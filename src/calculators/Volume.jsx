import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";
import { toFeet, cftToLiters } from "../utils/converters";
import { volumeCalc } from "../utils/formulas";

export default function Volume() {
  const [unit, setUnit] = useState("ft");
  const [l, setL] = useState("");
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const [res, setRes] = useState(null);

  const calc = () => {
    const lf = toFeet(l, unit);
    const wf = toFeet(w, unit);
    const hf = toFeet(h, unit);
    const r = volumeCalc(lf, wf, hf);
    setRes({
      cft: r.cft.toFixed(2),
      liters: cftToLiters(r.cft).toFixed(0),
      brass: r.brass.toFixed(2)
    });
  };

  return (
    <Card>
      <div className="row">
        <h3>Tank Volume</h3>
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
      <Input placeholder="Width" value={w} onChange={(e) => setW(e.target.value)} />
      <Input placeholder="Height" value={h} onChange={(e) => setH(e.target.value)} />

      <button className="primary" onClick={calc}>Calculate</button>

      {res && (
        <div className="result">
          <p>Volume: {res.cft} cft</p>
          <p>Liters: {res.liters}</p>
          <p>Brass: {res.brass}</p>
        </div>
      )}
    </Card>
  );
}