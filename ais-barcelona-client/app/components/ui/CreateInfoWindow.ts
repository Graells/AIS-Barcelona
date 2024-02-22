import { getShipType } from '@/app/utils/shipUtils';

const CreateInfoWindow = (vessel: any): google.maps.InfoWindow => {
  const shipTypeName = getShipType(vessel.ship_type);
  const contentString = `
    <div>
      <h2>${vessel.name}</h2>
      <p><strong>MMSI:</strong> ${vessel.mmsi}</p>
      <p><strong>Destination:</strong> ${vessel.destination || 'N/A'}</p>
      <p><strong>Callsign:</strong> ${vessel.callsign || 'N/A'}</p>
      <p><strong>Latest reported Speed:</strong> ${vessel.speed ? vessel.speed + ' knots' : 'N/A'}</p>
      <p><strong>Ship Type:</strong> ${shipTypeName || 'N/A'}</p>
      <p><strong>Last Update:</strong> ${formatTimestamp(vessel.lastUpdateTime)}</p>
    </div>
  `;

  return new google.maps.InfoWindow({
    content: contentString,
    ariaLabel: 'Vessel Information',
  });
};

const formatTimestamp = (timestamp: string | undefined): string => {
  if (!timestamp) return 'N/A';
  const formatted = `${timestamp.substring(6, 8)}/${timestamp.substring(4, 6)}/${timestamp.substring(0, 4)} ${timestamp.substring(8, 10)}:${timestamp.substring(10, 12)}:${timestamp.substring(12, 14)}`;
  return formatted;
};

export default CreateInfoWindow;
