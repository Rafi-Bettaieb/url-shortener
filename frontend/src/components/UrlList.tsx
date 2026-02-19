'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Url {
  id: number;
  originalUrl: string;
  shortCode: string;
}

export default function UrlList({ refreshTrigger }: { refreshTrigger: number }) {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/urls`)
      .then((res) => res.json())
      .then((data) => {
        setUrls(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur fetch urls:', err);
        setLoading(false);
      });
  }, [refreshTrigger]);

  const handleCopy = (url: Url) => {
    navigator.clipboard.writeText(`${API_URL}/${url.shortCode}`);
    setCopiedId(url.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce lien ?')) return;

    try {
      const res = await fetch(`${API_URL}/urls/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setUrls((prev) => prev.filter((u) => u.id !== id));
      } else {
        console.error('Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur fetch delete:', err);
    }
  };

  if (loading && urls.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 16px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 12px',
        }}/>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Chargement…</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (urls.length === 0 && !loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '56px 16px',
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px dashed var(--border)',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'rgba(124,106,247,0.08)',
          border: '1px solid rgba(124,106,247,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Aucun lien pour le moment</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Raccourcissez votre premier lien ci-dessus</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      {urls.map((u, i) => (
        <div
          key={u.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '14px 20px',
            borderBottom: i < urls.length - 1 ? '1px solid var(--border)' : 'none',
            transition: 'background 0.15s ease',
            cursor: 'default',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'rgba(124,106,247,0.08)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap' as const,
            }} title={u.originalUrl}>
              {u.originalUrl.replace(/^https?:\/\//, '')}
            </p>
          </div>

          <a
            href={`${API_URL}/${u.shortCode}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'rgba(124,106,247,0.08)',
              border: '1px solid rgba(124,106,247,0.15)',
              borderRadius: '8px',
              padding: '4px 10px',
              flexShrink: 0,
              fontFamily: 'DM Mono, monospace',
              fontSize: '12px',
              color: 'var(--accent)',
              fontWeight: '500',
              textDecoration: 'none',
              whiteSpace: 'nowrap' as const,
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(124,106,247,0.15)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(124,106,247,0.3)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(124,106,247,0.08)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(124,106,247,0.15)';
            }}
          >
            {API_URL}/{u.shortCode}
          </a>

          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <button
              onClick={() => handleCopy(u)}
              title="Copier le lien"
              style={{
                background: copiedId === u.id ? 'rgba(74,222,128,0.1)' : 'transparent',
                border: `1px solid ${copiedId === u.id ? 'rgba(74,222,128,0.2)' : 'var(--border)'}`,
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                color: copiedId === u.id ? 'var(--success)' : 'var(--text-muted)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {copiedId === u.id ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              )}
            </button>

            <a
              href={`${API_URL}/${u.shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Ouvrir le lien"
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-hover)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>

            <button
              onClick={() => handleDelete(u.id)}
              title="Supprimer le lien"
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.color = '#ef4444';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#ef4444';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239, 68, 68, 0.05)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}