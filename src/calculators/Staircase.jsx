import { useState, useMemo } from "react";
import Card from "../components/Card";
import Input from "../components/Input";

export default function Staircase() {
  const [type, setType] = useState("straight");

  // Default realistic values (kept same)
  const [L, setL] = useState("12");
  const [W, setW] = useState("7.5");
  const [H, setH] = useState("10");

  // ✅ Decimal-safe handler
  const handleDecimal = (val, setter) => {
    if (/^\d*\.?\d*$/.test(val)) {
      setter(val);
    }
  };

  const calc = useMemo(() => {
    const length = parseFloat(L);
    const width = parseFloat(W);
    const height = parseFloat(H);

    if (length <= 0 || width <= 0 || height <= 0) return null;

    const heightInch = height * 12;

    const idealRise = 6.5;
    const steps = Math.max(1, Math.round(heightInch / idealRise));
    const actualRise = heightInch / steps;

    let tread = 24 - 2 * actualRise;
    if (tread < 9) tread = 9;
    if (tread > 12) tread = 12;

    const treadFt = tread / 12;

    // Straight
    const totalRunStraight = steps * treadFt;

    // Dog leg
    const stepsPerFlight = Math.ceil(steps / 2);
    const runPerFlight = stepsPerFlight * treadFt;
    const landing = Math.max(3, width);
    const totalDogLength = runPerFlight + landing;

    // Open well
    const gap = width * 0.3;
    const flightWidth = (width - gap) / 2;

    // Spiral
    const diameter = Math.min(length, width);
    const radius = diameter / 2;

    const angle = Math.atan(actualRise / tread) * (180 / Math.PI);

    return {
      steps,
      actualRise,
      tread,
      treadFt,
      totalRunStraight,
      stepsPerFlight,
      runPerFlight,
      landing,
      totalDogLength,
      gap,
      flightWidth,
      diameter,
      radius,
      angle,
    };
  }, [L, W, H]);

  return (
    <Card>
      {/* ================= TABS ================= */}
      <div className="tabs">
        {["straight", "dog", "open", "spiral"].map((t) => (
          <button
            key={t}
            className={type === t ? "tab active" : "tab"}
            onClick={() => setType(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ================= INPUTS ================= */}
      <Input
        label="Total Length"
        unit="ft"
        value={L}
        onChange={(v) => handleDecimal(v, setL)}
        hint="Available horizontal space"
      />

      <Input
        label="Total Width"
        unit="ft"
        value={W}
        onChange={(v) => handleDecimal(v, setW)}
        hint="Staircase width"
      />

      <Input
        label="Floor Height"
        unit="ft"
        value={H}
        onChange={(v) => handleDecimal(v, setH)}
        hint="Floor to floor height"
      />

      <hr />

      {/* ================= VALIDATION ================= */}
      {!calc && (
        <p style={{ color: "red" }}>Enter valid dimensions</p>
      )}

      {/* ================= STRAIGHT ================= */}
      {calc && type === "straight" && (
        <>
          <h4>Straight Stair</h4>
          <p>Steps: {calc.steps}</p>
          <p>Rise: {calc.actualRise.toFixed(2)} inch</p>
          <p>Tread: {calc.tread.toFixed(2)} inch</p>
          <p>Total Run: {calc.totalRunStraight.toFixed(2)} ft</p>
          <p>Angle: {calc.angle.toFixed(1)}°</p>

          {calc.totalRunStraight > parseFloat(L) && (
            <p style={{ color: "red" }}>
              ❌ Not fitting → Use Dog Leg Stair
            </p>
          )}
        </>
      )}

      {/* ================= DOG LEG ================= */}
      {calc && type === "dog" && (
        <>
          <h4>Dog Leg Stair</h4>

          <p>Total Steps: {calc.steps}</p>
          <p>Steps / Flight: {calc.stepsPerFlight}</p>
          <p>Landing: {calc.landing.toFixed(2)} ft</p>

          <p>Run / Flight: {calc.runPerFlight.toFixed(2)} ft</p>
          <p>Total Length Used: {calc.totalDogLength.toFixed(2)} ft</p>

          {calc.totalDogLength > parseFloat(L) && (
            <p style={{ color: "red" }}>
              ❌ Not fitting → Adjust space or design
            </p>
          )}
        </>
      )}

      {/* ================= OPEN WELL ================= */}
      {calc && type === "open" && (
        <>
          <h4>Open Well Stair</h4>

          <p>Steps: {calc.steps}</p>
          <p>Central Gap: {calc.gap.toFixed(2)} ft</p>
          <p>Flight Width: {calc.flightWidth.toFixed(2)} ft</p>

          <p>Rise: {calc.actualRise.toFixed(2)} inch</p>
          <p>Tread: {calc.tread.toFixed(2)} inch</p>
        </>
      )}

      {/* ================= SPIRAL ================= */}
      {calc && type === "spiral" && (
        <>
          <h4>Spiral Stair</h4>

          <p>Diameter: {calc.diameter.toFixed(2)} ft</p>
          <p>Radius: {calc.radius.toFixed(2)} ft</p>

          <p>Steps: {calc.steps}</p>
          <p>Rise: {calc.actualRise.toFixed(2)} inch</p>
          <p>Angle: {calc.angle.toFixed(1)}°</p>
        </>
      )}
    </Card>
  );
}
