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

  // ================= GROUP BY THICKNESS =================
  const groups = {};

  pieces.forEach((p) => {
    const L = toFeet(p.l);
    const W = toFeet(p.w);
    const qty = Number(p.qty || 0);
    const t = p.t;

    if (!groups[t]) groups[t] = [];

    for (let i = 0; i < qty; i++) {
      if (L > 0 && W > 0) {
        groups[t].push({ l: L, w: W });
      }
    }
  });

  const SHEET_W = 4;
  const SHEET_H = 8;

  // ================= OPTIMIZER =================
  const optimize = (pieces) => {
    let sheets = [];

    pieces = [...pieces].sort((a, b) => b.w - a.w);

    pieces.forEach((piece) => {
      let placed = false;

      for (let sheet of sheets) {
        for (let space of sheet.spaces) {
          if (piece.l <= space.w && piece.w <= space.h) {
            sheet.used.push(piece);

            // split leftover space
            sheet.spaces.push({
              w: space.w - piece.l,
              h: piece.w
            });

            sheet.spaces.push({
              w: space.w,
              h: space.h - piece.w
            });

            sheet.spaces.splice(sheet.spaces.indexOf(space), 1);
            placed = true;
            break;
          }
        }
        if (placed) break;
      }

      if (!placed) {
        sheets.push({
          used: [piece],
          spaces: [
            { w: SHEET_W - piece.l, h: piece.w },
            { w: SHEET_W, h: SHEET_H - piece.w }
          ]
        });
      }
    });

    return sheets;
  };

  // ================= CALC =================
  let totalSheets = 0;
  let totalArea = 0;
  let layoutOutput = [];

  Object.keys(groups).forEach((thickness) => {
    const sheets = optimize(groups[thickness]);

    totalSheets += sheets.length;

    layoutOutput.push({
      thickness,
      sheets
    });

    groups[thickness].forEach(p => {
      totalArea += p.l * p.w;
    });
  });

  const sunmicaSheets = (totalArea * 0.8) / 32;
  const fevicol = totalArea / 100;

  const materialCost =
    totalSheets * 2500 +
    sunmicaSheets * 1200 +
    fevicol * 200;

  const labour = materialCost * 0.35;
  const totalCost = materialCost + labour;

  return (
    <Card>
      <h3>Custom Furniture PRO (Advanced)</h3>

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

      {/* CUT LAYOUT */}
      <div className="result">
        <h4>Cut Layout</h4>

        {layoutOutput.map((group, i) => (
          <div key={i}>
            <p><b>{group.thickness}mm Sheets:</b> {group.sheets.length}</p>

            {group.sheets.map((s, idx) => (
              <p key={idx}>
                Sheet {idx + 1}: {s.used.length} pieces
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* MATERIAL */}
      <div className="result">
        <p>Total Sheets: {totalSheets}</p>
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
