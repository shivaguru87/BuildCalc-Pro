import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

export default function Steel() {
  const [mode, setMode] = useState("bar"); 
  const [unit, setUnit] = useState("ft");

  const [dia, setDia] = useState("12");
  const [len, setLen] = useState("");
  const [qty, setQty] = useState("");

  const [l, setL] = useState("");
  const [w, setW] = useState("");
  const [h, setH] = useState("");

  const [rate, setRate] = useState("4"); // kg/sqft slab

  // ===== UNIT CONVERSION =====
  const toMeter = (val) => {
    const v = Number(val);
    if (unit === "ft") return v * 0.3048;
    return v;
  };

  // ===== BASIC BAR =====
  const d = Number(dia);
  const lengthM = toMeter(len);
  const q = Number(qty);

  const weightPerMeter = d ? (d * d) / 162 : 0;
  const totalBar = weightPerMeter * lengthM * (q || 1);

  // ===== STRUCTURAL =====
  const lm = toMeter(l);
  const wm = toMeter(w);
  const hm = toMeter(h);

  const volume = lm * wm * hm;

  // thumb rule kg/m³ (approx RCC steel)
  const steelDensity = 80; 

  const structuralSteel = volume * steelDensity;

  // ===== SLAB =====
  const slabArea = lm * wm; // m²
  const slabSteel = slabArea * Number(rate) * 10.764; // convert to sqft base

  return (
    <Card>
      <h3>Steel Calculator Pro</h3>

      {/* MODE */}
      <Tabs
        value={mode}
        onChange={setMode}
        options={[
          { label: "Bar", value: "bar" },
          { label: "Structure", value: "struct" },
          { label: "Slab", value: "slab" }
        ]}
      />

      {/* UNIT */}
      <Tabs
        value={unit}
        onChange={setUnit}
        options={[
          { label: "ft", value: "ft" },
          { label: "m", value: "m" }
        ]}
      />

      {/* ================= BAR ================= */}
      {mode === "bar" && (
        <>
          <Input label="Diameter" unit="mm" value={dia} onChange={setDia} hint="8,10,12,16..." />
          <Input label="Length" unit={unit} value={len} onChange={setLen} hint="Bar length" />
          <Input label="Quantity" value={qty} onChange={setQty} hint="No of bars" />

          <div className="result">
            <p>Weight / meter: {weightPerMeter.toFixed(3)} kg</p>
            <p>Total Steel: {totalBar.toFixed(2)} kg</p>
          </div>
        </>
      )}

      {/* ================= STRUCTURE ================= */}
      {mode === "struct" && (
        <>
          <Tabs
            value={mode}
            onChange={() => {}}
            options={[
              { label: "Column", value: "c" },
              { label: "Beam", value: "b" },
              { label: "Footing", value: "f" },
              { label: "Plinth", value: "p" }
            ]}
          />

          <Input label="Length" unit={unit} value={l} onChange={setL} hint="Length" />
          <Input label="Width" unit={unit} value={w} onChange={setW} hint="Width" />
          <Input label="Height" unit={unit} value={h} onChange={setH} hint="Height" />

          <div className="result">
            <p>Volume: {volume.toFixed(2)} m³</p>
            <p>Steel (approx): {structuralSteel.toFixed(2)} kg</p>
          </div>
        </>
      )}

      {/* ================= SLAB ================= */}
      {mode === "slab" && (
        <>
          <Input label="Length" unit={unit} value={l} onChange={setL} hint="Slab length" />
          <Input label="Width" unit={unit} value={w} onChange={setW} hint="Slab width" />
          <Input label="Steel Rate" unit="kg/sqft" value={rate} onChange={setRate} hint="3–5 kg/sqft" />

          <div className="result">
            <p>Area: {(slabArea * 10.764).toFixed(2)} sqft</p>
            <p>Total Steel: {slabSteel.toFixed(2)} kg</p>
          </div>
        </>
      )}
    </Card>
  );
}
