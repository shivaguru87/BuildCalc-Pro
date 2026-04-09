import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

export default function FurnitureEstimator() {
  const [unit, setUnit] = useState("ft");

  const [pieces, setPieces] = useState([
    { l: "", w: "", t: "18", qty: "1" }
  ]);

  const addPiece = () => {
    setPieces([...pieces, { l: "", w: "", t: "18", qty: "1" }]);
  };

  const updatePiece = (i, field, val) => {
    const updated = [...pieces];
    updated[i][field] = val;
    setPieces(updated);
  };

  // ================= UNIT =================
  const toFeet = (val) => {
    const v = Number(val || 0);
    if (unit === "ft") return v;
    if (unit === "inch") return v / 12;
    if (unit === "mm") return v / 304.8;
    return v;
  };

  const SHEET_W = 4;
  const SHEET_H = 8;

  // ================= GLOBAL CUT ENGINE =================
  const simulateGlobalCut = () => {
    let sheets = {
      "6": [],
      "12": [],
      "18": []
    };

    let results = [];

    pieces.forEach((p, index) => {
      const L = toFeet(p.l);
      const W = toFeet(p.w);
      const qty = Number(p.qty || 0);
      const t = p.t;

      if (!sheets[t].length) {
        sheets[t].push({ w: SHEET_W, h: SHEET_H });
      }

      for (let q = 0; q < qty; q++) {
        let placed = false;

        for (let i = 0; i < sheets[t].length; i++) {
          let space = sheets[t][i];

          // allow rotation
          let fitNormal = L <= space.h && W <= space.w;
          let fitRotate = W <= space.h && L <= space.w;

          if (fitNormal || fitRotate) {
            sheets[t].splice(i, 1);

            let cutL = fitNormal ? L : W;
            let cutW = fitNormal ? W : L;

            // RIGHT leftover
            const right = {
              w: space.w - cutW,
              h: cutL
            };

            // BOTTOM leftover
            const bottom = {
              w: space.w,
              h: space.h - cutL
            };

            if (right.w > 0 && right.h > 0) sheets[t].push(right);
            if (bottom.w > 0 && bottom.h > 0) sheets[t].push(bottom);

            placed = true;
            break;
          }
        }

        // ❗ Only create new sheet if no space fits
        if (!placed) {
          sheets[t].push({ w: SHEET_W, h: SHEET_H });
        }
      }

      // 🔥 snapshot after this piece
      const leftoverArea = sheets[t].reduce(
        (sum, s) => sum + s.w * s.h,
        0
      );

      const blocks = sheets[t].map(
        (s) => `${s.w.toFixed(2)} × ${s.h.toFixed(2)}`
      );

      results.push({
        index,
        leftoverArea,
        blocks
      });
    });

    return { results, sheets };
  };

  const { results, sheets } = simulateGlobalCut();

  // ================= FINAL =================
  let totalSheets = 0;

  Object.keys(sheets).forEach((t) => {
    totalSheets += Math.ceil(sheets[t].length / 2); 
    // approx grouping into sheets
  });

  const materialCost = totalSheets * 2500;
  const labour = materialCost * 0.35;
  const totalCost = materialCost + labour;

  return (
    <Card>
      <h3>Custom Furniture PRO (Correct Engine)</h3>

      <Tabs
        value={unit}
        onChange={setUnit}
        options={[
          { label: "ft", value: "ft" },
          { label: "inch", value: "inch" },
          { label: "mm", value: "mm" }
        ]}
      />

      {pieces.map((p, i) => {
        const res = results[i] || {};

        return (
          <div key={i} className="card">
            <h4>Piece {i + 1}</h4>

            <Input label="Length" unit={unit} value={p.l} onChange={(v) => updatePiece(i, "l", v)} />
            <Input label="Width" unit={unit} value={p.w} onChange={(v) => updatePiece(i, "w", v)} />

            <Tabs
              value={p.t}
              onChange={(v) => updatePiece(i, "t", v)}
              options={[
                { label: "6mm", value: "6" },
                { label: "12mm", value: "12" },
                { label: "18mm", value: "18" }
              ]}
            />

            <Input label="Quantity" value={p.qty} onChange={(v) => updatePiece(i, "qty", v)} />

            {/* ✅ LIVE LEFTOVER */}
            <div className="result">
              <p><b>Remaining Area:</b> {res.leftoverArea?.toFixed(2)} sqft</p>

              <p><b>Remaining Pieces:</b></p>
              {res.blocks?.map((b, idx) => (
                <p key={idx}>• {b} ft</p>
              ))}
            </div>
          </div>
        );
      })}

      <button className="primary" onClick={addPiece}>
        + Add Piece
      </button>

      {/* FINAL */}
      <div className="result">
        <p>Estimated Sheets: {totalSheets}</p>
        <p>Material: ₹ {materialCost.toFixed(0)}</p>
        <p>Labour (35%): ₹ {labour.toFixed(0)}</p>
        <h3>Total: ₹ {totalCost.toFixed(0)}</h3>
      </div>
    </Card>
  );
}
