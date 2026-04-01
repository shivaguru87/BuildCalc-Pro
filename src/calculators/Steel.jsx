import { useState } from "react";
import Card from "../components/Card";
import Tabs from "../components/Tabs";
import Input from "../components/Input";

export default function Steel() {
  const [mode, setMode] = useState("column");

  // ===== BUILDING INPUT =====
  const [floors, setFloors] = useState("1");
  const [basement, setBasement] = useState("0");

  // ===== DIMENSIONS (single input) =====
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const [unit, setUnit] = useState("ft");

  const toMeter = (v) => {
    const val = Number(v);
    return unit === "ft" ? val * 0.3048 : val;
  };

  const L = toMeter(length);
  const W = toMeter(width);
  const H = toMeter(height);

  // ===== BUILDING LOGIC =====
  const totalFloors = Number(floors) + Number(basement);

  let barDia = 10;
  let bars = 4;

  if (totalFloors === 1) {
    barDia = 10; bars = 4;
  } else if (totalFloors === 2) {
    barDia = 12; bars = 6;
  } else if (totalFloors === 3) {
    barDia = 12; bars = 8;
  } else {
    barDia = 16; bars = 10;
  }

  const wt = (d) => (d * d) / 162;

  // ===== COLUMN =====
  const colLen = H + 0.6;
  const colSteel = bars * colLen * wt(barDia);

  // ===== BEAM =====
  const beamSteel = 4 * L * wt(barDia);

  // ===== SLAB =====
  const area = L * W * 10.764;
  const slabSteel = area * 4;

  // ===== FOOTING =====
  const footing = L * W * H * 85;

  return (
    <Card>
      <h3>Steel Smart Calculator</h3>

      {/* MODE */}
      <Tabs
        value={mode}
        onChange={setMode}
        options={[
          { label: "Column", value: "column" },
          { label: "Beam", value: "beam" },
          { label: "Slab", value: "slab" },
          { label: "Footing", value: "footing" }
        ]}
      />

      {/* UNIT SELECT */}
      <Tabs
        value={unit}
        onChange={setUnit}
        options={[
          { label: "ft", value: "ft" },
          { label: "m", value: "m" }
        ]}
      />

      {/* BUILDING INPUT */}
      <Input label="Floors" value={floors} onChange={setFloors} hint="No of floors" />
      <Input label="Basement" value={basement} onChange={setBasement} hint="Basement levels" />

      {/* DIMENSIONS */}
      <Input label="Length" unit={unit} value={length} onChange={setLength} />
      <Input label="Width" unit={unit} value={width} onChange={setWidth} />
      <Input label="Height / Thickness" unit={unit} value={height} onChange={setHeight} />

      {/* AUTO SUGGESTION */}
      <div className="result">
        <p>Suggested Bar: {barDia} mm</p>
        <p>No of Bars: {bars}</p>
      </div>

      {/* RESULT SWITCH */}
      {mode === "column" && (
        <div className="result">
          <p>Column Steel: {colSteel.toFixed(2)} kg</p>
        </div>
      )}

      {mode === "beam" && (
        <div className="result">
          <p>Beam Steel: {beamSteel.toFixed(2)} kg</p>
        </div>
      )}

      {mode === "slab" && (
        <div className="result">
          <p>Area: {area.toFixed(2)} sqft</p>
          <p>Steel: {slabSteel.toFixed(2)} kg</p>
        </div>
      )}

      {mode === "footing" && (
        <div className="result">
          <p>Steel: {footing.toFixed(2)} kg</p>
        </div>
      )}
    </Card>
  );
}
