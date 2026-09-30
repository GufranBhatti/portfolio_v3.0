import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TextDisperse from './TextDisperse';

const SUGGESTIONS = [
  'How many years of experience does he have?',
  'Tell me about the IEEE research paper.',
  'What AI/ML tools does he work with?',
  'Where does he currently work?'
];

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '0.3rem', padding: '0.2rem 0' }}>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function AskGB() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: 'user', text: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextMessages.slice(0, -1)
        })
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // Non-JSON response — most likely /api/chat isn't running at all
        // (e.g. plain `vite dev` doesn't serve Vercel functions).
        throw new Error("Can't reach the assistant right now. Try again in a moment.");
      }

      if (!res.ok) {
        throw new Error(data?.error || 'Something went wrong.');
      }

      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  return (
    <section style={{ padding: '8rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          style={{ marginBottom: '3rem', textAlign: 'center' }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            // ASK.GB
          </p>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--fg)', margin: 0 }}>
            <TextDisperse>Ask about me</TextDisperse>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', marginTop: '1rem' }}>
            An AI assistant grounded in this portfolio — ask about my skills, experience, or projects.
          </p>
        </motion.div>

        <motion.div
          className="brutalist-cell"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-strong)' }}
        >
          {/* Header bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--border)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: 'var(--accent)'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} />
            GB_ASSISTANT ONLINE
          </div>

          {/* Message list */}
          <div
            ref={scrollRef}
            style={{
              height: '360px',
              overflowY: 'auto',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {messages.length === 0 && (
              <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--muted-strong)', fontSize: '0.95rem', maxWidth: '360px' }}>
                Try asking something like "What AI tools does he use?" or pick a suggestion below.
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    padding: '0.75rem 1.1rem',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    backgroundColor: msg.role === 'user' ? 'var(--accent)' : 'transparent',
                    color: msg.role === 'user' ? 'var(--bg)' : 'var(--fg)',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--border)'
                  }}
                >
                  {msg.text}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <div style={{ alignSelf: 'flex-start', padding: '0.75rem 1.1rem', border: '1px solid var(--border)' }}>
                <TypingDots />
              </div>
            )}

            {error && (
              <div style={{ alignSelf: 'flex-start', color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length === 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', padding: '0 1.5rem 1.25rem' }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{
                    background: 'none',
                    border: '1px solid var(--border-strong)',
                    color: 'var(--muted)',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', borderTop: '1px solid var(--border)' }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something about Gufran..."
              maxLength={500}
              disabled={loading}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                padding: '1rem 1.5rem',
                color: 'var(--fg)',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem'
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                border: 'none',
                borderLeft: '1px solid var(--border)',
                backgroundColor: 'var(--accent)',
                color: 'var(--bg)',
                padding: '0 1.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                opacity: loading || !input.trim() ? 0.5 : 1,
                cursor: loading || !input.trim() ? 'default' : 'pointer'
              }}
            >
              SEND
            </button>
          </form>
        </motion.div>

      </div>
    </section>
  );
}
