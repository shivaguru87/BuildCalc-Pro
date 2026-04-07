import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

export default function MaterialCost() {
  const [type, setType] = useState("construction");

  // ================= DATA =================

  const constructionItems = [
    { name: "Cement Bag", unit: "bag", stdCost: 400 },
    { name: "Bricks", unit: "nos", stdCost: 8, size: true },
    { name: "Sand", unit: "cft", stdCost: 50 },
    { name: "Aggregate", unit: "cft", stdCost: 60 },
    { name: "Steel", unit: "kg", stdCost: 70 },
    { name: "Wire", unit: "meter", stdCost: 15 }
  ];

  const interiorItems = [
    { name: "Plywood", unit: "sheet", stdCost: 2500, size: true, thickness: true },
    { name: "Laminate", unit: "sheet", stdCost: 1200 },
    { name: "Paint", unit: "litre", stdCost: 300 },
    { name: "Tiles", unit: "sqft", stdCost: 60 },
    { name: "Lights", unit: "nos", stdCost: 500 },
    { name: "Switch", unit: "nos", stdCost: 150 }
  ];

  const items = type === "construction" ? constructionItems : interiorItems;

  // ================= STATE =================

  const [data, setData] = useState({});

  const update = (name, field, value) => {
    setData((prev) => ({
      ...prev,
      [name]: { ...prev[name], [field]: value }
    }));
  };

  // ================= CALC =================

  const getTotal = (item) => {
    const d = data[item.name] || {};
    const qty = Number(d.qty || 0);
    const cost =
      d.mode === "manual"
        ? Number(d.cost || 0)
        : item.stdCost;

    return qty * cost;
  };

  const grandTotal = items.reduce((sum, item) => {
    return sum + getTotal(item);
  }, 0);

  // ================= UI =================

  return (
    <Card>
      <h3>Material Cost PRO</h3>

      {/* MAIN TAB */}
      <Tabs
        value={type}
        onChange={(val) => {
          setType(val);
          setData({});
        }}
        options={[
          { label: "Construction", value: "construction" },
          { label: "Interior", value: "interior" }
        ]}
      />

      {/* ITEMS */}
      {items.map((item) => {
        const d = data[item.name] || {};

        return (
          <div key={item.name} className="card">
            <h4>{item.name}</h4>

            {/* MODE */}
            <Tabs
              value={d.mode || "standard"}
              onChange={(val) => update(item.name, "mode", val)}
              options={[
                { label: "Std", value: "standard" },
                { label: "Manual", value: "manual" }
              ]}
            />

            {/* QUANTITY */}
            <Input
              label={`Quantity (${item.unit})`}
              value={d.qty || ""}
              onChange={(val) => update(item.name, "qty", val)}
            />

            {/* SIZE */}
            {item.size && (
              <Input
                label="Size (optional)"
                value={d.size || ""}
                onChange={(val) => update(item.name, "size", val)}
              />
            )}

            {/* THICKNESS */}
            {item.thickness && (
              <Input
                label="Thickness (mm)"
                value={d.thickness || ""}
                onChange={(val) => update(item.name, "thickness", val)}
              />
            )}

            {/* COST */}
            {d.mode === "manual" && (
              <Input
                label={`Cost per ${item.unit}`}
                value={d.cost || ""}
                onChange={(val) => update(item.name, "cost", val)}
              />
            )}

            {/* RESULT */}
            <div className="result">
              <p>Total: ₹ {getTotal(item).toFixed(0)}</p>
            </div>
          </div>
        );
      })}

      {/* GRAND TOTAL */}
      <div className="result">
        <h3>Total Cost: ₹ {grandTotal.toFixed(0)}</h3>
      </div>
    </Card>
  );
}
