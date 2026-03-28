import { useState } from "react";

export default function App() {
  const [tab, setTab] = useState("volume");

  // Common Inputs
  const [l, setL] = useState(0);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [area, setArea] = useState(0);
  const [heap, setHeap] = useState(10);
  const [radius, setRadius] = useState(0);

  // Volume
  const volume = l * w * h;
  const liters = volume * 28.3168;
  const brass = volume / 100;

  // PCC (thumb)
  const cement = area * 0.03;
  const sand = area * 0.16;
  const jelly = area * 0.31;

  // Truck
  const heapVol = volume * (1 + heap / 100);

  // Area
  const rectArea = l * w;
  const circleArea = 3.1416 * radius * radius;

  // Brickwork
  const brickVol = l * w * h;
  const bricks = brickVol * 14.16;

  return (
    <div style={{ padding: 16, maxWidth: 420, margin: "auto", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>BuildCalc Pro</h2>

      {/* Tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
        <button onClick={() => setTab("volume")}>Volume</button>
        <button onClick={() => setTab("pcc")}>PCC</button>
        <button onClick={() => setTab("truck")}>Truck</button>
        <button onClick={() => setTab("area")}>Area</button>
        <button onClick={() => setTab("brick")}>Brick</button>
      </div>

      {/* Volume */}
      {tab === "volume" && (
        <div>
          <input placeholder="Length ft" onChange={e => setL(+e.target.value)} />
          <input placeholder="Width ft" onChange={e => setW(+e.target.value)} />
          <input placeholder="Height ft" onChange={e => setH(+e.target.value)} />

          <p>Volume: {volume.toFixed(2)} cft</p>
          <p>Liters: {liters.toFixed(0)}</p>
          <p>Brass: {brass.toFixed(2)}</p>
        </div>
      )}

      {/* PCC */}
      {tab === "pcc" && (
        <div>
          <input placeholder="Area sq.ft" onChange={e => setArea(+e.target.value)} />

          <p>Cement: {cement.toFixed(2)} bags</p>
          <p>Sand: {sand.toFixed(2)} cft</p>
          <p>Jelly: {jelly.toFixed(2)} cft</p>
        </div>
      )}

      {/* Truck */}
      {tab === "truck" && (
        <div>
          <input placeholder="Length" onChange={e => setL(+e.target.value)} />
          <input placeholder="Width" onChange={e => setW(+e.target.value)} />
          <input placeholder="Height" onChange={e => setH(+e.target.value)} />
          <input placeholder="Heap %" onChange={e => setHeap(+e.target.value)} />

          <p>Total cft: {heapVol.toFixed(2)}</p>
          <p>Units: {(heapVol/100).toFixed(2)}</p>
        </div>
      )}

      {/* Area */}
      {tab === "area" && (
        <div>
          <input placeholder="Length" onChange={e => setL(+e.target.value)} />
          <input placeholder="Width" onChange={e => setW(+e.target.value)} />
          <input placeholder="Radius (circle)" onChange={e => setRadius(+e.target.value)} />

          <p>Rectangle: {rectArea.toFixed(2)} sq.ft</p>
          <p>Circle: {circleArea.toFixed(2)} sq.ft</p>
        </div>
      )}

      {/* Brick */}
      {tab === "brick" && (
        <div>
          <input placeholder="Length" onChange={e => setL(+e.target.value)} />
          <input placeholder="Height" onChange={e => setW(+e.target.value)} />
          <input placeholder="Thickness" onChange={e => setH(+e.target.value)} />

          <p>Volume: {brickVol.toFixed(2)} cft</p>
          <p>Bricks: {bricks.toFixed(0)}</p>
        </div>
      )}

      <p style={{ fontSize: 12, textAlign: "center", marginTop: 10 }}>
        Simple + Powerful Construction Tool
      </p>
    </div>
  );
}
