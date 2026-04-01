import React, { useState } from "react";

const TileCalculator = () => {
  const [mode, setMode] = useState("sqft");

  // Area input
  const [area, setArea] = useState("");

  // Dimension input
  const [lengthFt, setLengthFt] = useState("");
  const [lengthIn, setLengthIn] = useState("");
  const [widthFt, setWidthFt] = useState("");
  const [widthIn, setWidthIn] = useState("");

  // Tile
  const [tileSize, setTileSize] = useState("2x2"); // feet
  const [wastage, setWastage] = useState(10);
  const [tilesPerBox, setTilesPerBox] = useState("");

  const [result, setResult] = useState(null);

  const convertToSqft = () => {
    const length = Number(lengthFt) + Number(lengthIn) / 12;
    const width = Number(widthFt) + Number(widthIn) / 12;
    return length * width;
  };

  const getTileArea = () => {
    switch (tileSize) {
      case "1x1": return 1;
      case "2x2": return 4;
      case "2x1": return 2;
      case "4x2": return 8;
      default: return 4;
    }
  };

  const calculate = () => {
    let totalArea =
      mode === "sqft" ? Number(area) : convertToSqft();

    if (!totalArea || totalArea <= 0) return;

    const tileArea = getTileArea();

    let tiles = totalArea / tileArea;

    // Add wastage
    tiles += tiles * (wastage / 100);

    const totalTiles = Math.ceil(tiles);

    let boxes = null;
    if (tilesPerBox) {
      boxes = Math.ceil(totalTiles / Number(tilesPerBox));
    }

    setResult({
      totalArea,
      totalTiles,
      boxes,
    });
  };

  return (
    <div style={styles.container}>
      <h2>Tile Calculator</h2>

      {/* Mode */}
      <div style={styles.row}>
        <button onClick={() => setMode("sqft")}>Sqft</button>
        <button onClick={() => setMode("dimension")}>Feet/Inch</button>
      </div>

      {/* Inputs */}
      {mode === "sqft" ? (
        <input
          placeholder="Area (sqft)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
      ) : (
        <>
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
        </>
      )}

      {/* Tile Size */}
      <select value={tileSize} onChange={(e) => setTileSize(e.target.value)}>
        <option value="1x1">1x1 ft</option>
        <option value="2x2">2x2 ft</option>
        <option value="2x1">2x1 ft</option>
        <option value="4x2">4x2 ft</option>
      </select>

      {/* Wastage */}
      <input
        placeholder="Wastage % (default 10)"
        value={wastage}
        onChange={(e) => setWastage(e.target.value)}
      />

      {/* Box */}
      <input
        placeholder="Tiles per box (optional)"
        value={tilesPerBox}
        onChange={(e) => setTilesPerBox(e.target.value)}
      />

      <button style={styles.button} onClick={calculate}>
        Calculate
      </button>

      {/* Result */}
      {result && (
        <div style={styles.result}>
          <p>Total Area: {result.totalArea.toFixed(1)} sqft</p>
          <p>Total Tiles: {result.totalTiles}</p>
          {result.boxes && <p>Boxes: {result.boxes}</p>}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px" },
  row: { display: "flex", gap: "10px", marginBottom: "10px" },
  button: {
    marginTop: "10px",
    padding: "10px",
    background: "black",
    color: "white",
    border: "none",
  },
  result: {
    marginTop: "20px",
    background: "#eee",
    padding: "15px",
  },
};

export default TileCalculator;
