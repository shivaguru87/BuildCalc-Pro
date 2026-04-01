import React, { useState } from "react";

const RCCEstimator = () => {
  const [area, setArea] = useState("");
  const [floors, setFloors] = useState(1);
  const [basement, setBasement] = useState(0);
  const [result, setResult] = useState(null);

  const calculate = () => {
    if (!area || area <= 0) return;

    const totalFloors = Number(floors) + Number(basement);
    const totalArea = Number(area) * totalFloors;

    // RCC Thumb Rules (can upgrade later)
    const steel = totalArea * 4;        // kg
    const cement = totalArea * 0.4;     // bags
    const sand = totalArea * 1.2;       // cft
    const aggregate = totalArea * 2.4;  // cft

    setResult({
      totalArea,
      steel,
      cement,
      sand,
      aggregate,
    });
  };

  return (
    <div style={styles.container}>
      <h2>RCC Full Estimator</h2>

      <div style={styles.inputGroup}>
        <label>Area (sqft)</label>
        <input
          type="number"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Enter total sqft"
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

      <button style={styles.button} onClick={calculate}>
        Calculate
      </button>

      {result && (
        <div style={styles.result}>
          <p><strong>Total Area:</strong> {result.totalArea} sqft</p>
          <p><strong>Steel:</strong> {result.steel.toFixed(0)} kg</p>
          <p><strong>Cement:</strong> {result.cement.toFixed(1)} bags</p>
          <p><strong>Sand:</strong> {result.sand.toFixed(1)} cft</p>
          <p><strong>Aggregate:</strong> {result.aggregate.toFixed(1)} cft</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  inputGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    gap: "10px",
  },
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
