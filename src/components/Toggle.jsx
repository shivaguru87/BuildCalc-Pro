export default function Toggle({ label, value, onChange }) {
  return (
    <div className="row" style={{ marginTop: 8 }}>
      <span>{label}</span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  );
}