export interface Env {
  AI: {
    run: (
      model: string,
      options: { text?: string[]; messages?: ChatMessage[]; stream?: boolean }
    ) => Promise<unknown>; // Workers AI returns dynamic responses or ReadableStream
  };
  VECTORIZE: {
    query: (
      vector: number[],
      options: { topK: number; returnValues: boolean; returnMetadata: boolean }
    ) => Promise<{
      matches: Array<{
        id: string;
        score: number;
        metadata?: {
          title: string;
          filePath: string;
          text: string;
          app: string;
          slug: string;
        };
      }>;
    }>;
  };
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequestBody {
  message: string;
  history?: ChatMessage[];
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname !== '/chat') {
      return new Response('Not Found', { status: 404, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: CORS_HEADERS });
    }

    try {
      const body = (await request.json()) as ChatRequestBody;
      const { message, history = [] } = body;

      if (!message) {
        return new Response(JSON.stringify({ error: 'Message is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }

      // 1. Generate query embedding
      const embeddingModel = '@cf/baai/bge-large-en-v1.5';
      const embeddingResponse = await env.AI.run(embeddingModel, {
        text: [message],
      });

      const queryVector = embeddingResponse.data[0];

      // 2. Query Vectorize
      const matches = await env.VECTORIZE.query(queryVector, {
        topK: 5,
        returnValues: false,
        returnMetadata: true,
      });

      // 3. Extract and construct context
      let context = '';
      if (matches.matches && matches.matches.length > 0) {
        context = matches.matches
          .filter((match) => match.metadata)
          .map(
            (match) =>
              `Title: ${match.metadata?.title}\nSource: ${match.metadata?.filePath}\nContent: ${match.metadata?.text}`
          )
          .join('\n\n---\n\n');
      }

      // 4. Construct System Prompt with retrieved context
      const systemPrompt = `You are a helpful AI assistant for Knowledge Core (a documentation and course platform).
Use the following context to answer the user's question. 
If the context does not contain the answer, use your general knowledge, but state clearly that you didn't find specific documentation about it.
Answer in the same language as the user's query.

Context:
${context || 'No specific documentation found.'}`;

      // 5. Build prompt history
      const formattedHistory: ChatMessage[] = history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...formattedHistory,
        { role: 'user', content: message },
      ];

      // 6. Generate streaming response using LLM
      const llmModel = '@cf/meta/llama-3-8b-instruct';
      const stream = await env.AI.run(llmModel, {
        messages,
        stream: true,
      });

      // Return EventStream
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          ...CORS_HEADERS,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
  },
};
