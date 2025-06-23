import { useCallback, useEffect, useRef, useState } from "react";
import QuestionComponent from "./Extras/Question";
import Image from "next/image";
import loadingImg from "@/assets/images/loading.png";
import QuestProgress from "./Extras/Progress";
import AnswerOptions from "./Extras/AnswerOptions";
import http from "@/utils/http";
import { SAVE_PROGRESS, SAVE_TEST_SCORE } from "@/utils/urls";
import { getStoredItem, storeItem } from "@/utils/local_storage_utils";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

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

export default function QuizScreen({
  questions,
  time,
  testId,
  isCBTMode,
}: {
  questions: Question[];
  time: number;
  testId: string;
  isCBTMode: boolean;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [__currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [__currentQuestion, setCurrentQuestion] = useState<Question | null>(
    null
  );
  const [__questionsPassed, setQuestionsPassed] = useState<number[]>([]);
  const [__questionsFailed, setQuestionsFailed] = useState<Question[]>([]);

  // Timer States
  const [timeLeft, setTimeLeft] = useState<number>(time);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    if (__currentQuestion && time > 0) {
      setTimeLeft(time); // Reset time for the new question

      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerIntervalRef.current!);
            timerIntervalRef.current = null;
            // The handleCheckAnswer in AnswerOptions will catch timeLeft <= 0
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      setTimeLeft(time); // Set initial time if no question or time is 0
    }
  }, [__currentQuestionIndex, time]);

  const pauseTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const saveProgress = async () => {
    // SAVE USER PROGRESS HERE
    if (!isCBTMode) {
      const user = getStoredItem("user");
      console.log("Saving progress...");
      if (__questionsPassed.length > 0) {
        console.log("Passed questions count:", __questionsPassed.length);
        const response = await http.get(
          SAVE_PROGRESS(__questionsPassed, user.username)
        );
        if (!response.success) {
          showToast(
            "Failed to save progress. Connection Interrupted!!",
            "error"
          );
        }
      }
      console.log("Failed questions count:", __questionsFailed.length);
      storeItem("corrections", __questionsFailed);
      router.push(
        `/portal/practice-quest/results?id=${testId}&passed=${__questionsPassed.length}`
      );
    } else {
      const user = getStoredItem("user");
      console.log("Saving progress...");
      console.log("Passed questions count:", __questionsPassed.length);
      const response = await http.post(SAVE_TEST_SCORE(testId, user.username), {
        score: `${Math.floor(
          (__questionsPassed.length /
            (__questionsPassed.length + __questionsFailed.length)) *
            100
        )}`,
      });
      if (!response.success) {
        showToast("Failed to save progress. Connection Interrupted!!", "error");
      } else {
        showToast("Your test attempt has been recorded.", "info");
      }
      router.push(`/portal`);
    }
  };

  const handleNextQuestion = (questionId: number | null) => {
    console.log(
      `QuizScreen: handleNextQuestion called for Q index ${__currentQuestionIndex}. Question ID passed: ${questionId}`
    );

    if (questionId !== null) {
      setQuestionsPassed((prev) => {
        const newVal = [...prev, questionId];
        console.log("---- PASSED LIST ----\n\n" + newVal);

        return newVal;
      });
      console.log(`QuizScreen: QID ${questionId} marked as PASSED.`);
      console.log("---- PASSED ----");
    } else {
      // This branch is for incorrect answers or timeouts
      if (questions.length > 0 && __currentQuestionIndex < questions.length) {
        const failedQuestion = questions[__currentQuestionIndex];
        setQuestionsFailed((prev) => {
          const newVal = [...prev, failedQuestion];
          console.log("---- FAILED LIST ----\n\n" + newVal);

          return newVal;
        });
        console.log(
          `QuizScreen: QID ${failedQuestion.questionId} marked as FAILED.`
        );
        console.log("---- FAILED ----");
      } else {
        console.log(
          "QuizScreen: Attempted to mark question as failed, but no valid current question or index out of bounds."
        );
        console.log("---- FAILED ----");
      }
    }

    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    console.log(
      `QuizScreen: Moving to next index: ${__currentQuestionIndex + 1}.`
    );
  };

  useEffect(() => {
    if (questions.length > 0) {
      if (__currentQuestionIndex < questions.length) {
        const newQuestion = questions[__currentQuestionIndex];
        setCurrentQuestion(newQuestion);
        startTimer(); // Start timer for the new question
      } else {
        console.log(
          "QuizScreen: Quiz finished. Triggering save progress and navigation."
        );
        console.log(__currentQuestionIndex);
        setCurrentQuestion(null); // Signal end of quiz
        pauseTimer();
        setTimeout(() => {
          saveProgress();
        }, 2000);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [__currentQuestionIndex, questions, startTimer, pauseTimer]);

  // Display loading if questions are not yet loaded or currentQuestion is null initially
  if (questions.length === 0 || __currentQuestion === null) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <Image src={loadingImg} alt="Loading..." width={300} height={300} />
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-screen overflow-auto flex max-lg:flex-col lg:justify-center max-lg:items-center md:p-4 md:gap-4 font-inter">
      <div className="w-full max-w-2xl">
        <QuestProgress
          progress={((__currentQuestionIndex + 1) / questions.length) * 100}
        />
        <QuestionComponent
          question={__currentQuestion}
          currentQuestion={__currentQuestionIndex + 1}
          questionCount={questions.length}
          timeLeft={formatTime(timeLeft)}
        />
      </div>
      <div className="w-full max-w-2xl pb-12">
        <span className="text-sm text-black/60 italic mb-2 px-4 md:px-2 block">
          Note: Tap option again to confirm your choice.
        </span>
        <AnswerOptions
          question={__currentQuestion}
          triggerNextQuestion={(questionId) => handleNextQuestion(questionId)}
          timeLeft={timeLeft}
          pauseTimer={pauseTimer}
          isCBTMode={isCBTMode}
        />
      </div>
    </div>
  );
}
