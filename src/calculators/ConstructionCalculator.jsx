import { useState } from "react";
import Card from "../components/Card";
import Tabs from "../components/Tabs";
import Input from "../components/Input";

export default function ConstructionCalculator() {
  const [mainTab, setMainTab] = useState("main");

  // ================= MAIN =================
  const [type, setType] = useState("standard");
  const [customRate, setCustomRate] = useState("3500");

  const [area, setArea] = useState("1480");
  const [floors, setFloors] = useState("1");
  const [basement, setBasement] = useState("0");

  const costMap = {
    basic: 1800,
    standard: 2200,
    premium: 3000,
    custom: Number(customRate),
  };

  const rate = costMap[type];

  const totalFloors = Number(floors) + Number(basement);
  const totalArea = Number(area) * totalFloors;
  const totalCost = totalArea * rate;

  // ================= INTERIOR =================
  const [interiorType, setInteriorType] = useState("basic");
  const [interiorItem, setInteriorItem] = useState("kitchen");

  const [unit, setUnit] = useState("ft");

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const [cost, setCost] = useState("1500");

  const toFeet = (v) => {
    const val = Number(v || 0);
    if (unit === "inch") return val / 12;
    if (unit === "mm") return val / 304.8;
    return val;
  };

  const L = toFeet(length);
  const W = toFeet(width);
  const H = toFeet(height);

  const areaCalc = L * W;
  const volumeCalc = L * W * H;

  let finalCost = 0;

  if (["kitchen","wardrobe","bed","falseceiling","paneling"].includes(interiorItem)) {
    finalCost = areaCalc * Number(cost);
  } else {
    finalCost = volumeCalc * Number(cost);
  }

  // ================= TILE =================
  const [tileL, setTileL] = useState("600");
  const [tileW, setTileW] = useState("600");
  const [tilesPerBox, setTilesPerBox] = useState("4");

  const tileArea = (Number(tileL) * Number(tileW)) / 929030;
  const totalTiles = areaCalc / tileArea;
  const boxes = totalTiles / Number(tilesPerBox);

  // ================= PAINT =================
  const [coats, setCoats] = useState("2");

  const paintArea = 2 * (L + W) * H;
  const paintLiters = (paintArea * Number(coats)) / 120;

  return (
    <Card>
      <h3>Construction Calculator</h3>

      {/* MAIN TABS */}
      <Tabs
        value={mainTab}
        onChange={setMainTab}
        options={[
          { label: "Main", value: "main" },
          { label: "Interior", value: "interior" },
          { label: "Electrical", value: "electrical" },
          { label: "Plumbing", value: "plumbing" },
        ]}
      />

      {/* ================= MAIN ================= */}
      {mainTab === "main" && (
        <>
          <Tabs
            value={type}
            onChange={setType}
            options={[
              { label: "Basic", value: "basic" },
              { label: "Standard", value: "standard" },
              { label: "Premium", value: "premium" },
              { label: "Custom", value: "custom" },
            ]}
          />

          {type === "custom" && (
            <Input label="Rate" unit="₹/sqft" value={customRate} onChange={setCustomRate} />
          )}

          <Input label="Area" unit="sqft" value={area} onChange={setArea} />
          <Input label="Floors" value={floors} onChange={setFloors} />
          <Input label="Basement" value={basement} onChange={setBasement} />

          <div className="result">
            <p>Rate: ₹ {rate}</p>
            <p>Total Cost: ₹ {totalCost.toLocaleString()}</p>
          </div>
        </>
      )}

      {/* ================= INTERIOR ================= */}
      {mainTab === "interior" && (
        <>
          <Tabs
            value={interiorType}
            onChange={setInteriorType}
            options={[
              { label: "Basic", value: "basic" },
              { label: "Standard", value: "standard" },
              { label: "Premium", value: "premium" },
              { label: "Custom", value: "custom" },
            ]}
          />

          <Tabs
            value={interiorItem}
            onChange={setInteriorItem}
            options={[
              { label: "Kitchen", value: "kitchen" },
              { label: "Wardrobe", value: "wardrobe" },
              { label: "Bed", value: "bed" },
              { label: "Dressing", value: "dressing" },
              { label: "Paneling", value: "paneling" },
              { label: "Computer", value: "computer" },
              { label: "Sofa", value: "sofa" },
              { label: "Dining", value: "dining" },
              { label: "False Ceiling", value: "falseceiling" },
              { label: "Tiles", value: "tiles" },
              { label: "Paint", value: "paint" },
            ]}
          />

          <Tabs
            value={unit}
            onChange={setUnit}
            options={[
              { label: "ft", value: "ft" },
              { label: "inch", value: "inch" },
              { label: "mm", value: "mm" },
            ]}
          />

          {/* TILE MODE */}
          {interiorItem === "tiles" ? (
            <>
              <Input label="Length" value={length} onChange={setLength} />
              <Input label="Width" value={width} onChange={setWidth} />

              <Input label="Tile Length (mm)" value={tileL} onChange={setTileL} />
              <Input label="Tile Width (mm)" value={tileW} onChange={setTileW} />
              <Input label="Tiles per Box" value={tilesPerBox} onChange={setTilesPerBox} />

              <div className="result">
                <p>Tiles: {totalTiles.toFixed(0)}</p>
                <p>Boxes: {boxes.toFixed(0)}</p>
              </div>
            </>
          ) : interiorItem === "paint" ? (
            <>
              <Input label="Length" value={length} onChange={setLength} />
              <Input label="Width" value={width} onChange={setWidth} />
              <Input label="Height" value={height} onChange={setHeight} />
              <Input label="Coats" value={coats} onChange={setCoats} />

              <div className="result">
                <p>Paint: {paintLiters.toFixed(1)} Liters</p>
              </div>
            </>
          ) : (
            <>
              <Input label="Length" value={length} onChange={setLength} />
              <Input label="Width" value={width} onChange={setWidth} />
              <Input label="Height" value={height} onChange={setHeight} />
              <Input label="Cost" value={cost} onChange={setCost} />

              <div className="result">
                <p>Area: {areaCalc.toFixed(2)} sqft</p>
                <p>Cost: ₹ {finalCost.toLocaleString()}</p>
              </div>
            </>
          )}
        </>
      )}
    </Card>
  );
}
