import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";
import { toFeet } from "../utils/converters";
import { pccExact, pccThumb } from "../utils/formulas";

export default function PCC() {
  const [tab, setTab] = useState("pcc"); // NEW: pcc | plaster

  const [mode, setMode] = useState("exact");
  const [unit, setUnit] = useState("ft");

  const [l, setL] = useState("");
  const [w, setW] = useState("");
  const [t, setT] = useState("");

  const [area, setArea] = useState("");

  const [res, setRes] = useState(null);

  // ===== CALCULATE =====
  const calc = () => {
    // ================= PCC =================
    if (tab === "pcc") {
      if (mode === "exact") {
        const lf = toFeet(Number(l), unit);
        const wf = toFeet(Number(w), unit);
        const tf = Number(t) / 12; // inch → ft

        const r = pccExact(lf, wf, tf);

        setRes({
          type: "pcc",
          volume: r.volume.toFixed(2),
          cement: r.cement.toFixed(2),
          sand: r.sand.toFixed(2),
          jelly: r.jelly.toFixed(2),
        });
      } else {
        const a = Number(area) || 0;

        const r = pccThumb(a);

        setRes({
          type: "pcc-thumb",
          cementBags: r.cementBags.toFixed(2),
          sandCft: r.sandCft.toFixed(2),
          jellyCft: r.jellyCft.toFixed(2),
        });
      }
    }

    // ================= PLASTER =================
    if (tab === "plaster") {
      const lf = toFeet(Number(l), unit);
      const wf = toFeet(Number(w), unit);

      const areaSqft = lf * wf;

      // thickness in mm → feet
      const thicknessFt = Number(t) / 304.8;

      const volume = areaSqft * thicknessFt;

      // thumb rule mix 1:4
      const cement = volume * 0.25;
      const sand = volume * 1;

      const cementBags = cement / 1.25;

      setRes({
        type: "plaster",
        area: areaSqft.toFixed(2),
        volume: volume.toFixed(2),
        cementBags: cementBags.toFixed(2),
        sand: sand.toFixed(2),
      });
    }
  };

  return (
    <Card>
      <div className="row">
        <h3>PCC / Plaster</h3>
        <span className="badge">{unit}</span>
      </div>

      {/* MAIN TAB */}
      <Tabs
        value={tab}
        onChange={setTab}
        options={[
          { label: "PCC", value: "pcc" },
          { label: "Plaster", value: "plaster" },
        ]}
      />

      {/* PCC MODE */}
      {tab === "pcc" && (
        <Tabs
          value={mode}
          onChange={setMode}
          options={[
            { label: "Exact", value: "exact" },
            { label: "Thumb", value: "thumb" },
          ]}
        />
      )}

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

      {/* PCC INPUT */}
      {tab === "pcc" && mode === "exact" && (
        <>
          <Input label="Length" unit={unit} value={l} onChange={setL} />
          <Input label="Width" unit={unit} value={w} onChange={setW} />
          <Input label="Thickness" unit="in" value={t} onChange={setT} hint="Slab thickness (inches)" />
        </>
      )}

      {tab === "pcc" && mode === "thumb" && (
        <Input label="Area" unit="sq.ft" value={area} onChange={setArea} />
      )}

      {/* PLASTER INPUT */}
      {tab === "plaster" && (
        <>
          <Input label="Length" unit={unit} value={l} onChange={setL} />
          <Input label="Width" unit={unit} value={w} onChange={setW} />
          <Input
            label="Thickness"
            unit="mm"
            value={t}
            onChange={setT}
            hint="Plaster thickness in mm (12mm, 15mm, 20mm)"
          />
        </>
      )}

      <button className="primary" onClick={calc}>
        Calculate
      </button>

      {/* RESULT */}
      {res && (
        <div className="result">
          {res.type === "pcc" && (
            <>
              <p>Volume: {res.volume} cft</p>
              <p>Cement: {res.cement} cft</p>
              <p>Sand: {res.sand} cft</p>
              <p>Jelly: {res.jelly} cft</p>
            </>
          )}

          {res.type === "pcc-thumb" && (
            <>
              <p>Cement: {res.cementBags} bags</p>
              <p>Sand: {res.sandCft} cft</p>
              <p>Jelly: {res.jellyCft} cft</p>
            </>
          )}

          {res.type === "plaster" && (
            <>
              <p>Area: {res.area} sqft</p>
              <p>Volume: {res.volume} cft</p>
              <p>Cement: {res.cementBags} bags</p>
              <p>Sand: {res.sand} cft</p>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
