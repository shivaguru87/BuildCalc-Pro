import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

export default function MaterialCost() {
  const [type, setType] = useState("construction");

  // ================= ITEMS =================

  const constructionItems = [
    { name: "Cement Bag", unit: "bag", stdCost: 400 },
    { name: "Bricks", unit: "nos", stdCost: 8, size: true },
    { name: "Sand", unit: "cft", stdCost: 50 },
    { name: "Steel", unit: "kg", stdCost: 70 },
    { name: "Wire", unit: "meter", stdCost: 15 },

    // ELECTRICAL
    { name: "Switch", unit: "nos", stdCost: 150, typeSelect: ["6A", "16A", "20A"] },
    { name: "Socket", unit: "nos", stdCost: 200, typeSelect: ["6A", "16A", "20A"] },
    { name: "MCB", unit: "nos", stdCost: 400 },
    { name: "Modular Box", unit: "nos", stdCost: 120, size: true },
    { name: "DB Box", unit: "nos", stdCost: 2500, size: true },
    { name: "Junction Box", unit: "nos", stdCost: 100, size: true }
  ];

  const interiorItems = [
    { name: "Plywood", unit: "sheet", stdCost: 2500, size: true, thickness: true },
    { name: "Laminate", unit: "sheet", stdCost: 1200 },
    { name: "Paint", unit: "litre", stdCost: 300 },
    { name: "Tiles", unit: "sqft", stdCost: 60 },

    { name: "LED Strip", unit: "meter", stdCost: 120 },
    { name: "POP", unit: "sqft", stdCost: 80, size: true },
    { name: "False Ceiling", unit: "sqft", stdCost: 120, size: true }
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

  const getQty = (item, d) => {
    // If dimensions provided → calculate area
    if (d.l && d.w) {
      return Number(d.l) * Number(d.w);
    }
    return Number(d.qty || 0);
  };

  const getTotal = (item) => {
    const d = data[item.name] || {};

    const qty = getQty(item, d);

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

            {/* TYPE SELECT */}
            {item.typeSelect && (
              <Tabs
                value={d.subType || item.typeSelect[0]}
                onChange={(val) => update(item.name, "subType", val)}
                options={item.typeSelect.map((t) => ({
                  label: t,
                  value: t
                }))}
              />
            )}

            {/* QUANTITY */}
            <Input
              label={`Quantity (${item.unit})`}
              value={d.qty || ""}
              onChange={(val) => update(item.name, "qty", val)}
            />

            {/* SIZE INPUTS */}
            {item.size && (
              <>
                <Input
                  label="Length"
                  value={d.l || ""}
                  onChange={(val) => update(item.name, "l", val)}
                />
                <Input
                  label="Width"
                  value={d.w || ""}
                  onChange={(val) => update(item.name, "w", val)}
                />
                <Input
                  label="Height"
                  value={d.h || ""}
                  onChange={(val) => update(item.name, "h", val)}
                />
              </>
            )}

            {/* THICKNESS */}
            {item.thickness && (
              <Input
                label="Thickness (mm)"
                value={d.t || ""}
                onChange={(val) => update(item.name, "t", val)}
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
