import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

export default function MaterialCost() {
  const [type, setType] = useState("construction");

  // ================= ITEMS =================

  const constructionItems = [
    { name: "Cement Bag", unit: "bag", stdCost: 400 },

    {
      name: "Bricks",
      unit: "nos",
      stdCost: 8,
      sizes: ["9x4x3", "8x4x3"]
    },

    { name: "Sand", unit: "cft", stdCost: 50 },
    { name: "Steel", unit: "kg", stdCost: 70 },
    { name: "Wire", unit: "meter", stdCost: 15 },

    {
      name: "Switch",
      unit: "nos",
      stdCost: 150,
      sizes: ["6A", "16A", "20A"]
    },

    {
      name: "Socket",
      unit: "nos",
      stdCost: 200,
      sizes: ["6A", "16A", "20A"]
    },

    {
      name: "MCB",
      unit: "nos",
      stdCost: 400,
      sizes: ["6A", "10A", "16A", "20A", "32A", "40A", "63A"],
      types: ["SP", "DP", "TP", "TPN"],
      typePrice: {
        SP: 1,
        DP: 1.8,
        TP: 2.8,
        TPN: 3.5
      },
      typeHint: {
        SP: "Used for lights & small loads (single phase)",
        DP: "Cuts phase + neutral (main supply safety)",
        TP: "Used in 3-phase motors",
        TPN: "Main distribution for building (3-phase + neutral)"
      }
    },

    {
      name: "Modular Box",
      unit: "nos",
      stdCost: 120,
      sizes: ["2M", "4M", "6M", "8M"]
    },

    {
      name: "DB Box",
      unit: "nos",
      stdCost: 2500,
      sizes: ["4 Way", "8 Way", "12 Way"]
    },

    {
      name: "Junction Box",
      unit: "nos",
      stdCost: 100,
      sizes: ["4x4", "6x6"]
    }
  ];

  const interiorItems = [
    {
      name: "Plywood",
      unit: "sheet",
      stdCost: 2500,
      sizes: ["8x4", "6x4"],
      thickness: ["6mm", "12mm", "18mm"]
    },

    {
      name: "Laminate",
      unit: "sheet",
      stdCost: 1200,
      sizes: ["8x4"]
    },

    { name: "Paint", unit: "litre", stdCost: 300 },

    { name: "Tiles", unit: "sqft", stdCost: 60 },

    { name: "LED Strip", unit: "meter", stdCost: 120 },

    {
      name: "POP",
      unit: "sqft",
      stdCost: 80,
      sizes: ["Ceiling", "Wall"]
    },

    {
      name: "False Ceiling",
      unit: "sqft",
      stdCost: 120,
      sizes: ["Gypsum", "Grid"]
    }
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

    let cost =
      d.mode === "manual"
        ? Number(d.cost || 0)
        : item.stdCost;

    if (item.typePrice && d.type) {
      cost = cost * item.typePrice[d.type];
    }

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

            {/* SIZE */}
            {item.sizes && (
              <Tabs
                value={d.size || item.sizes[0]}
                onChange={(val) => update(item.name, "size", val)}
                options={item.sizes.map((s) => ({
                  label: s,
                  value: s
                }))}
              />
            )}

            {/* THICKNESS */}
            {item.thickness && (
              <Tabs
                value={d.thickness || item.thickness[0]}
                onChange={(val) => update(item.name, "thickness", val)}
                options={item.thickness.map((t) => ({
                  label: t,
                  value: t
                }))}
              />
            )}

            {/* TYPE + HINT */}
            {item.types && (
              <>
                <Tabs
                  value={d.type || item.types[0]}
                  onChange={(val) => update(item.name, "type", val)}
                  options={item.types.map((t) => ({
                    label: t,
                    value: t
                  }))}
                />

                <div className="hint">
                  {item.typeHint?.[d.type || item.types[0]]}
                </div>
              </>
            )}

            {/* QUANTITY */}
            <Input
              label={`Quantity (${item.unit})`}
              value={d.qty || ""}
              onChange={(val) => update(item.name, "qty", val)}
            />

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
