import { useState } from "react";
import Header from "./components/Header";
import Home from "./calculators/Home";
import PCC from "./calculators/PCC";
import Volume from "./calculators/Volume";
import Sand from "./calculators/SandTruck";
import Brick from "./calculators/Brick";
import AreaPro from "./calculators/AreaPro";
import Staircase from "./calculators/Staircase";
import UnitConverter from "./calculators/UnitConverter";
import Steel from "./calculators/Steel";
import RCCEstimator from "./calculators/RCCEstimator";
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
      {page === "areapro" && <AreaPro />}
      {page === "stair" && <Staircase />}
      {page === "converter" && <UnitConverter />}
      {page === "steel" && <Steel />}
      {page === "rcc" && <RCCEstimator />}

      {page !== "home" && (
        <button className="ghost" onClick={() => setPage("home")}>
           Back
        </button>
      )}

      <div className="footer">
        Professional Construction Toolkit
      </div>
    </div>
  );
}
