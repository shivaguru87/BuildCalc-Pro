import Card from "../components/Card";

export default function Home({ setPage }) {
  return (
	  <Card>
      <div className="grid">

        <button className="primary" onClick={() => setPage("pcc")}>
           PCC
        </button>

        <button className="primary" onClick={() => setPage("volume")}>
           Tank
        </button>

        <button className="primary" onClick={() => setPage("sand")}>
           Sand
        </button>

        <button className="primary" onClick={() => setPage("brick")}>
           Brick
        </button>
        <button className="primary" onClick={() => setPage("areapro")}>
  		    Area Pro
	     </button>
		<button className="primary"  onClick={() => setPage("stair")}>
  	    Staircase
		</button>
		  <button className="primary" onClick={() => setPage("converter")}>
		  Converter
		</button>
		  <button className="primary" onClick={() => setPage("steel")}>
		  Steel
		</button>

      </div>
    </Card>
  );
}
