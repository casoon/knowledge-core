import fs from 'node:fs';
import path from 'node:path';

// Load environment variables from .env if present (Node 22+)
try {
  process.loadEnvFile(path.resolve(process.cwd(), '.env'));
} catch {
  // .env not found — rely on environment variables already set
}

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const VECTOR_INDEX = process.env.CLOUDFLARE_VECTORIZE_INDEX || 'knowledge-core';

// Cloudflare Embedding model
const EMBEDDING_MODEL = '@cf/baai/bge-large-en-v1.5';

interface DocumentChunk {
  id: string;
  text: string;
  filePath: string;
  title: string;
  app: 'docs' | 'courses';
  slug: string;
}

/**
 * Splits text into semantic chunks of roughly targetSize characters, trying to split on paragraph boundaries.
 */
function chunkText(text: string, targetSize = 800): string[] {
  // Clean markdown basic syntaxes that might pollute embeddings
  const cleanText = text
    .replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '') // Remove MDX imports
    .replace(/<[A-Za-z].*?>[\s\S]*?<\/[A-Za-z]>/g, '') // Remove components
    .replace(/<\/?[A-Za-z].*?>/g, '') // Remove isolated HTML/MDX tags
    .trim();

  const paragraphs = cleanText.split(/\n\n+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;

    if (currentChunk.length + trimmed.length > targetSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = trimmed;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + trimmed;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Simplistic YAML frontmatter parser
 */
function parseFrontmatter(fileContent: string): { data: Record<string, string>; content: string } {
  const lines = fileContent.split('\n');
  if (lines[0]?.trim() !== '---') {
    return { data: {}, content: fileContent };
  }

  const data: Record<string, string> = {};
  let i = 1;
  while (i < lines.length && lines[i].trim() !== '---') {
    const line = lines[i];
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const val = line
        .slice(colonIndex + 1)
        .replace(/^['"]|['"]$/g, '')
        .trim();
      data[key] = val;
    }
    i++;
  }

  const content = lines.slice(i + 1).join('\n');
  return { data, content };
}

interface ApiResponse<T> {
  success: boolean;
  errors: unknown[];
  result: T;
}

interface EmbeddingResult {
  data: number[][];
}

interface VectorizeResult {
  success: boolean;
  errors: unknown[];
}

/**
 * Recursively find all MDX and MD files in a directory
 */
function getFilesRecursive(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getFilesRecursive(filePath));
    } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
      results.push(filePath);
    }
  }
  return results;
}

/**
 * Generates embeddings via Cloudflare Workers AI REST API
 */
async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${EMBEDDING_MODEL}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: texts }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Cloudflare AI API Error: ${response.status} - ${errText}`);
  }

  const json = (await response.json()) as ApiResponse<EmbeddingResult>;
  if (!json.success) {
    throw new Error(`Cloudflare AI API failed: ${JSON.stringify(json.errors)}`);
  }

  return json.result.data;
}

/**
 * Uploads vectors to Cloudflare Vectorize Index via REST API
 */
async function uploadToVectorize(
  vectors: Array<{
    id: string;
    values: number[];
    metadata: Record<string, string | number | boolean>;
  }>
) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/vectorize/v2/indexes/${VECTOR_INDEX}/insert`;

  // Format matching Cloudflare Vectorize bulk insert
  const ndjson = vectors.map((v) => JSON.stringify(v)).join('\n');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/x-ndjson',
    },
    body: ndjson,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Cloudflare Vectorize API Error: ${response.status} - ${errText}`);
  }

  const json = (await response.json()) as VectorizeResult;
  if (!json.success) {
    throw new Error(`Cloudflare Vectorize insert failed: ${JSON.stringify(json.errors)}`);
  }
}

function processDocs(docsDir: string, rootDir: string, allChunks: DocumentChunk[]) {
  if (!fs.existsSync(docsDir)) return;
  console.log('Processing documentation files...');
  const files = getFilesRecursive(docsDir);
  for (const file of files) {
    const relativePath = path.relative(rootDir, file);
    const rawContent = fs.readFileSync(file, 'utf-8');
    const { data, content } = parseFrontmatter(rawContent);

    const title = data.title || path.basename(file, path.extname(file));
    const slug = relativePath.replace('apps/docs/src/content/docs/', '').replace(/\.mdx?$/, '');
    const chunks = chunkText(content);

    for (let index = 0; index < chunks.length; index++) {
      allChunks.push({
        id: `docs-${slug}-${index}`,
        text: chunks[index],
        filePath: relativePath,
        title,
        app: 'docs',
        slug,
      });
    }
  }
}

function processLessons(lessonsDir: string, rootDir: string, allChunks: DocumentChunk[]) {
  if (!fs.existsSync(lessonsDir)) return;
  console.log('Processing courses/lessons files...');
  const files = getFilesRecursive(lessonsDir);
  for (const file of files) {
    const relativePath = path.relative(rootDir, file);
    const rawContent = fs.readFileSync(file, 'utf-8');
    const { data, content } = parseFrontmatter(rawContent);

    const title = data.title || path.basename(file, path.extname(file));
    const slug = relativePath
      .replace('apps/courses/src/content/lessons/', '')
      .replace(/\.mdx?$/, '');
    const chunks = chunkText(content);

    for (let index = 0; index < chunks.length; index++) {
      allChunks.push({
        id: `courses-${slug}-${index}`,
        text: chunks[index],
        filePath: relativePath,
        title,
        app: 'courses',
        slug,
      });
    }
  }
}

async function main() {
  if (!ACCOUNT_ID || !API_TOKEN) {
    console.error(
      'Error: Please set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN environment variables.'
    );
    process.exit(1);
  }

  console.log('Starting content ingestion...');
  const rootDir = path.resolve(__dirname, '..');
  const docsDir = path.join(rootDir, 'apps/docs/src/content/docs');
  const lessonsDir = path.join(rootDir, 'apps/courses/src/content/lessons');

  const allChunks: DocumentChunk[] = [];

  // 1. Process Docs
  processDocs(docsDir, rootDir, allChunks);

  // 2. Process Courses Lessons
  processLessons(lessonsDir, rootDir, allChunks);

  console.log(`Total chunks generated: ${allChunks.length}`);

  // 3. Batch generate embeddings and upload to Cloudflare Vectorize (max batch size for safety = 20)
  const BATCH_SIZE = 20;
  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE);
    console.log(
      `Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(allChunks.length / BATCH_SIZE)}...`
    );

    try {
      const embeddings = await generateEmbeddings(batch.map((c) => c.text));

      const vectors = batch.map((chunk, idx) => ({
        id: chunk.id,
        values: embeddings[idx],
        metadata: {
          text: chunk.text,
          title: chunk.title,
          filePath: chunk.filePath,
          app: chunk.app,
          slug: chunk.slug,
        },
      }));

      await uploadToVectorize(vectors);
      console.log('Uploaded batch successfully.');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Error processing batch: ${message}`);
      process.exit(1);
    }
  }

  console.log('Ingestion completed successfully!');
}

main().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
