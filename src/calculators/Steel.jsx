import { useState } from "react";
import Card from "../components/Card";
import Tabs from "../components/Tabs";
import Input from "../components/Input";

export default function Steel() {
  const [mode, setMode] = useState("column");

  // ===== INPUT =====
  const [lf, setLf] = useState("");
  const [li, setLi] = useState("");

  const [wf, setWf] = useState("");
  const [wi, setWi] = useState("");

  const [hf, setHf] = useState("");
  const [hi, setHi] = useState("");

  const [dia, setDia] = useState("12");
  const [stirDia, setStirDia] = useState("8");

  const [spacing, setSpacing] = useState("6"); // inches
  const [bars, setBars] = useState("4");

  const [rate, setRate] = useState("4"); // slab fallback

  // ===== CONVERSION =====
  const toFeet = (f, i) => Number(f || 0) + Number(i || 0) / 12;
  const toMeter = (ft) => ft * 0.3048;

  const L = toMeter(toFeet(lf, li));
  const W = toMeter(toFeet(wf, wi));
  const H = toMeter(toFeet(hf, hi));

  const d = Number(dia);
  const sd = Number(stirDia);

  const wt = (dia) => (dia * dia) / 162;

  const mainWt = wt(d);
  const stirWt = wt(sd);

  // ===== COMMON =====
  const cover = 0.04; // 40mm

  // ===== COLUMN =====
  const colBars = Number(bars);
  const colLength = H + 0.6; // lap

  const colMainSteel = colBars * colLength * mainWt;

  const stirSpacing = Number(spacing) / 12;
  const stirCount = H / (stirSpacing * 0.3048);

  const stirLen = 2 * ((W - 2 * cover) + (L - 2 * cover)) + 0.1; // hook
  const colStirSteel = stirCount * stirLen * stirWt;

  // ===== BEAM =====
  const beamLength = L;

  const beamTop = 2 * beamLength * mainWt;
  const beamBottom = 2 * beamLength * mainWt;

  const beamStirrups = beamLength / (stirSpacing * 0.3048);
  const beamStirLen = 2 * ((W - cover) + (H - cover)) + 0.1;

  const beamStirSteel = beamStirrups * beamStirLen * stirWt;

  // ===== SLAB =====
  const areaSqft = (L * W) * 10.764;

  const thickness = toFeet(hf, hi); // ft
  const slabSteel = areaSqft * Number(rate);

  // thickness based refinement
  const slabFactor = thickness > 0.5 ? 5 : 4;
  const slabSteelFinal = areaSqft * slabFactor;

  // ===== FOOTING =====
  const footingVol = L * W * H;
  const footingSteel = footingVol * 90;

  return (
    <Card>
      <h3>Steel Calculator Ultra Pro</h3>

      {/* MODE */}
      <Tabs
        value={mode}
        onChange={setMode}
        options={[
          { label: "Column", value: "column" },
          { label: "Beam", value: "beam" },
          { label: "Slab", value: "slab" },
          { label: "Footing", value: "footing" }
        ]}
      />

      {/* INPUT DIMENSIONS */}
      <Input label="Length (ft)" value={lf} onChange={setLf} />
      <Input label="Length (in)" value={li} onChange={setLi} />

      <Input label="Width (ft)" value={wf} onChange={setWf} />
      <Input label="Width (in)" value={wi} onChange={setWi} />

      <Input label="Height / Thickness (ft)" value={hf} onChange={setHf} />
      <Input label="Height / Thickness (in)" value={hi} onChange={setHi} />

      {/* BAR CONFIG */}
      <Input label="Main Bar Dia" unit="mm" value={dia} onChange={setDia} />
      <Input label="Stirrup Dia" unit="mm" value={stirDia} onChange={setStirDia} />
      <Input label="No of Bars" value={bars} onChange={setBars} />
      <Input label="Spacing" unit="inch" value={spacing} onChange={setSpacing} />

      {/* RESULT */}
      {mode === "column" && (
        <div className="result">
          <p>Main Steel: {colMainSteel.toFixed(2)} kg</p>
          <p>Stirrups: {colStirSteel.toFixed(2)} kg</p>
          <p>Total: {(colMainSteel + colStirSteel).toFixed(2)} kg</p>
        </div>
      )}

      {mode === "beam" && (
        <div className="result">
          <p>Top Steel: {beamTop.toFixed(2)} kg</p>
          <p>Bottom Steel: {beamBottom.toFixed(2)} kg</p>
          <p>Stirrups: {beamStirSteel.toFixed(2)} kg</p>
          <p>Total: {(beamTop + beamBottom + beamStirSteel).toFixed(2)} kg</p>
        </div>
      )}

      {mode === "slab" && (
        <div className="result">
          <p>Area: {areaSqft.toFixed(2)} sqft</p>
          <p>Steel (thumb): {slabSteel.toFixed(2)} kg</p>
          <p>Steel (IS refined): {slabSteelFinal.toFixed(2)} kg</p>
        </div>
      )}

      {mode === "footing" && (
        <div className="result">
          <p>Volume: {footingVol.toFixed(2)} m³</p>
          <p>Steel: {footingSteel.toFixed(2)} kg</p>
        </div>
      )}
    </Card>
  );
}
