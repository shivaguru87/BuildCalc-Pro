import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

// ================= SHEET SIZES =================
const SHEET_SIZES = {
  "8x4": { h: 8, w: 4, area: 32 },
  "7x4": { h: 7, w: 4, area: 28 },
  "6x4": { h: 6, w: 4, area: 24 },
  "8x3": { h: 8, w: 3, area: 24 },
  "6x3": { h: 6, w: 3, area: 18 },
  "5x5": { h: 5, w: 5, area: 25 }
};

// ================= THICKNESS =================
const THICKNESS = ["4", "6", "9", "12", "15", "18", "25"];

const DEFAULT_RATES = {
  "4": 1000,
  "6": 1200,
  "9": 1500,
  "12": 1800,
  "15": 2100,
  "18": 2500,
  "25": 3200,
  laminate: 1200,
  fevicol: 120
};

// ================= CUT ENGINE =================
const runEngine = (pieces, sheet) => {
  let sheets = [];

  const tryPlace = (spaces, L, W) => {
    for (let i = 0; i < spaces.length; i++) {
      let s = spaces[i];

      if (L <= s.h && W <= s.w) {
        spaces.splice(i, 1);

        const bottom = { w: s.w, h: s.h - L };
        const right = { w: s.w - W, h: L };

        if (bottom.w > 0 && bottom.h > 0) spaces.push(bottom);
        if (right.w > 0 && right.h > 0) spaces.push(right);

        return true;
      }
    }
    return false;
  };

  pieces.forEach(p => {
    for (let q = 0; q < p.qty; q++) {
      let placed = false;

      for (let sheetObj of sheets) {
        if (tryPlace(sheetObj.spaces, p.l, p.w)) {
          placed = true;
          break;
        }
      }

      if (!placed) {
        let newSheet = {
          spaces: [{ w: sheet.w, h: sheet.h }]
        };

        tryPlace(newSheet.spaces, p.l, p.w);
        sheets.push(newSheet);
      }
    }
  });

  return sheets;
};

export default function FurniturePro() {
  const [sheetType, setSheetType] = useState("8x4");
  const sheet = SHEET_SIZES[sheetType];

  const [dims, setDims] = useState({ L: 6, W: 2, H: 7 });

  const [layout, setLayout] = useState({
    hanging: 3.5,
    drawerH: 0.5,
    drawers: 2,
    shelves: 3,
    skirting: 0.25
  });

  const [rates, setRates] = useState(DEFAULT_RATES);

  // ================= HEIGHT =================
  const used =
    layout.hanging +
    layout.drawerH * layout.drawers +
    layout.skirting;

  const remaining = dims.H - used;
  const gap = remaining / (layout.shelves + 1);

  // ================= CUT LIST =================
  const pieces = [
    { l: dims.H, w: dims.W, t: "18", qty: 2 },
    { l: dims.L, w: dims.W, t: "18", qty: 2 },
    { l: dims.L, w: dims.W, t: "18", qty: layout.shelves },
    { l: dims.L, w: dims.W / 2, t: "12", qty: layout.drawers },
    { l: dims.L, w: dims.H, t: "6", qty: 1 }
  ];

  // ================= GROUP BY THICKNESS =================
  let grouped = {};
  pieces.forEach(p => {
    if (!grouped[p.t]) grouped[p.t] = [];
    grouped[p.t].push(p);
  });

  let results = {};
  let totalCost = 0;
  let totalWaste = 0;

  Object.keys(grouped).forEach(t => {
    const sheets = runEngine(grouped[t], sheet);

    let waste = 0;
    sheets.forEach(s =>
      s.spaces.forEach(sp => {
        waste += sp.w * sp.h;
      })
    );

    results[t] = {
      count: sheets.length,
      sheets,
      waste
    };

    totalWaste += waste;
    totalCost += sheets.length * (rates[t] || 0);
  });

  return (
    <Card>
      <h2>Furniture PRO (Ultimate)</h2>

      {/* SHEET SELECT */}
      <Tabs
        value={sheetType}
        onChange={setSheetType}
        options={Object.keys(SHEET_SIZES).map(s => ({
          label: s,
          value: s
        }))}
      />

      {/* DIMENSIONS */}
      <Input label="Length" value={dims.L}
        onChange={v => setDims({ ...dims, L: Number(v) })} />
      <Input label="Depth" value={dims.W}
        onChange={v => setDims({ ...dims, W: Number(v) })} />
      <Input label="Height" value={dims.H}
        onChange={v => setDims({ ...dims, H: Number(v) })} />

      {/* LAYOUT */}
      <h4>Layout</h4>
      <Input label="Hanging Height" value={layout.hanging}
        onChange={v => setLayout({ ...layout, hanging: Number(v) })} />
      <Input label="Drawer Count" value={layout.drawers}
        onChange={v => setLayout({ ...layout, drawers: Number(v) })} />
      <Input label="Drawer Height" value={layout.drawerH}
        onChange={v => setLayout({ ...layout, drawerH: Number(v) })} />
      <Input label="Shelf Count" value={layout.shelves}
        onChange={v => setLayout({ ...layout, shelves: Number(v) })} />

      {/* RESULT */}
      <div className="result">
        <h4>Layout</h4>
        <p>Remaining: {remaining.toFixed(2)} ft</p>
        <p>Gap: {gap.toFixed(2)} ft</p>

        <h4>Sheet-wise Result</h4>

        {Object.keys(results).map(t => (
          <div key={t}>
            <p><b>{t}mm Ply → {results[t].count} sheets</b></p>

            {results[t].sheets.map((s, i) => (
              <div key={i}>
                <p>Sheet {i + 1}</p>
                {s.spaces.map((sp, idx) => (
                  <p key={idx}>
                    • {sp.h.toFixed(2)} × {sp.w.toFixed(2)}
                  </p>
                ))}
              </div>
            ))}
          </div>
        ))}

        <p>Total Waste: {totalWaste.toFixed(2)} sqft</p>

        <h3>Total Cost: ₹ {totalCost.toFixed(0)}</h3>
      </div>

      {/* TIPS */}
      <div className="result">
        <h4>Smart Tips</h4>
        <p>• Use 6×4 sheets for shelves to reduce waste</p>
        <p>• Reduce drawers to save cost</p>
        <p>• Use 18mm for strength</p>
      </div>
    </Card>
  );
}
