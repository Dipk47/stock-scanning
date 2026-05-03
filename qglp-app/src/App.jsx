import React, { useState, useMemo } from "react";

// ---------------- DATA ----------------
const stockData = [
  { name: "Adani Enterprises", ticker: "ADANIENT", pe: 22.1, roe: 3.4, growth: 15, lastUpdated: "2026-05-03" },
  { name: "Adani Power", ticker: "ADANIPOWER", pe: 38.1, roe: 20.6, growth: 12, lastUpdated: "2026-05-03" },
  { name: "ASK Automotive", ticker: "ASKAUTOLTD", pe: 28.5, roe: 22.1, growth: 18, lastUpdated: "2026-05-03" },
  { name: "EMS Limited", ticker: "EMSLIMITED", pe: 24.2, roe: 28.5, growth: 20, lastUpdated: "2026-05-03" },
  { name: "Gravita India", ticker: "GRAVITA", pe: 31.5, roe: 17.6, growth: 21, lastUpdated: "2026-05-03" },
  { name: "IndiGo", ticker: "INDIGO", pe: 20.0, roe: 25.0, growth: 15, lastUpdated: "2026-05-03" },
  { name: "Larsen & Toubro", ticker: "LT", pe: 34.0, roe: 15.0, growth: 15, lastUpdated: "2026-05-03" },
  { name: "Mazagon Dock", ticker: "MAZDOCK", pe: 45.0, roe: 35.0, growth: 25, lastUpdated: "2026-05-03" },
  { name: "Paras Defence", ticker: "PARAS", pe: 65.0, roe: 12.0, growth: 25, lastUpdated: "2026-05-03" },
  { name: "Polycab India", ticker: "POLYCAB", pe: 48.0, roe: 22.0, growth: 18, lastUpdated: "2026-05-03" },
  { name: "Urbanco", ticker: "URBANCO", pe: 62.0, roe: 15.5, growth: 32, lastUpdated: "2026-05-03" },
];

const COE = 13;

// ---------------- LOGIC ----------------
function calculatePEG(pe, growth) {
  if (!growth || growth === 0) return null;
  return pe / growth;
}

function valueCreation(roe) {
  if (roe < COE) return "Destroyer";
  if (Math.abs(roe - COE) < 1) return "Neutral";
  return "Creator";
}

function scoreStock({ roe, growth, pe }) {
  const peg = calculatePEG(pe, growth);
  let score = 0;

  // ROE
  if (roe > 25) score += 30;
  else if (roe > 20) score += 25;
  else if (roe > 15) score += 15;

  // Growth
  if (growth > 25) score += 25;
  else if (growth > 15) score += 20;
  else if (growth > 10) score += 10;

  // PEG
  if (peg && peg < 1) score += 30;
  else if (peg && peg < 1.5) score += 20;
  else if (peg && peg < 2) score += 10;

  // PE penalty
  if (pe > 50) score -= 15;
  else if (pe > 35) score -= 10;

  return Math.max(0, Math.min(100, score));
}

function classify(stock) {
  const peg = calculatePEG(stock.pe, stock.growth);

  if (stock.roe > 20 && stock.growth >= 15 && peg && peg <= 1.5)
    return "Compounder";
  if (stock.growth > 25 && stock.roe > COE && peg && peg <= 2)
    return "High Growth";
  if (stock.pe < 21 && stock.roe > COE) return "Value";
  return "Avoid";
}

function marginOfSafety(pe, growth) {
  if (!growth) return null;
  const fairPE = growth * 1.5;
  return ((fairPE - pe) / fairPE) * 100;
}

function tagColor(tag) {
  switch (tag) {
    case "Compounder":
      return "bg-green-500/20 text-green-400";
    case "High Growth":
      return "bg-blue-500/20 text-blue-400";
    case "Value":
      return "bg-yellow-500/20 text-yellow-400";
    default:
      return "bg-red-500/20 text-red-400";
  }
}

// ---------------- UI ----------------
export default function App() {
  const [minROE, setMinROE] = useState(0);
  const [maxPE, setMaxPE] = useState(100);

  const processed = useMemo(() => {
    return stockData
      .map((s) => {
        const peg = calculatePEG(s.pe, s.growth);
        return {
          ...s,
          peg,
          score: scoreStock(s),
          value: valueCreation(s.roe),
          tag: classify(s),
          mos: marginOfSafety(s.pe, s.growth),
        };
      })
      .filter((s) => s.roe >= minROE && s.pe <= maxPE)
      .sort((a, b) => b.score - a.score);
  }, [minROE, maxPE]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">
        QGLP Alpha Engine
      </h1>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6 flex gap-4 shadow-lg">
        <input
          type="number"
          placeholder="Min ROE"
          value={minROE}
          onChange={(e) => setMinROE(Number(e.target.value))}
          className="px-3 py-2 rounded bg-gray-900 border border-gray-700"
        />
        <input
          type="number"
          placeholder="Max PE"
          value={maxPE}
          onChange={(e) => setMaxPE(Number(e.target.value))}
          className="px-3 py-2 rounded bg-gray-900 border border-gray-700"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 rounded-xl overflow-hidden">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-3 text-left">Stock</th>
              <th>PE</th>
              <th>ROE</th>
              <th>Growth</th>
              <th>PEG</th>
              <th>Score</th>
              <th>MoS</th>
              <th>Tag</th>
            </tr>
          </thead>
          <tbody>
            {processed.map((s) => (
              <tr
                key={s.ticker}
                className="border-t border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="p-3 font-semibold">{s.ticker}</td>
                <td>{s.pe}</td>
                <td className="text-green-400">{s.roe}%</td>
                <td>{s.growth}%</td>
                <td>{s.peg ? s.peg.toFixed(2) : "-"}</td>
                <td className="font-bold">{s.score}</td>
                <td>
                  {s.mos ? `${s.mos.toFixed(1)}%` : "-"}
                </td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs ${tagColor(s.tag)}`}>
                    {s.tag}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}