// PCC (1:2:4)
export function pccExact(l, w, t) {
  const wet = l * w * t;         // cft
  const dry = wet * 1.54;        // dry volume factor
  return {
    volume: wet,
    cement: (dry / 7),           // cft (convert to bags outside if needed)
    sand: (dry * 2) / 7,         // cft
    jelly: (dry * 4) / 7         // cft
  };
}
// Thumb rule for ~4 inch (0.333 ft) PCC per sqft
export function pccThumb(area) {
  return {
    cementBags: area * 0.03,
    sandCft: area * 0.09,
    jellyCft: area * 0.18
  };
}

export function volumeCalc(l, w, h) {
  const v = l * w * h;
  return { cft: v, liters: v * 28.3168, brass: v / 100 };
}

export function sandTruck(l, w, h, heapPct) {
  const base = l * w * h;
  const total = base * (1 + (Number(heapPct) || 0) / 100);
  return { cft: total, units: total / 100 };
}

export function brickCalc(l, h, t) {
  const vol = l * h * t;       // wall volume cft
  const bricks = vol * 14.16;  // typical factor
  return { volume: vol, bricks };
}