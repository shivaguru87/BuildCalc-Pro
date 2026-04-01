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
    ha: 10000
  };

  const units = type === "length" ? lengthUnits : areaUnits;

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
        }}
        options={[
          { label: "Length", value: "length" },
          { label: "Area", value: "area" }
        ]}
      />

      {/* FROM */}
      <Input
        label="From"
        value={input}
        onChange={setInput}
        hint="Enter value"
      />

      <Tabs
        value={fromUnit}
        onChange={setFromUnit}
        options={Object.keys(units).map(u => ({ label: u, value: u }))}
      />

      {/* SWAP */}
      <button className="ghost" onClick={swap}>
        ⇅ Swap
      </button>

      {/* TO */}
      <Input
        label="To"
        value={output}
        onChange={() => {}}
        hint="Converted value"
      />

      <Tabs
        value={toUnit}
        onChange={setToUnit}
        options={Object.keys(units).map(u => ({ label: u, value: u }))}
      />

      {/* RESULT */}
      <div className="result">
        <p>
          {input || 0} {fromUnit} = {output || 0} {toUnit}
        </p>
      </div>

    </Card>
  );
}
