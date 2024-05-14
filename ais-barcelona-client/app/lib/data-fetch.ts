const getVessels = process.env.NEXT_PUBLIC_API_URL as string;
const getCurrentVessels = process.env.NEXT_PUBLIC_API_URL_CURRENT as string;
const getVesselPositions = process.env
  .NEXT_PUBLIC_API_URL_VESSEL_POSITIONS as string;
const getLast12hPositions = process.env
  .NEXT_PUBLIC_API_URL_LAST12H_POSITIONS as string;
const getVessel = process.env.NEXT_PUBLIC_API_URL_VESSEL as string;
const getVesselByDate = process.env
  .NEXT_PUBLIC_API_URL_VESSELS_BY_DATE as string;

export async function fetchAll() {
  const response = await fetch(getVessels, {
    // 3001/get-decoded-2448
    // ais-tags
    // next: { revalidate: 60 },
    cache: 'no-store',
  });
  const sentences = await response.json();
  return sentences;
}
export async function fetchCurrentVessels() {
  const response = await fetch(getCurrentVessels, {
    // 3001/get-decoded-2448
    // ais-tags
    // next: { revalidate: 60 },
    cache: 'no-store',
  });
  const sentences = await response.json();
  return sentences;
}
export async function fetchVessel() {
  const response = await fetch(getVessel, {
    // 3001/get-decoded-2448
    // ais-tags
    // next: { revalidate: 60 },
    cache: 'no-store',
  });
  const sentence = await response.json();
  return sentence;
}
export async function fetchVesselPositions(mmsi: number) {
  const response = await fetch(`${getVesselPositions}/${mmsi}`, {
    // 3001/get-decoded-2448
    // ais-tags
    // next: { revalidate: 60 },
    cache: 'no-store',
  });
  const data = await response.json();
  return data;
}
export async function fetchByData(date: any) {
  console.log('fetchByData', date);
  console.log('fetchByData URI', getVesselByDate);
  console.log('fetchByData URI', `${getVesselByDate}/${date}`);
  const response = await fetch(`${getVesselByDate}/${date}`, {
    cache: 'no-store',
  });
  const data = await response.json();
  return data;
}

export async function fetchLast12hVesselPositions() {
  const response = await fetch(getLast12hPositions, {
    // 3001/get-decoded-2448
    // ais-tags
    // next: { revalidate: 60 },
    cache: 'no-store',
  });
  const data = await response.json();
  return data;
}
