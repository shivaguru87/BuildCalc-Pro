import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";
import Toggle from "../components/Toggle";
import { toFeet } from "../utils/converters";
import { pccExact, pccThumb } from "../utils/formulas";

export default function PCC() {
  const [mode, setMode] = useState("exact"); // exact | thumb
  const [unit, setUnit] = useState("ft");    // ft | m | mm

  const [l, setL] = useState("");
  const [w, setW] = useState("");
  const [t, setT] = useState(""); // thickness

  const [area, setArea] = useState("");

  const [res, setRes] = useState(null);

  const calc = () => {
    if (mode === "exact") {
      const lf = toFeet(l, unit);
      const wf = toFeet(w, unit);
      const tf = Number(t) / 12;
      const r = pccExact(lf, wf, tf);
      setRes({
        volume: r.volume.toFixed(2),
        cement: r.cement.toFixed(2),
        sand: r.sand.toFixed(2),
        jelly: r.jelly.toFixed(2)
      });
    } else {
      const a = Number(area) || 0;
      const r = pccThumb(a);
      setRes({
        cementBags: r.cementBags.toFixed(2),
        sandCft: r.sandCft.toFixed(2),
        jellyCft: r.jellyCft.toFixed(2)
      });
    }
  };

  return (
    <Card>
      <div className="row">
        <h3>PCC</h3>
        <span className="badge">{unit}</span>
      </div>

      <Tabs
        value={mode}
        onChange={setMode}
        options={[
          { label: "Exact", value: "exact" },
          { label: "Thumb", value: "thumb" }
        ]}
      />

      <Tabs
        value={unit}
        onChange={setUnit}
        options={[
          { label: "ft", value: "ft" },
          { label: "m", value: "m" },
          { label: "mm", value: "mm" }
        ]}
      />

      {mode === "exact" ? (
        <>
          <Input label="Length" unit={unit} value={l} onChange={setL} hint="Enter length" />
          <Input label="Width" unit={unit} value={w} onChange={setW} hint="Enter width" />
          <Input label="Thickness" unit="in" value={t} onChange={setT} hint="Slab thickness (inches)" />
        </>
      ) : (
        <Input label="Area" unit="sq.ft" value={area} onChange={setArea} hint="Total area" />
      )}

      <button className="primary" onClick={calc}>Calculate</button>

      {res && (
        <div className="result">
          {mode === "exact" ? (
            <>
              <p>Volume: {res.volume} cft</p>
              <p>Cement: {res.cement} cft</p>
              <p>Sand: {res.sand} cft</p>
              <p>Jelly: {res.jelly} cft</p>
            </>
          ) : (
            <>
              <p>Cement: {res.cementBags} bags</p>
              <p>Sand: {res.sandCft} cft</p>
              <p>Jelly: {res.jellyCft} cft</p>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
