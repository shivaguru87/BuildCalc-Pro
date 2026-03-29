export default function Header({ dark, setDark }) {
  return (
    <div className="header">
      <div>
        <div className="title">BuildCalc Pro</div>
        <div className="sub">Site-ready calculators</div>
      </div>
      <button className="ghost" onClick={() => setDark(!dark)}>
        {dark ? "Light" : "Dark"}
      </button>
    </div>
  );
}