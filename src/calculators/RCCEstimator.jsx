import React, { useState } from "react";

const RCCEstimator = () => {
  const [area, setArea] = useState("");
  const [floors, setFloors] = useState(1);
  const [basement, setBasement] = useState(0);
  const [grade, setGrade] = useState("M20");
  const [result, setResult] = useState(null);

  const calculate = () => {
    if (!area || area <= 0) return;

    const totalFloors = Number(floors) + Number(basement);
    const totalArea = Number(area) * totalFloors;

    // Distribution (%)
    const slab = totalArea * 0.5;
    const beam = totalArea * 0.2;
    const column = totalArea * 0.2;
    const footing = totalArea * 0.1;

    // Steel factors (kg/sqft)
    const steelFactor = {
      slab: 3,
      beam: 5,
      column: 6,
      footing: 4,
    };

    const steel =
      slab * steelFactor.slab +
      beam * steelFactor.beam +
      column * steelFactor.column +
      footing * steelFactor.footing;

    // Concrete factor (based on grade)
    const cementFactor = grade === "M25" ? 0.45 : 0.4;

    const cement = totalArea * cementFactor;
    const sand = totalArea * 1.2;
    const aggregate = totalArea * 2.4;

    // Bar suggestion logic
    let bar = "10mm";
    if (floors >= 3) bar = "12mm";
    if (floors >= 5) bar = "16mm";

    // Cost (approx)
    const steelCost = steel * 75;
    const cementCost = cement * 420;
    const sandCost = sand * 50;
    const aggCost = aggregate * 45;

    const totalCost = steelCost + cementCost + sandCost + aggCost;

    setResult({
      totalArea,
      slab,
      beam,
      column,
      footing,
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
      <h2>RCC PRO Estimator</h2>

      <div style={styles.inputGroup}>
        <label>Area (sqft)</label>
        <input
          type="number"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Enter total area"
        />
      </div>

      <div style={styles.row}>
        <div style={styles.inputGroup}>
          <label>Floors</label>
          <select value={floors} onChange={(e) => setFloors(e.target.value)}>
            {[1,2,3,4,5].map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label>Basement</label>
          <select value={basement} onChange={(e) => setBasement(e.target.value)}>
            {[0,1,2].map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.inputGroup}>
        <label>Concrete Grade</label>
        <select value={grade} onChange={(e) => setGrade(e.target.value)}>
          <option value="M20">M20</option>
          <option value="M25">M25</option>
        </select>
      </div>

      <button style={styles.button} onClick={calculate}>
        Calculate
      </button>

      {result && (
        <div style={styles.result}>
          <h3>Breakup</h3>
          <p>Slab: {result.slab.toFixed(0)} sqft</p>
          <p>Beam: {result.beam.toFixed(0)} sqft</p>
          <p>Column: {result.column.toFixed(0)} sqft</p>
          <p>Footing: {result.footing.toFixed(0)} sqft</p>

          <h3>Materials</h3>
          <p>Steel: {result.steel.toFixed(0)} kg</p>
          <p>Cement: {result.cement.toFixed(1)} bags</p>
          <p>Sand: {result.sand.toFixed(1)} cft</p>
          <p>Aggregate: {result.aggregate.toFixed(1)} cft</p>

          <h3>Suggestion</h3>
          <p>Recommended Bar: {result.bar}</p>

          <h3>Estimated Cost</h3>
          <p>₹ {result.totalCost.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px" },
  inputGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
  },
  row: { display: "flex", gap: "10px" },
  button: {
    padding: "10px",
    background: "black",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  result: {
    marginTop: "20px",
    background: "#f2f2f2",
    padding: "15px",
  },
};

export default RCCEstimator;
