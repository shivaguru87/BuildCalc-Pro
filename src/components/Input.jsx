export default function Input({ label, unit, value, onChange, hint }) {
  const handleChange = (e) => {
    const val = e.target.value;

    // allow numbers + decimal typing
    if (/^\d*\.?\d*$/.test(val)) {
      // keep original behavior (number output)
      onChange(val === "" ? 0 : Number(val));
    }
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 13, marginBottom: 4 }}>
        {label} {unit && <span style={{ opacity: 0.6 }}>({unit})</span>}
      </div>

      <input
        type="text"
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
        <div style={{ fontSize: 11, color: "#666", opacity: 1 }}>
          {hint}
        </div>
      )}
    </div>
  );
}
