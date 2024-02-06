export type VesselData = {
  mmsi: number;
  lat: number | undefined;
  lon: number | undefined;
  lastUpdateTime: string;
  name: string;
  destination: string | undefined;
  callsign: string | undefined;
  speed: number | undefined;
  ship_type: number | undefined;
  lastPositions: { lat: number | undefined; lon: number | undefined }[];
};
