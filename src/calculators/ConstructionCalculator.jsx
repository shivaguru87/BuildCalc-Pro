import { useState } from "react";
import Card from "../components/Card";
import Tabs from "../components/Tabs";
import Input from "../components/Input";

export default function ConstructionCalculator() {
  const [mainTab, setMainTab] = useState("main");
  const [type, setType] = useState("standard");

  const [area, setArea] = useState("1480");
  const [floors, setFloors] = useState("1");
  const [basement, setBasement] = useState("0");

  // ===== COST PER SQFT =====
  const costMap = {
    basic: 1800,
    standard: 2200,
    premium: 3000,
  };

  const costPerSqft = costMap[type];

  const totalFloors = Number(floors) + Number(basement);
  const totalArea = Number(area) * totalFloors;

  // ===== COST =====
  const totalCost = totalArea * costPerSqft;
  const materialCost = totalCost * 0.65;
  const labourCost = totalCost * 0.35;

  // ===== MATERIALS =====
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

  return (
    <Card>
      <h3>Construction Calculator</h3>

      {/* MAIN TABS */}
      <Tabs
        value={mainTab}
        onChange={setMainTab}
        options={[
          { label: "Main", value: "main" },
          { label: "Electrical", value: "electrical" },
          { label: "Plumbing", value: "plumbing" },
        ]}
      />

      {/* ================= MAIN ================= */}
      {mainTab === "main" && (
        <>
          {/* TYPE */}
          <Tabs
            value={type}
            onChange={setType}
            options={[
              { label: "Basic", value: "basic" },
              { label: "Standard", value: "standard" },
              { label: "Premium", value: "premium" },
            ]}
          />

          {/* INPUTS */}
          <Input label="Built-up Area" unit="sqft" value={area} onChange={setArea} />
          <Input label="Floors" value={floors} onChange={setFloors} />
          <Input label="Basement" value={basement} onChange={setBasement} />

          {/* COST */}
          <div className="result">
            <p>Cost per sqft: ₹ {costPerSqft}</p>
            <p>Total Cost: ₹ {totalCost.toLocaleString()}</p>
            <p>Material Cost: ₹ {materialCost.toLocaleString()}</p>
            <p>Labour Cost: ₹ {labourCost.toLocaleString()}</p>
          </div>

          {/* MATERIALS */}
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
    </Card>
  );
}
