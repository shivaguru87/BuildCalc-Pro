import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Tabs from "../components/Tabs";

const DEFAULT_RATES = {
  ply18: 2500,
  ply12: 1800,
  ply6: 1200
};

// ================= CUT ENGINE =================
const SHEET = { w: 4, h: 8 };

const runCutEngine = (pieces) => {
  let sheetsByT = {};

  const tryPlace = (spaces, L, W) => {
    for (let i = 0; i < spaces.length; i++) {
      let s = spaces[i];

      let fitNormal = L <= s.h && W <= s.w;
      let fitRotate = W <= s.h && L <= s.w;

      if (fitNormal || fitRotate) {
        spaces.splice(i, 1);

        let cutL = fitNormal ? L : W;
        let cutW = fitNormal ? W : L;

        const bottom = { w: s.w, h: s.h - cutL };
        const right = { w: s.w - cutW, h: cutL };

        if (bottom.w > 0 && bottom.h > 0) spaces.push(bottom);
        if (right.w > 0 && right.h > 0) spaces.push(right);

        return true;
      }
    }
    return false;
  };

  pieces.forEach((p) => {
    if (!sheetsByT[p.t]) sheetsByT[p.t] = [];

    for (let i = 0; i < p.qty; i++) {
      let placed = false;

      for (let sheet of sheetsByT[p.t]) {
        if (tryPlace(sheet.spaces, p.l, p.w)) {
          placed = true;
          break;
        }
      }

      if (!placed) {
        let newSheet = { spaces: [{ w: SHEET.w, h: SHEET.h }] };
        tryPlace(newSheet.spaces, p.l, p.w);
        sheetsByT[p.t].push(newSheet);
      }
    }
  });

  return sheetsByT;
};

export default function FurniturePro() {
  const [unit, setUnit] = useState("ft");

  const [dims, setDims] = useState({
    L: 6,
    W: 2,
    H: 7
  });

  const [layout, setLayout] = useState({
    hangingHeight: 3.5,
    hangingFrom: "top",
    drawerHeight: 0.5,
    drawerCount: 2,
    drawerFrom: "bottom",
    shelfCount: 3,
    skirting: 0.25
  });

  // ================= UNIT =================
  const toFeet = (v) => {
    if (unit === "ft") return Number(v);
    if (unit === "inch") return Number(v) / 12;
    if (unit === "mm") return Number(v) / 304.8;
  };

  const L = toFeet(dims.L);
  const D = toFeet(dims.W);
  const H = toFeet(dims.H);

  // ================= POSITION LOGIC =================
  const drawerTotal = layout.drawerHeight * layout.drawerCount;

  let topUsed = 0;
  let bottomUsed = 0;

  if (layout.hangingFrom === "top") {
    topUsed += layout.hangingHeight;
  } else {
    bottomUsed += layout.hangingHeight;
  }

  if (layout.drawerFrom === "bottom") {
    bottomUsed += drawerTotal;
  } else {
    topUsed += drawerTotal;
  }

  bottomUsed += layout.skirting;

  const remainingHeight = H - (topUsed + bottomUsed);

  const shelfGap =
    layout.shelfCount > 0
      ? remainingHeight / (layout.shelfCount + 1)
      : 0;

  // ================= CUT LIST =================
  const pieces = [
    { l: H, w: D, t: "18", qty: 2 },
    { l: L, w: D, t: "18", qty: 2 },
    { l: L, w: D, t: "18", qty: layout.shelfCount },
    { l: L, w: D / 2, t: "12", qty: layout.drawerCount },
    { l: L, w: H, t: "6", qty: 1 }
  ];

  const result = runCutEngine(pieces);

  const sheets18 = result["18"]?.length || 0;
  const sheets12 = result["12"]?.length || 0;
  const sheets6 = result["6"]?.length || 0;

  let waste = 0;
  Object.values(result).forEach((sheets) =>
    sheets.forEach((sheet) =>
      sheet.spaces.forEach((s) => {
        waste += s.w * s.h;
      })
    )
  );

  const totalCost =
    sheets18 * DEFAULT_RATES.ply18 +
    sheets12 * DEFAULT_RATES.ply12 +
    sheets6 * DEFAULT_RATES.ply6;

  return (
    <Card>
      <h2>Furniture PRO</h2>

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

      {/* DIMENSIONS */}
      <Input label="Length" value={dims.L}
        onChange={(v) => setDims({ ...dims, L: v })} />
      <Input label="Depth" value={dims.W}
        onChange={(v) => setDims({ ...dims, W: v })} />
      <Input label="Height" value={dims.H}
        onChange={(v) => setDims({ ...dims, H: v })} />

      {/* HANGING */}
      <h4>Clothing Hanging</h4>
      <Input label="Height (ft)"
        value={layout.hangingHeight}
        onChange={(v) =>
          setLayout({ ...layout, hangingHeight: Number(v) })
        } />

      <Tabs
        value={layout.hangingFrom}
        onChange={(v) =>
          setLayout({ ...layout, hangingFrom: v })
        }
        options={[
          { label: "Top", value: "top" },
          { label: "Bottom", value: "bottom" }
        ]}
      />

      {/* DRAWERS */}
      <h4>Drawers</h4>
      <Input label="Drawer Count"
        value={layout.drawerCount}
        onChange={(v) =>
          setLayout({ ...layout, drawerCount: Number(v) })
        } />

      <Input label="Drawer Height (ft)"
        value={layout.drawerHeight}
        onChange={(v) =>
          setLayout({ ...layout, drawerHeight: Number(v) })
        } />

      <Tabs
        value={layout.drawerFrom}
        onChange={(v) =>
          setLayout({ ...layout, drawerFrom: v })
        }
        options={[
          { label: "Bottom", value: "bottom" },
          { label: "Top", value: "top" }
        ]}
      />

      {/* SKIRTING */}
      <h4>Skirting</h4>
      <Input label="Skirting Height (ft)"
        value={layout.skirting}
        onChange={(v) =>
          setLayout({ ...layout, skirting: Number(v) })
        } />

      {/* SHELVES */}
      <h4>Shelves</h4>
      <Input label="Shelf Count"
        value={layout.shelfCount}
        onChange={(v) =>
          setLayout({ ...layout, shelfCount: Number(v) })
        } />

      {/* RESULT */}
      <div className="result">
        <h4>Layout Result</h4>
        <p>Remaining Height: {remainingHeight.toFixed(2)} ft</p>
        <p>Shelf Gap: {shelfGap.toFixed(2)} ft</p>

        <h4>Material</h4>
        <p>18mm Ply: {sheets18}</p>
        <p>12mm Ply: {sheets12}</p>
        <p>6mm Ply: {sheets6}</p>

        <h4>Sheet-wise Leftover</h4>
        {Object.keys(result).map((t) => (
          <div key={t}>
            <b>{t}mm</b>
            {result[t].map((sheet, i) => (
              <div key={i}>
                Sheet {i + 1}
                {sheet.spaces.map((s, idx) => (
                  <p key={idx}>• {s.h.toFixed(2)} × {s.w.toFixed(2)}</p>
                ))}
              </div>
            ))}
          </div>
        ))}

        <p>Waste: {waste.toFixed(2)} sqft</p>

        <h3>Total: ₹ {totalCost.toFixed(0)}</h3>
      </div>
    </Card>
  );
}
