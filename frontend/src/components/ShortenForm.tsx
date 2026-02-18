'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function ShortenForm({ onUrlAdded }: { onUrlAdded: () => void }) {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [copied, setCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Lien créé avec succès !');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setCopied(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowToast(false);

    try {
      const res = await fetch(`${API_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) throw new Error('Erreur lors de la création du lien');

      const data = await res.json();
      setShortUrl(`${API_URL}/${data.shortCode}`);

      if (data.isNew === false) {
        setSuccessMessage('Ce lien existe déjà.');
      } else {
        setSuccessMessage('Lien créé avec succès !');
      }

      setUrl('');
      onUrlAdded();
      setShowToast(true);
    } catch (err) {
      setError('Impossible de raccourcir ce lien. Vérifiez le format.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
  };

  return (
    <>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        padding: '24px',
        transition: 'border-color 0.2s ease',
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap' as const,
          }}>
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' as const }}>
              <div style={{
                position: 'absolute' as const,
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: focused ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'color 0.2s',
                pointerEvents: 'none',
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </div>

              <input
                type="url"
                required
                placeholder="https://exemple.com/votre-lien-ici"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '10px',
                  padding: '12px 14px 12px 40px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: focused ? '0 0 0 3px var(--accent-glow)' : 'none',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? 'rgba(124,106,247,0.5)' : 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 22px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s ease, transform 0.1s ease',
                whiteSpace: 'nowrap' as const,
                fontFamily: 'DM Sans, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={e => { if (!loading) (e.target as HTMLButtonElement).style.background = 'var(--accent-hover)'; }}
              onMouseLeave={e => { if (!loading) (e.target as HTMLButtonElement).style.background = 'var(--accent)'; }}
            >
              {loading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Traitement…
                </>
              ) : (
                <>
                  Raccourcir
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div style={{
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--error)',
            fontSize: '13px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}
      </div>

      {showToast && (
        <div className="animate-slide-in" style={{
          position: 'fixed' as const,
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-hover)',
          borderRadius: '14px',
          padding: '16px 20px',
          maxWidth: '380px',
          width: 'calc(100vw - 48px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: successMessage.includes('existe') ? 'rgba(251,191,36,0.1)' : 'rgba(74,222,128,0.1)',
              border: `1px solid ${successMessage.includes('existe') ? 'rgba(251,191,36,0.2)' : 'rgba(74,222,128,0.2)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {successMessage.includes('existe') ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '13px',
                fontWeight: '600',
                color: successMessage.includes('existe') ? 'var(--warning)' : 'var(--success)',
                marginBottom: '6px',
              }}>
                {successMessage}
              </p>
              <div style={{
                background: 'var(--bg-input)',
                borderRadius: '8px',
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                border: '1px solid var(--border)',
              }}>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--accent)',
                    fontSize: '13px',
                    fontFamily: 'DM Mono, monospace',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap' as const,
                    textDecoration: 'none',
                  }}
                >
                  {shortUrl}
                </a>
                <button
                  onClick={handleCopy}
                  style={{
                    background: copied ? 'rgba(74,222,128,0.1)' : 'rgba(124,106,247,0.1)',
                    border: `1px solid ${copied ? 'rgba(74,222,128,0.2)' : 'rgba(124,106,247,0.2)'}`,
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: copied ? 'var(--success)' : 'var(--accent)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap' as const,
                    fontFamily: 'DM Sans, sans-serif',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                >
                  {copied ? '✓ Copié' : 'Copier'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowToast(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}