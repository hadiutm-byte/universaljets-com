import { useState, useEffect } from "react";
import { generateEmptyLegShareCard } from "@/lib/emptyLegShareCard";

const testCases = [
  { fromCode: "LKPR", fromCity: "Prague", toCode: "LFPB", toCity: "Paris", date: "2026-03-26", price: "Save up to 75%", aircraftType: "Learjet 75", category: "Light" },
  { fromCode: "OMDB", fromCity: "Dubai", toCode: "EGLL", toCity: "London", date: "2026-04-05", price: "EUR 45,000", aircraftType: "Gulfstream G650", category: "Ultra Long Range" },
  { fromCode: "LSGG", fromCity: "Geneva", toCode: "EBLG", toCity: "Liege", date: "2026-07-17", price: "Save up to 75%", aircraftType: "Pilatus PC-24", category: "Light" },
];

export default function ShareCardTest() {
  const [cards, setCards] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const urls: string[] = [];
      for (const tc of testCases) {
        try {
          const blob = await generateEmptyLegShareCard(tc);
          urls.push(URL.createObjectURL(blob));
        } catch (e) {
          console.error("Failed:", tc.fromCode, e);
          urls.push("");
        }
      }
      setCards(urls);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={{ padding: 40, color: "#fff", background: "#000" }}>Generating share cards...</div>;

  return (
    <div style={{ display: "flex", gap: 20, padding: 20, background: "#111", minHeight: "100vh", flexWrap: "wrap", alignItems: "flex-start" }}>
      {cards.map((url, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <p style={{ color: "#999", fontSize: 12, marginBottom: 8 }}>
            {testCases[i].fromCode} → {testCases[i].toCode} | {testCases[i].price}
          </p>
          {url ? (
            <img src={url} alt={`Card ${i}`} style={{ height: "85vh", border: "1px solid #333", borderRadius: 8 }} />
          ) : (
            <p style={{ color: "red" }}>Failed</p>
          )}
        </div>
      ))}
    </div>
  );
}
