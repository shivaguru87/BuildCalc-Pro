import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";
import { toFeet } from "../utils/converters";

export default function AreaPro() {
  const [type, setType] = useState("rectangle");
  const [unit, setUnit] = useState("ft");

  const [l, setL] = useState("");
  const [w, setW] = useState("");
  const [r, setR] = useState("");
  const [h, setH] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  // ✅ Convert to feet
  const lf = toFeet(Number(l), unit);
  const wf = toFeet(Number(w), unit);
  const rf = toFeet(Number(r), unit);
  const hf = toFeet(Number(h), unit);
  const af = toFeet(Number(a), unit);
  const bf = toFeet(Number(b), unit);

  // ✅ FORMULAS
  const rect = lf * wf;
  const square = lf * lf;
  const circle = 3.1416 * rf * rf;
  const triangle = 0.5 * bf * hf;
  const trapezium = 0.5 * (af + bf) * hf;
  const cone = 3.1416 * rf * (rf + Math.sqrt(hf * hf + rf * rf));
  const cylinder = 2 * 3.1416 * rf * (rf + hf);

  const getResult = () => {
    switch (type) {
      case "rectangle": return rect;
      case "square": return square;
      case "circle": return circle;
      case "triangle": return triangle;
      case "trapezium": return trapezium;
      case "cone": return cone;
      case "cylinder": return cylinder;
      default: return 0;
    }
  };

  const result = getResult();

  // ✅ CONVERSIONS
  const toSqM = (ft) => ft * 0.092903;
  const toSqMM = (ft) => ft * 92903;

  return (
    <Card title="Area Calculator Pro">

      {/* TYPE SELECT (FIXED) */}
      <Tabs
        value={type}
        onChange={setType}
        options={[
          { label: "Rectangle", value: "rectangle" },
          { label: "Square", value: "square" },
          { label: "Circle", value: "circle" },
          { label: "Triangle", value: "triangle" },
          { label: "Trapezium", value: "trapezium" },
          { label: "Cone", value: "cone" },
          { label: "Cylinder", value: "cylinder" }
        ]}
      />

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

      {/* INPUTS */}
      {type === "rectangle" && (
        <>
          <Input label="Length" unit={unit} onChange={setL} />
          <Input label="Width" unit={unit} onChange={setW} />
        </>
      )}

      {type === "square" && (
        <Input label="Side" unit={unit} onChange={setL} />
      )}

      {type === "circle" && (
        <Input label="Radius" unit={unit} onChange={setR} />
      )}

      {type === "triangle" && (
        <>
          <Input label="Base" unit={unit} onChange={setB} />
          <Input label="Height" unit={unit} onChange={setH} />
        </>
      )}

      {type === "trapezium" && (
        <>
          <Input label="Side A" unit={unit} onChange={setA} />
          <Input label="Side B" unit={unit} onChange={setB} />
          <Input label="Height" unit={unit} onChange={setH} />
        </>
      )}

      {type === "cone" && (
        <>
          <Input label="Radius" unit={unit} onChange={setR} />
          <Input label="Height" unit={unit} onChange={setH} />
        </>
      )}

      {type === "cylinder" && (
        <>
          <Input label="Radius" unit={unit} onChange={setR} />
          <Input label="Height" unit={unit} onChange={setH} />
        </>
      )}

      {/* RESULT */}
      <div className="result">
        <p>Area: {result.toFixed(2)} sq.ft</p>
        <p>{toSqM(result).toFixed(2)} sq.m</p>
        <p>{toSqMM(result).toFixed(0)} sq.mm</p>
      </div>

    </Card>
  );
}
