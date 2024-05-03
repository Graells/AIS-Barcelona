const all = process.env.NEXT_PUBLIC_API_URL as string;
const current = process.env.NEXT_PUBLIC_API_URL_CURRENT as string;
const last_twelve = process.env.NEXT_PUBLIC_API_URL_LAST_12 as string;
export async function fetchAll() {
  const response = await fetch(all, {
    // 3001/get-decoded-2448
    // ais-tags
    // next: { revalidate: 60 },
    cache: 'no-store',
  });
  const sentences = await response.json();
  return sentences;
}
export async function fetchCurrent() {
  const response = await fetch(current, {
    // 3001/get-decoded-2448
    // ais-tags
    // next: { revalidate: 60 },
    cache: 'no-store',
  });
  const sentences = await response.json();
  return sentences;
}
export async function fetchTwelve() {
  const response = await fetch(last_twelve, {
    // 3001/get-decoded-2448
    // ais-tags
    // next: { revalidate: 60 },
    cache: 'no-store',
  });
  const sentences = await response.json();
  return sentences;
}
