import { useState } from "react";
import Card from "../components/Card";
import Tabs from "../components/Tabs";
import Input from "../components/Input";

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

// Different logic per item
let finalCost = 0;

if (interiorItem === "kitchen") {
  finalCost = areaCalc * Number(cost);
} else if (interiorItem === "wardrobe") {
  finalCost = areaCalc * Number(cost);
} else if (interiorItem === "bed") {
  finalCost = areaCalc * Number(cost);
} else if (interiorItem === "falseceiling") {
  finalCost = areaCalc * Number(cost);
} else {
  finalCost = volumeCalc * Number(cost);
}

  // ================= INTERIOR =================
  const [interiorItem, setInteriorItem] = useState("kitchen");

const [unit, setUnit] = useState("ft");

const [length, setLength] = useState("");
const [width, setWidth] = useState("");
const [height, setHeight] = useState("");

const [cost, setCost] = useState("1500");

export default function ConstructionCalculator() {
  const [mainTab, setMainTab] = useState("main");
  const toFeet = (v) => {
    const val = Number(v || 0);
    if (unit === "inch") return val / 12;
    if (unit === "mm") return val / 304.8;
    return val;
  };

  const L = toFeet(length);
  const W = toFeet(width);
  const H = toFeet(height);

  const volume = L * W * H;
  const areaCalc = L * W;

  const interiorCost = areaCalc * Number(cost);

  // ================= TILE =================
  const [tileSize, setTileSize] = useState("600x600");
  const [tilesPerBox, setTilesPerBox] = useState("4");

  const tileArea = (600 * 600) / 929030; // mm² to sqft approx
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
            <Input
              label="Custom Rate"
              unit="₹/sqft"
              value={customRate}
              onChange={setCustomRate}
            />
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
    {/* TYPE */}
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

    {/* ITEM TABS */}
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
        { label: "Custom", value: "customItem" },
      ]}
    />

    {/* UNIT */}
    <Tabs
      value={unit}
      onChange={setUnit}
      options={[
        { label: "ft", value: "ft" },
        { label: "inch", value: "inch" },
        { label: "mm", value: "mm" },
      ]}
    />

    {/* INPUTS */}
    <Input label="Length" value={length} onChange={setLength} />
    <Input label="Width" value={width} onChange={setWidth} />
    <Input label="Height" value={height} onChange={setHeight} />

    <Input label="Cost" unit="₹" value={cost} onChange={setCost} />

    {/* RESULT */}
    <div className="result">
      <p>Area: {areaCalc.toFixed(2)} sqft</p>
      <p>Volume: {volumeCalc.toFixed(2)} cft</p>
      <p>Total Cost: ₹ {finalCost.toLocaleString()}</p>
    </div>
  </>
)}
    </Card>
  );
}
