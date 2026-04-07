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

  // ================= PIPE PRO =================
  const [pipeMode, setPipeMode] = useState("manual"); // manual / standard
  const [schedule, setSchedule] = useState("40");
  const [nps, setNps] = useState("1");

  const [od, setOd] = useState("");
  const [id, setId] = useState("");

  // ================= PIPE DATA =================
  const pipeData = {
    "0.5": { od: 21.3, sch40: 2.77, sch80: 3.73 },
    "0.75": { od: 26.7, sch40: 2.87, sch80: 3.91 },
    "1": { od: 33.4, sch40: 3.38, sch80: 4.55 },
    "1.5": { od: 48.3, sch40: 3.68, sch80: 5.08 },
    "2": { od: 60.3, sch40: 3.91, sch80: 5.54 },
    "3": { od: 88.9, sch40: 5.49, sch80: 7.62 },
    "4": { od: 114.3, sch40: 6.02, sch80: 8.56 }
  };

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

  const volumeUnits = {
    cft: 0.0283168,
    m3: 1,
    liters: 0.001,
    brass: 2.83168,
    bag: 0.035396
  };

  const units =
    type === "length"
      ? lengthUnits
      : type === "area"
      ? areaUnits
      : volumeUnits;

  // ================= NORMAL CONVERT =================
  const convert = (val, from, to) => {
    if (!val) return "";
    const base = Number(val) * units[from];
    return (base / units[to]).toFixed(4);
  };

  // ================= PIPE CALC =================
  const mmToInch = (val) => (val ? (val / 25.4).toFixed(2) : 0);

  let pipeOD = Number(od);
  let pipeID = Number(id);
  let thickness = 0;

  if (pipeMode === "standard") {
    const data = pipeData[nps];
    if (data) {
      pipeOD = data.od;
      const t = schedule === "40" ? data.sch40 : data.sch80;
      thickness = t;
      pipeID = pipeOD - 2 * t;
    }
  } else {
    thickness =
      pipeOD && pipeID ? ((pipeOD - pipeID) / 2).toFixed(2) : 0;
  }

  // ================= LIVE UPDATE =================
  useEffect(() => {
    if (type !== "pipe") {
      setOutput(convert(input, fromUnit, toUnit));
    }
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
      <h3>Unit Converter PRO</h3>

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
          { label: "Area", value: "area" },
          { label: "Volume", value: "volume" },
          { label: "Pipe PRO", value: "pipe" }
        ]}
      />

      {/* ================= NORMAL ================= */}
      {type !== "pipe" && (
        <>
          <Input label="From" value={input} onChange={setInput} />

          <Tabs
            value={fromUnit}
            onChange={setFromUnit}
            options={Object.keys(units).map((u) => ({
              label: u,
              value: u
            }))}
          />

          <button className="ghost" onClick={swap}>
            ⇅ Swap
          </button>

          <Input label="To" value={output} onChange={() => {}} />

          <Tabs
            value={toUnit}
            onChange={setToUnit}
            options={Object.keys(units).map((u) => ({
              label: u,
              value: u
            }))}
          />

          <div className="result">
            <p>
              {input || 0} {fromUnit} = {output || 0} {toUnit}
            </p>
          </div>
        </>
      )}

      {/* ================= PIPE PRO ================= */}
      {type === "pipe" && (
        <>
          <Tabs
            value={pipeMode}
            onChange={setPipeMode}
            options={[
              { label: "Manual", value: "manual" },
              { label: "Standard", value: "standard" }
            ]}
          />

          {pipeMode === "manual" && (
            <>
              <Input
                label="OD (mm)"
                value={od}
                onChange={setOd}
              />
              <Input
                label="ID (mm)"
                value={id}
                onChange={setId}
              />
            </>
          )}

          {pipeMode === "standard" && (
            <>
              <Tabs
                value={nps}
                onChange={setNps}
                options={Object.keys(pipeData).map((p) => ({
                  label: `${p}"`,
                  value: p
                }))}
              />

              <Tabs
                value={schedule}
                onChange={setSchedule}
                options={[
                  { label: "SCH 40", value: "40" },
                  { label: "SCH 80", value: "80" }
                ]}
              />
            </>
          )}

          <div className="result">
            <p>OD: {pipeOD.toFixed(2)} mm ({mmToInch(pipeOD)} inch)</p>
            <p>ID: {pipeID.toFixed(2)} mm ({mmToInch(pipeID)} inch)</p>
            <p>Thickness: {thickness} mm</p>
          </div>
        </>
      )}
    </Card>
  );
}
