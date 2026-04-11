import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

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
const SHEET = { w: 4, h: 8 };

const runCutEngine = (pieces) => {
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

      for (let sheet of sheetsByT[t]) {
        if (tryPlace(sheet.spaces, l, w)) {
          placed = true;
          break;
        }
      }

      if (!placed) {
        let newSheet = { spaces: [{ w: SHEET.w, h: SHEET.h }] };
        tryPlace(newSheet.spaces, l, w);
        sheetsByT[t].push(newSheet);
      }
    }
  });

  return sheetsByT;
};

export default function FurniturePro() {
  const [unit, setUnit] = useState("ft");

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
  const result = runCutEngine(pieces);

  const sheets18 = result["18"]?.length || 0;
  const sheets12 = result["12"]?.length || 0;
  const sheets6 = result["6"]?.length || 0;

  let waste = 0;
  Object.values(result).forEach((sheets) => {
    sheets.forEach((sheet) => {
      sheet.spaces.forEach((s) => {
        waste += s.w * s.h;
      });
    });
  });

  // ================= ORIGINAL LOGIC (UNCHANGED) =================
  let laminateArea = 0;
  if (sunmica.inside) laminateArea += L * H;
  if (sunmica.outside) laminateArea += L * H;

  const laminateSheets = Math.ceil(laminateArea / 32);

  const hinges = 4;
  const channels = layout.drawerCount;
  const handles = layout.drawerCount + 2;

  const fevicolKg = Math.ceil(
    (sheets18 + sheets12 + sheets6) / 2
  );

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
    "Use BWR ply for durability",
    "Keep shelf spacing ~1.5ft",
    "Reduce drawers to save cost",
    "Use leftover pieces for small shelves",
    "Optimize cuts to reduce waste"
  ];

  return (
    <Card>
      <h2>Furniture PRO (Advanced Wardrobe)</h2>

      <Tabs value={unit} onChange={setUnit}
        options={[
          { label: "ft", value: "ft" },
          { label: "inch", value: "inch" },
          { label: "mm", value: "mm" }
        ]}
      />

      {/* EXISTING UI KEPT SAME */}

      <div className="result">
        <h4>Layout Result</h4>
        <p>Remaining Height: {remainingHeight.toFixed(2)} ft</p>
        <p>Shelf Gap: {shelfGap.toFixed(2)} ft</p>

        <h4>Material</h4>
        <p>18mm Ply: {sheets18}</p>
        <p>12mm Ply: {sheets12}</p>
        <p>6mm Ply: {sheets6}</p>
        <p>Laminate: {laminateSheets}</p>
        <p>Fevicol: {fevicolKg} kg</p>

        <h4>Sheet-wise Leftover</h4>
        {Object.keys(result).map((t) => (
          <div key={t}>
            <p><b>{t}mm</b></p>
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

        <h4>Hardware</h4>
        <p>Hinges: {hinges}</p>
        <p>Channels: {channels}</p>
        <p>Handles: {handles}</p>

        <h3>Total: ₹ {totalCost.toFixed(0)}</h3>
      </div>

      {/* SMART TIPS */}
      <div className="result">
        <h4>Smart Tips</h4>
        {tips.map((t, i) => (
          <p key={i}>• {t}</p>
        ))}
      </div>
    </Card>
  );
}
