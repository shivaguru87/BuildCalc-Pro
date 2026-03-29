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
    const lf = toFeet(l, unit);
    const hf = toFeet(h, unit);
    const tf = toFeet(t, unit);
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

      <Input placeholder="Length" value={l} onChange={(e) => setL(e.target.value)} />
      <Input placeholder="Height" value={h} onChange={(e) => setH(e.target.value)} />
      <Input placeholder="Thickness" value={t} onChange={(e) => setT(e.target.value)} />

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