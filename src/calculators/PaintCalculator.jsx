import { useState } from "react";
import Card from "../components/Card";
import Tabs from "../components/Tabs";
import Input from "../components/Input";

export default function PaintCalculator() {
  const [mode, setMode] = useState("wall"); // wall / ceiling
  const [unit, setUnit] = useState("ft");

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const [coats, setCoats] = useState("2");
  const [coverage, setCoverage] = useState("120"); // sqft/litre

  // ===== UNIT CONVERSION =====
  const toFeet = (val) => {
    const v = Number(val || 0);

    if (unit === "m") return v * 3.281;
    if (unit === "inch") return v / 12;
    return v;
  };

  const L = toFeet(length);
  const W = toFeet(width);
  const H = toFeet(height);

  // ===== AREA =====
  let area = 0;

  if (mode === "wall") {
    area = 2 * (L + W) * H; // 4 walls
  } else {
    area = L * W; // ceiling
  }

  const totalPaint = (area * Number(coats)) / Number(coverage);

  return (
    <Card>
      <h3>Paint Calculator</h3>

      {/* MODE */}
      <Tabs
        value={mode}
        onChange={setMode}
        options={[
          { label: "Wall", value: "wall" },
          { label: "Ceiling", value: "ceiling" }
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

      {/* INPUTS */}
      <Input label="Length" unit={unit} value={length} onChange={setLength} />
      <Input label="Width" unit={unit} value={width} onChange={setWidth} />

      {mode === "wall" && (
        <Input label="Height" unit={unit} value={height} onChange={setHeight} />
      )}

      <Input label="No of Coats" value={coats} onChange={setCoats} />
      <Input
        label="Coverage"
        value={coverage}
        onChange={setCoverage}
        hint="sqft per litre"
      />

      {/* RESULT */}
      <div className="result">
        <p>Area: {area.toFixed(2)} sqft</p>
        <p>Paint Required: {totalPaint.toFixed(2)} Litres</p>
      </div>
    </Card>
  );
}
