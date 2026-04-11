import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

// ================= STANDARD SHEETS =================
const SHEET_OPTIONS = [
  { label: "8 × 4", w: 4, h: 8 },
  { label: "7 × 4", w: 4, h: 7 },
  { label: "6 × 4", w: 4, h: 6 }
];

// ================= THICKNESS =================
const THICKNESS = ["6", "12", "18"];

// ================= DEFAULT RATES =================
const DEFAULT_RATES = {
  "18": 2500,
  "12": 1800,
  "6": 1200,
  laminate: 1200,
  fevicol: 120,
  hinge: 80,
  channel: 300,
  handle: 150
};

// ================= CUT ENGINE =================
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
    if (!sheetsByT[p.t]) sheetsByT[p.t] = [];

    for (let i = 0; i < p.qty; i++) {
      let placed = false;

      for (let sheetObj of sheetsByT[p.t]) {
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
        sheetsByT[p.t].push(newSheet);
      }
    }
  });

  return sheetsByT;
};

export default function FurniturePro() {
  const [tab, setTab] = useState("wardrobe");

  return (
    <Card>
      <h2>Furniture PRO</h2>

      <Tabs
        value={tab}
        onChange={setTab}
        options={[
          { label: "Wardrobe", value: "wardrobe" },
          { label: "Bed (soon)", value: "bed" },
          { label: "Sofa (soon)", value: "sofa" }
        ]}
      />

      {tab === "wardrobe" && <Wardrobe />}
    </Card>
  );
}

// ================= WARDROBE MODULE =================
function Wardrobe() {
  const [unit, setUnit] = useState("ft");

  const [sheetIndex, setSheetIndex] = useState(0);
  const sheet = SHEET_OPTIONS[sheetIndex];

  const [dims, setDims] = useState({
    L: 6,
    W: 2,
    H: 7
  });

  const [layout, setLayout] = useState({
    hangingHeight: 3.5,
    drawerHeight: 0.5,
    drawerCount: 2,
    shelfCount: 3,
    skirting: 0.25
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
  const used =
    layout.hangingHeight +
    layout.drawerHeight * layout.drawerCount +
    layout.skirting;

  const remaining = H - used;
  const gap = remaining / (layout.shelfCount + 1);

  // ================= CUT LIST =================
  const pieces = [
    { l: H, w: D, t: "18", qty: 2 },
    { l: L, w: D, t: "18", qty: 2 },
    { l: L, w: D, t: "18", qty: layout.shelfCount },
    { l: L, w: D / 2, t: "12", qty: layout.drawerCount },
    { l: L, w: H, t: "6", qty: 1 }
  ];

  const result = runCutEngine(pieces, sheet);

  let sheetsCount = { "18": 0, "12": 0, "6": 0 };
  let waste = 0;

  Object.keys(result).forEach(t => {
    sheetsCount[t] = result[t].length;

    result[t].forEach(s =>
      s.spaces.forEach(sp => {
        waste += sp.w * sp.h;
      })
    );
  });

  // ================= COST =================
  const laminateArea = L * H * (sunmica.inside + sunmica.outside);
  const laminateSheets = Math.ceil(laminateArea / (sheet.w * sheet.h));

  const fevicolKg = Math.ceil(
    (sheetsCount["18"] + sheetsCount["12"] + sheetsCount["6"]) / 2
  );

  const hinges = 4;
  const channels = layout.drawerCount;
  const handles = layout.drawerCount + 2;

  const totalCost =
    sheetsCount["18"] * rates["18"] +
    sheetsCount["12"] * rates["12"] +
    sheetsCount["6"] * rates["6"] +
    laminateSheets * rates.laminate +
    fevicolKg * rates.fevicol +
    hinges * rates.hinge +
    channels * rates.channel +
    handles * rates.handle;

  return (
    <div>
      <h3>Wardrobe PRO</h3>

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
        value={sheetIndex}
        onChange={setSheetIndex}
        options={SHEET_OPTIONS.map((s, i) => ({
          label: s.label,
          value: i
        }))}
      />

      <Input label="Length" value={dims.L}
        onChange={(v) => setDims({ ...dims, L: v })} />
      <Input label="Depth" value={dims.W}
        onChange={(v) => setDims({ ...dims, W: v })} />
      <Input label="Height" value={dims.H}
        onChange={(v) => setDims({ ...dims, H: v })} />

      <h4>Layout</h4>
      <Input label="Hanging Height" value={layout.hangingHeight}
        onChange={(v) => setLayout({ ...layout, hangingHeight: Number(v) })} />
      <Input label="Drawer Count" value={layout.drawerCount}
        onChange={(v) => setLayout({ ...layout, drawerCount: Number(v) })} />
      <Input label="Shelf Count" value={layout.shelfCount}
        onChange={(v) => setLayout({ ...layout, shelfCount: Number(v) })} />

      <h4>Material Required</h4>
      <p>18mm Ply: {sheetsCount["18"]}</p>
      <p>12mm Ply: {sheetsCount["12"]}</p>
      <p>6mm Ply: {sheetsCount["6"]}</p>
      <p>Laminate: {laminateSheets}</p>
      <p>Fevicol: {fevicolKg} kg</p>

      <h4>Sheet-wise Leftover</h4>
      {Object.keys(result).map(t => (
        <div key={t}>
          <b>{t}mm</b>
          {result[t].map((sheet, i) => (
            <div key={i}>
              Sheet {i + 1}
              {sheet.spaces.map((s, idx) => (
                <p key={idx}>• {s.h.toFixed(2)} × {s.w.toFixed(2)}</p>
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

      <div className="result">
        <h4>Smart Tips</h4>
        <p>• Use BWR ply for wardrobes</p>
        <p>• Reduce drawers to save cost</p>
        <p>• Use leftover pieces efficiently</p>
      </div>
    </div>
  );
}
