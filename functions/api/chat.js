// Cloudflare Pages Function: AI Chat for St. Catharines Digital
// POST /api/chat

const SYSTEM_PROMPT = `You are the AI assistant for St. Catharines Digital, a web design and local SEO agency in St. Catharines, Ontario.

Services:
- High-Performance Websites (from $1,500)
- Technical SEO (site speed, schema, Core Web Vitals)
- Google Business Profile optimization
- Local SEO (service area pages, local link building)

Pricing: Launch $1,500 | Growth $3,500 | Local Authority $5,500
Phone: (365) 359-5973
Calendly: https://calendly.com/tahamtandariush/30min

Be helpful, professional, concise. Guide visitors toward booking a free audit.`;

export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const { messages } = await request.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
        max_tokens: 500,
      }),
    });

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
