'use client';

import { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { VesselData } from '../definitions/vesselData';
import { getShipType } from '../utils/shipUtils';
import {
  fetchAll,
  fetchCurrentVessels,
  fetchVesselPositions,
} from '../lib/data-fetch';
import Dropdown from '../components/ui/Dropdown';
import { useRouter } from 'next/navigation';

const portPolygon = [
  [41.31499060828476, 2.1704329763480104],
  [41.29252426739199, 2.1493721026934023],
  [41.323057616133845, 2.1089352252765545],
  [41.40003933561574, 2.1708541938211026],
  [41.373769338063866, 2.197823961464215],
  [41.358106498153965, 2.1851999458786366],
  [41.35125966746277, 2.1747650659437],
  [41.31734354861349, 2.1725759302931715],
];

export default function Database() {
  const [vessels, setVessels] = useState<VesselData[]>([]);
  const [filteredVessels, setFilteredVessels] = useState<VesselData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<any>('currentVessels');
  const [loading, setLoading] = useState(true);
  const [timeInPortResults, setTimeInPortResults] = useState<{
    [mmsi: number]: string;
  }>({});
  const router = useRouter();

  useEffect(() => {
    loadData(selectedOption);
  }, [selectedOption]);

  const loadData = (value: string) => {
    setLoading(true);
    let fetchData = value === 'allVessels' ? fetchAll : fetchCurrentVessels;
    fetchData()
      .then((data) => {
        setVessels(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      });
  };
  const handleSelectChange = (event: { target: { value: string } }) => {
    const newSelection = event.target.value;
    setTimeInPortResults({});
    setSelectedOption(newSelection);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredVessels([]);
      setTimeInPortResults({});
    } else {
      setLoading(true);
      const filter = vessels.filter(
        (vessel) =>
          vessel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vessel.mmsi.toString().includes(searchQuery),
      );
      if (filter.length === 0) {
        setFilteredVessels([
          {
            mmsi: 0,
            lat: 0,
            lon: 0,
            lastUpdateTime: '',
            name: 'No vessels found',
            destination: '',
            callsign: '',
            speed: 0,
            ship_type: 0,
            positions: [],
          },
        ]);
        setLoading(false);
      }
      if (filter.length > 0) {
        setFilteredVessels(filter);
        setLoading(false);
      }
    }
  };
  const handleResetSearch = () => {
    setSearchQuery('');
    setFilteredVessels([]);
    setTimeInPortResults({});
  };

  const formatTimestamp = (timestamp: string | undefined): string => {
    if (!timestamp) return 'N/A';
    const formatted = `${timestamp.substring(6, 8)}/${timestamp.substring(4, 6)}/${timestamp.substring(0, 4)} ${timestamp.substring(8, 10)}:${timestamp.substring(10, 12)}:${timestamp.substring(12, 14)}`;
    return formatted;
  };

  const isPointInPolygon = (lat: number, lon: number) => {
    let inside = false;
    const x = lat,
      y = lon;
    for (
      let i = 0, j = portPolygon.length - 1;
      i < portPolygon.length;
      j = i++
    ) {
      const xi = portPolygon[i][0],
        yi = portPolygon[i][1];
      const xj = portPolygon[j][0],
        yj = portPolygon[j][1];

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const parseTimestamp = (timestamp: string) => {
    return new Date(
      parseInt(timestamp.substring(0, 4), 10), // year
      parseInt(timestamp.substring(4, 6), 10) - 1, // month (0-based)
      parseInt(timestamp.substring(6, 8), 10), // day
      parseInt(timestamp.substring(8, 10), 10), // hour
      parseInt(timestamp.substring(10, 12), 10), // minute
      parseInt(timestamp.substring(12, 14), 10), // second
    );
  };

  const formatDuration = (totalMinutes: number) => {
    if (totalMinutes === 0) {
      return 'Not within port';
    }
    const minutesInADay = 1440; // 60 minutes * 24 hours
    const minutesInAnHour = 60;

    const days = Math.floor(totalMinutes / minutesInADay);
    const hours = Math.floor((totalMinutes % minutesInADay) / minutesInAnHour);
    const minutes = Math.round(totalMinutes % minutesInAnHour);

    return `${days} days, ${hours} hours, ${minutes} minutes`;
  };

  const timeInPort = (
    positions: { lat: number; lon: number; timestamp: string }[],
  ) => {
    let totalTime: any = 0;
    let inPort: boolean = false;
    let entryTime: any = null;
    // const uniquePositions = positions.filter(
    //   (value, index, self) =>
    //     index ===
    //     self.findIndex((t) => t.lat === value.lat && t.lon === value.lon),
    // );

    positions.forEach(
      (position: { lat: number; lon: number; timestamp: string }) => {
        if (position.lat !== undefined && position.lon !== undefined) {
          const isInPort: any = isPointInPolygon(position.lat, position.lon);
          if (isInPort && inPort === false) {
            entryTime = parseTimestamp(position.timestamp);
            inPort = true;
          } else if (!isInPort && inPort) {
            const exitTime: any = parseTimestamp(position.timestamp);
            totalTime += exitTime.getTime() - entryTime.getTime();
            inPort = false;
          }
        }
      },
    );

    if (inPort) {
      const lastPosition = positions[positions.length - 1];
      const now = parseTimestamp(lastPosition.timestamp);
      totalTime += new Date().getTime() - entryTime.getTime(); // If still in port
    }
    console.log(`Total time in port in milliseconds: ${totalTime}`);
    const totalMinutes = totalTime / 1000 / 60;
    console.log(`Total time in port in minutes: ${totalMinutes}`);
    return formatDuration(totalMinutes);
  };
  const calculateTimeInPort = async (mmsi: number) => {
    setLoading(true);
    try {
      const positions = await fetchVesselPositions(mmsi);
      const duration = timeInPort(positions);
      setTimeInPortResults((prev) => ({ ...prev, [mmsi]: duration }));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch positions:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center ">
      <div className="mb-4 flex flex-col justify-center md:w-[1100px] md:flex-row">
        <div className="mr-5 md:w-[373px]">
          <Dropdown
            options={[
              { value: 'allVessels', label: 'All vessels from last 24h' },
              {
                value: 'currentVessels',
                label: 'Current vessels in range (last 24h)',
              },
            ]}
            selectedOption={selectedOption}
            onChange={(value) => handleSelectChange({ target: { value } })}
            disabled={loading}
          />
        </div>
        <div className="mx-0.5 mt-2">
          <input
            type="text"
            placeholder="Search by MMSI or Name"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            onKeyUp={(e: KeyboardEvent<HTMLInputElement>) =>
              e.key === 'Enter' && handleSearch()
            }
            className="mt-0.25 mr-1 w-[275px] rounded border border-gray-300 px-2 py-1 focus:border-2 focus:border-black focus:outline-none dark:focus:ring-white"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="rounded border-2 border-black bg-green-200 px-2 py-1  font-bold hover:bg-green-300 dark:border-white  dark:text-black"
          >
            Search
          </button>
          <button
            onClick={handleResetSearch}
            disabled={loading}
            className="ml-1 rounded border-2 border-black bg-red-200 px-2 py-1 font-bold hover:bg-red-300 dark:border-white  dark:text-black"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="mx-auto mb-1 flex flex-wrap justify-center gap-1">
        {filteredVessels.length > 0
          ? filteredVessels.map((vessel) => (
              <div
                key={vessel.mmsi}
                className=" w-full max-w-md border border-black p-2 dark:border-white"
              >
                <h2
                  className="cursor-pointer text-lg font-bold underline hover:text-sky-500"
                  onClick={() => router.push(`/?mmsi=${vessel.mmsi}`)}
                >
                  {vessel.name} (MMSI: {vessel.mmsi})
                </h2>
                {vessel.ship_type !== undefined && (
                  <p>Ship Type: {getShipType(vessel.ship_type)}</p>
                )}
                {vessel.destination && <p>Destination: {vessel.destination}</p>}
                {vessel.callsign && <p>Call Sign: {vessel.callsign}</p>}
                {vessel.speed !== undefined && (
                  <p>Speed: {vessel.speed} knots</p>
                )}
                <div className="flex flex-row items-center">
                  <p>Time in port:</p>
                  {timeInPortResults[vessel.mmsi] ? (
                    <p className="ml-2">{timeInPortResults[vessel.mmsi]}</p>
                  ) : (
                    <button
                      onClick={() => calculateTimeInPort(vessel.mmsi ?? 0)}
                      disabled={loading || vessel.mmsi === null}
                      className="ml-2 rounded border-2 border-black bg-sky-100 px-1 font-bold hover:bg-sky-200 dark:border-white  dark:text-black"
                    >
                      Calculate
                    </button>
                  )}
                </div>
                <p>
                  Latitude: {vessel.lat} Longitude: {vessel.lon}
                </p>
                <p>
                  Last update:{' '}
                  {formatTimestamp(vessel.lastUpdateTime).toString()}
                </p>
              </div>
            ))
          : vessels.map((vessel) => (
              <div
                key={vessel.mmsi}
                className=" w-full max-w-md border border-black p-2 dark:border-white"
              >
                <h2
                  className="cursor-pointer text-lg font-bold underline hover:text-sky-500"
                  onClick={() => router.push(`/?mmsi=${vessel.mmsi}`)}
                >
                  {vessel.name} (MMSI: {vessel.mmsi})
                </h2>
                {vessel.ship_type !== undefined && (
                  <p>Ship Type: {getShipType(vessel.ship_type)}</p>
                )}
                {vessel.destination && <p>Destination: {vessel.destination}</p>}
                {vessel.callsign && <p>Call Sign: {vessel.callsign}</p>}
                {vessel.speed !== undefined && (
                  <p>Speed: {vessel.speed} knots</p>
                )}
                <div className="flex flex-row items-center">
                  <p>Time in port:</p>
                  {timeInPortResults[vessel.mmsi] ? (
                    <p className="ml-2">{timeInPortResults[vessel.mmsi]}</p>
                  ) : (
                    <button
                      onClick={() => calculateTimeInPort(vessel.mmsi ?? 0)}
                      disabled={loading || vessel.mmsi === null}
                      className="ml-2 rounded border-2 border-black bg-sky-100 px-1 font-bold hover:bg-sky-200 dark:border-white  dark:text-black"
                    >
                      Calculate
                    </button>
                  )}
                </div>
                <p>
                  Latitude: {vessel.lat} Longitude: {vessel.lon}
                </p>
                <p>
                  Last update:{' '}
                  {formatTimestamp(vessel.lastUpdateTime).toString()}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
}