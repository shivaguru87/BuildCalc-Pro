import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

export default function FurnitureEstimator() {
  const [type, setType] = useState("wardrobe");
  const [mode, setMode] = useState("box");

  const [l, setL] = useState("");
  const [w, setW] = useState("");
  const [h, setH] = useState("");

  const L = Number(l || 0);
  const W = Number(w || 0);
  const H = Number(h || 0);

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

  if (type === "wardrobe") {
    if (H >= 7) {
      shelves = 4;
      shelfGap = (H * 12) / shelves; // inch
    } else {
      shelves = 3;
      shelfGap = (H * 12) / shelves;
    }

    drawers = Math.floor(H / 2); // simple logic
    drawerHeight = 6; // inches
    hanging = true;
  }

  if (type === "tv") {
    shelves = 2;
    drawers = 2;
    drawerHeight = 5;
  }

  if (type === "bed") {
    drawers = mode === "box" ? 2 : 0;
    drawerHeight = 8;
  }

  // ================= HARDWARE =================
  const doors = Math.ceil(L / 2);
  const hinges = doors * 2;
  const handles = doors;

  // ================= COST =================
  const totalCost =
    plywoodSheets * 2500 +
    sunmicaSheets * 1200 +
    fevicol * 200 +
    hinges * 80 +
    handles * 150;

  return (
    <Card>
      <h3>Furniture Estimator PRO</h3>

      <Tabs
        value={type}
        onChange={setType}
        options={[
          { label: "Wardrobe", value: "wardrobe" },
          { label: "Bed", value: "bed" },
          { label: "TV Unit", value: "tv" },
          { label: "Dressing", value: "dressing" },
          { label: "Dining", value: "dining" }
        ]}
      />

      <Tabs
        value={mode}
        onChange={setMode}
        options={[
          { label: "Box", value: "box" },
          { label: "Panel", value: "panel" }
        ]}
      />

      <Input label="Length" unit="ft" value={l} onChange={setL} />
      <Input label="Width (Depth)" unit="ft" value={w} onChange={setW} />
      <Input label="Height" unit="ft" value={h} onChange={setH} />

      {/* MATERIAL RESULT */}
      <div className="result">
        <p>Plywood: {plywoodSheets.toFixed(2)} sheets</p>
        <p>Sunmica: {sunmicaSheets.toFixed(2)} sheets</p>
        <p>Fevicol: {fevicol.toFixed(2)} kg</p>
      </div>

      {/* SMART BREAKDOWN */}
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
        <h3>Total Cost: ₹ {totalCost.toFixed(0)}</h3>
      </div>
    </Card>
  );
}
