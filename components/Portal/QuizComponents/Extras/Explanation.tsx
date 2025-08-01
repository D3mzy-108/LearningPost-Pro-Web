"use client";
import React, { useEffect, useState } from "react";
import "@/assets/css/animation.css";
import SelectableText from "./SmartLinks";

interface ExplanationDisplayProps {
  question: string;
  explanationText: string;
  correctAnswer: string;
  isVisible: boolean;
  onDismiss: () => void;
}

/**
 * @function ExplanationDisplay
 * @description A component to display an explanation text, typically when an answer is incorrect.
 * It appears with a fade-in/fade-out transition.
 * @param {ExplanationDisplayProps} props - The component props.
 * @returns {JSX.Element | null} The rendered explanation display or null if not visible.
 */
const ExplanationDisplay: React.FC<ExplanationDisplayProps> = ({
  question,
  explanationText,
  correctAnswer,
  isVisible,
  onDismiss,
}) => {
  const [displayButton, setDisplayButton] = useState(false);
  function hideExplanation() {
    const drawer = document.getElementById("explanation-wrapper");
    drawer?.classList.remove("slide-up");
    drawer?.classList.add("slide-down");
    setDisplayButton(false);
    setTimeout(() => {
      onDismiss();
    }, 300);
  }

  useEffect(() => {
    function showBtn() {
      setTimeout(() => {
        setDisplayButton(true);
      }, 3000);
    }

    if (isVisible) {
      showBtn();
    }
  }, [isVisible]);

  if (!isVisible || !explanationText || explanationText.trim().length === 0) {
    return null;
  }

  return (
    <div
      id="explanation-wrapper"
      className={`w-screen h-screen fixed top-0 left-0 z-[1000] bg-black/40 slide-up grid place-items-end`}
    >
      <div className="w-full max-w-lg h-fit overflow-auto bg-[#fafbff] p-6 mx-auto target rounded-t-3xl md:rounded-b-3xl md:mb-6 flex flex-col gap-4">
        <legend className="text-xl font-bold text-red-800">
          Close, but not quite!
        </legend>
        <div className="w-full">
          <span className="text-sm text-black/60">Correct answer:</span>
          <SelectableText
            text={
              <>
                <div className="selectable my-2">{correctAnswer}</div>
                <div className="selectable">{explanationText}</div>
              </>
            }
            textContent={`Question: ${question}\n\nAnswer: ${correctAnswer}\n\nExplanation: ${explanationText}`}
            textStyleClasses="text-black/80"
          />
        </div>
        <div className="w-full text-start mt-2">
          <button
            onClick={() => {
              if (displayButton) hideExplanation();
            }}
            className={`px-6 py-4 w-full rounded-full border-none bg-black/20 text-black duration-500 ${
              displayButton ? "opacity-100" : "opacity-0"
            }`}
            style={{
              fontWeight: 600,
            }}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplanationDisplay;
