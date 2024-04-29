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
    <main className="md:mx-20 md:flex md:flex-row md:justify-center">
      <div>
        <Mapa sentences={sentences} />
        <div className="flex flex-col">
          <button
            className="mt-1 rounded-md border-2 border-black px-4 py-2 font-bold transition duration-200 ease-in-out hover:bg-slate-200 dark:border-white dark:hover:bg-slate-600"
            onClick={loadData}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh Real-Time Data'}
          </button>
          <div className="mt-2">
            <p>Last update requested at: {lastUpdated}</p>
            <h1>Total number of vessels monitored: {sentences.length}</h1>
            <p>
              The data is from the last 12 hours, range is about 50km radius
              from FNB.
            </p>
            <p>Updates every 90 seconds to 2 minuts(click refresh button).</p>
          </div>
        </div>
      </div>
      <div className="mt-4 h-[700px] w-[290px] overflow-y-auto rounded-md border-2 p-2 md:fixed md:right-0 md:my-0 md:mr-16 ">
        <h2 className=" p-2 text-center">
          Type of vessels currently monitored:
        </h2>
        <ul>
          {sortedShipTypes.map((type: string) => (
            <li
              key={type}
              className="mb-1 flex flex-row items-center justify-center gap-2 rounded-md border p-2 dark:border-white"
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
    </main>
  );
}