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
  const [phase, setPhase] = useState("single");

const [floorsElec, setFloorsElec] = useState("1");
const [basementElec, setBasementElec] = useState("0");

const [light, setLight] = useState("10");
const [fan, setFan] = useState("4");

const [socket6, setSocket6] = useState("5");
const [socket16, setSocket16] = useState("3");

const [ac, setAc] = useState("2");
const [geyser, setGeyser] = useState("1");
const [wm, setWm] = useState("1");

const [motorHP, setMotorHP] = useState("1");
  
  // ===== LOAD (REALISTIC)
const lightLoad = Number(light) * 15;
const fanLoad = Number(fan) * 75;

const socketLoad =
  Number(socket6) * 100 +
  Number(socket16) * 1000;

const acLoad = Number(ac) * 1500;
const geyserLoad = Number(geyser) * 2000;
const wmLoad = Number(wm) * 800;

// MOTOR
const motorLoad = Number(motorHP) * 750;
const motorEffective = motorLoad * 0.4;

// TOTAL CONNECTED LOAD
const totalLoadW =
  lightLoad +
  fanLoad +
  socketLoad +
  acLoad +
  geyserLoad +
  wmLoad +
  motorEffective;

const connectedKW = totalLoadW / 1000;

// DIVERSITY
const diversityFactor = 0.6;
const effectiveKW = (totalLoadW * diversityFactor) / 1000;

// ===== FLOOR LOGIC
const totalFloors =
  Number(floorsElec) + Number(basementElec);

const buildingFactor = totalFloors > 1 ? 0.8 : 1;

const buildingLoad =
  effectiveKW * totalFloors * buildingFactor;

// ===== MCB LOGIC
const lightMCB = Math.ceil(Number(light) / 10);
const socketMCB = Math.ceil(
  (Number(socket6) + Number(socket16)) / 5
);
const acMCB = Number(ac);
const geyserMCB = Number(geyser);

const totalMCB =
  lightMCB + socketMCB + acMCB + geyserMCB;

// ===== MAIN MCB
let mainMCB = "40A";
if (buildingLoad > 5) mainMCB = "63A";
if (buildingLoad > 8) mainMCB = "3 Phase Recommended";

// ===== RCCB
const rccb = "63A / 30mA";

// ===== WIRES
const wireLight = "1.5 sqmm";
const wireSocket = "2.5 sqmm";
const wireHeavy = "4 sqmm";
const mainWire = "6 sqmm";

// ===== WIRE LENGTH
const totalPoints =
  Number(light) +
  Number(fan) +
  Number(socket6) +
  Number(socket16);

const wirePerPoint = 8;

const phaseWire = totalPoints * wirePerPoint;
const neutralWire = phaseWire;
const earthWire = phaseWire * 0.7;

const totalWire =
  phaseWire + neutralWire + earthWire;
  

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
    {/* PHASE */}
    <Tabs
      value={phase}
      onChange={setPhase}
      options={[
        { label: "Single Phase", value: "single" },
        { label: "3 Phase", value: "three" },
      ]}
    />

    {/* BUILDING */}
    <Input label="Floors" value={floorsElec} onChange={setFloorsElec} />
    <Input label="Basement" value={basementElec} onChange={setBasementElec} />

    {/* INPUTS */}
    <Input label="Light Points" value={light} onChange={setLight} />
    <Input label="Fan Points" value={fan} onChange={setFan} />

    <Input label="6A Socket" value={socket6} onChange={setSocket6} />
    <Input label="16A Socket" value={socket16} onChange={setSocket16} />

    <Input label="AC Units" value={ac} onChange={setAc} />
    <Input label="Geyser" value={geyser} onChange={setGeyser} />
    <Input label="Washing Machine" value={wm} onChange={setWm} />

    <Input label="Motor (HP)" value={motorHP} onChange={setMotorHP} />

    {/* LOAD */}
    <div className="result">
      <p>Connected Load: {connectedKW.toFixed(2)} kW</p>
      <p>Effective Load: {effectiveKW.toFixed(2)} kW</p>
      <p>Building Load: {buildingLoad.toFixed(2)} kW</p>
    </div>

    {/* MCB */}
    <div className="result">
      <p>Light MCB: {lightMCB} × 6A</p>
      <p>Socket MCB: {socketMCB} × 10A</p>
      <p>AC MCB: {acMCB} × 20A</p>
      <p>Geyser MCB: {geyserMCB} × 20A</p>
      <p>Total MCB: {totalMCB}</p>
    </div>

    {/* MAIN */}
    <div className="result">
      <p>Main MCB: {mainMCB}</p>
      <p>RCCB: {rccb}</p>
    </div>

    {/* WIRES */}
    <div className="result">
      <p>Light Wire: {wireLight}</p>
      <p>Socket Wire: {wireSocket}</p>
      <p>Heavy Wire: {wireHeavy}</p>
      <p>Main Wire: {mainWire}</p>
    </div>

    {/* WIRE LENGTH */}
    <div className="result">
      <p>Phase Wire: {phaseWire.toFixed(0)} m</p>
      <p>Neutral Wire: {neutralWire.toFixed(0)} m</p>
      <p>Earth Wire: {earthWire.toFixed(0)} m</p>
      <p>Total Wire: {totalWire.toFixed(0)} m</p>
    </div>

    {/* GUIDANCE */}
    <div className="result">
      <p>📏 8–10 meters per point</p>
      <p>⚡ Neutral = Phase</p>
      <p>🟢 Earth ≈ 70% of phase</p>
      <p>✔ Add 10% extra for wastage</p>
      <p>⚠️ Load uses 60% diversity</p>
      <p>✔ Single phase safe till ~7kW</p>
      <p>⚡ Use 3-phase if &gt; 8kW</p>
    </div>
  </>
)}
    </Card>
  );
}
