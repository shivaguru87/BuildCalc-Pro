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

  // ================= FLATTEN PIECES =================
  const allPieces = [];

  pieces.forEach((p) => {
    const L = toFeet(p.l);
    const W = toFeet(p.w);
    const qty = Number(p.qty || 0);

    for (let i = 0; i < qty; i++) {
      if (L > 0 && W > 0) {
        allPieces.push({ l: L, w: W });
      }
    }
  });

  // ================= CUT OPTIMIZATION =================
  const SHEET_W = 4;
  const SHEET_H = 8;

  const optimize = () => {
    let sheets = [];
    let currentSheet = [];
    let currentY = 0;
    let rowHeight = 0;
    let currentX = 0;

    const sorted = [...allPieces].sort((a, b) => b.w - a.w);

    sorted.forEach((piece) => {
      if (currentX + piece.l <= SHEET_W) {
        currentSheet.push(piece);
        currentX += piece.l;
        rowHeight = Math.max(rowHeight, piece.w);
      } else {
        currentY += rowHeight;
        currentX = 0;
        rowHeight = 0;

        if (currentY + piece.w <= SHEET_H) {
          currentSheet.push(piece);
          currentX += piece.l;
          rowHeight = piece.w;
        } else {
          sheets.push(currentSheet);
          currentSheet = [piece];
          currentX = piece.l;
          currentY = 0;
          rowHeight = piece.w;
        }
      }
    });

    if (currentSheet.length) sheets.push(currentSheet);

    return sheets;
  };

  const sheets = optimize();

  // ================= AREA =================
  let totalArea = 0;
  allPieces.forEach(p => totalArea += p.l * p.w);

  const usedArea = totalArea;
  const totalSheetArea = sheets.length * 32;
  const waste = totalSheetArea - usedArea;
  const wastePercent = totalSheetArea > 0
    ? (waste / totalSheetArea) * 100
    : 0;

  // ================= COST =================
  const plywoodSheets = sheets.length;
  const sunmicaSheets = (totalArea * 0.8) / 32;
  const fevicol = totalArea / 100;

  const materialCost =
    plywoodSheets * 2500 +
    sunmicaSheets * 1200 +
    fevicol * 200;

  const labour = materialCost * 0.35;
  const totalCost = materialCost + labour;

  return (
    <Card>
      <h3>Custom Furniture PRO (Cut Optimizer)</h3>

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

      {/* PIECES */}
      {pieces.map((p, i) => (
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
        </div>
      ))}

      <button className="primary" onClick={addPiece}>
        + Add Piece
      </button>

      {/* OPTIMIZATION RESULT */}
      <div className="result">
        <h4>Cut Optimization</h4>
        <p>Sheets Required: {sheets.length}</p>
        <p>Waste: {waste.toFixed(2)} sqft ({wastePercent.toFixed(1)}%)</p>
      </div>

      {/* MATERIAL */}
      <div className="result">
        <p>Plywood: {plywoodSheets} sheets</p>
        <p>Sunmica: {sunmicaSheets.toFixed(2)} sheets</p>
        <p>Fevicol: {fevicol.toFixed(2)} kg</p>
      </div>

      {/* COST */}
      <div className="result">
        <p>Material: ₹ {materialCost.toFixed(0)}</p>
        <p>Labour (35%): ₹ {labour.toFixed(0)}</p>
        <h3>Total: ₹ {totalCost.toFixed(0)}</h3>
      </div>
    </Card>
  );
}
