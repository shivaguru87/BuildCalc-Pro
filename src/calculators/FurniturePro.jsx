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

export default function FurniturePro() {
  const [unit, setUnit] = useState("ft");

  const [dims, setDims] = useState({
    L: 6,
    W: 2,
    H: 7
  });

  const [rates, setRates] = useState(DEFAULT_RATES);

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
  let usedHeight = 0;

  usedHeight += layout.hangingHeight;
  const totalDrawerHeight = layout.drawerHeight * layout.drawerCount;
  usedHeight += totalDrawerHeight;
  usedHeight += layout.skirting;

  const remainingHeight = H - usedHeight;

  const shelfGap =
    layout.shelfCount > 0
      ? remainingHeight / (layout.shelfCount + 1)
      : 0;

  // ================= AREA =================
  const pieces = [
    { l: H, w: D, t: 18, qty: 2 },
    { l: L, w: D, t: 18, qty: 2 },
    { l: L, w: D, t: 18, qty: layout.shelfCount },
    { l: L, w: D / 2, t: 12, qty: layout.drawerCount },
    { l: L, w: H, t: 6, qty: 1 }
  ];

  const calcArea = (t) =>
    pieces
      .filter(p => p.t === t)
      .reduce((sum, p) => sum + p.l * p.w * p.qty, 0);

  const area18 = calcArea(18);
  const area12 = calcArea(12);
  const area6 = calcArea(6);

  // ================= SHEETS =================
  const sheetArea = 32; // 8x4

  const sheets18 = Math.ceil(area18 / sheetArea);
  const sheets12 = Math.ceil(area12 / sheetArea);
  const sheets6 = Math.ceil(area6 / sheetArea);

  // ================= LEFTOVER =================
  const leftover18 = sheets18 * sheetArea - area18;
  const leftover12 = sheets12 * sheetArea - area12;
  const leftover6 = sheets6 * sheetArea - area6;

  // ================= LAMINATE =================
  const laminateArea = L * H * 2; // inside + outside simple

  // ================= COST =================
  const totalCost =
    sheets18 * rates.ply18 +
    sheets12 * rates.ply12 +
    sheets6 * rates.ply6 +
    laminateArea * (rates.laminate / 32);

  return (
    <Card>
      <h2>Furniture PRO (Advanced Wardrobe)</h2>

      <Tabs
        value={unit}
        onChange={setUnit}
        options={[
          { label: "ft", value: "ft" },
          { label: "inch", value: "inch" },
          { label: "mm", value: "mm" }
        ]}
      />

      <Input label="Length" value={dims.L}
        onChange={(v) => setDims({ ...dims, L: v })} />
      <Input label="Depth" value={dims.W}
        onChange={(v) => setDims({ ...dims, W: v })} />
      <Input label="Height" value={dims.H}
        onChange={(v) => setDims({ ...dims, H: v })} />

      <h4>Clothing Hanging</h4>
      <Input label="Height (ft)"
        value={layout.hangingHeight}
        onChange={(v) =>
          setLayout({ ...layout, hangingHeight: Number(v) })
        } />

      <h4>Drawers</h4>
      <Input label="Drawer Count"
        value={layout.drawerCount}
        onChange={(v) =>
          setLayout({ ...layout, drawerCount: Number(v) })
        } />

      <h4>Shelves</h4>
      <Input label="Shelf Count"
        value={layout.shelfCount}
        onChange={(v) =>
          setLayout({ ...layout, shelfCount: Number(v) })
        } />

      <div className="result">
        <h4>Layout Result</h4>

        <p>Remaining Height: {remainingHeight.toFixed(2)} ft</p>
        <p>Shelf Gap: {shelfGap.toFixed(2)} ft</p>

        <h4>Material</h4>
        <p>18mm Ply: {sheets18} (Leftover: {leftover18.toFixed(2)} sqft)</p>
        <p>12mm Ply: {sheets12} (Leftover: {leftover12.toFixed(2)} sqft)</p>
        <p>6mm Ply: {sheets6} (Leftover: {leftover6.toFixed(2)} sqft)</p>

        <p>Laminate Required: {laminateArea.toFixed(2)} sqft</p>

        <h3>Total: ₹ {totalCost.toFixed(0)}</h3>
      </div>
    </Card>
  );
}
