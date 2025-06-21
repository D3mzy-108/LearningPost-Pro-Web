// components/AnswerOptions.tsx
"use client"; // This component needs to be a client component as it uses useState and useEffect

import React, { useEffect, useState } from "react";

interface AnswerOption {
  id: number;
  text: string;
}

interface AnswerOptionsProps {
  options: string[]; // Array of strings for the answer options
  onSelect: (selectedText: string) => void; // Callback when a selected option is clicked again
}

export default function AnswerOptions({
  options,
  onSelect,
}: AnswerOptionsProps) {
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);

  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

  useEffect(() => {
    const loadedOptions: AnswerOption[] = options.map((option, index) => {
      return {
        id: index,
        text: option,
      };
    });
    setAnswerOptions(loadedOptions);
    setSelectedOptionId(null);
    console.log("[AnswerOptions] Options loaded");
  }, [options]);

  const handleOptionClick = (clickedId: number, clickedText: string) => {
    if (selectedOptionId === clickedId) {
      onSelect(clickedText);
      setSelectedOptionId(null);
    } else {
      setSelectedOptionId(clickedId);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-2 p-4">
        {answerOptions.map((option) => {
          const isHighlighted = selectedOptionId === option.id;

          return (
            <button
              type="button"
              key={option.id}
              onClick={() => handleOptionClick(option.id, option.text)}
              className={`
                w-full text-left py-3 px-4 rounded-lg border-2
                transition-colors duration-300 ease-in-out
                ${
                  isHighlighted
                    ? "bg-blue-600/20 border-transparent text-blue-600"
                    : "border-gray-300 text-gray-800 hover:bg-gray-100" // Default styles
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              `}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    </>
  );
}
