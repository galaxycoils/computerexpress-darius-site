import { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { trackEvent } from '../utils/analytics';

const CHAT_API = '/api/chat';

const SUGGESTIONS = [
  { label: '💰 Pricing', message: 'What are your pricing packages?' },
  { label: '🔍 SEO Services', message: 'What SEO services do you offer?' },
  { label: '📱 Web Design', message: 'Tell me about your web design process' },
  { label: '📞 Book a Call', message: 'How do I book a free consultation?' },
];

const WebLLMChat = lazy(() => import('./WebLLMChat'));

function AIChatSkeleton() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      background: 'var(--bg-card)',
      color: 'var(--text)',
    }}>
      {/* Header Skeleton */}
      <div style={{
        padding: '0.85rem 1.25rem',
        borderBottom: '1px solid var(--panel-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-soft)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ width: '120px', height: '12px', borderRadius: '4px', background: 'var(--bg-soft)', marginBottom: '6px' }} />
          <div style={{ width: '80px', height: '8px', borderRadius: '4px', background: 'var(--bg-soft)' }} />
        </div>
      </div>
      
      {/* Messages Skeleton */}
      <div style={{
        flex: 1,
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <div style={{ alignSelf: 'flex-start', width: '70%' }}>
          <div style={{ height: '40px', borderRadius: '12px 12px 12px 4px', background: 'var(--bg-soft)' }} />
        </div>
        <div style={{ alignSelf: 'flex-end', width: '60%' }}>
          <div style={{ height: '32px', borderRadius: '12px 12px 4px 12px', background: 'var(--bg-soft)' }} />
        </div>
        <div style={{ alignSelf: 'flex-start', width: '80%' }}>
          <div style={{ height: '56px', borderRadius: '12px 12px 12px 4px', background: 'var(--bg-soft)' }} />
        </div>
      </div>

      {/* Input Skeleton */}
      <div style={{
        padding: '0.65rem 1rem',
        borderTop: '1px solid var(--panel-border)',
        display: 'flex',
        gap: '0.5rem',
      }}>
        <div style={{ flex: 1, height: '36px', borderRadius: '999px', background: 'var(--bg-soft)' }} />
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-soft)' }} />
      </div>
    </div>
  );
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('cloud'); // 'cloud' | 'local'
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileDockReady, setMobileDockReady] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const trackedOpenRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current && mode === 'cloud') {
      inputRef.current.focus();
    }
  }, [open, mode]);

  useEffect(() => {
    function updateMobileDock() {
      const isSmallViewport = window.matchMedia('(max-width: 480px)').matches;
      setMobileDockReady(!isSmallViewport || window.scrollY > 420);
    }

    updateMobileDock();
    window.addEventListener('scroll', updateMobileDock, { passive: true });
    window.addEventListener('resize', updateMobileDock);
    return () => {
      window.removeEventListener('scroll', updateMobileDock);
      window.removeEventListener('resize', updateMobileDock);
    };
  }, []);

  async function sendMessage(text) {
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError('');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second response timeout

    try {
      const res = await fetch(CHAT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP error! status: ${res.status}`);
      }

      // Read streaming response
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantMsg = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, assistantMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(l => l.trim().startsWith('data:'));

        for (const line of lines) {
          const data = line.replace(/^data:\s*/, '').trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content || parsed.response;
            if (delta) {
              assistantContent += delta;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                return updated;
              });
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError('Request timed out. The server took too long to respond.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleSuggestion(msg) {
    sendMessage(msg);
  }

  function handleRetry() {
    if (messages.length > 0) {
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMsg) {
        // Remove the last assistant message if it is empty/erroring, and retry
        setMessages(prev => {
          const clean = prev.filter((m, idx) => {
            // Keep user messages and any successfully completed assistant messages
            if (m.role === 'user') return true;
            if (m.role === 'assistant' && m.content) return true;
            return false;
          });
          return clean.slice(0, -1); // slice user message off because sendMessage will append it again
        });
        sendMessage(lastUserMsg.content);
      }
    }
  }

  function toggleChat() {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && !trackedOpenRef.current) {
      trackedOpenRef.current = true;
      trackEvent('chat_open', { mode });
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className={`chat-toggle${!open && !mobileDockReady ? ' chat-toggle-mobile-hidden' : ''}`}
        aria-label={open ? 'Close chat' : 'Open AI chat'}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: mode === 'local' 
            ? 'linear-gradient(135deg, #34d399, #10b981)' 
            : 'linear-gradient(135deg, #12d6ff, #0ea5e9)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(18, 214, 255, 0.3)',
          zIndex: 9999,
          transition: 'transform 0.2s, box-shadow 0.2s, background 0.3s',
        }}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#060d1b" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#060d1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <line x1="9" y1="10" x2="9" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="15" y1="10" x2="15" y2="10"/>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="chat-window"
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            width: 'min(420px, calc(100vw - 48px))',
            height: 'min(580px, calc(100vh - 140px))',
            background: 'var(--bg-card)',
            border: '1px solid var(--panel-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {mode === 'local' ? (
            <Suspense fallback={<AIChatSkeleton />}>
              <WebLLMChat onSwitchMode={() => setMode('cloud')} />
            </Suspense>
          ) : (
            <>
              {/* Header */}
              <div style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--panel-border)',
                background: 'linear-gradient(135deg, rgba(18,214,255,0.05), rgba(167,139,250,0.05))',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #12d6ff, #0ea5e9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#060d1b" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--text-bright)', fontWeight: 700, fontSize: '0.95rem' }}>
                      St. Catharines Digital
                    </div>
                    <div style={{ color: 'var(--success)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
                      AI Assistant — Online
                    </div>
                  </div>
                  <button
                    onClick={() => setMode('local')}
                    style={{
                      background: 'var(--bg-soft)',
                      border: '1px solid var(--panel-border)',
                      color: '#34d399',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: '600',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    Local LLM
                  </button>
                </div>
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
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👋</div>
                    <div style={{ color: 'var(--text-bright)', fontWeight: 600, marginBottom: '0.5rem' }}>
                      Hi! I'm the St. Catharines Digital AI assistant.
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                      Ask me about our services, pricing, or how we can help your business rank higher.
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                      {SUGGESTIONS.map(s => (
                        <button
                          key={s.label}
                          onClick={() => handleSuggestion(s.message)}
                          style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: '999px',
                            border: '1px solid var(--panel-border)',
                            background: 'var(--bg-soft)',
                            color: 'var(--text)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
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
                  <div
                    key={i}
                    style={{
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                    }}
                  >
                    <div style={{
                      padding: '0.65rem 0.9rem',
                      borderRadius: msg.role === 'user'
                        ? '16px 16px 4px 16px'
                        : '16px 16px 16px 4px',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #12d6ff, #0ea5e9)'
                        : 'var(--bg-soft)',
                      color: msg.role === 'user' ? '#060d1b' : 'var(--text)',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div style={{ alignSelf: 'flex-start' }}>
                    <div style={{
                      padding: '0.65rem 0.9rem',
                      borderRadius: '16px 16px 16px 4px',
                      background: 'var(--bg-soft)',
                      display: 'flex',
                      gap: '4px',
                    }}>
                      <span className="chat-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--muted)', display: 'inline-block', animation: 'chat-pulse 1.4s infinite' }} />
                      <span className="chat-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--muted)', display: 'inline-block', animation: 'chat-pulse 1.4s infinite 0.2s' }} />
                      <span className="chat-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--muted)', display: 'inline-block', animation: 'chat-pulse 1.4s infinite 0.4s' }} />
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
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}>
                    <span>{error}</span>
                    <button
                      type="button"
                      onClick={handleRetry}
                      style={{
                        alignSelf: 'flex-start',
                        background: 'rgba(255,107,107,0.2)',
                        border: '1px solid rgba(255,107,107,0.3)',
                        color: '#ff6b6b',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Retry message
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} style={{
                padding: '0.75rem 1rem',
                borderTop: '1px solid var(--panel-border)',
                display: 'flex',
                gap: '0.5rem',
              }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about services, pricing, SEO…"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '0.6rem 0.9rem',
                    borderRadius: '999px',
                    border: '1px solid var(--panel-border)',
                    background: 'var(--bg-soft)',
                    color: 'var(--text)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'linear-gradient(135deg, #12d6ff, #0ea5e9)',
                    cursor: loading ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: loading || !input.trim() ? 0.5 : 1,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#060d1b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes chat-pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
        .skeleton-pulse {
          animation: skeleton-load 1.5s ease-in-out infinite;
        }
        @keyframes skeleton-load {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </>
  );
}
