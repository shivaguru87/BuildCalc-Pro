import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";

export default function AreaPro() {
  const [type, setType] = useState("rectangle");

  const [l, setL] = useState(0);
  const [w, setW] = useState(0);
  const [r, setR] = useState(0);
  const [h, setH] = useState(0);
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  // FORMULAS
  const rect = l * w;
  const square = l * l;
  const circle = 3.1416 * r * r;
  const triangle = 0.5 * b * h;
  const trapezium = 0.5 * (a + b) * h;
  const cone = 3.1416 * r * (r + Math.sqrt(h * h + r * r));
  const cylinder = 2 * 3.1416 * r * (r + h);

  return (
    <Card title="Area Calculator Pro">

      {/* SELECTOR */}
      <div className="tabs">
        {["rectangle","square","circle","triangle","trapezium","cone","cylinder"].map(t => (
          <button key={t} onClick={() => setType(t)}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* RECTANGLE */}
      {type === "rectangle" && (
        <>
          <Input label="Length" onChange={setL} />
          <Input label="Width" onChange={setW} />
          <p>Area: {rect.toFixed(2)} sq.ft</p>
        </>
      )}

      {/* SQUARE */}
      {type === "square" && (
        <>
          <Input label="Side" onChange={setL} />
          <p>Area: {square.toFixed(2)} sq.ft</p>
        </>
      )}

      {/* CIRCLE */}
      {type === "circle" && (
        <>
          <Input label="Radius" onChange={setR} />
          <p>Area: {circle.toFixed(2)} sq.ft</p>
        </>
      )}

      {/* TRIANGLE */}
      {type === "triangle" && (
        <>
          <Input label="Base" onChange={setB} />
          <Input label="Height" onChange={setH} />
          <p>Area: {triangle.toFixed(2)} sq.ft</p>
        </>
      )}

      {/* TRAPEZIUM */}
      {type === "trapezium" && (
        <>
          <Input label="Side A" onChange={setA} />
          <Input label="Side B" onChange={setB} />
          <Input label="Height" onChange={setH} />
          <p>Area: {trapezium.toFixed(2)} sq.ft</p>
        </>
      )}

      {/* CONE */}
      {type === "cone" && (
        <>
          <Input label="Radius" onChange={setR} />
          <Input label="Height" onChange={setH} />
          <p>Surface Area: {cone.toFixed(2)} sq.ft</p>
        </>
      )}

      {/* CYLINDER */}
      {type === "cylinder" && (
        <>
          <Input label="Radius" onChange={setR} />
          <Input label="Height" onChange={setH} />
          <p>Surface Area: {cylinder.toFixed(2)} sq.ft</p>
        </>
      )}

    </Card>
  );
}
