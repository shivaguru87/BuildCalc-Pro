export default function Input({ label, value, onChange }) {
  return (
    <input
      placeholder={label}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
    />
  );
}
