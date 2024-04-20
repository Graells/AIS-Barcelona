export async function fetchSentences() {
  const response = await fetch('http://localhost:3001/decode-ais-messages', {
    next: { revalidate: 60 },
    // cache: 'no-store',
  });
  const sentences = await response.json();
  return sentences;
}
export async function fetchTags() {
  const response = await fetch('http://localhost:3001/decode-2448', {
    // ais-tags
    // next: { revalidate: 60 },
    cache: 'no-store',
  });
  const sentences = await response.json();
  return sentences;
}
