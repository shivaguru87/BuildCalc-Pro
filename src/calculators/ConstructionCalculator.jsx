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
  const materialCost = totalCost * 0.65;
  const labourCost = totalCost * 0.35;

  const steel = totalArea * 4;
  const cement = totalArea * 0.4;
  const sand = totalArea * 0.8;
  const aggregate = totalArea * 0.75;

  const tiles = totalArea * 1.1;
  const paint = totalArea * 0.18;

  const electricalPoints = totalArea / 30;
  const plumbingPoints = totalArea / 60;

  const wireLength = totalArea * 3;
  const pipeLength = totalArea * 2;

  const architectFee = totalCost * 0.04;
  const interiorFee = totalCost * 0.06;

  // ================= INTERIOR =================
  const [interiorItem, setInteriorItem] = useState("kitchen");
  const [unit, setUnit] = useState("ft");

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [cost, setCost] = useState("1500");

  // FALSE CEILING (RUNNING FEET)
  const [runningFeet, setRunningFeet] = useState("");

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

if (interiorItem === "falseceiling") {
  if (Number(runningFeet) > 0) {
    finalCost = Number(runningFeet) * Number(cost);
  } else {
    finalCost = areaCalc * Number(cost);
  }
} else if (["kitchen","wardrobe","bed","paneling"].includes(interiorItem)) {
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

  // ================= Electrical =================
  const [electricalType, setElectricalType] = useState("light");
const [points, setPoints] = useState("10");
  

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

          <Input label="Built-up Area" unit="sqft" value={area} onChange={setArea} />
          <Input label="Floors" value={floors} onChange={setFloors} />
          <Input label="Basement" value={basement} onChange={setBasement} />

          <div className="result">
            <p>Cost per sqft: ₹ {rate}</p>
            <p>Total Cost: ₹ {totalCost.toLocaleString()}</p>
            <p>Material Cost: ₹ {materialCost.toLocaleString()}</p>
            <p>Labour Cost: ₹ {labourCost.toLocaleString()}</p>
          </div>

          <div className="result">
            <p>Steel: {steel.toFixed(0)} kg</p>
            <p>Cement: {cement.toFixed(0)} bags</p>
            <p>Sand: {sand.toFixed(0)} cft</p>
            <p>Aggregate: {aggregate.toFixed(0)} cft</p>
          </div>

          <div className="result">
            <p>Tiles: {tiles.toFixed(0)} sqft</p>
            <p>Paint: {paint.toFixed(1)} liters</p>
          </div>

          <div className="result">
            <p>Electrical Points: {electricalPoints.toFixed(0)}</p>
            <p>Plumbing Points: {plumbingPoints.toFixed(0)}</p>
            <p>Wire Length: {wireLength.toFixed(0)} m</p>
            <p>Pipe Length: {pipeLength.toFixed(0)} m</p>
          </div>

          <div className="result">
            <p>Architect Fee: ₹ {architectFee.toLocaleString()}</p>
            <p>Interior Fee: ₹ {interiorFee.toLocaleString()}</p>
          </div>
        </>
      )}

      {/* ================= INTERIOR ================= */}
      {mainTab === "interior" && (
        <>
          <Tabs
            value={interiorItem}
            onChange={setInteriorItem}
            options={[
              { label: "Kitchen", value: "kitchen" },
              { label: "Wardrobe", value: "wardrobe" },
              { label: "Bed", value: "bed" },
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

          {/* FALSE CEILING SPECIAL */}
          {interiorItem === "falseceiling" ? (
            <>
              {/* DIMENSIONS */}
              <Input label="Length" value={length} onChange={setLength} />
              <Input label="Width" value={width} onChange={setWidth} />
              <Input label="Height" value={height} onChange={setHeight} />
          
              {/* RUNNING FEET */}
              <Input label="Running Feet" value={runningFeet} onChange={setRunningFeet} />
          
              <Input label="Cost" value={cost} onChange={setCost} />
          
              <div className="result">
                {Number(runningFeet) > 0 ? (
                  <p>Running Feet Cost: ₹ {(runningFeet * cost).toLocaleString()}</p>
                ) : (
                  <>
                    <p>Area: {areaCalc.toFixed(2)} sqft</p>
                    <p>Area Cost: ₹ {(areaCalc * cost).toLocaleString()}</p>
                  </>
                )}
              </div>
            </>
          ) : interiorItem === "tiles" ? (
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
      {/* ================= Electrical ================= */}
      {mainTab === "electrical" && (
  <>
    {/* TYPE TABS */}
    <Tabs
      value={electricalType}
      onChange={setElectricalType}
      options={[
        { label: "Light", value: "light" },
        { label: "Fan", value: "fan" },
        { label: "Socket", value: "socket" },
        { label: "AC", value: "ac" },
        { label: "MCB", value: "mcb" },
      ]}
    />

    {/* INPUT */}
    <Input label="Number of Points" value={points} onChange={setPoints} />

    {/* ===== LOGIC ===== */}
    {(() => {
      let wire = "1.5 sqmm";
      let amp = 6;
      let mcb = "6A";

      if (electricalType === "fan") {
        wire = "1.5 sqmm";
        amp = 6;
        mcb = "6A";
      }

      if (electricalType === "socket") {
        wire = "2.5 sqmm";
        amp = 10;
        mcb = "10A";
      }

      if (electricalType === "ac") {
        wire = "4 sqmm";
        amp = 20;
        mcb = "20A";
      }

      // wire length logic
      const wireLength = Number(points) * 8; // avg 8m per point

      return (
        <>
          <div className="result">
            <p>Wire Size: {wire}</p>
            <p>Recommended Amp: {amp}A</p>
            <p>MCB: {mcb}</p>
            <p>Total Wire: {wireLength} meters</p>
          </div>
        </>
      );
    })()}
  </>
)}
    </Card>
  );
}
