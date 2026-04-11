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

  // ✅ NEW: REMOVE PIECE
  const removePiece = (index) => {
    if (pieces.length === 1) return; // prevent removing last
    const updated = pieces.filter((_, i) => i !== index);
    setPieces(updated);
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
    const inch = (x) => Math.round(x * 12);
    return `${l}' (${inch(l)}") × ${w}' (${inch(w)}")`;
  };

  // ================= SMART CUT ENGINE =================
  const simulate = () => {
    let sheetsByThickness = {};

    THICKNESS.forEach(t => {
      sheetsByThickness[t.value] = [];
    });

    const SHEET = SHEET_SIZES[sheetType];

    const tryPlace = (spaces, L, W) => {
      let bestIndex = -1;
      let bestScore = Infinity;
      let bestFit = null;

      spaces.forEach((s, i) => {
        let fits = [];

        if (L <= s.h && W <= s.w) fits.push({ l: L, w: W });
        if (W <= s.h && L <= s.w) fits.push({ l: W, w: L });

        fits.forEach(f => {
          let waste = (s.w * s.h) - (f.l * f.w);
          if (waste < bestScore) {
            bestScore = waste;
            bestIndex = i;
            bestFit = f;
          }
        });
      });

      if (bestIndex === -1) return null;

      let space = spaces[bestIndex];
      spaces.splice(bestIndex, 1);

      const bottom = {
        w: space.w,
        h: space.h - bestFit.l
      };

      const right = {
        w: space.w - bestFit.w,
        h: bestFit.l
      };

      if (bottom.w > 0 && bottom.h > 0) spaces.push(bottom);
      if (right.w > 0 && right.h > 0) spaces.push(right);

      return true;
    };

    // ================= PROCESS =================
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

        for (let sheet of sheetsByThickness[t]) {
          if (tryPlace(sheet.spaces, L, W)) {
            placed = true;
            break;
          }
        }

        if (!placed) {
          let newSheet = {
            spaces: [{ w: SHEET.w, h: SHEET.h }]
          };

          tryPlace(newSheet.spaces, L, W);
          sheetsByThickness[t].push(newSheet);
        }
      }
    });

    // ================= FINAL =================
    let totalSheets = 0;
    let finalArea = 0;
    let finalSheets = [];

    Object.keys(sheetsByThickness).forEach((t) => {
      sheetsByThickness[t].forEach((sheet) => {
        totalSheets++;

        let blocks = sheet.spaces.map((s) => {
          finalArea += s.w * s.h;
          return format(s.h, s.w);
        });

        finalSheets.push({
          thickness: t,
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
      <h3>Custom Furniture PRO (Smart Engine)</h3>

      <Tabs value={unit} onChange={setUnit}
        options={[
          { label: "ft", value: "ft" },
          { label: "inch", value: "inch" },
          { label: "mm", value: "mm" }
        ]}
      />

      <Tabs value={sheetType} onChange={setSheetType}
        options={[
          { label: "8 × 4", value: "8x4" },
          { label: "7 × 4", value: "7x4" },
          { label: "6 × 4", value: "6x4" },
          { label: "8 × 3", value: "8x3" },
          { label: "6 × 3", value: "6x3" },
          { label: "5 × 5", value: "5x5" }
        ]}
      />

      {pieces.map((p, i) => (
        <div key={i} className="card">
          <h4>Piece {i + 1}</h4>

          <Input label="Length" unit={unit}
            value={p.l}
            onChange={(v) => updatePiece(i, "l", v)} />

          <Input label="Width" unit={unit}
            value={p.w}
            onChange={(v) => updatePiece(i, "w", v)} />

          <Tabs value={p.t}
            onChange={(v) => updatePiece(i, "t", v)}
            options={THICKNESS}
          />

          <Input label="Quantity"
            value={p.qty}
            onChange={(v) => updatePiece(i, "qty", v)} />

          {/* ✅ REMOVE BUTTON */}
          {pieces.length > 1 && (
            <button
              className="danger"
              onClick={() => removePiece(i)}
            >
              Remove Piece
            </button>
          )}
        </div>
      ))}

      <button className="primary" onClick={addPiece}>
        + Add Piece
      </button>

      <div className="result">
        <h4>Sheet-wise Leftover</h4>

        {finalSheets.map((s, i) => (
          <div key={i}>
            <p><b>Sheet {i + 1} ({s.thickness}mm)</b></p>
            {s.blocks.map((b, idx) => (
              <p key={idx}>• {b}</p>
            ))}
          </div>
        ))}

        <p><b>Total Leftover:</b> {finalArea.toFixed(2)} sqft</p>
      </div>

      <div className="result">
        <p>Estimated Sheets: {totalSheets}</p>
        <p>Material: ₹ {materialCost.toFixed(0)}</p>
        <p>Labour (35%): ₹ {labour.toFixed(0)}</p>
        <h3>Total: ₹ {totalCost.toFixed(0)}</h3>
      </div>
    </Card>
  );
}
