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

// Interface for a single quiz question
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

/**
 * QuizScreen Component
 * Manages the quiz flow, displays questions, handles timer, progress,
 * and submission of results.
 */
export default function QuizScreen({
  questions, // Array of question objects
  time, // Time allowed per question in seconds
  testId, // ID of the current test/quiz
  isCBTMode, // Boolean to indicate if it's a CBT (Computer Based Test) mode
}: {
  questions: Question[];
  time: number;
  testId: string;
  isCBTMode: boolean;
}) {
  const router = useRouter(); // Next.js router for navigation
  const { showToast } = useToast(); // Toast notification hook

  // State for quiz progression
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionsPassed, setQuestionsPassed] = useState<number[]>([]); // IDs of correctly answered questions
  const [questionsFailed, setQuestionsFailed] = useState<Question[]>([]); // Full question objects of failed questions

  // Timer States
  const [timeLeft, setTimeLeft] = useState<number>(time); // Remaining time for the current question
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the setInterval ID

  /**
   * Starts the countdown timer for the current question.
   * Clears any existing timer before starting a new one.
   * Resets `timeLeft` to the initial `time` prop.
   */
  const startTimer = useCallback(() => {
    // Clear any existing timer to prevent multiple intervals running
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Only start timer if a positive time is provided
    if (time > 0) {
      if (!isCBTMode) {
        setTimeLeft(time); // Reset time for the new question
      }

      // Set up a new interval to decrement time every second
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // If time runs out, clear the interval
            clearInterval(timerIntervalRef.current!);
            timerIntervalRef.current = null;
            // Return 0 to ensure timeLeft state is exactly 0
            return 0;
          }
          return prevTime - 1; // Decrement time
        });
      }, 1000);
    } else {
      // If time is 0 or less, set timeLeft to 0 immediately
      setTimeLeft(0);
    }
  }, [isCBTMode, time]); // Dependency: `time` prop. Re-create if time per question changes.

  /**
   * Pauses the current timer by clearing the interval.
   */
  const pauseTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []); // No dependencies, as it only interacts with the ref

  /**
   * Saves the quiz progress or test score to the backend.
   * Navigates to results or portal page after saving.
   */
  const saveProgress = useCallback(async () => {
    const user = getStoredItem("user"); // Get user data from local storage
    if (!user?.username) {
      showToast("User not logged in. Cannot save progress.", "error");
      return;
    }

    if (!isCBTMode) {
      // Practice mode: Save progress of passed questions and corrections
      console.log("Saving practice progress...");
      if (questionsPassed.length > 0) {
        console.log("Passed questions count:", questionsPassed.length);
        try {
          const response = await http.get(
            SAVE_PROGRESS(questionsPassed, user.username)
          );
          if (!response.success) {
            showToast(
              "Failed to save progress. Connection Interrupted!",
              "error"
            );
          }
        } catch (error) {
          console.error("Error saving practice progress:", error);
          showToast("Failed to save practice progress.", "error");
        }
      }
      console.log("Failed questions count:", questionsFailed.length);
      // Store failed questions for review
      storeItem("corrections", questionsFailed);
      // Navigate to practice results page
      router.push(
        `/portal/practice-quest/results?id=${testId}&passed=${questionsPassed.length}`
      );
    } else {
      // CBT mode: Save test score
      console.log("Saving CBT test score...");
      // const totalQuestions = questionsPassed.length + questionsFailed.length;
      const totalQuestions = questions.length;
      const score =
        totalQuestions > 0
          ? Math.floor((questionsPassed.length / totalQuestions) * 100)
          : 0;
      try {
        const response = await http.post(
          SAVE_TEST_SCORE(testId, user.username),
          {
            score: `${score}`,
          }
        );
        if (!response.success) {
          showToast(
            "Failed to save test score. Connection Interrupted!",
            "error"
          );
        } else {
          showToast("Your test attempt has been recorded.", "info");
        }
      } catch (error) {
        console.error("Error saving CBT test score:", error);
        showToast("Failed to save test score.", "error");
      }
      // Navigate to portal after CBT submission
      router.push(`/portal`);
    }
  }, [
    isCBTMode,
    showToast,
    questionsPassed,
    questionsFailed,
    router,
    testId,
    questions.length,
  ]); // Dependencies for saveProgress

  /**
   * Handles moving to the next question after an answer is submitted or time runs out.
   * Updates `questionsPassed` or `questionsFailed` based on the outcome.
   * @param questionId The ID of the question if it was answered correctly, null otherwise.
   */
  const handleNextQuestion = useCallback(
    (questionId: number | null) => {
      console.log(
        `QuizScreen: handleNextQuestion called for Q index ${currentQuestionIndex}. Question ID passed: ${questionId}`
      );

      if (questionId !== null) {
        // Question answered correctly
        setQuestionsPassed((prev) => {
          const newVal = [...prev, questionId];
          console.log("---- PASSED LIST ----\n" + newVal);
          return newVal;
        });
        console.log(`QuizScreen: QID ${questionId} marked as PASSED.`);
      } else {
        // Question answered incorrectly or timed out
        if (questions.length > 0 && currentQuestionIndex < questions.length) {
          const failedQuestion = questions[currentQuestionIndex];
          setQuestionsFailed((prev) => {
            const newVal = [...prev, failedQuestion];
            console.log("---- FAILED LIST ----\n" + newVal);
            return newVal;
          });
          console.log(
            `QuizScreen: QID ${failedQuestion.questionId} marked as FAILED.`
          );
        } else {
          console.log(
            "QuizScreen: Attempted to mark question as failed, but no valid current question or index out of bounds."
          );
        }
      }

      // Move to the next question
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      console.log(
        `QuizScreen: Moving to next index: ${currentQuestionIndex + 1}.`
      );
    },
    [currentQuestionIndex, questions] // Dependencies for handleNextQuestion
  );

  const handleFinishQuiz = useCallback(() => {
    console.log(
      "QuizScreen: Quiz finished. Triggering save progress and navigation."
    );
    setCurrentQuestion(null); // Signal end of quiz
    pauseTimer(); // Stop the timer
    // Give a small delay before saving progress, useful for UI transitions
    setTimeout(() => {
      saveProgress();
    }, 2000);
  }, [pauseTimer, saveProgress]);

  /**
   * Main effect hook to manage quiz progression and timer lifecycle.
   * Runs when `currentQuestionIndex`, `questions`, `time`, `startTimer`, `pauseTimer`, or `saveProgress` changes.
   */
  useEffect(() => {
    // Check if there are questions to display
    if (questions.length > 0) {
      // If there are more questions, set the current question and start the timer)
      if (currentQuestionIndex < questions.length) {
        const newQuestion = questions[currentQuestionIndex];
        setCurrentQuestion(newQuestion);
        startTimer(); // Start timer for the new question
      } else {
        // All questions answered: Quiz finished
        handleFinishQuiz();
      }
    }

    // Cleanup function: Clear the timer when the component unmounts
    // or when this effect re-runs (e.g., due to index change)
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [
    currentQuestionIndex,
    questions,
    time,
    startTimer,
    pauseTimer,
    saveProgress,
    handleFinishQuiz,
    isCBTMode,
  ]); // Dependencies

  useEffect(() => {
    // WATCHING FOR CHANGES IN TIME LEFT
    if (isCBTMode) {
      if (timeLeft <= 0) {
        handleFinishQuiz();
      }
    }
  }, [handleFinishQuiz, isCBTMode, timeLeft]);

  // Display a loading screen if questions are not yet loaded or currentQuestion is null initially
  if (questions.length === 0 || currentQuestion === null) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <Image src={loadingImg} alt="Loading..." width={300} height={300} />
      </div>
    );
  }

  /**
   * Formats seconds into a "MM:SS" string.
   */
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
        {/* Progress bar for the quiz */}
        <QuestProgress
          progress={((currentQuestionIndex + 1) / questions.length) * 100}
        />
        {/* Component to display the current question */}
        <QuestionComponent
          question={currentQuestion}
          currentQuestion={currentQuestionIndex + 1}
          questionCount={questions.length}
          timeLeft={formatTime(timeLeft)}
        />
      </div>
      <div className="w-full max-w-2xl pb-12">
        <span className="text-sm text-black/60 italic mb-2 px-4 md:px-2 block">
          Note: Tap option again to confirm your choice.
        </span>
        {/* Component for answer options and handling user input */}
        <AnswerOptions
          question={currentQuestion}
          triggerNextQuestion={(questionId) => handleNextQuestion(questionId)}
          timeLeft={timeLeft} // Pass raw timeLeft to AnswerOptions for its logic
          pauseTimer={pauseTimer}
          isCBTMode={isCBTMode}
        />
      </div>
    </div>
  );
}
