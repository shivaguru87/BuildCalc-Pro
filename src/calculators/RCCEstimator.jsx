import { useState } from "react";
import Card from "../components/Card";
import Tabs from "../components/Tabs";
import Input from "../components/Input";

export default function RCCEstimator() {
  const [mode, setMode] = useState("sqft");
  const [unit, setUnit] = useState("ft");

  const [area, setArea] = useState("");

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");

  const [floors, setFloors] = useState("1");
  const [basement, setBasement] = useState("0");

  const [grade, setGrade] = useState("M20");
  const [thickness, setThickness] = useState("5");
  const [spacing, setSpacing] = useState("10");

  // ===== UNIT CONVERSION =====
  const toFeet = (val) => {
    const v = Number(val || 0);

    if (unit === "m") return v * 3.281;
    if (unit === "inch") return v / 12;
    return v;
  };

  const L = toFeet(length);
  const W = toFeet(width);

  const baseArea = mode === "sqft" ? Number(area) : L * W;

  const totalFloors = Number(floors) + Number(basement);
  const totalArea = baseArea * totalFloors;

  // ===== COLUMN COUNT =====
  const cols = Math.ceil(Math.sqrt(baseArea) / Number(spacing));
  const totalColumns = cols * cols;

  // ===== STEEL FACTOR =====
  let steelFactor = 4;
  if (thickness >= 6) steelFactor = 4.5;
  if (thickness >= 8) steelFactor = 5;

  const steel = totalArea * steelFactor;

  // ===== MATERIALS =====
  const cementFactor = grade === "M25" ? 0.45 : 0.4;

  const cement = totalArea * cementFactor;
  const sand = totalArea * 1.2;
  const aggregate = totalArea * 2.4;

  // ===== BAR LOGIC =====
  let bar = "10mm";
  if (totalFloors >= 3) bar = "12mm";
  if (totalFloors >= 5) bar = "16mm";

  const totalCost =
    steel * 75 +
    cement * 420 +
    sand * 50 +
    aggregate * 45;

  return (
    <Card>
      <h3>RCC ULTRA PRO</h3>

      {/* MODE */}
      <Tabs
        value={mode}
        onChange={setMode}
        options={[
          { label: "Sqft", value: "sqft" },
          { label: "Dimension", value: "dimension" }
        ]}
      />

      {/* UNIT */}
      <Tabs
        value={unit}
        onChange={setUnit}
        options={[
          { label: "ft", value: "ft" },
          { label: "m", value: "m" },
          { label: "inch", value: "inch" }
        ]}
      />

      {/* INPUT */}
      {mode === "sqft" ? (
        <Input label="Area" unit="sqft" value={area} onChange={setArea} />
      ) : (
        <>
          <Input label="Length" unit={unit} value={length} onChange={setLength} />
          <Input label="Width" unit={unit} value={width} onChange={setWidth} />
        </>
      )}

      {/* BUILDING */}
      <Input label="Floors" value={floors} onChange={setFloors} />
      <Input label="Basement" value={basement} onChange={setBasement} />

      {/* SETTINGS */}
      <Tabs
        value={grade}
        onChange={setGrade}
        options={[
          { label: "M20", value: "M20" },
          { label: "M25", value: "M25" }
        ]}
      />

      <Input
        label="Slab Thickness"
        unit="inch"
        value={thickness}
        onChange={setThickness}
      />

      <Input
        label="Column Spacing"
        unit="ft"
        value={spacing}
        onChange={setSpacing}
      />

      {/* RESULT */}
      <div className="result">
        <p>Base Area: {baseArea.toFixed(2)} sqft</p>
        <p>Total Area: {totalArea.toFixed(2)} sqft</p>
        <p>Columns: {totalColumns}</p>
      </div>

      <div className="result">
        <p>Steel: {steel.toFixed(0)} kg</p>
        <p>Cement: {cement.toFixed(1)} bags</p>
        <p>Sand: {sand.toFixed(1)} cft</p>
        <p>Aggregate: {aggregate.toFixed(1)} cft</p>
      </div>

      <div className="result">
        <p>Suggested Bar: {bar}</p>
        <p>Total Cost: ₹ {totalCost.toLocaleString()}</p>
      </div>
    </Card>
  );
}
