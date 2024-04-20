import { getShipType } from '@/app/utils/shipUtils';

const CreateInfoWindow = (
  vessel: any,
  map: google.maps.Map,
): google.maps.InfoWindow => {
  const shipTypeName = getShipType(vessel.ship_type);
  const contentString = `
  <div style="padding: 8px; font-family: sans-serif;">
    <h2 style="font-size: 1.25rem; font-weight: 700;">${vessel.name}</h2>
    <p style="margin: 4px 0;"><strong>MMSI:</strong> ${vessel.mmsi}</p>
    <p style="margin: 4px 0;"><strong>Destination:</strong> ${vessel.destination || 'N/A'}</p>
    <p style="margin: 4px 0;"><strong>Callsign:</strong> ${vessel.callsign || 'N/A'}</p>
    <p style="margin: 4px 0;"><strong>Latest reported Speed:</strong> ${vessel.speed ? vessel.speed + ' knots' : 'N/A'}</p>
    <p style="margin: 4px 0;"><strong>Ship Type:</strong> ${shipTypeName || 'N/A'}</p>
    <p style="margin: 4px 0;"><strong>Last Update:</strong> ${formatTimestamp(vessel.lastUpdateTime)}</p>
    <button id="trackButton" style="background-color: #2563eb; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Track</button>
  </div>
`;

  const infoWindow = new google.maps.InfoWindow({
    content: contentString,
    ariaLabel: 'Vessel Information',
  });

  google.maps.event.addListener(infoWindow, 'domready', () => {
    const trackButton = document.getElementById('trackButton');
    if (trackButton) {
      trackButton.addEventListener('click', () => {
        infoWindow.close();
        drawTrackLine(vessel.positions, map);
      });
    }
  });

  return infoWindow;
};

const formatTimestamp = (timestamp: string | undefined): string => {
  if (!timestamp) return 'N/A';
  const formatted = `${timestamp.substring(6, 8)}/${timestamp.substring(4, 6)}/${timestamp.substring(0, 4)} ${timestamp.substring(8, 10)}:${timestamp.substring(10, 12)}:${timestamp.substring(12, 14)}`;
  return formatted;
};

let currentPolyline: any = null;
const drawTrackLine = (
  positions: Array<{ lat: number; lon: number }>,
  map: google.maps.Map,
) => {
  if (currentPolyline) {
    currentPolyline.setMap(null);
  }
  const uniquePositions = positions.filter(
    (value, index, self) =>
      index ===
      self.findIndex((t) => t.lat === value.lat && t.lon === value.lon),
  );

  const path = uniquePositions.map((position) => ({
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
};

export default CreateInfoWindow;
