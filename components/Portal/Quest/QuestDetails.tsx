"use client";
import PrimaryBtn from "@/components/Buttons/PrimaryBtn";
import { DOMAIN } from "@/utils/urls";
import { useRouter } from "next/navigation";

export default function QuestDetails({ quest }: { quest: any }) {
  const router = useRouter();
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

  return (
    <div className="flex flex-col gap-6">
      {/* QUEST TITLE */}
      <div className="w-full flex items-center">
        <img
          src={`${DOMAIN}${quest["cover"]}`}
          alt={quest["title"]}
          className="w-[60px] aspect-square rounded-xl bg-gray-100"
        />
        <div className="w-full flex-1 pl-4">
          <legend className="font-bold text-black/80 text-lg">
            {quest["title"]}
          </legend>
          <p className="text-black/60 text-sm">
            {questions} Questions . {answered} Answered
          </p>
        </div>
        <div
          className="w-fit"
          style={{
            transform: "scale(0.8) translateX(0.75rem)",
          }}
        >
          <PrimaryBtn
            type="button"
            btnWidth="w-fit"
            textContent="Start"
            onClick={() => {
              router.push(
                `/portal/practice-quest?id=${quest["testid"]}&time=${quest["time"]}`
              );
            }}
          />
        </div>
      </div>

      {/* QUEST INFO */}
      <div className="w-full flex gap-3">
        <div className="w-full flex-1 rounded-lg bg-gray-200 p-3 text-center">
          <p
            style={{
              lineHeight: "1.2rem",
            }}
          >
            <span className="text-md font-bold text-black/80">
              {quest["time"]} sec
            </span>
            <br />
            <span className="text-sm text-black/60">per Question</span>
          </p>
        </div>
        <div className="w-full flex-1 rounded-lg bg-gray-200 p-3 text-center">
          <p
            style={{
              lineHeight: "1.2rem",
            }}
          >
            <span className="text-md font-bold text-black/80">
              {calculateProgress()}%
            </span>
            <br />
            <span className="text-sm text-black/60">Completed</span>
          </p>
        </div>
      </div>
      <div className="w-full">
        <legend>
          <span className="text-sm font-bold text-black/80">About Course</span>
        </legend>
        <div className="text-black/80 p-3 text-sm border-y border-y-gray-300 italic mt-3">
          {quest["about"].toString().length == 0
            ? "No info about this course was added."
            : quest["about"]}
        </div>
      </div>
      <div className="w-full">
        <legend>
          <span className="text-sm font-bold text-black/80">
            Course Instructions
          </span>
        </legend>
        <div className="text-black/80 p-3 text-sm border-y border-y-gray-300 italic mt-3">
          {quest["instructions"].toString().length == 0
            ? "No instructions were added for this course."
            : quest["instructions"]}
        </div>
      </div>
    </div>
  );
}
