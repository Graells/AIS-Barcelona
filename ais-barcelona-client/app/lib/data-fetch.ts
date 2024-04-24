export async function fetchSentences() {
  const response = await fetch('http://localhost:3001/decode-ais-messages', {
    next: { revalidate: 60 },
    // cache: 'no-store',
  });
  const sentences = await response.json();
  return sentences;
}
export async function fetchTags() {
  const response = await fetch('http://localhost:5000/get-decoded-2448', {
    // http://localhost:5000/get-decoded-2448
    // http://10.84.27.21:5000/get-decoded-2448
    // 3001/get-decoded-2448
    // ais-tags
    // next: { revalidate: 60 },
    cache: 'no-store',
  });
  const sentences = await response.json();
  return sentences;
}
