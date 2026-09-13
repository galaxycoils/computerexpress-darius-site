// Cloudflare Pages Function: AI Chat for St. Catharines Digital
// POST /api/chat — Powered by Cloudflare Workers AI (Llama 3.1 8B)

const SYSTEM_PROMPT = `You are the AI assistant for St. Catharines Digital, an independent Niagara Region local-news service.

Scope:
- Official municipal planning notices, public meetings, council documents, road closures, and infrastructure notices.
- Official Niagara Regional Police Service media releases and public-safety notices.
- Coverage areas: St. Catharines, Welland, Thorold, Niagara Falls, and Niagara Region.

Rules:
- Describe the site as a guide to official sources, not as a government authority or emergency service.
- Do not invent facts, dates, public-safety advice, or source material.
- When a visitor needs urgent help, direct them to 911 for emergencies or to the relevant official municipal/NRPS source.
- Keep responses concise and point people to the relevant site section: /planning-tracker, /council, /news/police, or /news.
- For editorial corrections, sponsorship, or advertising inquiries, direct visitors to /contact.

Keep responses under 150 words.`;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // Accept only bounded user/assistant text turns. This protects the Worker
    // from oversized requests and prevents callers from injecting a second
    // system prompt into the model context.
    const trimmedMessages = messages.slice(-10)
    const validMessages = trimmedMessages.every((message) => (
      message
      && (message.role === 'user' || message.role === 'assistant')
      && typeof message.content === 'string'
      && message.content.length > 0
      && message.content.length <= 4_000
    ))
    if (!validMessages) {
      return new Response(
        JSON.stringify({ error: 'Messages must be user or assistant text under 4,000 characters' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    const stream = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...trimmedMessages,
      ],
      stream: true,
      max_tokens: 400,
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...CORS_HEADERS,
      },
    });
  } catch (err) {
    console.error('Chat function error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'AI service unavailable' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      }
    );
  }
}
