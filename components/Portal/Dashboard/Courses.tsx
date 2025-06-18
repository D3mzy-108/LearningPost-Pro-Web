import { DOMAIN } from "@/utils/urls";
import React from "react";
import QuestDetails from "../Quest/QuestDetails";

export default function Courses({
  quests,
  showDetailsComponent,
}: {
  quests: [];
  showDetailsComponent: (child: React.ReactElement) => void;
}) {
  return (
    <section className="w-full py-4 px-6 bg-transparent rounded-xl backdrop-blur-sm">
      <h3 className="text-black/70 text-md font-bold w-full">Your Courses</h3>

      <div className="w-full mt-4">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quests.map((quest) => {
            return (
              <button
                type="button"
                key={quest["testid"]}
                className="cursor-pointer border-none bg-transparent text-start"
                onClick={() =>
                  showDetailsComponent(<QuestDetails quest={quest} />)
                }
              >
                <CourseCard quest={quest} />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CourseCard({ quest }: { quest: any }) {
  const answered = quest["answered_count"];
  const questions = quest["question_count"];

  function calculateProgress() {
    if (answered == 0 || questions == 0) {
      return 0;
    } else {
      try {
        return (answered / questions) * 100;
      } catch (error) {
        return 0;
      }
    }
  }
  const progress = calculateProgress();

  return (
    <div
      className="bg-white/30 w-full p-4 rounded-xl border border-gray-300"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.3s ease-in-out",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.transform = "translateY(-5px)")
      }
      onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}
      >
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
        <div
          className="w-full flex-1"
          style={{ fontSize: "18px", color: "#333" }}
        >
          {quest["title"]}
        </div>
      </div>
      <p style={{ fontSize: "15px", color: "#666", marginBottom: "10px" }}>
        {questions} Questions - {answered} Answered
      </p>
      <div className="w-full flex gap-2 items-center">
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
        <span
          style={{
            fontSize: "14px",
            color: "#555",
            fontWeight: "bold",
          }}
        >
          {progress}%
        </span>
      </div>
    </div>
  );
}
