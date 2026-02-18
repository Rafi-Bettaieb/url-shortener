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
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            URL Shortener
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Raccourcissez vos liens en un clin d'œil.
          </p>
        </div>

        <ShortenForm onUrlAdded={handleUrlAdded} />
        
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 px-1">Historique des liens</h2>
          <UrlList refreshTrigger={refreshKey} />
        </div>
      </div>
    </main>
  );
}