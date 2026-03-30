import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";
import { toFeet } from "../utils/converters";

export default function AreaPro() {
  const [type, setType] = useState("rectangle");
  const [unit, setUnit] = useState("ft");

  const [l, setL] = useState(0);
  const [w, setW] = useState(0);
  const [r, setR] = useState(0);
  const [h, setH] = useState(0);
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  // ✅ Convert all inputs to feet FIRST (no logic change)
  const lf = toFeet(Number(l), unit);
  const wf = toFeet(Number(w), unit);
  const rf = toFeet(Number(r), unit);
  const hf = toFeet(Number(h), unit);
  const af = toFeet(Number(a), unit);
  const bf = toFeet(Number(b), unit);

  // FORMULAS (same logic, just using converted values)
  const rect = lf * wf;
  const square = lf * lf;
  const circle = 3.1416 * rf * rf;
  const triangle = 0.5 * bf * hf;
  const trapezium = 0.5 * (af + bf) * hf;
  const cone = 3.1416 * rf * (rf + Math.sqrt(hf * hf + rf * rf));
  const cylinder = 2 * 3.1416 * rf * (rf + hf);

  // ✅ Convert output
  const toSqM = (ft) => ft * 0.092903;
  const toSqMM = (ft) => ft * 92903;

  const show = (val) => (
    <>
      <p>Area: {val.toFixed(2)} sq.ft</p>
      <p>{toSqM(val).toFixed(2)} sq.m</p>
      <p>{toSqMM(val).toFixed(0)} sq.mm</p>
    </>
  );

  return (
    <Card title="Area Calculator Pro">

      {/* TYPE SELECT */}
      <div className="tabs-container">
        <div className="tabs">
          {["rectangle","square","circle","triangle","trapezium","cone","cylinder"].map(t => (
            <button key={t} onClick={() => setType(t)}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* UNIT SELECT */}
      <Tabs
        value={unit}
        onChange={setUnit}
        options={[
          { label: "ft", value: "ft" },
          { label: "m", value: "m" },
          { label: "mm", value: "mm" }
        ]}
      />

      {/* RECTANGLE */}
      {type === "rectangle" && (
        <>
          <Input label="Length" unit={unit} onChange={setL} />
          <Input label="Width" unit={unit} onChange={setW} />
          {show(rect)}
        </>
      )}

      {/* SQUARE */}
      {type === "square" && (
        <>
          <Input label="Side" unit={unit} onChange={setL} />
          {show(square)}
        </>
      )}

      {/* CIRCLE */}
      {type === "circle" && (
        <>
          <Input label="Radius" unit={unit} onChange={setR} />
          {show(circle)}
        </>
      )}

      {/* TRIANGLE */}
      {type === "triangle" && (
        <>
          <Input label="Base" unit={unit} onChange={setB} />
          <Input label="Height" unit={unit} onChange={setH} />
          {show(triangle)}
        </>
      )}

      {/* TRAPEZIUM */}
      {type === "trapezium" && (
        <>
          <Input label="Side A" unit={unit} onChange={setA} />
          <Input label="Side B" unit={unit} onChange={setB} />
          <Input label="Height" unit={unit} onChange={setH} />
          {show(trapezium)}
        </>
      )}

      {/* CONE */}
      {type === "cone" && (
        <>
          <Input label="Radius" unit={unit} onChange={setR} />
          <Input label="Height" unit={unit} onChange={setH} />
          {show(cone)}
        </>
      )}

      {/* CYLINDER */}
      {type === "cylinder" && (
        <>
          <Input label="Radius" unit={unit} onChange={setR} />
          <Input label="Height" unit={unit} onChange={setH} />
          {show(cylinder)}
        </>
      )}

    </Card>
  );
}
