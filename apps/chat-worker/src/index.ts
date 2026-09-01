const MAX_BODY_BYTES = 32_000;
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_HISTORY_LENGTH = 10;
const MAX_HISTORY_MESSAGE_LENGTH = 4_000;
const MIN_MATCH_SCORE = 0.55;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ClientChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequestBody {
  message: string;
  history: ClientChatMessage[];
}

interface ChunkMetadata {
  title: string;
  filePath: string;
  text: string;
}

class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseClientMessage(value: unknown): ClientChatMessage {
  if (!isRecord(value) || (value.role !== 'user' && value.role !== 'assistant')) {
    throw new HttpError(400, 'History contains an invalid role.');
  }
  if (typeof value.content !== 'string' || value.content.length > MAX_HISTORY_MESSAGE_LENGTH) {
    throw new HttpError(400, 'History contains an invalid message.');
  }
  return { role: value.role, content: value.content };
}

export function parseChatRequest(value: unknown): ChatRequestBody {
  if (!isRecord(value) || typeof value.message !== 'string') {
    throw new HttpError(400, 'Message is required.');
  }

  const message = value.message.trim();
  if (message.length === 0 || message.length > MAX_MESSAGE_LENGTH) {
    throw new HttpError(
      400,
      `Message must contain between 1 and ${MAX_MESSAGE_LENGTH} characters.`
    );
  }

  const rawHistory = value.history ?? [];
  if (!Array.isArray(rawHistory) || rawHistory.length > MAX_HISTORY_LENGTH) {
    throw new HttpError(400, `History must contain at most ${MAX_HISTORY_LENGTH} messages.`);
  }

  return {
    message,
    history: rawHistory.map(parseClientMessage),
  };
}

export function isAllowedOrigin(origin: string | null, allowedOrigins: string): origin is string {
  if (!origin) return false;
  return allowedOrigins
    .split(',')
    .map((allowed) => allowed.trim())
    .filter(Boolean)
    .includes(origin);
}

function corsHeaders(origin: string): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function jsonResponse(body: unknown, status: number, origin?: string): Response {
  return Response.json(body, {
    status,
    headers: {
      ...(origin ? corsHeaders(origin) : {}),
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

async function readLimitedJson(request: Request): Promise<unknown> {
  const contentLength = Number(request.headers.get('Content-Length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    throw new HttpError(413, 'Request body is too large.');
  }
  if (!request.body) {
    throw new HttpError(400, 'Request body is required.');
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new HttpError(413, 'Request body is too large.');
    }
    chunks.push(value);
  }

  const body = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder().decode(body));
  } catch {
    throw new HttpError(400, 'Request body must be valid JSON.');
  }
}

function getEmbeddingVector(value: unknown): number[] {
  if (!isRecord(value) || !Array.isArray(value.data) || !Array.isArray(value.data[0])) {
    throw new Error('Workers AI returned an invalid embedding response.');
  }
  const vector = value.data[0];
  if (!vector.every((item) => typeof item === 'number')) {
    throw new Error('Workers AI returned an invalid embedding vector.');
  }
  return vector;
}

function getChunkMetadata(value: unknown): ChunkMetadata | null {
  if (!isRecord(value)) return null;
  const { title, filePath, text } = value;
  if (typeof title !== 'string' || typeof filePath !== 'string' || typeof text !== 'string') {
    return null;
  }
  return { title, filePath, text };
}

function getRateLimitKey(request: Request, origin: string): string {
  const clientIp = request.headers.get('CF-Connecting-IP');
  return `chat:${origin}:${clientIp ?? 'local'}`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== '/chat') {
      return jsonResponse({ error: 'Not found.' }, 404);
    }

    const origin = request.headers.get('Origin');
    if (!isAllowedOrigin(origin, env.ALLOWED_ORIGINS)) {
      return jsonResponse({ error: 'Origin is not allowed.' }, 403);
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed.' }, 405, origin);
    }

    try {
      const rateLimit = await env.CHAT_RATE_LIMITER.limit({
        key: getRateLimitKey(request, origin),
      });
      if (!rateLimit.success) {
        return jsonResponse({ error: 'Too many requests. Please try again later.' }, 429, origin);
      }

      const { message, history } = parseChatRequest(await readLimitedJson(request));
      const embeddingResponse = await env.AI.run('@cf/baai/bge-large-en-v1.5', {
        text: [message],
      });
      const queryVector = getEmbeddingVector(embeddingResponse);

      const matches = await env.VECTORIZE.query(queryVector, {
        topK: 5,
        returnValues: false,
        returnMetadata: 'all',
      });

      const context = matches.matches
        .filter((match) => match.score >= MIN_MATCH_SCORE)
        .map((match) => getChunkMetadata(match.metadata))
        .filter((metadata): metadata is ChunkMetadata => metadata !== null)
        .map(
          (metadata) =>
            `Title: ${metadata.title}\nSource: ${metadata.filePath}\nContent: ${metadata.text}`
        )
        .join('\n\n---\n\n');

      const systemPrompt = `You are a helpful AI assistant for Knowledge Core, a documentation and course platform.
Use the supplied context to answer the user's question and cite relevant Source paths.
If the context does not contain the answer, say that the project documentation does not cover it. Do not invent project-specific details.
Answer in the same language as the user's query.

Context:
${context || 'No relevant documentation found.'}`;

      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message },
      ];
      const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
        messages,
        stream: true,
      });
      if (!(aiResponse instanceof ReadableStream)) {
        throw new Error('Workers AI did not return a response stream.');
      }

      return new Response(aiResponse, {
        headers: {
          ...corsHeaders(origin),
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-store',
          Connection: 'keep-alive',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500;
      const publicMessage = error instanceof HttpError ? error.message : 'Internal server error.';
      console.error(
        JSON.stringify({
          message: 'chat request failed',
          error: error instanceof Error ? error.message : String(error),
          path: url.pathname,
          status,
        })
      );
      return jsonResponse({ error: publicMessage }, status, origin);
    }
  },
} satisfies ExportedHandler<Env>;
