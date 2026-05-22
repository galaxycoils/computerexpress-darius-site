// Cloudflare Pages Function: AI Chat for St. Catharines Digital
// POST /api/chat — Powered by Cloudflare Workers AI (Llama 3.1 8B)

const SYSTEM_PROMPT = `You are the AI assistant for St. Catharines Digital, a web design and local SEO agency in St. Catharines, Ontario.

Services:
- High-Performance Websites (from $1,500)
- Technical SEO (site speed, schema, Core Web Vitals)
- Google Business Profile optimization
- Local SEO (service area pages, local link building)

Pricing: Launch $1,500 | Growth $3,500 | Local Authority $5,500
Phone: (365) 359-5973
Calendly: https://calendly.com/tahamtandariush/30min

Be helpful, professional, concise. Guide visitors toward booking a free audit. Keep responses under 150 words.`;

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

    // Limit conversation history to last 10 messages to keep context window manageable
    const trimmedMessages = messages.slice(-10);

    const stream = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
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
