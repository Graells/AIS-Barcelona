'use client';

import React, { useEffect, useState } from 'react';
import Mapa from '@/app/components/ui/Mapa';
import { fetchTags } from './lib/data-fetch';
import NavBar from './components/ui/NavBar';
import { VesselData } from './definitions/vesselData';
import { countVesselTypes } from './utils/shipUtils';

export default function Home() {
  const [sentences, setSentences] = useState<VesselData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  async function loadData() {
    setLoading(true);
    setSentences([]);
    try {
      const data = await fetchTags();
      setSentences(data);
      updateTimestamp();
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
    updateTimestamp();
  }, []);

  const updateTimestamp = () => {
    const now = new Date().toLocaleString();
    setLastUpdated(now);
  };

  const vesselTypeCounts = countVesselTypes(sentences);

  return (
    <main className="min-h-screen bg-blue-50 p-4">
      <NavBar />
      <div className=" mx-5 md:mx-20">
        <Mapa sentences={sentences} />
        <div className="flex flex-col">
          <button
            className="mt-2 rounded bg-blue-500 px-4 py-2 text-white transition duration-200 ease-in-out hover:bg-blue-600"
            onClick={loadData}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
          <div className="mt-4">
            <p>Last update requested at: {lastUpdated}</p>
            <h1>Total number of vessels monitored: {sentences.length}</h1>
            <p>
              The data is guaranteed from the past 24 hours and may include
              information up to the last 48 hours.
            </p>
            <div className="mt-4 rounded bg-white p-4 shadow">
              <h2 className="border-b p-2 text-center">
                Type of vessels monitored:
              </h2>
              <ul>
                {Object.entries(vesselTypeCounts).map(([type, count]) => (
                  <li key={type} className="border-b p-2 last:border-b-0">
                    {`${type}: ${count}`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
