import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

// ================= DEFAULT RATES =================
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
          { label: "Office (soon)", value: "office" }
        ]}
      />

      {tab === "wardrobe" && <WardrobeModule />}
    </Card>
  );
}

// ================= WARDROBE =================
function WardrobeModule() {
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

  // ================= NEW HEIGHT-BASED LAYOUT =================
  const [layout, setLayout] = useState({
    hangingHeight: 3.5,
    drawerHeight: 0.5,
    drawerCount: 2,
    shelfCount: 4,
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

  // ================= HEIGHT BREAKDOWN =================
  const drawerTotal = layout.drawerHeight * layout.drawerCount;

  const usedHeight =
    layout.hangingHeight +
    drawerTotal +
    layout.skirting;

  const remainingHeight = H - usedHeight;

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

  // ================= LAMINATE =================
  let laminateArea = 0;

  if (sunmica.inside) laminateArea += area18;
  if (sunmica.outside) laminateArea += L * H;

  const laminateSheets = Math.ceil(laminateArea / 32);

  // ================= HARDWARE =================
  const hinges = 4;
  const channels = layout.drawerCount;
  const handles = layout.drawerCount + 2;

  // ================= FEVICOL =================
  const fevicolKg = Math.ceil((sheets18 + sheets12 + sheets6) / 2);

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
    <div>
      <h3>Wardrobe PRO</h3>

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

      {/* NEW LAYOUT */}
      <h4>Layout (Editable)</h4>

      <Input label="Hanging Height (ft)"
        value={layout.hangingHeight}
        onChange={(v) =>
          setLayout({ ...layout, hangingHeight: Number(v) })
        } />

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

      <Input label="Shelf Count"
        value={layout.shelfCount}
        onChange={(v) =>
          setLayout({ ...layout, shelfCount: Number(v) })
        } />

      <Input label="Skirting Height (ft)"
        value={layout.skirting}
        onChange={(v) =>
          setLayout({ ...layout, skirting: Number(v) })
        } />

      {/* RESULT ADDITION */}
      <div className="result">
        <h4>Layout Result</h4>
        <p>Remaining Height: {remainingHeight.toFixed(2)} ft</p>
        <p>Shelf Gap: {shelfGap.toFixed(2)} ft</p>
      </div>

      {/* SUNMICA */}
      <h4>Sunmica Options</h4>
      <div className="sunmica-grid">
        {Object.keys(sunmica).map((k) => (
          <label key={k} className="sunmica-row">
            <span className="sunmica-label">{k}</span>
            <input
              type="checkbox"
              checked={sunmica[k]}
              onChange={() =>
                setSunmica({ ...sunmica, [k]: !sunmica[k] })
              }
            />
          </label>
        ))}
      </div>

      {/* RATES */}
      <h4>Material Rates</h4>
      {Object.keys(rates).map(k => (
        <Input
          key={k}
          label={k}
          value={rates[k]}
          onChange={(v) =>
            setRates({ ...rates, [k]: Number(v) })
          }
        />
      ))}

      {/* RESULT */}
      <div className="result">
        <h4>Material Required</h4>
        <p>18mm Ply: {sheets18}</p>
        <p>12mm Ply: {sheets12}</p>
        <p>6mm Ply: {sheets6}</p>
        <p>Laminate: {laminateSheets}</p>
        <p>Fevicol: {fevicolKg} kg</p>

        <h4>Hardware</h4>
        <p>Hinges: {hinges}</p>
        <p>Channels: {channels}</p>
        <p>Handles: {handles}</p>

        <h3>Total: ₹ {totalCost.toFixed(0)}</h3>
      </div>

      {/* TIPS */}
      <div className="result">
        <h4>Smart Tips</h4>
        <p>• Use BWR ply for durability</p>
        <p>• Keep shelf gap between 1–1.5 ft</p>
        <p>• Reduce drawers to save cost</p>
        <p>• Adjust hanging height based on clothes</p>
      </div>
    </div>
  );
}
