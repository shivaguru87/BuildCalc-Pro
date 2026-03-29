import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";

export default function Staircase() {
  const [type, setType] = useState("straight");

  const [floor, setFloor] = useState(10); // total height ft
  const [rise, setRise] = useState(7); // inches
  const [tread, setTread] = useState(10); // inches
  const [width, setWidth] = useState(3); // ft

  // CONVERSIONS
  const totalInches = floor * 12;

  // CALCULATIONS
  const steps = Math.round(totalInches / rise);
  const actualRise = totalInches / steps;
  const run = steps * tread / 12; // ft
  const angle = Math.atan(actualRise / tread) * (180 / Math.PI);

  return (
    <Card title="Staircase Calculator">

      {/* TYPE SELECT */}
      <div className="tabs">
        {["straight","dog","open","spiral"].map(t => (
          <button key={t} onClick={() => setType(t)}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* COMMON INPUTS */}
      <Input label="Floor Height (ft)" onChange={setFloor} />
      <Input label="Rise (inch)" onChange={setRise} />
      <Input label="Tread (inch)" onChange={setTread} />
      <Input label="Width (ft)" onChange={setWidth} />

      {/* RESULTS */}
      <div className="result-box">
        <p>Total Steps: {steps}</p>
        <p>Actual Rise: {actualRise.toFixed(2)} inch</p>
        <p>Total Run: {run.toFixed(2)} ft</p>
        <p>Angle: {angle.toFixed(1)}°</p>
      </div>

      {/* TYPE BASED INFO */}
      {type === "dog" && (
        <p>Dog-legged: Split into 2 flights with landing</p>
      )}

      {type === "open" && (
        <p>Open well: Space between flights (for ventilation/light)</p>
      )}

      {type === "spiral" && (
        <p>Spiral: Circular design, radius required (advanced coming)</p>
      )}

    </Card>
  );
}
