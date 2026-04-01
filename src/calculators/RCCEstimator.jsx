import React, { useState } from "react";

const RCCEstimator = () => {
  const [mode, setMode] = useState("sqft");

  // Sqft input
  const [area, setArea] = useState("");

  // Dimension input
  const [lengthFt, setLengthFt] = useState("");
  const [lengthIn, setLengthIn] = useState("");
  const [widthFt, setWidthFt] = useState("");
  const [widthIn, setWidthIn] = useState("");

  const [floors, setFloors] = useState(1);
  const [basement, setBasement] = useState(0);
  const [grade, setGrade] = useState("M20");
  const [thickness, setThickness] = useState(5); // inches
  const [columnSpacing, setColumnSpacing] = useState(10); // ft

  const [result, setResult] = useState(null);

  const convertToSqft = () => {
    const length = Number(lengthFt) + Number(lengthIn) / 12;
    const width = Number(widthFt) + Number(widthIn) / 12;
    return length * width;
  };

  const calculate = () => {
    let baseArea =
      mode === "sqft" ? Number(area) : convertToSqft();

    if (!baseArea || baseArea <= 0) return;

    const totalFloors = Number(floors) + Number(basement);
    const totalArea = baseArea * totalFloors;

    // Column count (approx grid)
    const colsX = Math.ceil(Math.sqrt(baseArea) / columnSpacing);
    const totalColumns = colsX * colsX;

    // Steel factor adjusted by thickness
    let steelFactor = 4;
    if (thickness >= 6) steelFactor = 4.5;
    if (thickness >= 8) steelFactor = 5;

    const steel = totalArea * steelFactor;

    // Concrete factors
    const cementFactor = grade === "M25" ? 0.45 : 0.4;
    const cement = totalArea * cementFactor;
    const sand = totalArea * 1.2;
    const aggregate = totalArea * 2.4;

    // Bar logic
    let bar = "10mm";
    if (floors >= 3) bar = "12mm";
    if (floors >= 5) bar = "16mm";

    // Cost
    const totalCost =
      steel * 75 +
      cement * 420 +
      sand * 50 +
      aggregate * 45;

    setResult({
      baseArea,
      totalArea,
      totalColumns,
      steel,
      cement,
      sand,
      aggregate,
      bar,
      totalCost,
    });
  };

  return (
    <div style={styles.container}>
      <h2>RCC ULTRA PRO</h2>

      {/* Mode Toggle */}
      <div style={styles.row}>
        <button onClick={() => setMode("sqft")}>Sqft</button>
        <button onClick={() => setMode("dimension")}>Feet/Inch</button>
      </div>

      {/* INPUTS */}
      {mode === "sqft" ? (
        <div style={styles.inputGroup}>
          <label>Area (sqft)</label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>
      ) : (
        <div>
          <div style={styles.row}>
            <input
              placeholder="Length ft"
              value={lengthFt}
              onChange={(e) => setLengthFt(e.target.value)}
            />
            <input
              placeholder="in"
              value={lengthIn}
              onChange={(e) => setLengthIn(e.target.value)}
            />
          </div>

          <div style={styles.row}>
            <input
              placeholder="Width ft"
              value={widthFt}
              onChange={(e) => setWidthFt(e.target.value)}
            />
            <input
              placeholder="in"
              value={widthIn}
              onChange={(e) => setWidthIn(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* BASIC */}
      <div style={styles.row}>
        <select value={floors} onChange={(e) => setFloors(e.target.value)}>
          {[1,2,3,4,5].map((f) => (
            <option key={f}>{f} Floors</option>
          ))}
        </select>

        <select value={basement} onChange={(e) => setBasement(e.target.value)}>
          {[0,1,2].map((b) => (
            <option key={b}>{b} Basement</option>
          ))}
        </select>
      </div>

      <div style={styles.row}>
        <select value={grade} onChange={(e) => setGrade(e.target.value)}>
          <option>M20</option>
          <option>M25</option>
        </select>

        <input
          placeholder="Slab thickness (inch)"
          value={thickness}
          onChange={(e) => setThickness(e.target.value)}
        />
      </div>

      <div style={styles.inputGroup}>
        <label>Column Spacing (ft)</label>
        <input
          value={columnSpacing}
          onChange={(e) => setColumnSpacing(e.target.value)}
        />
      </div>

      <button style={styles.button} onClick={calculate}>
        Calculate
      </button>

      {/* RESULT */}
      {result && (
        <div style={styles.result}>
          <h3>Area</h3>
          <p>Base: {result.baseArea.toFixed(1)} sqft</p>
          <p>Total: {result.totalArea.toFixed(1)} sqft</p>

          <h3>Structure</h3>
          <p>Columns: {result.totalColumns}</p>

          <h3>Materials</h3>
          <p>Steel: {result.steel.toFixed(0)} kg</p>
          <p>Cement: {result.cement.toFixed(1)} bags</p>
          <p>Sand: {result.sand.toFixed(1)} cft</p>
          <p>Aggregate: {result.aggregate.toFixed(1)} cft</p>

          <h3>Recommendation</h3>
          <p>Bar: {result.bar}</p>

          <h3>Total Cost</h3>
          <p>₹ {result.totalCost.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px" },
  inputGroup: { marginBottom: "10px" },
  row: { display: "flex", gap: "10px", marginBottom: "10px" },
  button: {
    padding: "10px",
    background: "black",
    color: "white",
    border: "none",
  },
  result: {
    marginTop: "20px",
    padding: "15px",
    background: "#eee",
  },
};

export default RCCEstimator;
