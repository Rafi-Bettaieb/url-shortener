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

  if (loading && urls.length === 0) return <div className="text-center py-4 text-gray-500">Chargement...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">URL Originale</th>
              <th className="px-6 py-4">Code Court</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {urls.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 max-w-xs sm:max-w-md truncate text-gray-700" title={u.originalUrl}>
                  {u.originalUrl}
                </td>
                <td className="px-6 py-4 font-mono text-indigo-600 font-medium">
                  {u.shortCode}
                </td>
                <td className="px-6 py-4 text-right">
                  <a
                    href={`${API_URL}/${u.shortCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:text-indigo-700 hover:underline font-medium"
                  >
                    Visiter &rarr;
                  </a>
                </td>
              </tr>
            ))}
            {urls.length === 0 && !loading && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                  Aucun lien raccourci pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}