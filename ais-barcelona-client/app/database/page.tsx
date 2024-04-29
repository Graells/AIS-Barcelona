'use client';

import { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { VesselData } from '../definitions/vesselData';
import { getShipType } from '../utils/shipUtils';

const url = process.env.NEXT_PUBLIC_API_URL as string;
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

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setVessels(data))
      .catch((err) => console.error('Failed to fetch data:', err));
  }, []);

  const handleSearch = () => {
    const filter = vessels.filter(
      (vessel) =>
        vessel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vessel.mmsi.toString().includes(searchQuery),
    );
    setFilteredVessels(filter);
  };
  const formatTimestamp = (timestamp: string | undefined): string => {
    if (!timestamp) return 'N/A';
    const formatted = `${timestamp.substring(6, 8)}/${timestamp.substring(4, 6)}/${timestamp.substring(0, 4)} ${timestamp.substring(8, 10)}:${timestamp.substring(10, 12)}:${timestamp.substring(12, 14)}`;
    return formatted;
  };

  const isPointInPolygon = (lat: never, lon: never) => {
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

  const parseTimestamp = (timestamp: string): Date => {
    if (!timestamp) return new Date(); // fallback to current date/time if undefined
    // Extract parts from the timestamp
    const year = parseInt(timestamp.substring(0, 4), 10);
    const month = parseInt(timestamp.substring(4, 6), 10) - 1; // Month is 0-indexed in JavaScript Date
    const day = parseInt(timestamp.substring(6, 8), 10);
    const hour = parseInt(timestamp.substring(8, 10), 10);
    const minute = parseInt(timestamp.substring(10, 12), 10);
    const second = parseInt(timestamp.substring(12, 14), 10);
    // Create a new Date object with extracted parts
    return new Date(year, month, day, hour, minute, second);
  };
  const formatDuration = (totalMinutes: number) => {
    const minutesInADay = 1440; // 60 minutes * 24 hours
    const minutesInAnHour = 60;

    const days = Math.floor(totalMinutes / minutesInADay);
    const hours = Math.floor((totalMinutes % minutesInADay) / minutesInAnHour);
    const minutes = Math.round(totalMinutes % minutesInAnHour);

    return `${days} days, ${hours} hours, ${minutes} minutes`;
  };

  const timeInPort: any = (positions: any[]) => {
    let totalTime: any = 0;
    let inPort: boolean = false;
    let entryTime: any = null;

    positions.forEach(
      (position: { lat: undefined; lon: undefined; timestamp: string }) => {
        if (position.lat !== undefined && position.lon !== undefined) {
          const isInPort: any = isPointInPolygon(position.lat, position.lon);
          if (isInPort && !inPort) {
            entryTime = parseTimestamp(position.timestamp);
            inPort = true;
          } else if (!isInPort && inPort) {
            const exitTime: any = parseTimestamp(position.timestamp);
            totalTime += exitTime - entryTime; // Time in milliseconds
            inPort = false;
          }
        }
      },
    );

    if (inPort) {
      const now: any = new Date();
      totalTime += now - entryTime; // If still in port
    }

    const totalMinutes = totalTime / 1000 / 60;
    return formatDuration(totalMinutes);
  };

  return (
    <div className="flex min-h-screen flex-col items-center ">
      <div className="mb-4 flex ">
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
          className="mt-0.5 h-[34px] w-[275px] rounded-l border border-gray-300 p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
        <button
          onClick={handleSearch}
          className="h-[38px] rounded-r border-2 border-black bg-green-200 px-4 py-1 font-bold hover:bg-green-300  dark:border-white"
        >
          Search
        </button>
      </div>
      {filteredVessels.length > 0
        ? filteredVessels.map((vessel) => (
            <div
              key={vessel.mmsi}
              className="w-full max-w-md border border-black p-4 dark:border-white"
            >
              <h2 className="text-lg font-bold">
                {vessel.name} (MMSI: {vessel.mmsi})
              </h2>
              <p>
                Last update: {formatTimestamp(vessel.lastUpdateTime).toString()}
              </p>
              <p>
                Latitude: {vessel.lat} Longitude: {vessel.lon}
              </p>
              {vessel.destination && <p>Destination: {vessel.destination}</p>}
              {vessel.callsign && <p>Call Sign: {vessel.callsign}</p>}
              {vessel.speed !== undefined && <p>Speed: {vessel.speed} knots</p>}
              <p>
                Time in Port(last 12h): {timeInPort(vessel.positions)} minutes
              </p>
              {vessel.ship_type !== undefined && (
                <p>Ship Type: {vessel.ship_type}</p>
              )}
            </div>
          ))
        : vessels.map((vessel) => (
            <div
              key={vessel.mmsi}
              className="mb-1 w-full max-w-md border border-black p-2 dark:border-white"
            >
              <h2 className="text-lg font-bold">
                {vessel.name} (MMSI: {vessel.mmsi})
              </h2>
              {vessel.ship_type !== undefined && (
                <p>Ship Type: {getShipType(vessel.ship_type)}</p>
              )}
              {vessel.destination && <p>Destination: {vessel.destination}</p>}
              {vessel.callsign && <p>Call Sign: {vessel.callsign}</p>}
              {vessel.speed !== undefined && <p>Speed: {vessel.speed} knots</p>}
              <p>
                Time in Port(last 12h): {timeInPort(vessel.positions)} minutes
              </p>
              <p>
                Latitude: {vessel.lat} Longitude: {vessel.lon}
              </p>
              <p>
                Last update: {formatTimestamp(vessel.lastUpdateTime).toString()}
              </p>
            </div>
          ))}
    </div>
  );
}