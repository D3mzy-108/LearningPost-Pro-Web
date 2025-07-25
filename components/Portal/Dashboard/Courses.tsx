import { DOMAIN } from "@/utils/urls";
import React from "react";
import QuestDetails from "../Quest/QuestDetails";
import PrimaryBtn from "@/components/Buttons/PrimaryBtn";

export default function Courses({
  quests,
  showDetailsComponent,
}: {
  quests: [];
  showDetailsComponent: (child: React.ReactElement) => void;
}) {
  return (
    <section className="w-full py-4 px-4 bg-transparent rounded-xl backdrop-blur-sm">
      <h3 className="text-black/70 text-xl font-bold w-full">Modules</h3>

      <div className="w-full mt-4 px-2">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quests.map((quest) => {
            return (
              <CourseCard
                key={quest["testid"]}
                quest={quest}
                showDetailsComponent={showDetailsComponent}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CourseCard({
  quest,
  showDetailsComponent,
}: {
  quest: any;
  showDetailsComponent: (child: React.ReactElement) => void;
}) {
  const answered = quest["answered_count"];
  const questions = quest["question_count"];

  function calculateProgress() {
    if (answered == 0 || questions == 0) {
      return 0;
    } else {
      try {
        return Math.floor((answered / questions) * 100);
      } catch (error) {
        return 0;
      }
    }
  }
  const progress = calculateProgress();

  return (
    <div className="bg-white/30 w-full p-4 rounded-xl border border-gray-300">
      <div style={{ display: "flex", alignItems: "start" }}>
        <img
          src={`${DOMAIN}${quest["cover"]}`}
          alt="Course Logo"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/50x50/EEE/333333?text=";
          }} // Fallback image
          style={{
            width: "50px",
            height: "50px",
            marginRight: "15px",
            borderRadius: "8px",
          }}
        />
        {/* TITLE */}
        <div className="w-full flex-1 flex flex-col gap-1">
          <legend
            className="text-[18px] text-[#333]"
            style={{ fontWeight: 600 }}
          >
            {quest["title"]}
          </legend>

          <p style={{ fontSize: "15px", color: "#666", marginBottom: "10px" }}>
            {questions} Questions
          </p>
        </div>
      </div>

      {/* OTHER DATA */}
      <div className="w-full flex flex-col gap-2 mt-2">
        <div className="w-full">
          <div
            className="w-full flex-1"
            style={{
              height: "8px",
              backgroundColor: "#e0e0e0",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              className="bg-[var(--primary)]"
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: "4px",
              }}
            ></div>
          </div>
        </div>
        <span
          style={{
            fontSize: "14px",
            color: "#555",
          }}
        >
          {progress}% Completed
        </span>

        <div className="w-full mt-2">
          <button
            className="px-4 py-3 rounded-[8px] text-md border-none w-full"
            style={{
              backgroundColor: "var(--primary)",
              color: "#fff",
              cursor: "pointer",
              transition:
                "background-color 0.3s ease-in-out, transform 0.1s ease-in-out",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#0056b3")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--primary)")
            }
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.98)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => {
              showDetailsComponent(<QuestDetails quest={quest} />);
            }}
          >
            {progress > 0 ? "Continue Lesson" : "Start Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}
