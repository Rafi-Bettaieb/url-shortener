'use client';

import { useState } from 'react';
import ShortenForm from '@/components/ShortenForm';
import UrlList from '@/components/UrlList';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUrlAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main style={{ position: 'relative', zIndex: 1, minHeight: '100vh', padding: '60px 16px 80px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div className="animate-fade-up" style={{ marginBottom: '52px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(124,106,247,0.1)',
            border: '1px solid rgba(124,106,247,0.2)',
            borderRadius: '100px',
            padding: '6px 14px',
            marginBottom: '24px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }}></span>
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              URL Shortener
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '600',
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: '1.1',
            marginBottom: '12px',
          }}>
            Des liens courts,<br />
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', maxWidth: '420px', margin: '0 auto' }}>
            Transformez vos URLs longues en un instant.
          </p>
        </div>

        <div className="animate-fade-up-delay-1">
          <ShortenForm onUrlAdded={handleUrlAdded} />
        </div>

        <div className="animate-fade-up-delay-2" style={{ marginTop: '40px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border)',
          }}>
            <h2 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Historique des liens
            </h2>
          </div>
          <UrlList refreshTrigger={refreshKey} />
        </div>
      </div>
    </main>
  );
}