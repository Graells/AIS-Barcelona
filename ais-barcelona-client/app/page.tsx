import Mapa from "@/app/components/ui/Mapa";
import { fetchSentences } from "./lib/data";
import NavBar from "./components/ui/NavBar";

export default async function Home() {
  // const sentences = await fetchSentences();
  const sentences = [null, null, null];

  return (
    <main>
      <NavBar />
      <Mapa sentences={sentences} />
      {/* {sentences && <pre>{JSON.stringify(sentences, null, 2)}</pre>} */}
    </main>
  );
}
