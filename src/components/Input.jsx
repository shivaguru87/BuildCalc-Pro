export default function Input({
  label,
  unit,
  value,
  onChange,
  hint
}) {
  const handleChange = (e) => {
    const val = e.target.value;

    // ✅ Allow decimal typing
    if (/^\d*\.?\d*$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className="input-group">
      <label>{label} ({unit})</label>

      <input
        type="text"                 // ✅ IMPORTANT (not number)
        inputMode="decimal"         // mobile keyboard support
        value={value}
        onChange={handleChange}
        placeholder={`Enter ${label}`}
      />

      {hint && <small>{hint}</small>}
    </div>
  );
}
