import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

export default function FurnitureEstimator() {
  const [type, setType] = useState("wardrobe");
  const [mode, setMode] = useState("box");
  const [unit, setUnit] = useState("ft");

  const [l, setL] = useState("");
  const [w, setW] = useState("");
  const [h, setH] = useState("");

  // ================= UNIT CONVERT =================
  const toFeet = (val) => {
    const v = Number(val || 0);
    if (unit === "ft") return v;
    if (unit === "inch") return v / 12;
    if (unit === "mm") return v / 304.8;
    return v;
  };

  const L = toFeet(l);
  const W = toFeet(w);
  const H = toFeet(h);

  const D = W;

  // ================= AREA =================
  const boxArea =
    2 * (H * D) +
    2 * (L * D) +
    (L * H);

  const panelArea = L * H;
  const totalArea = mode === "box" ? boxArea : panelArea;

  // ================= MATERIAL =================
  const plywoodSheets = totalArea / 32;
  const sunmicaSheets = (totalArea * 0.8) / 32;
  const fevicol = totalArea / 100;

  // ================= SMART LOGIC =================

  let shelves = 0;
  let shelfGap = 0;
  let drawers = 0;
  let drawerHeight = 0;
  let hanging = false;

  // 🔹 WARDROBE
  if (type === "wardrobe") {
    shelves = H >= 7 ? 4 : 3;
    shelfGap = (H * 12) / shelves;
    drawers = Math.floor(H / 2);
    drawerHeight = 6;
    hanging = true;
  }

  // 🔹 TV UNIT
  if (type === "tv") {
    shelves = 2;
    drawers = 2;
    drawerHeight = 5;
  }

  // 🔹 BED
  if (type === "bed") {
    drawers = mode === "box" ? 2 : 0;
    drawerHeight = 8;
  }

  // 🔹 MODULAR KITCHEN (NEW)
  if (type === "kitchen") {
    shelves = Math.floor(H / 2);
    drawers = Math.floor(L / 2);
    drawerHeight = 6;
  }

  // ================= HARDWARE =================
  const doors = Math.ceil(L / 2);
  const hinges = doors * 2;
  const handles = doors;

  // ================= COST =================
  const materialCost =
    plywoodSheets * 2500 +
    sunmicaSheets * 1200 +
    fevicol * 200 +
    hinges * 80 +
    handles * 150;

  // ✅ LABOUR 35%
  const labourCost = materialCost * 0.35;
  const totalCost = materialCost + labourCost;

  return (
    <Card>
      <h3>Furniture Estimator PRO</h3>

      {/* TYPE */}
      <Tabs
        value={type}
        onChange={setType}
        options={[
          { label: "Wardrobe", value: "wardrobe" },
          { label: "Bed", value: "bed" },
          { label: "TV Unit", value: "tv" },
          { label: "Dressing", value: "dressing" },
          { label: "Dining", value: "dining" },
          { label: "Kitchen", value: "kitchen" }
        ]}
      />

      {/* MODE */}
      <Tabs
        value={mode}
        onChange={setMode}
        options={[
          { label: "Box", value: "box" },
          { label: "Panel", value: "panel" }
        ]}
      />

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

      {/* INPUTS */}
      <Input label="Length" unit={unit} value={l} onChange={setL} />
      <Input label="Width (Depth)" unit={unit} value={w} onChange={setW} />
      <Input label="Height" unit={unit} value={h} onChange={setH} />

      {/* MATERIAL */}
      <div className="result">
        <p>Plywood: {plywoodSheets.toFixed(2)} sheets</p>
        <p>Sunmica: {sunmicaSheets.toFixed(2)} sheets</p>
        <p>Fevicol: {fevicol.toFixed(2)} kg</p>
      </div>

      {/* DESIGN */}
      <div className="result">
        <h4>Design Breakdown</h4>

        {shelves > 0 && (
          <p>
            Shelves: {shelves} (Gap ~ {shelfGap.toFixed(0)} inch)
          </p>
        )}

        {drawers > 0 && (
          <p>
            Drawers: {drawers} (Height ~ {drawerHeight} inch)
          </p>
        )}

        {hanging && <p>Hanging Space: Yes (~3 ft)</p>}
      </div>

      {/* HARDWARE */}
      <div className="result">
        <p>Hinges: {hinges} nos</p>
        <p>Handles: {handles} nos</p>
      </div>

      {/* COST */}
      <div className="result">
        <p>Material Cost: ₹ {materialCost.toFixed(0)}</p>
        <p>Labour (35%): ₹ {labourCost.toFixed(0)}</p>
        <h3>Total Cost: ₹ {totalCost.toFixed(0)}</h3>
      </div>
    </Card>
  );
}
