"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Question } from "../QuizScreen";
import ExplanationDisplay from "./Explanation";

interface AnswerOption {
  id: number;
  text: string;
}

interface AnswerOptionsProps {
  question: Question;
  triggerNextQuestion: (questionId: number | null) => void;
  timeLeft: number;
  pauseTimer: () => void;
  isCBTMode: boolean;
}

export default function AnswerOptions({
  question,
  triggerNextQuestion,
  timeLeft,
  pauseTimer,
  isCBTMode,
}: AnswerOptionsProps) {
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [answerChecked, setAnswerChecked] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isCorrectAnswerSelected, setIsCorrectAnswerSelected] = useState<
    boolean | null
  >(null);
  const [correctAnswerId, setCorrectAnswerId] = useState<number | null>(null);

  useEffect(() => {
    const options = [
      question.optionA,
      question.optionB,
      question.optionC,
      question.optionD,
    ];
    function shuffleArraySort(array: string[]) {
      return array.sort(() => Math.random() - 0.5);
    }

    const shuffledArray = shuffleArraySort(options);
    const loadedOptions: AnswerOption[] = shuffledArray.map((option, index) => {
      // Find and set correct answer ID during mapping
      if (option.trim() === question.answer.trim()) {
        setCorrectAnswerId(index);
      }
      return {
        id: index,
        text: option,
      };
    });
    setAnswerOptions(loadedOptions);
    setSelectedOptionId(null);
    setAnswerChecked(false);
    setIsCorrectAnswerSelected(null);
    setShowExplanation(false); // Reset explanation visibility for new question
  }, [question]);

  const handleCheckAnswer = useCallback(
    (selectedOptionText: string) => {
      // If an answer has already been checked for this question, prevent re-execution
      if (answerChecked) {
        console.log("Answer already checked, preventing re-check.");
        return;
      }

      pauseTimer();
      setAnswerChecked(true); // Mark answer as checked immediately
      const isCorrect = question.answer.trim() === selectedOptionText.trim();
      setIsCorrectAnswerSelected(isCorrect);
      console.log(
        `QID ${question.questionId} - Answered: "${selectedOptionText}", Correct: "${question.answer}", Result: ${isCorrect}`
      );

      setTimeout(
        () => {
          if (isCorrect) {
            console.log(
              `QID ${question.questionId} - Correct answer. Triggering next question (passed).`
            );
            triggerNextQuestion(question.questionId);
          } else {
            console.log(
              `QID ${question.questionId} - Incorrect answer. Checking for explanation.`
            );
            if (question.explanation.trim().length > 0) {
              setShowExplanation(true); // Show explanation if available
            } else {
              console.log(
                `QID ${question.questionId} - No explanation, triggering next question (failed).`
              );
              triggerNextQuestion(null); // No explanation, directly move to next question (failed)
            }
          }
        },
        isCBTMode ? 0 : 2500
      );
    },
    [question, triggerNextQuestion, pauseTimer, answerChecked, isCBTMode] // Add answerChecked to dependencies
  );

  useEffect(() => {
    // Only trigger timeout handling if time is up AND an answer hasn't already been checked
    if (timeLeft <= 0 && !answerChecked) {
      console.log(
        `QID ${question.questionId} - TIMEDOUT. Calling handleCheckAnswer for timeout.`
      );
      handleCheckAnswer(""); // Treat timeout as an empty/incorrect answer
    }
  }, [timeLeft, answerChecked, handleCheckAnswer, question.questionId]); // Added question.questionId for better log context

  const handleOptionClick = useCallback(
    (clickedId: number, clickedText: string) => {
      if (answerChecked) {
        console.log(
          `QID ${question.questionId} - Option click ignored, answer already checked.`
        );
        return; // Prevent interaction if answer has already been checked
      }

      if (selectedOptionId === clickedId) {
        console.log(
          `QID ${question.questionId} - Confirming selection: ${clickedText}`
        );
        handleCheckAnswer(clickedText);
      } else {
        console.log(
          `QID ${question.questionId} - Selecting option: ${clickedText}`
        );
        setSelectedOptionId(clickedId);
      }
    },
    [selectedOptionId, answerChecked, handleCheckAnswer, question.questionId]
  );

  return (
    <>
      <div className="w-full flex flex-col gap-2 p-4">
        {answerOptions.map((option) => {
          let buttonClasses = `
            w-full text-left py-3 px-4 rounded-lg border-2
            transition-colors duration-300 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          `;

          if (answerChecked && !isCBTMode) {
            const isThisCorrect = option.text.trim() === question.answer.trim();
            const isThisSelectedByUser = selectedOptionId === option.id;

            if (isThisCorrect) {
              buttonClasses +=
                " bg-green-600/20 border-transparent text-green-600 shadow-md";
            } else if (isThisSelectedByUser && !isCorrectAnswerSelected) {
              buttonClasses +=
                " bg-red-600/20 border-transparent text-red-600 shadow-md";
            } else {
              buttonClasses +=
                " bg-gray-100 border-gray-300 text-gray-700 opacity-70 cursor-not-allowed";
            }
          } else {
            const isHighlighted = selectedOptionId === option.id;
            if (isHighlighted) {
              buttonClasses +=
                " bg-blue-600/20 border-transparent text-blue-600 shadow-md";
            } else {
              buttonClasses +=
                " bg-white border-gray-300 text-gray-800 hover:bg-gray-100";
            }
          }

          return (
            <button
              type="button"
              key={option.id}
              onClick={() => handleOptionClick(option.id, option.text)}
              // Dynamically disable buttons during feedback phase
              disabled={answerChecked}
              className={buttonClasses}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {/* EXPLANATION COMPONENT */}
      <ExplanationDisplay
        correctAnswer={question.answer}
        explanationText={question.explanation}
        isVisible={showExplanation}
        onDismiss={() => {
          console.log(
            `QID ${question.questionId} - Dismissing explanation, triggering next question (failed).`
          );
          setShowExplanation(false);
          triggerNextQuestion(null); // Ensure next question is triggered after explanation
        }}
      />
    </>
  );
}
