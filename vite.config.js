import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only plugin: mock /api/chat so the chat widget works during `npm run dev`
function devChatMock() {
  return {
    name: 'dev-chat-mock',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          })
          res.end()
          return
        }

        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', () => {
          try {
            const { messages } = JSON.parse(body)
            const lastUserMsg = messages?.filter(m => m.role === 'user').pop()?.content || ''

            // Generate a contextual dev response
            let reply = ''
            const q = lastUserMsg.toLowerCase()
            if (q.includes('pricing') || q.includes('cost') || q.includes('price')) {
              reply = "We offer three packages: **Launch** ($1,500) for a professional 5-page site, **Growth** ($3,500) for SEO-optimized multi-page sites, and **Local Authority** ($5,500) for our full-service package including Google Business Profile optimization, local SEO, and ongoing support. Want to book a free consultation to discuss which package fits your business?"
            } else if (q.includes('seo') || q.includes('rank') || q.includes('google')) {
              reply = "Our SEO services include Technical SEO (site speed, schema markup, Core Web Vitals), Google Business Profile optimization, and Local SEO (service area pages, local link building). We specialize in helping service businesses in St. Catharines and the Niagara Region rank higher on Google Maps and organic search. Book a free audit at https://calendly.com/tahamtandariush/30min!"
            } else if (q.includes('web design') || q.includes('website') || q.includes('design')) {
              reply = "Our web design process starts with a free audit of your current site, then we build a high-performance, mobile-first website optimized for conversions and local SEO. Every site includes structured data markup, fast loading times, and is designed to turn visitors into leads. We specialize in sites for plumbers, HVAC contractors, electricians, and other service businesses."
            } else if (q.includes('book') || q.includes('call') || q.includes('consult') || q.includes('contact')) {
              reply = "You can book a free 30-minute consultation here: https://calendly.com/tahamtandariush/30min\n\nOr call us directly at (365) 359-5973. We'll review your current online presence and discuss how we can help your business get more leads."
            } else {
              reply = "Thanks for reaching out! I'm the AI assistant for St. Catharines Digital. We specialize in high-performance websites and local SEO for service businesses in the Niagara Region. I can help you with questions about our services, pricing, or how we can boost your online presence. What would you like to know?"
            }

            // Stream response as SSE to match production behavior
            res.writeHead(200, {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
              'Access-Control-Allow-Origin': '*',
            })

            // Simulate streaming by sending word-by-word chunks
            const words = reply.split(' ')
            let i = 0

            function sendNext() {
              if (i < words.length) {
                const word = (i === 0 ? '' : ' ') + words[i]
                const chunk = JSON.stringify({ response: word })
                res.write(`data: ${chunk}\n\n`)
                i++
                setTimeout(sendNext, 20)
              } else {
                res.write('data: [DONE]\n\n')
                res.end()
              }
            }

            sendNext()
          } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Invalid request body' }))
          }
        })
      })
    }
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), devChatMock()],
  ssr: {
    noExternal: ['react-helmet-async']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mlc-ai') || id.includes('@mlc-ai/web-llm')) return 'webllm';
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('react/')) return 'react-vendor';
            return 'vendor';
          }
        }
      }
    }
  }
})
