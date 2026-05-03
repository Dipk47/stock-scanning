// QGLP Alpha Engine - Enhanced UI with Styling
// Tailwind CSS based clean UI

import React, { useState, useMemo } from "react";

const stockData = [
  {
    name: "Adani Enterprises",
    ticker: "ADANIENT",
    pe: 45,
    roe: 12,
    growth: 25,
    marketCap: 300000,
    sector: "Conglomerate",
    score: null
  },
  {
    name: "Adani Power",
    ticker: "ADANIPOWER",
    pe: 18,
    roe: 20,
    growth: 15,
    marketCap: 150000,
    sector: "Power",
    score: null
  },
  {
    name: "ASK Automotive",
    ticker: "ASKAUTOLTD",
    pe: 28,
    roe: 22,
    growth: 18,
    marketCap: 8000,
    sector: "Auto Ancillary",
    score: null
  },
  {
    name: "EMS Limited",
    ticker: "EMSLIMITED",
    pe: 24,
    roe: 30,
    growth: 20,
    marketCap: 6000,
    sector: "Infra",
    score: null
  },
  {
    name: "Gravita India",
    ticker: "GRAVITA",
    pe: 16,
    roe: 28,
    growth: 22,
    marketCap: 10000,
    sector: "Recycling",
    score: null
  },
  {
    name: "IndiGo",
    ticker: "INDIGO",
    pe: 20,
    roe: 18,
    growth: 12,
    marketCap: 120000,
    sector: "Aviation",
    score: null
  },
  {
    name: "Larsen & Toubro",
    ticker: "LT",
    pe: 32,
    roe: 16,
    growth: 14,
    marketCap: 400000,
    sector: "Infra",
    score: null
  },
  {
    name: "Mazagon Dock",
    ticker: "MAZDOCK",
    pe: 35,
    roe: 40,
    growth: 25,
    marketCap: 70000,
    sector: "Defense",
    score: null
  },
  {
    name: "Paras Defence",
    ticker: "PARAS",
    pe: 70,
    roe: 15,
    growth: 30,
    marketCap: 12000,
    sector: "Defense",
    score: null
  },
  {
    name: "Polycab India",
    ticker: "POLYCAB",
    pe: 38,
    roe: 25,
    growth: 20,
    marketCap: 200000,
    sector: "Electricals",
    score: null
  },
  {
    name: "Urbanco",
    ticker: "URBANCO",
    pe: 22,
    roe: 18,
    growth: 16,
    marketCap: 5000,
    sector: "Real Estate",
    score: null
  }
];

const COE = 13;

function calculatePEG(pe, growth) {
  if (!growth) return null;
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

  if (roe > 25) score += 30;
  else if (roe > 20) score += 25;
  else if (roe > 15) score += 15;

  if (growth > 25) score += 25;
  else if (growth > 15) score += 20;
  else if (growth > 10) score += 10;

  if (peg && peg < 1) score += 30;
  else if (peg < 1.5) score += 20;
  else if (peg < 2) score += 10;

  if (pe > 50) score -= 15;
  else if (pe > 35) score -= 10;

  return Math.max(0, Math.min(100, score));
}

function classify(stock) {
  const peg = calculatePEG(stock.pe, stock.growth);

  if (stock.roe > 20 && stock.growth >= 15 && peg <= 1.5) return "Compounder";
  if (stock.growth > 25 && stock.roe > COE && peg <= 2) return "High Growth";
  if (stock.pe < 21 && stock.roe > COE) return "Value";
  return "Avoid";
}

function tagColor(tag) {
  switch (tag) {
    case "Compounder": return "bg-green-500/20 text-green-400";
    case "High Growth": return "bg-blue-500/20 text-blue-400";
    case "Value": return "bg-yellow-500/20 text-yellow-400";
    default: return "bg-red-500/20 text-red-400";
  }
}

export default function App() {
  const [minROE, setMinROE] = useState(0);
  const [maxPE, setMaxPE] = useState(100);

  const processed = useMemo(() => {
    return stocksData
      .map((s) => {
        const peg = calculatePEG(s.pe, s.growth);
        return {
          ...s,
          peg,
          score: scoreStock(s),
          value: valueCreation(s.roe),
          tag: classify(s),
        };
      })
      .filter((s) => s.roe >= minROE && s.pe <= maxPE);
  }, [minROE, maxPE]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">QGLP Alpha Engine</h1>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6 flex gap-4 shadow-lg">
        <input
          type="number"
          placeholder="Min ROE"
          value={minROE}
          onChange={(e) => setMinROE(Number(e.target.value))}
          className="px-3 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Max PE"
          value={maxPE}
          onChange={(e) => setMaxPE(Number(e.target.value))}
          className="px-3 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none"
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
              <th>Tag</th>
            </tr>
          </thead>
          <tbody>
            {processed.map((s) => (
              <tr key={s.ticker} className="border-t border-gray-700 hover:bg-gray-800 transition">
                <td className="p-3 font-semibold">{s.ticker}</td>
                <td>{s.pe}</td>
                <td className="text-green-400">{s.roe}%</td>
                <td>{s.growth}%</td>
                <td>{s.peg?.toFixed(2)}</td>
                <td className="font-bold">{s.score}</td>
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
