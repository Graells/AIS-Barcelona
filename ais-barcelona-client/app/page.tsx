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
import Link from 'next/link';
import FnbPage from './fnb/page';

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
    <main className="">
      <div className="flex flex-col md:items-center ">
        <Mapa sentences={sentences} />
        <div className="mx-0.5 flex flex-col md:w-[1100px]">
          <button
            className="mt-1 rounded-md border-2 border-black bg-green-200 px-4 py-2 font-bold text-black transition duration-200 ease-in-out hover:bg-green-300 dark:border-white dark:hover:bg-green-300"
            onClick={handleRefreshClick}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh Real-Time Data'}
          </button>
          <div>
            <div>
              <div className="mt-1">
                <div className="flex flex-row justify-between">
                  <div>
                    <p>
                      Last update requested at:{' '}
                      <span className="font-bold ">{lastUpdated}</span>
                    </p>
                    <p>
                      Total number of vessels monitored:{' '}
                      <span className="font-bold ">{sentences.length}</span>
                    </p>
                  </div>
                  <div className="md:w-[373px]">
                    <Dropup
                      options={[
                        {
                          value: 'allData',
                          label: 'All vessels from last 24h',
                        },
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
                      onChange={(value) =>
                        handleSelectChange({ target: { value } })
                      }
                      disabled={loading}
                    />
                  </div>
                </div>
                <p>
                  Updates every 90 seconds to 2 minuts(click refresh button).
                </p>
                <p className="font-bold  ">
                  Data collected over the last 24 hours, covering a range of
                  about 50 km (27 nmi)<a href="#oran">*</a> from{' '}
                  <Link className="text-sky-500 underline" href="/fnb">
                    FNB&apos;s AIS antenna receiver
                  </Link>
                  .
                </p>

                <br />

                <span id="oran" className="text-sm">
                  *Weather conditions and obstacles permitting, the FNB antenna
                  is capable of detecting vessels up to 830 km (448 nmi) in
                  front of Oran port!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden">
        <div
          id="legend"
          className="mr-1 mt-4 h-[200px] w-[140px] overflow-y-auto rounded-md border border-black bg-[#E5E3DF] p-1 dark:border-white md:my-0 md:h-[500px] md:w-[160px] "
        >
          <h2 className="p-1 text-center text-xs">
            Legend. Type of vessels currently monitored:
          </h2>
          <ul>
            {sortedShipTypes.map((type: string) => (
              <li
                key={type}
                className="mb-1 flex flex-row items-center justify-between  rounded-md border border-black py-0.5 pl-1 pr-0.5 text-xs  dark:border-white"
              >
                {`${type}: ${vesselTypeCounts[type as keyof typeof vesselTypeCounts] || 0}`}
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}