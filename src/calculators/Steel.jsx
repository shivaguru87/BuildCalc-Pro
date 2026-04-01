import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

export default function Steel() {
  const [mode, setMode] = useState("single"); // single | total

  const [dia, setDia] = useState("");
  const [len, setLen] = useState("");
  const [qty, setQty] = useState("");

  const d = Number(dia);
  const l = Number(len);
  const q = Number(qty);

  const weightPerMeter = d ? (d * d) / 162 : 0;
  const totalWeight = weightPerMeter * l * (mode === "total" ? q : 1);

  return (
    <Card>
      <h3>Steel Weight</h3>

      {/* MODE */}
      <Tabs
        value={mode}
        onChange={setMode}
        options={[
          { label: "Single", value: "single" },
          { label: "Multiple", value: "total" }
        ]}
      />

      {/* INPUTS */}
      <Input
        label="Diameter"
        unit="mm"
        value={dia}
        onChange={setDia}
        hint="Bar size (e.g. 8, 10, 12, 16)"
      />

      <Input
        label="Length"
        unit="m"
        value={len}
        onChange={setLen}
        hint="Length of bar"
      />

      {mode === "total" && (
        <Input
          label="Quantity"
          value={qty}
          onChange={setQty}
          hint="Number of bars"
        />
      )}

      {/* RESULT */}
      <div className="result">
        <p>Weight / meter: {weightPerMeter.toFixed(3)} kg</p>
        <p>Total Weight: {totalWeight.toFixed(2)} kg</p>
      </div>
    </Card>
  );
}
