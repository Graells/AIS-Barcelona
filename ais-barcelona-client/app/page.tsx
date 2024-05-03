'use client';

import React, { useEffect, useState } from 'react';
import Mapa from '@/app/components/ui/Mapa';
import { fetchAll, fetchCurrent, fetchTwelve } from './lib/data-fetch';
import { VesselData } from './definitions/vesselData';
import {
  countVesselTypes,
  getImagePathFromShipTypeName,
  allShipTypes,
} from './utils/shipUtils';
import Image from 'next/image';
import Dropup from './components/ui/Dropup';

export default function Home() {
  const [sentences, setSentences] = useState<VesselData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [vesselTypeCounts, setVesselTypeCounts] = useState({});
  const [selectedOption, setSelectedOption] = useState('currentData');

  useEffect(() => {
    loadCurrentData();
    updateTimestamp();
  }, []);

  const handleSelectChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    const newSelection = event.target.value;
    setSelectedOption(newSelection);
    setLoading(true);

    if (newSelection === 'allData') {
      loadAllData();
    } else if (newSelection === 'currentData') {
      loadCurrentData();
    } else if (newSelection === 'twelveData') {
      loadCurrent12();
    }
  };

  const handleRefreshClick = () => {
    setLoading(true);
    if (selectedOption === 'allData') {
      loadAllData();
    } else if (selectedOption === 'currentData') {
      loadCurrentData();
    } else if (selectedOption === 'twelveData') {
      loadCurrent12();
    }
  };

  async function loadCurrentData() {
    setLoading(true);
    try {
      const data = await fetchCurrent();
      setSentences(data);
      setVesselTypeCounts(countVesselTypes(data));
      updateTimestamp();
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  }
  async function loadCurrent12() {
    setLoading(true);
    try {
      const data = await fetchTwelve();
      setSentences(data);
      setVesselTypeCounts(countVesselTypes(data));
      updateTimestamp();
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  }
  async function loadAllData() {
    setLoading(true);
    try {
      const data = await fetchAll();
      setSentences(data);
      setVesselTypeCounts(countVesselTypes(data));
      updateTimestamp();
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  }
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
    <main className="md:mx-auto md:w-[1100px]">
      <div>
        <Mapa sentences={sentences} />
        <div className="flex flex-col">
          <button
            className="mt-1 rounded-md border-2 border-black bg-green-200 px-4 py-2 font-bold text-black transition duration-200 ease-in-out hover:bg-green-300 dark:border-white dark:hover:bg-green-300"
            onClick={handleRefreshClick}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh Real-Time Data'}
          </button>
          <div className="flex flex-row justify-between">
            <div>
              <div className="mt-2">
                <p>
                  Last update requested at:{' '}
                  <span className="font-bold ">{lastUpdated}</span>
                </p>
                <h1>
                  Total number of vessels monitored:{' '}
                  <span className="font-bold ">{sentences.length}</span>
                </h1>
                <p className="font-bold text-sky-500 ">
                  The data is from the last 12 hours, range is about 50km radius
                  from FNB.
                </p>

                <p>
                  Updates every 90 seconds to 2 minuts(click refresh button).
                </p>
              </div>
            </div>
            <div>
              <Dropup
                options={[
                  { value: 'allData', label: 'All vessels from last 24h' },
                  {
                    value: 'currentData',
                    label: 'Current vessels in range (last 24h)',
                  },
                  {
                    value: 'twelveData',
                    label: 'Current vessels in range (last 12h)',
                  },
                ]}
                selectedOption={selectedOption}
                onChange={(value) => handleSelectChange({ target: { value } })}
                disabled={loading}
              />
              {/* <select
                className="mt-1 rounded-md border-2 border-black p-2 transition duration-200 ease-in-out hover:bg-slate-200 dark:border-white"
                value={selectedOption}
                onChange={handleSelectChange}
                disabled={loading}
              >
                <option value="allData">All vessels from last 12h</option>
                <option value="currentData">Current vessels in range</option>
              </select> */}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden">
        <div
          id="legend"
          className="mr-1 mt-4 h-[200px] w-[140px] overflow-y-auto rounded-md border border-black bg-[#8AC0FF] p-2 dark:border-white md:my-0 md:h-[500px] md:w-[200px] "
        >
          <h2 className="p-2 text-center text-xs">
            Legend. Type of vessels currently monitored:
          </h2>
          <ul>
            {sortedShipTypes.map((type: string) => (
              <li
                key={type}
                className="mb-1 flex flex-row items-center gap-2 rounded-md border border-black p-2 text-xs  dark:border-white"
              >
                <Image
                  src={getImagePathFromShipTypeName(type)}
                  alt={type}
                  width={50}
                  height={40}
                  style={{
                    width: '50px',
                    height: 'auto',
                  }}
                />
                {`${type}: ${vesselTypeCounts[type as keyof typeof vesselTypeCounts] || 0}`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}