import React, { useState } from "react";
import "./staircase.css";

export default function Staircase() {
  const [type, setType] = useState("straight");

  const [form, setForm] = useState({
    totalLength: "",
    totalWidth: "",
    floorHeight: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ✅ Allow decimal input (7.5 etc.)
  const handleInput = (val, field) => {
    if (/^\d*\.?\d*$/.test(val)) {
      setForm((prev) => ({
        ...prev,
        [field]: val,
      }));
    }
  };

  // ✅ Main Calculation Logic
  const calculate = () => {
    const length = parseFloat(form.totalLength);
    const width = parseFloat(form.totalWidth);
    const height = parseFloat(form.floorHeight);

    if (!length || !height) {
      setError("Enter valid dimensions");
      setResult(null);
      return;
    }

    // Basic thumb rules
    const riser = 7; // inches
    const tread = 10; // inches

    const totalRiseInches = height * 12;
    const steps = Math.round(totalRiseInches / riser);
    const actualRiser = totalRiseInches / steps;

    const totalRunFeet = (steps * tread) / 12;

    setResult({
      steps,
      riser: actualRiser.toFixed(2),
      tread,
      run: totalRunFeet.toFixed(2),
    });

    setError("");
  };

  return (
    <div className="staircase-container">
      <h2>BuildCalc Pro - Staircase</h2>

      {/* TYPE SELECT */}
      <div className="tabs">
        {["straight", "dog", "open", "spiral"].map((t) => (
          <button
            key={t}
            className={type === t ? "active" : ""}
            onClick={() => setType(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* INPUTS */}
      <div className="form">
        <div className="input-group">
          <label>Total Length (ft)</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="e.g. 12 or 12.5"
            value={form.totalLength}
            onChange={(e) =>
              handleInput(e.target.value, "totalLength")
            }
          />
          <small>Available horizontal space</small>
        </div>

        <div className="input-group">
          <label>Total Width (ft)</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="e.g. 3 or 3.5"
            value={form.totalWidth}
            onChange={(e) =>
              handleInput(e.target.value, "totalWidth")
            }
          />
          <small>Staircase width</small>
        </div>

        <div className="input-group">
          <label>Floor Height (ft)</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="e.g. 10 or 10.5"
            value={form.floorHeight}
            onChange={(e) =>
              handleInput(e.target.value, "floorHeight")
            }
          />
          <small>Floor to floor height</small>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="calculate-btn" onClick={calculate}>
          Calculate
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div className="result">
          <h3>Result</h3>
          <p>Steps: {result.steps}</p>
          <p>Riser: {result.riser} in</p>
          <p>Tread: {result.tread} in</p>
          <p>Total Run: {result.run} ft</p>
        </div>
      )}
    </div>
  );
}
