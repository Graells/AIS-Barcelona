export async function fetchSentences() {
  const response = await fetch('http://localhost:3001/decode-ais-messages', {
    next: { revalidate: 3600 },
    cache: 'no-store',
  });
  const sentences = await response.json();
  return sentences;
}
