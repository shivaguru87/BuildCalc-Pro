export default function Input({ label, unit, value, onChange, hint }) {
  const handleChange = (e) => {
    const val = e.target.value;

    // ✅ allow typing decimal (7.5 etc.)
    if (/^\d*\.?\d*$/.test(val)) {
      // ✅ if empty, send 0 (same as your original behavior)
      if (val === "") {
        onChange(0);
      } else {
        onChange(parseFloat(val));
      }
    }
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 13, marginBottom: 4 }}>
        {label} {unit && <span style={{ opacity: 0.6 }}>({unit})</span>}
      </div>

      <input
        type="text"               // allow decimal typing
        inputMode="decimal"
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
        <div style={{ fontSize: 11, opacity: 0.7, color: "#555" }}>
          {hint}
        </div>
      )}
    </div>
  );
}
