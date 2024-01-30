import Mapa from "@/app/components/ui/Mapa";
import { fetchSentences } from "./lib/data";

export default async function Home() {
  const sentences = await fetchSentences();
  // const sentences = [
  //   null,
  //   null,
  //   null,
  //   null,
  //   null,
  //   null,
  //   null,
  //   null,
  //   null,
  //   null,
  //   null,
  //   null,
  //   null,
  //   null,
  //   null,
  // ];

  return (
    <div>
      <Mapa sentences={sentences} />
      {sentences && <pre>{JSON.stringify(sentences, null, 2)}</pre>}
    </div>
  );
}
