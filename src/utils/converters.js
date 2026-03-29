export function toFeet(value, unit) {
  const v = Number(value) || 0;
  if (unit === "ft") return v;
  if (unit === "m") return v * 3.28084;
  if (unit === "mm") return v / 304.8;
  return v;
}
export function cftToLiters(cft) {
  return cft * 28.3168;
}