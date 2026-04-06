import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";
import { toFeet, cftToLiters } from "../utils/converters";
import { volumeCalc } from "../utils/formulas";

export default function Volume() {
  const [mode, setMode] = useState("rect");
  const [unit, setUnit] = useState("ft");

  const [l, setL] = useState("");
  const [w, setW] = useState("");
  const [h, setH] = useState("");

  // CYLINDER INPUTS
  const [radius, setRadius] = useState("");
  const [diameter, setDiameter] = useState("");

  const [res, setRes] = useState(null);

  const calc = () => {
    // ===== RECTANGULAR =====
    if (mode === "rect") {
      const lf = toFeet(Number(l), unit);
      const wf = toFeet(Number(w), unit);
      const hf = toFeet(Number(h), unit);

      const r = volumeCalc(lf, wf, hf);

      setRes({
        cft: r.cft.toFixed(2),
        liters: cftToLiters(r.cft).toFixed(0),
        brass: r.brass.toFixed(2),
      });
    }

    // ===== CYLINDRICAL =====
    if (mode === "cyl") {
      let rFt = 0;

      // Priority: Diameter > Radius
      if (Number(diameter) > 0) {
        rFt = toFeet(Number(diameter), unit) / 2;
      } else if (Number(radius) > 0) {
        rFt = toFeet(Number(radius), unit);
      } else {
        setRes(null);
        return;
      }

      const hFt = toFeet(Number(h), unit);

      const volume = Math.PI * rFt * rFt * hFt;

      setRes({
        cft: volume.toFixed(2),
        liters: cftToLiters(volume).toFixed(0),
        brass: (volume / 100).toFixed(2),
      });
    }
  };

  return (
    <Card>
      <div className="row">
        <h3>Tank Volume</h3>
        <span className="badge">{unit}</span>
      </div>

      {/* MODE */}
      <Tabs
        value={mode}
        onChange={setMode}
        options={[
          { label: "Rectangular", value: "rect" },
          { label: "Cylindrical", value: "cyl" },
        ]}
      />

      {/* UNIT */}
      <Tabs
        value={unit}
        onChange={setUnit}
        options={[
          { label: "ft", value: "ft" },
          { label: "m", value: "m" },
          { label: "mm", value: "mm" },
        ]}
      />

      {/* RECTANGULAR */}
      {mode === "rect" && (
        <>
          <Input label="Length" unit={unit} value={l} onChange={setL} />
          <Input label="Width" unit={unit} value={w} onChange={setW} />
          <Input label="Height" unit={unit} value={h} onChange={setH} />
        </>
      )}

      {/* CYLINDRICAL */}
      {mode === "cyl" && (
        <>
          <Input label="Height / Length" unit={unit} value={h} onChange={setH} />

          <Input
            label="Diameter"
            unit={unit}
            value={diameter}
            onChange={setDiameter}
            hint="Preferred input"
          />

          <Input
            label="Radius"
            unit={unit}
            value={radius}
            onChange={setRadius}
            hint="Use if diameter not known"
          />
        </>
      )}

      <button className="primary" onClick={calc}>
        Calculate
      </button>

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
