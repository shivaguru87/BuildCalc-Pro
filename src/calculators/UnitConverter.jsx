import { useState, useEffect } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

export default function UnitConverter() {
  const [type, setType] = useState("length");

  const [fromUnit, setFromUnit] = useState("mm");
  const [toUnit, setToUnit] = useState("m");

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  // ================= UNITS =================

  const lengthUnits = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    ft: 0.3048,
    in: 0.0254
  };

  const areaUnits = {
    mm2: 0.000001,
    cm2: 0.0001,
    m2: 1,
    ft2: 0.092903,
    acre: 4046.86,
    ha: 10000,
    cent: 40.4686
  };

  // 🔥 UPDATED VOLUME (WITH BAG)
  const volumeUnits = {
    cft: 0.0283168,
    m3: 1,
    liters: 0.001,
    brass: 2.83168,
    bag: 0.035396 // ✅ NEW (1 bag = 1.25 cft)
  };

  const units =
    type === "length"
      ? lengthUnits
      : type === "area"
      ? areaUnits
      : volumeUnits;

  // ================= CONVERT =================
  const convert = (val, from, to) => {
    if (!val) return "";
    const base = Number(val) * units[from];
    return (base / units[to]).toFixed(4);
  };

  // ================= LIVE UPDATE =================
  useEffect(() => {
    setOutput(convert(input, fromUnit, toUnit));
  }, [input, fromUnit, toUnit, type]);

  // ================= SWAP =================
  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setInput(output);
    setOutput(input);
  };

  return (
    <Card>
      <h3>Unit Converter</h3>

      {/* TYPE */}
      <Tabs
        value={type}
        onChange={(val) => {
          setType(val);
          setInput("");
          setOutput("");

          if (val === "length") {
            setFromUnit("mm");
            setToUnit("m");
          }
          if (val === "area") {
            setFromUnit("cent");
            setToUnit("ft2");
          }
          if (val === "volume") {
            setFromUnit("cft");
            setToUnit("bag"); // ✅ default now bag
          }
        }}
        options={[
          { label: "Length", value: "length" },
          { label: "Area", value: "area" },
          { label: "Volume", value: "volume" }
        ]}
      />

      {/* INPUT */}
      <Input
        label="From"
        value={input}
        onChange={setInput}
        hint="Enter value"
      />

      <Tabs
        value={fromUnit}
        onChange={setFromUnit}
        options={Object.keys(units).map(u => ({
          label: u,
          value: u
        }))}
      />

      {/* SWAP */}
      <button className="ghost" onClick={swap}>
        ⇅ Swap
      </button>

      {/* OUTPUT */}
      <Input
        label="To"
        value={output}
        onChange={() => {}}
        hint="Converted value"
      />

      <Tabs
        value={toUnit}
        onChange={setToUnit}
        options={Object.keys(units).map(u => ({
          label: u,
          value: u
        }))}
      />

      {/* RESULT */}
      <div className="result">
        <p>
          {input || 0} {fromUnit} = {output || 0} {toUnit}
        </p>
      </div>

      {/* AREA HINT */}
      {type === "area" && (
        <div className="result">
          <p>📐 1 cent = 435.6 sqft</p>
          <p>📐 100 cents = 1 acre</p>
        </div>
      )}

      {/* VOLUME HINT */}
      {type === "volume" && (
        <div className="result">
          <p>📦 1 brass = 100 cft</p>
          <p>📦 1 cft = 28.3168 liters</p>
          <p>🧱 1 bag ≈ 1.25 cft</p>
          <p>⚖️ Standard bag weight = 50 kg</p>
        </div>
      )}
    </Card>
  );
}
