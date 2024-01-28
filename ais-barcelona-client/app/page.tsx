import Mapa from "@/app/components/ui/Mapa";
import { fetchSentences } from "./lib/data";

export default async function Home() {
  let sentences = await fetchSentences();
  return (
    <div>
      <Mapa />
      {sentences && <pre>{JSON.stringify(sentences, null, 2)}</pre>}
    </div>
  );
}
