import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

// ================= SHEET SIZES =================
const SHEETS = {
  "8x4": { w: 4, h: 8, area: 32 },
  "6x4": { w: 4, h: 6, area: 24 }
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
const runCutEngine = (pieces, sheet) => {
  let sheetsByT = {};

  const tryPlace = (spaces, L, W) => {
    for (let i = 0; i < spaces.length; i++) {
      let s = spaces[i];

      let fitNormal = L <= s.h && W <= s.w;
      let fitRotate = W <= s.h && L <= s.w;

      if (fitNormal || fitRotate) {
        spaces.splice(i, 1);

        let cutL = fitNormal ? L : W;
        let cutW = fitNormal ? W : L;

        const bottom = { w: s.w, h: s.h - cutL };
        const right = { w: s.w - cutW, h: cutL };

        if (bottom.w > 0 && bottom.h > 0) spaces.push(bottom);
        if (right.w > 0 && right.h > 0) spaces.push(right);

        return true;
      }
    }
    return false;
  };

  pieces.forEach((p) => {
    const { l, w, t, qty } = p;

    if (!sheetsByT[t]) sheetsByT[t] = [];

    for (let q = 0; q < qty; q++) {
      let placed = false;

      for (let sheetObj of sheetsByT[t]) {
        if (tryPlace(sheetObj.spaces, l, w)) {
          placed = true;
          break;
        }
      }

      if (!placed) {
        let newSheet = {
          spaces: [{ w: sheet.w, h: sheet.h }]
        };
        tryPlace(newSheet.spaces, l, w);
        sheetsByT[t].push(newSheet);
      }
    }
  });

  return sheetsByT;
};

export default function FurniturePro() {
  const [unit, setUnit] = useState("ft");
  const [sheetType, setSheetType] = useState("8x4");

  const sheet = SHEETS[sheetType];

  const [dims, setDims] = useState({
    L: 6,
    W: 2,
    H: 7
  });

  const [rates, setRates] = useState(DEFAULT_RATES);

  const [sunmica, setSunmica] = useState({
    inside: true,
    outside: true
  });

  const [layout, setLayout] = useState({
    hangingHeight: 3.5,
    hangingFrom: "top",
    drawerHeight: 0.5,
    drawerCount: 2,
    drawerFrom: "bottom",
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

  // ================= ENGINE =================
  const result = runCutEngine(pieces, sheet);

  let sheets18 = result["18"]?.length || 0;
  let sheets12 = result["12"]?.length || 0;
  let sheets6 = result["6"]?.length || 0;

  let waste = 0;
  Object.values(result).forEach(s =>
    s.forEach(sheet =>
      sheet.spaces.forEach(sp => {
        waste += sp.w * sp.h;
      })
    )
  );

  // ================= LAMINATE =================
  let laminateArea = 0;
  if (sunmica.inside) laminateArea += L * H;
  if (sunmica.outside) laminateArea += L * H;

  const laminateSheets = Math.ceil(laminateArea / sheet.area);

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

  // ================= SMART TIPS =================
  const tips = [
    "Use BWR ply for wardrobes",
    "Reduce drawers to lower cost",
    "Use 6x4 sheet for less waste in small jobs",
    "Reuse leftover pieces for shelves",
    "Keep shelf gap between 1.2–1.6 ft"
  ];

  return (
    <Card>
      <h2>Furniture PRO (Ultimate)</h2>

      <Tabs value={unit} onChange={setUnit}
        options={[
          { label: "ft", value: "ft" },
          { label: "inch", value: "inch" },
          { label: "mm", value: "mm" }
        ]}
      />

      <Tabs value={sheetType} onChange={setSheetType}
        options={[
          { label: "8×4", value: "8x4" },
          { label: "6×4", value: "6x4" }
        ]}
      />

      {/* KEEP YOUR EXISTING UI (no change) */}

      <div className="result">
        <h4>Layout Result</h4>
        <p>Remaining Height: {remainingHeight.toFixed(2)} ft</p>
        <p>Shelf Gap: {shelfGap.toFixed(2)} ft</p>

        <h4>Sheet-wise Leftover</h4>
        {Object.keys(result).map(t => (
          <div key={t}>
            <p><b>{t}mm Ply</b></p>
            {result[t].map((sheet, i) => (
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

        <h4>Material</h4>
        <p>18mm Ply: {sheets18}</p>
        <p>12mm Ply: {sheets12}</p>
        <p>6mm Ply: {sheets6}</p>
        <p>Laminate: {laminateSheets}</p>
        <p>Fevicol: {fevicolKg} kg</p>

        <h3>Total: ₹ {totalCost.toFixed(0)}</h3>
      </div>

      <div className="result">
        <h4>Smart Tips</h4>
        {tips.map((t, i) => (
          <p key={i}>• {t}</p>
        ))}
      </div>
    </Card>
  );
}
