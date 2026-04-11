import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

// ================= SHEET SIZES =================
const SHEET_SIZES = {
  "8x4": { h: 8, w: 4 },
  "6x4": { h: 6, w: 4 }
};

const DEFAULT_RATES = {
  ply18: 2500,
  ply12: 1800,
  ply6: 1200,
  laminate: 1200,
  fevicol: 120,
  hinge: 80,
  channel: 300,
  handle: 150
};

// ================= REAL CUT ENGINE =================
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
  const [unit, setUnit] = useState("ft");
  const [sheetType, setSheetType] = useState("8x4");

  const sheet = SHEET_SIZES[sheetType];

  const [dims, setDims] = useState({
    L: 6,
    W: 2,
    H: 7
  });

  const [rates, setRates] = useState(DEFAULT_RATES);

  const [sunmica, setSunmica] = useState({
    inside: true,
    outside: true,
    left: true,
    right: true,
    top: true,
    bottom: false,
    back: false
  });

  const [layout, setLayout] = useState({
    hangingHeight: 3.5,
    drawerHeight: 0.5,
    drawerCount: 2,
    shelfCount: 3,
    skirting: 0.25
  });

  // ================= UNIT =================
  const toFeet = (v) => {
    if (unit === "ft") return Number(v);
    if (unit === "inch") return Number(v) / 12;
    if (unit === "mm") return Number(v) / 304.8;
  };

  const L = toFeet(dims.L);
  const D = toFeet(dims.W);
  const H = toFeet(dims.H);

  // ================= HEIGHT =================
  const totalDrawerHeight = layout.drawerHeight * layout.drawerCount;
  const usedHeight =
    layout.hangingHeight +
    totalDrawerHeight +
    layout.skirting;

  const remainingHeight = H - usedHeight;
  const shelfGap =
    layout.shelfCount > 0
      ? remainingHeight / (layout.shelfCount + 1)
      : 0;

  // ================= CUT LIST =================
  const pieces = [
    { l: H, w: D, t: "18", qty: 2 },
    { l: L, w: D, t: "18", qty: 2 },
    { l: L, w: D, t: "18", qty: layout.shelfCount },
    { l: L, w: D / 2, t: "12", qty: layout.drawerCount },
    { l: L, w: H, t: "6", qty: 1 }
  ];

  // ================= RUN ENGINE =================
  const grouped = {
    "18": [],
    "12": [],
    "6": []
  };

  pieces.forEach(p => grouped[p.t].push(p));

  const results = {};
  let waste = 0;

  Object.keys(grouped).forEach(t => {
    const sheets = runEngine(grouped[t], sheet);
    results[t] = sheets;

    sheets.forEach(s =>
      s.spaces.forEach(sp => {
        waste += sp.w * sp.h;
      })
    );
  });

  const sheets18 = results["18"].length;
  const sheets12 = results["12"].length;
  const sheets6 = results["6"].length;

  // ================= LAMINATE =================
  let laminateArea = 0;
  if (sunmica.inside) laminateArea += L * H;
  if (sunmica.outside) laminateArea += L * H;

  const laminateSheets = Math.ceil(laminateArea / 32);

  // ================= HARDWARE =================
  const hinges = 4;
  const channels = layout.drawerCount;
  const handles = layout.drawerCount + 2;

  // ================= FEVICOL =================
  const fevicolKg = Math.ceil(
    (sheets18 + sheets12 + sheets6) / 2
  );

  // ================= COST =================
  const totalCost =
    sheets18 * rates.ply18 +
    sheets12 * rates.ply12 +
    sheets6 * rates.ply6 +
    laminateSheets * rates.laminate +
    fevicolKg * rates.fevicol +
    hinges * rates.hinge +
    channels * rates.channel +
    handles * rates.handle;

  return (
    <Card>
      <h2>Furniture PRO (Final)</h2>

      <Tabs
        value={unit}
        onChange={setUnit}
        options={[
          { label: "ft", value: "ft" },
          { label: "inch", value: "inch" },
          { label: "mm", value: "mm" }
        ]}
      />

      <Tabs
        value={sheetType}
        onChange={setSheetType}
        options={[
          { label: "8×4", value: "8x4" },
          { label: "6×4", value: "6x4" }
        ]}
      />

      {/* RESULT */}
      <div className="result">
        <h4>Sheet-wise Leftover</h4>

        {Object.keys(results).map(t => (
          <div key={t}>
            <p><b>{t}mm Ply</b></p>

            {results[t].map((sheet, i) => (
              <div key={i}>
                <p>Sheet {i + 1}</p>
                {sheet.spaces.map((s, idx) => (
                  <p key={idx}>
                    • {s.h.toFixed(2)} × {s.w.toFixed(2)}
                  </p>
                ))}
              </div>
            ))}
          </div>
        ))}

        <p>Waste: {waste.toFixed(2)} sqft</p>
      </div>

      {/* FINAL COST */}
      <div className="result">
        <p>18mm Ply: {sheets18}</p>
        <p>12mm Ply: {sheets12}</p>
        <p>6mm Ply: {sheets6}</p>

        <p>Laminate: {laminateSheets}</p>
        <p>Fevicol: {fevicolKg} kg</p>

        <h3>Total: ₹ {totalCost.toFixed(0)}</h3>
      </div>
    </Card>
  );
}
