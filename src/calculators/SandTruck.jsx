import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";
import { toFeet } from "../utils/converters";
import { sandTruck } from "../utils/formulas";

export default function SandTruck() {
  const [unit, setUnit] = useState("ft");
  const [l, setL] = useState("");
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const [heap, setHeap] = useState("10");
  const [res, setRes] = useState(null);

  const calc = () => {
    const lf = toFeet(l, unit);
    const wf = toFeet(w, unit);
    const hf = toFeet(h, unit);
    const r = sandTruck(lf, wf, hf, heap);
    setRes({
      cft: r.cft.toFixed(2),
      units: r.units.toFixed(2)
    });
  };

  return (
    <Card>
      <div className="row">
        <h3>Sand Truck</h3>
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
      <Input placeholder="Heap % (10-20)" value={heap} onChange={(e) => setHeap(e.target.value)} />

      <button className="primary" onClick={calc}>Calculate</button>

      {res && (
        <div className="result">
          <p>Total: {res.cft} cft</p>
          <p>Units: {res.units}</p>
        </div>
      )}
    </Card>
  );
}