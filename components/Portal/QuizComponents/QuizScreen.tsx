import { useEffect, useState } from "react";
import QuestionComponent from "./Extras/Question";
import Image from "next/image";
import loadingImg from "@/assets/images/loading.png";
import QuestProgress from "./Extras/Progress";
import AnswerOptions from "./Extras/AnswerOptions";

export interface Question {
  questionId: number;
  comprehension: string;
  diagram: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  explanation: string;
  topic: string;
}

export default function QuizScreen({ questions }: { questions: Question[] }) {
  const [__currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [__currentQuestion, setCurrentQuestion] = useState<Question | null>(
    null
  );

  const handleCheckAnswer = (selectedOption: string) => {
    console.log(`Checking Answer: ${selectedOption}`);
  };

  const handleNextQuestion = () => {
    if (__currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(__currentQuestionIndex + 1);
    } else {
      // TODO: SAVE PROGRESS
      console.log("No more questions available.");
    }
  };

  useEffect(() => {
    function loadCurrentQuestion() {
      if (__currentQuestionIndex < questions.length) {
        setCurrentQuestion(questions[__currentQuestionIndex]);
      }
    }

    loadCurrentQuestion();
  }, [__currentQuestionIndex, questions]);

  if (questions.length === 0 || __currentQuestion === null) {
    return (
      <>
        <div className="w-full h-screen grid place-items-center">
          <Image src={loadingImg} alt="Loading..." width={300} height={300} />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="w-full flex max-lg:flex-col justify-center max-lg:items-center md:p-4 md:gap-4">
          <div className="w-full max-w-2xl">
            <QuestProgress
              progress={((__currentQuestionIndex + 1) / questions.length) * 100}
            />
            <QuestionComponent
              question={__currentQuestion}
              currentQuestion={__currentQuestionIndex + 1}
              questionCount={questions.length}
            />
          </div>
          <div className="w-full max-w-2xl pb-12">
            <span className="text-sm text-black/60 italic mb-2 px-4 md:px-2">
              Note: Tap option again to confirm your choice.
            </span>
            <AnswerOptions
              options={[
                __currentQuestion.optionA,
                __currentQuestion.optionB,
                __currentQuestion.optionC,
                __currentQuestion.optionD,
              ]}
              onSelect={handleCheckAnswer}
            />
          </div>
        </div>
      </>
    );
  }
}
