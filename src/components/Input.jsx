export default function Input({ label, onChange }) {
  return (
    <input
      type="number"
      placeholder={label}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}
