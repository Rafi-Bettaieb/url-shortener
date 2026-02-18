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

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setCopied(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowToast(false);

    let finalUrl = url.trim();
    

    try {
      const res = await fetch(`${API_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: finalUrl }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la création du lien');
      }

      const data = await res.json();
      
      setShortUrl(`${API_URL}/${data.shortCode}`);
      
      if (data.isNew === false) {
        setSuccessMessage("Ce lien existe déjà ! Voici son raccourci :");
      } else {
        setSuccessMessage("Lien créé avec succès !");
      }

      setUrl('');
      onUrlAdded();
      setShowToast(true);
    } catch (err) {
      setError('Impossible de raccourcir ce lien.');
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
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100 relative">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Nouveau lien</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="url" 
          required
          placeholder="Collez votre lien (ex: google.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? 'Traitement...' : 'Raccourcir'}
        </button>
      </form>

      {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}

      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce-in">
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-2xl flex items-center gap-4 max-w-md border border-gray-700">
            <div className="flex-1">
              <p className={`text-sm font-bold mb-1 ${successMessage.includes('existe') ? 'text-yellow-400' : 'text-green-400'}`}>
                {successMessage}
              </p>
              <a 
                href={shortUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:underline truncate block"
              >
                {shortUrl}
              </a>
            </div>
            
            <button
              onClick={handleCopy}
              className={`px-3 py-1 rounded text-xs font-bold transition ${
                copied 
                  ? 'bg-green-500 text-white cursor-default' 
                  : 'bg-white text-gray-800 hover:bg-gray-200'
              }`}
            >
              {copied ? 'Copié !' : 'Copier'}
            </button>
            
            <button 
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-white ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}