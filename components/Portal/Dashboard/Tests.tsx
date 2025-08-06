"use client";
import { DOMAIN } from "@/utils/urls";
import ConfirmStartTest from "../Test/ConfirmStartTest";
import TestScore from "../Test/TestResults";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function Tests({
  tests,
  showDetailsComponent,
  isLocked,
}: {
  tests: [];
  showDetailsComponent: (child: React.ReactElement) => void;
  isLocked: boolean;
}) {
  const searchParams = useSearchParams();
  return (
    <section className="w-full py-4 md:px-2 lg:px-4 backdrop-blur-sm">
      <h3 className="text-black text-xl font-bold w-full">
        Certification Tests
      </h3>
      <div className="text-red-600 my-5 text-sm italic rounded-xl">
        <p>
          {`This section contains the certification tests required to clear you for active duty with ${searchParams.get(
            "tc"
          )}.
          `}
        </p>
        <p>
          {`
         Access to these tests will be granted upon the successful completion of all prerequisite courses.`}
        </p>
      </div>

      <div className={`w-full ${isLocked && "opacity-50 pointer-events-none"}`}>
        <div className="w-full flex flex-col gap-4">
          {tests.map((test) => {
            return (
              <TestCard
                test={test}
                showDetailsComponent={showDetailsComponent}
                key={test["testid"]}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TestCard({
  test,
  showDetailsComponent,
}: {
  test: any;
  showDetailsComponent: (child: React.ReactElement) => void;
}) {
  const doNotAllowInteraction = test["is_locked"] && !test["is_attempted"];
  const testAttempted = test["is_attempted"];

  function startTestOrShowResults() {
    if (testAttempted) {
      // TODO: DISPLAY THE RESULTS OF THE TEST
      showDetailsComponent(<TestScore test={test} />);
    } else {
      showDetailsComponent(<ConfirmStartTest test={test} />);
    }
  }

  return (
    <div
      className={`${
        doNotAllowInteraction ? "opacity-50 pointer-events-none" : ""
      }
        w-full max-w-lg bg-white/40 rounded-lg p-4 flex flex-col gap-2 border border-gray-300`}
    >
      <div className="w-full flex-1 flex items-center">
        <Image
          src={`${DOMAIN}${test["cover"]}`}
          alt={`${test["title"]}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/60x60/cccccc/333333?text=";
          }} // Fallback image
          width={60}
          height={60}
          style={{
            marginRight: "20px",
            borderRadius: "10px",
          }}
        />
        <div className="w-full flex-1">
          <legend
            className="text-[18px] text-[#333]"
            style={{ fontWeight: 600 }}
          >
            {test["title"]}
          </legend>
          <p style={{ fontSize: "16px", color: "#666", margin: "5px 0" }}>
            {test["question_count"]} Questions
          </p>
        </div>
      </div>
      <button
        className="px-4 py-3 rounded-[8px] text-md border-none mt-3"
        style={{
          backgroundColor: `${
            test["is_attempted"] ? "#ca8a04" : "var(--primary)"
          }`,
          color: "#fff",
          cursor: "pointer",
          transition:
            "background-color 0.3s ease-in-out, transform 0.1s ease-in-out",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = `${
            test["is_attempted"] ? "#eab308 " : "#0056b3"
          }`)
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = `${
            test["is_attempted"] ? "#ca8a04" : "var(--primary)"
          }`)
        }
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onClick={() => startTestOrShowResults()}
      >
        {test["is_attempted"] ? "Show Results" : "Start Test"}
      </button>
      <p
        style={{
          fontSize: "14px",
          color: "#888",
          margin: 0,
          textAlign: "center",
        }}
      >
        {test["status"]}
      </p>
    </div>
  );
}
