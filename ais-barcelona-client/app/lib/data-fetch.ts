const url = process.env.NEXT_PUBLIC_API_URL as string;
export async function fetchTags() {
  const response = await fetch('/get-decoded-2448', {
    // 3001/get-decoded-2448
    // ais-tags
    // next: { revalidate: 60 },
    cache: 'no-store',
  });
  const sentences = await response.json();
  return sentences;
}
