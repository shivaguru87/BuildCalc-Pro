import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

const DEFAULT_RATES = {
  ply18: 2500,
  ply12: 1800,
  ply6: 1200
};

// ================= CUT ENGINE =================
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
    if (!sheetsByT[p.t]) sheetsByT[p.t] = [];

    for (let i = 0; i < p.qty; i++) {
      let placed = false;

      for (let sheet of sheetsByT[p.t]) {
        if (tryPlace(sheet.spaces, p.l, p.w)) {
          placed = true;
          break;
        }
      }

      if (!placed) {
        let newSheet = { spaces: [{ w: SHEET.w, h: SHEET.h }] };
        tryPlace(newSheet.spaces, p.l, p.w);
        sheetsByT[p.t].push(newSheet);
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

  const [rates] = useState(DEFAULT_RATES);

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

  // ================= POSITION LOGIC =================
  const drawerTotal = layout.drawerHeight * layout.drawerCount;

  let topUsed = 0;
  let bottomUsed = 0;

  // Hanging
  if (layout.hangingFrom === "top") {
    topUsed += layout.hangingHeight;
  } else {
    bottomUsed += layout.hangingHeight;
  }

  // Drawers
  if (layout.drawerFrom === "bottom") {
    bottomUsed += drawerTotal;
  } else {
    topUsed += drawerTotal;
  }

  // Skirting
  bottomUsed += layout.skirting;

  // Remaining space for shelves
  const remainingHeight = H - (topUsed + bottomUsed);

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
  const result = runCutEngine(pieces);

  const sheets18 = result["18"]?.length || 0;
  const sheets12 = result["12"]?.length || 0;
  const sheets6 = result["6"]?.length || 0;

  let waste = 0;
  Object.values(result).forEach((sheets) =>
    sheets.forEach((sheet) =>
      sheet.spaces.forEach((s) => {
        waste += s.w * s.h;
      })
    )
  );

  // ================= COST =================
  const totalCost =
    sheets18 * rates.ply18 +
    sheets12 * rates.ply12 +
    sheets6 * rates.ply6;

  return (
    <Card>
      <h2>Furniture PRO (Final Correct)</h2>

      {/* KEEP YOUR ORIGINAL UI */}

      <div className="result">
        <h4>Layout Result</h4>
        <p>Remaining Height: {remainingHeight.toFixed(2)} ft</p>
        <p>Shelf Gap: {shelfGap.toFixed(2)} ft</p>

        <h4>Material</h4>
        <p>18mm Ply: {sheets18}</p>
        <p>12mm Ply: {sheets12}</p>
        <p>6mm Ply: {sheets6}</p>

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

        <h3>Total: ₹ {totalCost.toFixed(0)}</h3>
      </div>

      <div className="result">
        <h4>Smart Tips</h4>
        <p>• Use BWR ply for durability</p>
        <p>• Place drawers at bottom for stability</p>
        <p>• Keep shelf gap 1.2–1.6 ft</p>
        <p>• Use leftover pieces efficiently</p>
      </div>
    </Card>
  );
}
