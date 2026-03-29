import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";

export default function Staircase() {
  const [type, setType] = useState("straight");

  const [floor, setFloor] = useState(10);
  const [rise, setRise] = useState(7);
  const [tread, setTread] = useState(10);
  const [width, setWidth] = useState(3);

  const totalInches = floor * 12;
  const steps = Math.round(totalInches / rise || 0);
  const actualRise = steps ? totalInches / steps : 0;
  const run = (steps * tread) / 12;
  const angle = Math.atan(actualRise / tread) * (180 / Math.PI) || 0;

  return (
    <Card title="Staircase Calculator">

      {/* TABS */}
      <div className="tabs">
  {["straight", "dog", "open", "spiral"].map((t) => (
    <button
      key={t}
      className={type === t ? "tab active" : "tab"}
      onClick={() => setType(t)}
    >
      {t.toUpperCase()}
    </button>
  ))}
</div>
      {type === "straight" && <p>Straight Stair Selected</p>}
      {type === "dog" && <p>Dog Leg Stair Selected</p>}
     {type === "open" && <p>Open Stair Selected</p>}
     {type === "spiral" && <p>Spiral Stair Selected</p>}

      {/* INPUTS */}
      <Input label="Floor Height (ft)" onChange={setFloor} />
      <Input label="Rise (inch)" onChange={setRise} />
      <Input label="Tread (inch)" onChange={setTread} />
      <Input label="Width (ft)" onChange={setWidth} />

      {/* RESULT */}
      <div className="result-box">
        <p>Total Steps: {steps}</p>
        <p>Actual Rise: {actualRise.toFixed(2)}</p>
        <p>Total Run: {run.toFixed(2)} ft</p>
        <p>Angle: {angle.toFixed(1)}°</p>
      </div>

    </Card>
  );
}
