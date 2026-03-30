export default function Input({ label, unit, value, onChange, hint }) {
  const handleChange = (e) => {
    const val = e.target.value;

    // ✅ allow decimals like 7.5
    if (/^\d*\.?\d*$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 13, marginBottom: 4 }}>
        {label} {unit && <span style={{ opacity: 0.6 }}>({unit})</span>}
      </div>

      <input
        type="text"              // ✅ important change
        inputMode="decimal"      // ✅ mobile support
        value={value}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ccc"
        }}
      />

      {hint && (
        <div style={{ fontSize: 11, opacity: 0.6 }}>
          {hint}
        </div>
      )}
    </div>
  );
}
