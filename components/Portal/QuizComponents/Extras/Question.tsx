import { DOMAIN } from "@/utils/urls";
import { Question } from "../QuizScreen";

export default function QuestionComponent({
  question,
  currentQuestion,
  questionCount,
  timeLeft,
}: {
  question: Question;
  currentQuestion: number;
  questionCount: number;
  timeLeft: string;
}) {
  return (
    <div className="py-4 px-4">
      <div className="w-full flex justify-between">
        <span className="font-medium text-black/60">
          Question {currentQuestion} of {questionCount}:
        </span>

        {/* Timer Display */}
        <span className={"text-gray-700 text-sm"}>{timeLeft}</span>
      </div>
      <div
        className="w-full mt-2 text-lg text-black/80"
        style={{
          fontWeight: 600,
        }}
      >
        {question.question}
      </div>
      {question.diagram.trim().length > 0 && (
        <div className="w-full max-w-[280px] md:max-w-xs backdrop-blur-md rounded-lg bg-white/10 mx-auto mt-4 grid place-items-center">
          <img
            src={`${DOMAIN}${question.diagram}`}
            alt=""
            className="w-full aspect-square"
            style={{
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </div>
  );
}
