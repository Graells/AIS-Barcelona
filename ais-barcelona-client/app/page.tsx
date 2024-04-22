'use client';

import React, { useEffect, useState } from 'react';
import Mapa from '@/app/components/ui/Mapa';
import { fetchTags } from './lib/data-fetch';
import { VesselData } from './definitions/vesselData';
import {
  countVesselTypes,
  getImagePathFromShipTypeName,
  allShipTypes,
} from './utils/shipUtils';
import Image from 'next/image';

export default function Home() {
  const [sentences, setSentences] = useState<VesselData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [vesselTypeCounts, setVesselTypeCounts] = useState({});

  async function loadData() {
    setLoading(true);
    try {
      const data = await fetchTags();
      setSentences(data);
      setVesselTypeCounts(countVesselTypes(data));
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

  const sortedShipTypes = allShipTypes.sort((a, b) => {
    return (
      (vesselTypeCounts[b as keyof typeof vesselTypeCounts] || 0) -
      (vesselTypeCounts[a as keyof typeof vesselTypeCounts] || 0)
    );
  });

  return (
    <main className="mx-auto max-w-4xl">
      <Mapa sentences={sentences} />
      <div className="flex flex-col">
        <button
          className="mt-2 rounded-xl border-2 border-black px-4 py-2 transition duration-200 ease-in-out hover:bg-slate-200 dark:border-white dark:hover:bg-slate-600"
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
          <div className="mt-4 rounded-xl bg-white p-4 shadow">
            <h2 className="border-b p-2 text-center text-black">
              Type of vessels monitored:
            </h2>
            <ul>
              {sortedShipTypes.map((type: string) => (
                <li
                  key={type}
                  className="flex flex-row items-center gap-3 border-b p-2 text-black last:border-b-0"
                >
                  <Image
                    src={getImagePathFromShipTypeName(type)}
                    alt={type}
                    width={50}
                    height={50}
                  />
                  {`${type}: ${vesselTypeCounts[type as keyof typeof vesselTypeCounts] || 0}`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}