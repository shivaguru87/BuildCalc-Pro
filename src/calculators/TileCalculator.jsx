import { useState } from "react";
import Card from "../components/Card";
import Tabs from "../components/Tabs";
import Input from "../components/Input";

export default function TileCalculator() {
  const [unit, setUnit] = useState("ft");

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");

  const [tileSize, setTileSize] = useState("2x2");

  const [wastage, setWastage] = useState("10");
  const [tilesPerBox, setTilesPerBox] = useState("");

  // ===== UNIT CONVERSION =====
  const toFeet = (val) => {
    const v = Number(val || 0);

    if (unit === "m") return v * 3.281;
    if (unit === "inch") return v / 12;
    return v; // ft
  };

  const L = toFeet(length);
  const W = toFeet(width);

  // ===== TILE AREA =====
  const getTileArea = () => {
    if (tileSize === "1x1") return 1;
    if (tileSize === "2x2") return 4;
    if (tileSize === "2x1") return 2;
    if (tileSize === "4x2") return 8;
    return 4;
  };

  // ===== CALCULATIONS =====
  const area = L * W;

  let tiles = area / getTileArea();
  tiles += tiles * (Number(wastage) / 100);

  const totalTiles = Math.ceil(tiles);

  let boxes = null;
  if (tilesPerBox) {
    boxes = Math.ceil(totalTiles / Number(tilesPerBox));
  }

  return (
    <Card>
      <h3>Tile Calculator</h3>

      {/* UNIT SELECT */}
      <Tabs
        value={unit}
        onChange={setUnit}
        options={[
          { label: "ft", value: "ft" },
          { label: "m", value: "m" },
          { label: "inch", value: "inch" }
        ]}
      />

      {/* DIMENSIONS */}
      <Input label="Length" unit={unit} value={length} onChange={setLength} />
      <Input label="Width" unit={unit} value={width} onChange={setWidth} />

      {/* TILE SIZE */}
      <Tabs
        value={tileSize}
        onChange={setTileSize}
        options={[
          { label: "1x1", value: "1x1" },
          { label: "2x2", value: "2x2" },
          { label: "2x1", value: "2x1" },
          { label: "4x2", value: "4x2" }
        ]}
      />

      {/* INPUTS */}
      <Input
        label="Wastage (%)"
        value={wastage}
        onChange={setWastage}
      />

      <Input
        label="Tiles per Box"
        value={tilesPerBox}
        onChange={setTilesPerBox}
        hint="Optional"
      />

      {/* RESULT */}
      <div className="result">
        <p>Total Area: {area.toFixed(2)} sqft</p>
        <p>Total Tiles: {totalTiles}</p>
        {boxes && <p>Boxes: {boxes}</p>}
      </div>
    </Card>
  );
}
