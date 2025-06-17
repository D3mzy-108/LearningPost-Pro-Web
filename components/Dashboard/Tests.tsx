import { DOMAIN } from "@/utils/urls";

export default function Tests({ tests }: { tests: [] }) {
  return (
    <section className="w-full py-4 px-6 bg-transparent rounded-xl backdrop-blur-md shadow-md">
      <h3 className="text-black/70 text-md font-bold w-full">Upcoming Tests</h3>

      <div className="w-full mt-4">
        <div className="w-full flex flex-col gap-4">
          {tests.map((test) => {
            return <TestCard test={test} key={test["testid"]} />;
          })}
        </div>
      </div>
    </section>
  );
}

function TestCard({ test }: { test: any }) {
  const doNotAllowInteraction = test["is_locked"] && !test["is_attempted"];
  const testAttempted = test["is_attempted"];

  function startTestOrShowResults() {
    if (testAttempted) {
      // TODO: DISPLAY THE RESULTS OF THE TEST
    } else {
      // TODO: START THE TEST
    }
  }

  return (
    <div
      className={`${
        doNotAllowInteraction ? "opacity-50 pointer-events-none" : ""
      }
        w-full max-w-lg bg-white/40 rounded-lg p-4 flex items-center gap-2`}
      style={{
        border: "1px solid #eee",
        transition: "transform 0.3s ease-in-out",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.transform = "translateY(-5px)")
      }
      onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div className="w-full flex-1 flex items-center">
        <img
          src={`${DOMAIN}${test["cover"]}`}
          alt={`${test["title"]}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/60x60/cccccc/333333?text=";
          }} // Fallback image
          style={{
            width: "60px",
            height: "60px",
            marginRight: "20px",
            borderRadius: "10px",
          }}
        />
        <div className="w-full flex-1">
          <h3 style={{ color: "#333" }}>{test["title"]}</h3>
          <p style={{ fontSize: "16px", color: "#666", margin: "5px 0" }}>
            {test["question_count"]} Questions
          </p>
          <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>
            {test["status"]}
          </p>
        </div>
      </div>
      <button
        className="px-4 py-3 rounded-lg text-md border-none"
        style={{
          backgroundColor: "var(--primary)",
          color: "#fff",
          cursor: "pointer",
          transition:
            "background-color 0.3s ease-in-out, transform 0.1s ease-in-out",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onClick={() => startTestOrShowResults()}
      >
        {test["is_attempted"] ? "Show Results" : "Start Test"}
      </button>
    </div>
  );
}
