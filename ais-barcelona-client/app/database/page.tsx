'use client';

import { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { VesselData } from '../definitions/vesselData';

export default function Database() {
  const [vessels, setVessels] = useState<VesselData[]>([]);
  const [filteredVessels, setFilteredVessels] = useState<VesselData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:5000/get-database')
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

  return (
    <div>
      <input
        type="text"
        placeholder="Search by MMSI or Name..."
        value={searchQuery}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchQuery(e.target.value)
        }
        onKeyUp={(e: KeyboardEvent<HTMLInputElement>) =>
          e.key === 'Enter' && handleSearch()
        }
      />
      {filteredVessels.length > 0
        ? filteredVessels.map((vessel) => (
            <div key={vessel.mmsi}>
              <h2>
                {vessel.name} (MMSI: {vessel.mmsi})
              </h2>
              <p>Last update: {vessel.lastUpdateTime}</p>
              <p>
                Latitude: {vessel.lat} Longitude: {vessel.lon}
              </p>
            </div>
          ))
        : vessels.map((vessel) => (
            <div key={vessel.mmsi}>
              <h2>
                {vessel.name} (MMSI: {vessel.mmsi})
              </h2>
              <p>Last update: {vessel.lastUpdateTime}</p>
              <p>
                Latitude: {vessel.lat} Longitude: {vessel.lon}
              </p>
            </div>
          ))}
    </div>
  );
}
