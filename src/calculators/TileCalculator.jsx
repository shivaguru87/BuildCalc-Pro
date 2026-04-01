import React, { useState } from "react";

const TileCalculator = () => {
  const [unit, setUnit] = useState("ft");

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");

  const [tileSize, setTileSize] = useState("2x2");
  const [wastage, setWastage] = useState(10);
  const [tilesPerBox, setTilesPerBox] = useState("");

  const [result, setResult] = useState(null);

  const convertToFeet = (value) => {
    if (unit === "m") return value * 3.281;
    if (unit === "inch") return value / 12;
    return value;
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
    let L = convertToFeet(Number(length));
    let W = convertToFeet(Number(width));

    if (!L || !W) return;

    const area = L * W;
    const tileArea = getTileArea();

    let tiles = area / tileArea;
    tiles += tiles * (wastage / 100);

    const totalTiles = Math.ceil(tiles);

    let boxes = null;
    if (tilesPerBox) {
      boxes = Math.ceil(totalTiles / Number(tilesPerBox));
    }

    setResult({
      area,
      totalTiles,
      boxes,
    });
  };

  return (
    <div className="card">
      <h2>Tile Calculator</h2>

      {/* UNIT SELECTOR */}
      <div className="toggle-group">
        <button className={unit === "ft" ? "active" : ""} onClick={() => setUnit("ft")}>ft</button>
        <button className={unit === "m" ? "active" : ""} onClick={() => setUnit("m")}>m</button>
        <button className={unit === "inch" ? "active" : ""} onClick={() => setUnit("inch")}>inch</button>
      </div>

      {/* INPUTS */}
      <label>Length ({unit})</label>
      <input value={length} onChange={(e) => setLength(e.target.value)} />

      <label>Width ({unit})</label>
      <input value={width} onChange={(e) => setWidth(e.target.value)} />

      {/* TILE SIZE */}
      <div className="toggle-group">
        <button className={tileSize === "1x1" ? "active" : ""} onClick={() => setTileSize("1x1")}>1x1</button>
        <button className={tileSize === "2x2" ? "active" : ""} onClick={() => setTileSize("2x2")}>2x2</button>
        <button className={tileSize === "2x1" ? "active" : ""} onClick={() => setTileSize("2x1")}>2x1</button>
        <button className={tileSize === "4x2" ? "active" : ""} onClick={() => setTileSize("4x2")}>4x2</button>
      </div>

      <label>Wastage (%)</label>
      <input value={wastage} onChange={(e) => setWastage(e.target.value)} />

      <label>Tiles per Box (optional)</label>
      <input value={tilesPerBox} onChange={(e) => setTilesPerBox(e.target.value)} />

      <button className="primary" onClick={calculate}>
        Calculate
      </button>

      {/* RESULT */}
      {result && (
        <div className="result-box">
          <p>Total Area: {result.area.toFixed(1)} sqft</p>
          <p>Total Tiles: {result.totalTiles}</p>
          {result.boxes && <p>Boxes: {result.boxes}</p>}
        </div>
      )}

      <button className="secondary">Back</button>
    </div>
  );
};

export default TileCalculator;
