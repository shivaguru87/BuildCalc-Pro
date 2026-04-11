import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

// ================= SHEET SIZES =================
const SHEET_SIZES = {
  "8x4": { h: 8, w: 4 },
  "7x4": { h: 7, w: 4 },
  "6x4": { h: 6, w: 4 },
  "8x3": { h: 8, w: 3 },
  "6x3": { h: 6, w: 3 },
  "5x5": { h: 5, w: 5 }
};

// ================= THICKNESS =================
const THICKNESS = [
  { label: "4mm", value: "4" },
  { label: "6mm", value: "6" },
  { label: "9mm", value: "9" },
  { label: "12mm", value: "12" },
  { label: "15mm", value: "15" },
  { label: "18mm", value: "18" },
  { label: "25mm", value: "25" }
];

export default function FurnitureEstimator() {
  const [unit, setUnit] = useState("ft");
  const [sheetType, setSheetType] = useState("8x4");

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

  const format = (l, w) => {
    const toInch = (ft) => Math.round(ft * 12);
    return `${l}' (${toInch(l)}") × ${w}' (${toInch(w)}")`;
  };

  // ================= CUT ENGINE =================
  const simulate = () => {
    let sheetsByThickness = {};

    THICKNESS.forEach(t => {
      sheetsByThickness[t.value] = [];
    });

    const SHEET = SHEET_SIZES[sheetType];

    pieces.forEach((p) => {
      const L = toFeet(p.l);
      const W = toFeet(p.w);
      const qty = Number(p.qty || 0);
      const t = p.t;

      if (!sheetsByThickness[t].length) {
        sheetsByThickness[t].push({
          spaces: [{ w: SHEET.w, h: SHEET.h }]
        });
      }

      for (let q = 0; q < qty; q++) {
        let placed = false;

        for (let s = 0; s < sheetsByThickness[t].length; s++) {
          let sheet = sheetsByThickness[t][s];

          for (let i = 0; i < sheet.spaces.length; i++) {
            let space = sheet.spaces[i];

            let fitNormal = L <= space.h && W <= space.w;
            let fitRotate = W <= space.h && L <= space.w;

            if (fitNormal || fitRotate) {
              sheet.spaces.splice(i, 1);

              let cutL = fitNormal ? L : W;
              let cutW = fitNormal ? W : L;

              // LENGTH-FIRST CUT (IMPORTANT)
              const bottom = {
                w: space.w,
                h: space.h - cutL
              };

              const right = {
                w: space.w - cutW,
                h: cutL
              };

              if (bottom.w > 0 && bottom.h > 0) sheet.spaces.push(bottom);
              if (right.w > 0 && right.h > 0) sheet.spaces.push(right);

              placed = true;
              break;
            }
          }

          if (placed) break;
        }

        // NEW SHEET
        if (!placed) {
          let newSheet = {
            spaces: []
          };

          let base = { w: SHEET.w, h: SHEET.h };

          let cutL = L;
          let cutW = W;

          const bottom = {
            w: base.w,
            h: base.h - cutL
          };

          const right = {
            w: base.w - cutW,
            h: cutL
          };

          if (bottom.w > 0 && bottom.h > 0) newSheet.spaces.push(bottom);
          if (right.w > 0 && right.h > 0) newSheet.spaces.push(right);

          sheetsByThickness[t].push(newSheet);
        }
      }
    });

    // ================= FINAL =================
    let totalSheets = 0;
    let finalArea = 0;
    let finalSheets = [];

    Object.keys(sheetsByThickness).forEach((t) => {
      sheetsByThickness[t].forEach((sheet, index) => {
        totalSheets++;

        const blocks = sheet.spaces.map((s) => {
          finalArea += s.w * s.h;
          return format(s.h, s.w);
        });

        finalSheets.push({
          thickness: t,
          sheetNo: totalSheets,
          blocks
        });
      });
    });

    return { totalSheets, finalArea, finalSheets };
  };

  const { totalSheets, finalArea, finalSheets } = simulate();

  // ================= COST =================
  const materialCost = totalSheets * 2500;
  const labour = materialCost * 0.35;
  const totalCost = materialCost + labour;

  return (
    <Card>
      <h3>Custom Furniture PRO (Final Engine)</h3>

      {/* UNIT */}
      <Tabs
        value={unit}
        onChange={setUnit}
        options={[
          { label: "ft", value: "ft" },
          { label: "inch", value: "inch" },
          { label: "mm", value: "mm" }
        ]}
      />

      {/* SHEET SIZE */}
      <Tabs
        value={sheetType}
        onChange={setSheetType}
        options={[
          { label: "8 × 4", value: "8x4" },
          { label: "7 × 4", value: "7x4" },
          { label: "6 × 4", value: "6x4" },
          { label: "8 × 3", value: "8x3" },
          { label: "6 × 3", value: "6x3" },
          { label: "5 × 5", value: "5x5" }
        ]}
      />

      {/* PIECES */}
      {pieces.map((p, i) => (
        <div key={i} className="card">
          <h4>Piece {i + 1}</h4>

          <Input label="Length" unit={unit} value={p.l}
            onChange={(v) => updatePiece(i, "l", v)} />

          <Input label="Width" unit={unit} value={p.w}
            onChange={(v) => updatePiece(i, "w", v)} />

          <Tabs
            value={p.t}
            onChange={(v) => updatePiece(i, "t", v)}
            options={THICKNESS}
          />

          <Input label="Quantity" value={p.qty}
            onChange={(v) => updatePiece(i, "qty", v)} />
        </div>
      ))}

      <button className="primary" onClick={addPiece}>
        + Add Piece
      </button>

      {/* FINAL RESULT */}
      <div className="result">
        <h4>Sheet-wise Leftover</h4>

        {finalSheets.map((s, i) => (
          <div key={i}>
            <p><b>Sheet {s.sheetNo} ({s.thickness}mm)</b></p>
            {s.blocks.map((b, idx) => (
              <p key={idx}>• {b}</p>
            ))}
          </div>
        ))}

        <p><b>Total Leftover:</b> {finalArea.toFixed(2)} sqft</p>
      </div>

      {/* COST */}
      <div className="result">
        <p>Estimated Sheets: {totalSheets}</p>
        <p>Material: ₹ {materialCost.toFixed(0)}</p>
        <p>Labour (35%): ₹ {labour.toFixed(0)}</p>
        <h3>Total: ₹ {totalCost.toFixed(0)}</h3>
      </div>
    </Card>
  );
}
