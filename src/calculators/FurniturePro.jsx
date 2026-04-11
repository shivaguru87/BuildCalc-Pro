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
    hangingFrom: "top", // top or bottom

    drawerHeight: 0.5, // 6 inch
    drawerCount: 2,
    drawerFrom: "bottom",

    shelfCount: 3,
    skirting: 0.25 // 3 inch
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

  // ================= HEIGHT BREAKDOWN =================
  let usedHeight = 0;

  // Hanging
  usedHeight += layout.hangingHeight;

  // Drawers
  const totalDrawerHeight = layout.drawerHeight * layout.drawerCount;
  usedHeight += totalDrawerHeight;

  // Skirting
  usedHeight += layout.skirting;

  // Remaining for shelves
  const remainingHeight = H - usedHeight;

  // Shelf gap auto
  const shelfGap =
    layout.shelfCount > 0
      ? remainingHeight / (layout.shelfCount + 1)
      : 0;

  // ================= CUT LIST =================
  let pieces = [];

  // structure
  pieces.push({ l: H, w: D, t: 18, qty: 2 });
  pieces.push({ l: L, w: D, t: 18, qty: 2 });

  // shelves
  pieces.push({
    l: L,
    w: D,
    t: 18,
    qty: layout.shelfCount
  });

  // drawers
  pieces.push({
    l: L,
    w: D / 2,
    t: 12,
    qty: layout.drawerCount
  });

  // back
  pieces.push({ l: L, w: H, t: 6, qty: 1 });

  // ================= AREA =================
  const calcArea = (t) =>
    pieces
      .filter(p => p.t === t)
      .reduce((sum, p) => sum + p.l * p.w * p.qty, 0);

  const area18 = calcArea(18);
  const area12 = calcArea(12);
  const area6 = calcArea(6);

  // ================= SHEETS =================
  const sheets18 = Math.ceil(area18 / 32);
  const sheets12 = Math.ceil(area12 / 32);
  const sheets6 = Math.ceil(area6 / 32);

  // ================= COST =================
  const totalCost =
    sheets18 * rates.ply18 +
    sheets12 * rates.ply12 +
    sheets6 * rates.ply6;

  return (
    <Card>
      <h2>Furniture PRO (Advanced Wardrobe)</h2>

      {/* UNIT */}
      <Tabs
        value={unit}
        onChange={setUnit}
        options={[
          { label: "ft", value: "ft" },
          { label: "inch", value: "inch" },
          { label: "mm", value: "mm" }
        ]}
      />

      {/* DIMENSIONS */}
      <Input label="Length" value={dims.L}
        onChange={(v) => setDims({ ...dims, L: v })} />
      <Input label="Depth" value={dims.W}
        onChange={(v) => setDims({ ...dims, W: v })} />
      <Input label="Height" value={dims.H}
        onChange={(v) => setDims({ ...dims, H: v })} />

      {/* HANGING */}
      <h4>Clothing Hanging</h4>
      <Input label="Height (ft)"
        value={layout.hangingHeight}
        onChange={(v) =>
          setLayout({ ...layout, hangingHeight: Number(v) })
        } />

      <Tabs
        value={layout.hangingFrom}
        onChange={(v) =>
          setLayout({ ...layout, hangingFrom: v })
        }
        options={[
          { label: "Top", value: "top" },
          { label: "Bottom", value: "bottom" }
        ]}
      />

      {/* DRAWERS */}
      <h4>Drawers</h4>
      <Input label="Drawer Count"
        value={layout.drawerCount}
        onChange={(v) =>
          setLayout({ ...layout, drawerCount: Number(v) })
        } />

      <Input label="Drawer Height (ft)"
        value={layout.drawerHeight}
        onChange={(v) =>
          setLayout({ ...layout, drawerHeight: Number(v) })
        } />

      <Tabs
        value={layout.drawerFrom}
        onChange={(v) =>
          setLayout({ ...layout, drawerFrom: v })
        }
        options={[
          { label: "Bottom", value: "bottom" },
          { label: "Top", value: "top" }
        ]}
      />

      {/* SKIRTING */}
      <h4>Skirting</h4>
      <Input label="Skirting Height (ft)"
        value={layout.skirting}
        onChange={(v) =>
          setLayout({ ...layout, skirting: Number(v) })
        } />

      {/* SHELVES */}
      <h4>Shelves</h4>
      <Input label="Shelf Count"
        value={layout.shelfCount}
        onChange={(v) =>
          setLayout({ ...layout, shelfCount: Number(v) })
        } />

      {/* RESULT */}
      <div className="result">
        <h4>Layout Result</h4>

        <p>Remaining Height: {remainingHeight.toFixed(2)} ft</p>
        <p>Auto Shelf Gap: {shelfGap.toFixed(2)} ft</p>

        <h4>Material</h4>
        <p>18mm Ply: {sheets18}</p>
        <p>12mm Ply: {sheets12}</p>
        <p>6mm Ply: {sheets6}</p>

        <h3>Total: ₹ {totalCost.toFixed(0)}</h3>
      </div>
    </Card>
  );
}
