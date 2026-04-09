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
  const [d, setD] = useState("");

  // ================= CALC =================

  const L = Number(l || 0);
  const W = Number(w || 0);
  const H = Number(h || 0);
  const D = Number(d || 0);

  // BOX TYPE (full structure)
  const boxArea =
    2 * (H * D) +      // sides
    2 * (L * D) +      // top + bottom
    (L * H);           // back

  // PANEL TYPE (front only)
  const panelArea = L * H;

  const totalArea = mode === "box" ? boxArea : panelArea;

  // MATERIALS
  const plywoodSheets = totalArea / 32;
  const sunmicaSheets = (totalArea * 0.8) / 32;
  const fevicol = totalArea / 100;

  // HARDWARE ESTIMATION
  const doors = Math.ceil(L / 2); // approx door count
  const hinges = doors * 2;
  const handles = doors;

  // COST (basic placeholder — you will connect with MaterialCost later)
  const totalCost =
    plywoodSheets * 2500 +
    sunmicaSheets * 1200 +
    fevicol * 200 +
    hinges * 80 +
    handles * 150;

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
          { label: "Dining", value: "dining" }
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

      {/* INPUTS */}
      <Input label="Length" unit="ft" value={l} onChange={setL} />
      <Input label="Width" unit="ft" value={w} onChange={setW} />
      <Input label="Height" unit="ft" value={h} onChange={setH} />
      <Input label="Depth" unit="ft" value={d} onChange={setD} />

      {/* RESULTS */}
      <div className="result">
        <p>Plywood: {plywoodSheets.toFixed(2)} sheets</p>
        <p>Sunmica: {sunmicaSheets.toFixed(2)} sheets</p>
        <p>Fevicol: {fevicol.toFixed(2)} kg</p>
        <p>Hinges: {hinges} nos</p>
        <p>Handles: {handles} nos</p>
      </div>

      <div className="result">
        <h3>Total Cost: ₹ {totalCost.toFixed(0)}</h3>
      </div>
    </Card>
  );
}
