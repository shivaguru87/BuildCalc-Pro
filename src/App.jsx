import { useState } from "react";
import Header from "./components/Header";
import Home from "./calculators/Home";
import PCC from "./calculators/PCC";
import Volume from "./calculators/Volume";
import Sand from "./calculators/SandTruck";
import Brick from "./calculators/Brick";
import "./styles.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark container" : "container"}>
      <Header dark={dark} setDark={setDark} />

      {page === "home" && <Home setPage={setPage} />}
      {page === "pcc" && <PCC />}
      {page === "volume" && <Volume />}
      {page === "sand" && <Sand />}
      {page === "brick" && <Brick />}

      {page !== "home" && (
        <button className="ghost" onClick={() => setPage("home")}>
          ? Back
        </button>
      )}

      <div className="footer">
        Professional Construction Toolkit
      </div>
    </div>
  );
}