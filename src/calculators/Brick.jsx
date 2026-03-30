import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";
import { toFeet } from "../utils/converters";
import { brickCalc } from "../utils/formulas";

export default function Brick() {
  const [unit, setUnit] = useState("ft");
  const [l, setL] = useState("");
  const [h, setH] = useState("");
  const [t, setT] = useState("");
  const [res, setRes] = useState(null);

  const calc = () => {
    const lf = toFeet(Number(l), unit);
    const hf = toFeet(h, unit);
    const tf = Number(t) / 12;
    const r = brickCalc(lf, hf, tf);
    setRes({
      volume: r.volume.toFixed(2),
      bricks: Math.round(r.bricks)
    });
  };

  return (
    <Card>
      <div className="row">
        <h3>Brick</h3>
        <span className="badge">{unit}</span>
      </div>

      <Tabs
        value={unit}
        onChange={setUnit}
        options={[
          { label: "ft", value: "ft" },
          { label: "m", value: "m" },
          { label: "mm", value: "mm" }
        ]}
      />

      <Input label="Length" unit={unit} value={l} onChange={setL} hint="Wall length" />
      <Input label="Height" unit={unit} value={h} onChange={setH} hint="Wall height" />
      <Input label="Thickness" unit="in" value={t} onChange={setT} hint="Wall thickness (inches)" />

      <button className="primary" onClick={calc}>Calculate</button>

      {res && (
        <div className="result">
          <p>Volume: {res.volume} cft</p>
          <p>Bricks: {res.bricks}</p>
        </div>
      )}
    </Card>
  );
}
