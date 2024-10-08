import { fetchVesselPositions } from '@/app/lib/data-fetch';
import { getShipType } from '@/app/utils/shipUtils';

const CreateInfoWindow = (
  vessel: any,
  map: google.maps.Map,
): google.maps.InfoWindow => {
  const shipTypeName = getShipType(vessel.ship_type);
  const contentString = `
  <div style="font-family: sans-serif; color: black; ">
    <h2 style="font-size: 1.25rem; font-weight: 700;">${vessel.name ?? 'Unknown'}</h2>
    <p style="margin: 4px 0;"><strong>MMSI:</strong> ${vessel.mmsi}</p>
    <p style="margin: 4px 0;"><strong>Destination:</strong> ${vessel.destination || 'Unknown'}</p>
    <p style="margin: 4px 0;"><strong>Callsign:</strong> ${vessel.callsign || 'Unknown'}</p>
    <p style="margin: 4px 0;"><strong>Latest reported Speed:</strong> ${vessel.speed ? vessel.speed + ' knots' : 'N/A'}</p>
    <p style="margin: 4px 0;"><strong>Ship Type:</strong> ${shipTypeName || 'Unknown'}</p>
    <p style="margin: 4px 0;"><strong>Last Update:</strong> ${formatTimestamp(vessel.lastUpdateTime)}</p>
    <div style="display:flex; justify-content: center;">
      <button id="trackButton" style="margin-top: 6px; background-color: rgb(187 247 208); color: black; font-weight: 600; font-size: 1rem; border-style: solid; padding: 8px 16px; border-color: rgb(0 0 0); border-width: 2px; border-radius: 4px; cursor: pointer;">Track</button>
    </div>
  </div>
`;

  const infoWindow = new google.maps.InfoWindow({
    content: contentString,
    ariaLabel: 'Vessel Information',
  });

  google.maps.event.addListener(infoWindow, 'domready', () => {
    const trackButton = document.getElementById('trackButton');
    if (trackButton) {
      trackButton.addEventListener('click', async () => {
        infoWindow.close();
        const positions = await fetchVesselPositions(vessel.mmsi);
        drawTrackLine(positions, map);
      });
    }
  });

  return infoWindow;
};

// const formatTimestamp = (timestamp: string | undefined): string => {
//   if (!timestamp) return 'N/A';
//   const formatted = `${timestamp.substring(6, 8)}/${timestamp.substring(4, 6)}/${timestamp.substring(0, 4)} ${timestamp.substring(8, 10)}:${timestamp.substring(10, 12)}:${timestamp.substring(12, 14)}`;
//   return formatted;
// };
const formatTimestamp = (timestamp: number | undefined): string => {
  if (!timestamp) return 'N/A';

  const date = new Date(timestamp * 1000);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

let currentPolyline: any = null;
let currentMarkers: any = [];

const clearExistingMarkers = () => {
  currentMarkers.forEach((marker: { setMap: (arg0: null) => any }) =>
    marker.setMap(null),
  );
  currentMarkers = [];
  if (currentPolyline) {
    currentPolyline.setMap(null);
    currentPolyline = null;
  }
};

const drawTrackLine = (
  positions: Array<{ lat: number; lon: number; timestamp: number }>,
  map: google.maps.Map,
) => {
  clearExistingMarkers();
  const path = positions.map((position) => ({
    lat: position.lat,
    lng: position.lon,
  }));
  const polyline = new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });

  polyline.setMap(map);
  currentPolyline = polyline;

  let lastAddedTime = new Date(0);

  const parseTimestamp = (timestamp: number): Date => {
    return new Date(timestamp * 1000);
  };

  positions.forEach((position) => {
    const positionTime = parseTimestamp(position.timestamp);

    if (positionTime.getTime() - lastAddedTime.getTime() >= 300000) {
      const tag = document.createElement('div');
      tag.className = 'dot';

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: position.lat, lng: position.lon },
        map: map,
        content: tag,
        title: formatTimestamp(position.timestamp),
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="color: black">Timestamp: ${formatTimestamp(position.timestamp)}</div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      currentMarkers.push(marker);

      lastAddedTime = positionTime;
    }
  });
};

export default CreateInfoWindow;
