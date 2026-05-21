import { useState, useRef, useEffect, useCallback } from 'react';
import * as webllm from '@mlc-ai/web-llm';

const SYSTEM_PROMPT = `You are the AI assistant for St. Catharines Digital, a web design and local SEO agency in St. Catharines, Ontario.

Services: High-Performance Websites (from $1,500), Technical SEO, Google Business Profile optimization, Local SEO.
Pricing: Launch $1,500 | Growth $3,500 | Local Authority $5,500
Phone: (365) 359-5973
Calendly: https://calendly.com/tahamtandariush/30min

Be helpful, professional, and concise. Guide visitors toward booking a free audit.`;

const SUGGESTIONS = [
  { label: '💰 Pricing', message: 'What are your pricing packages?' },
  { label: '🔍 SEO', message: 'What SEO services do you offer?' },
  { label: '📱 Web Design', message: 'Tell me about your web design process' },
  { label: '📞 Book Call', message: 'How do I book a free consultation?' },
];

export default function WebLLMChat({ onSwitchMode }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ text: '', percentage: 0 });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const engineRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const initStarted = useRef(false);

  const initEngine = useCallback(async () => {
    if (initStarted.current || engineRef.current) return;
    initStarted.current = true;

    try {
      setProgress({ text: 'Initializing WebLLM...', percentage: 0 });

      const engine = new webllm.MLCEngine({
        initProgressCallback: (report) => {
          const pct = Math.round(report.progress * 100);
          setProgress({ text: report.text, percentage: pct });
        },
      });

      await engine.reload('Llama-3.2-1B-Instruct-q4f16_1-MLC', {
        context_window_size: 2048,
      });

      engineRef.current = engine;
      setReady(true);
      setProgress({ text: 'Ready!', percentage: 100 });
    } catch (err) {
      console.error('WebLLM init error:', err);
      setError(`Failed to load AI model: ${err.message}. Try using a WebGPU-compatible browser (Chrome 113+ or Edge 113+).`);
      setProgress({ text: 'Error', percentage: 0 });
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    // Auto-trigger engine initialization when the local model view is opened
    if (!initStarted.current) {
      initEngine();
    }
  }, [initEngine]);

  async function sendMessage(text) {
    if (!text.trim() || generating) return;

    const userMsg = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg, { role: 'assistant', content: '' }]);
    setInput('');
    setGenerating(true);
    setError('');

    try {
      if (!engineRef.current) {
        await initEngine();
      }

      const engine = engineRef.current;
      if (!engine) throw new Error('Engine not initialized');

      const fullMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
        userMsg,
      ];

      const chunks = await engine.chat.completions.create({
        messages: fullMessages,
        max_tokens: 300,
        temperature: 0.7,
        stream: true,
      });

      let assistantContent = '';
      for await (const chunk of chunks) {
        const delta = chunk.choices[0]?.delta?.content || '';
        assistantContent += delta;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
          return updated;
        });
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message || 'Something went wrong.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setGenerating(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleSuggestion(msg) {
    sendMessage(msg);
  }

  return (
    <div
      className="webllm-chat-window"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: 'var(--bg-card)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '0.85rem 1.25rem',
        borderBottom: '1px solid var(--panel-border)',
        background: 'linear-gradient(135deg, rgba(52,211,153,0.05), rgba(18,214,255,0.05))',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #34d399, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#060d1b" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'var(--text-bright)', fontWeight: 700, fontSize: '0.9rem' }}>
              St. Catharines Digital AI
            </div>
            <div style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {ready ? (
                <>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                  <span style={{ color: '#34d399' }}>Llama 3.2 1B — Running locally</span>
                </>
              ) : progress.percentage > 0 ? (
                <>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#12d6ff', display: 'inline-block' }} />
                  <span style={{ color: 'var(--muted)' }}>Loading model... {progress.percentage}%</span>
                </>
              ) : (
                <>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#12d6ff', display: 'inline-block' }} />
                  <span style={{ color: 'var(--muted)' }}>Click to start</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onSwitchMode}
            style={{
              background: 'var(--bg-soft)',
              border: '1px solid var(--panel-border)',
              color: 'var(--primary)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              padding: '4px 8px',
              borderRadius: '4px',
              marginRight: '0.25rem',
              fontWeight: '600',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Cloud AI
          </button>
          <button
            onClick={() => setShowInfo(!showInfo)}
            style={{
              background: 'none', border: 'none', color: 'var(--muted)',
              cursor: 'pointer', fontSize: '0.8rem', padding: '4px',
            }}
            title="About this AI"
          >
            ⓘ
          </button>
        </div>

        {/* Progress bar */}
        {progress.percentage > 0 && progress.percentage < 100 && (
          <div style={{
            marginTop: '0.5rem',
            height: '3px',
            background: 'var(--bg-soft)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progress.percentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #12d6ff, #34d399)',
              transition: 'width 0.3s',
              borderRadius: '2px',
            }} />
          </div>
        )}

        {/* Info panel */}
        {showInfo && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem 0.75rem',
            background: 'var(--bg-soft)',
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: 'var(--muted)',
            lineHeight: 1.5,
          }}>
            🔒 <strong style={{ color: 'var(--text-bright)' }}>100% Private</strong> — This AI runs entirely in your browser using WebGPU. No data is sent to any server. Powered by Llama 3.2 1B from MLC.
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        {messages.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
            <div style={{ color: 'var(--text-bright)', fontWeight: 600, marginBottom: '0.5rem' }}>
              Private AI Assistant
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              Runs 100% in your browser — no server, no tracking.
            </div>
            {!ready && progress.percentage === 0 && (
              <button
                onClick={initEngine}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #12d6ff, #0ea5e9)',
                  color: '#060d1b',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  marginBottom: '1rem',
                }}
              >
                Load AI Model (~600MB)
              </button>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s.label}
                  onClick={() => handleSuggestion(s.message)}
                  disabled={!ready}
                  style={{
                    padding: '0.35rem 0.7rem',
                    borderRadius: '999px',
                    border: '1px solid var(--panel-border)',
                    background: 'var(--bg-soft)',
                    color: 'var(--text)',
                    fontSize: '0.75rem',
                    cursor: ready ? 'pointer' : 'default',
                    opacity: ready ? 1 : 0.5,
                    transition: 'all 0.15s',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
          }}>
            <div style={{
              padding: '0.6rem 0.85rem',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #12d6ff, #0ea5e9)'
                : 'var(--bg-soft)',
              color: msg.role === 'user' ? '#060d1b' : 'var(--text)',
              fontSize: '0.88rem',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {generating && messages.length > 0 && !messages[messages.length - 1].content && (
          <div style={{ alignSelf: 'flex-start' }}>
            <div style={{
              padding: '0.6rem 0.85rem',
              borderRadius: '16px 16px 16px 4px',
              background: 'var(--bg-soft)',
              display: 'flex',
              gap: '4px',
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: 'var(--muted)',
                  display: 'inline-block',
                  animation: `webllm-pulse 1.4s infinite ${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            background: 'rgba(255,107,107,0.1)',
            border: '1px solid rgba(255,107,107,0.2)',
            color: '#ff6b6b',
            fontSize: '0.8rem',
          }}>
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{
        padding: '0.65rem 1rem',
        borderTop: '1px solid var(--panel-border)',
        display: 'flex',
        gap: '0.5rem',
      }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={ready ? 'Ask about services, pricing, SEO...' : 'Load the model first...'}
          disabled={generating || !ready}
          style={{
            flex: 1,
            padding: '0.55rem 0.85rem',
            borderRadius: '999px',
            border: '1px solid var(--panel-border)',
            background: 'var(--bg-soft)',
            color: 'var(--text)',
            fontSize: '0.88rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={generating || !ready || !input.trim()}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #34d399, #10b981)',
            cursor: (generating || !ready || !input.trim()) ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: (generating || !ready || !input.trim()) ? 0.4 : 1,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#060d1b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>

      <style>{`
        @keyframes webllm-pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
