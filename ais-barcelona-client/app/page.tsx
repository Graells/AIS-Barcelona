import Mapa from "@/app/components/ui/Mapa";
import { fetchSentences } from './lib/data-fetch';
import NavBar from './components/ui/NavBar';
import { VesselData } from './definitions/vesselData';

export default async function Home() {
  const sentences: VesselData[] = await fetchSentences();
  // const sentences = [null, null, null];

  return (
    <main>
      <NavBar />
      <Mapa sentences={sentences} />
      {/* {sentences && <pre>{JSON.stringify(sentences, null, 2)}</pre>} */}
    </main>
  );
}
