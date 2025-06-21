// components/ToastMessage.tsx
"use client"; // This component needs to be a client component as it uses useEffect and state

import React, { useEffect, useState } from "react";
import { ToastMessageObject } from "@/context/ToastContext"; // Adjust path if necessary

interface ToastMessageProps {
  message: ToastMessageObject;
  onClose: () => void;
  autoHideDuration?: number; // Duration in milliseconds before message auto-hides
}

/**
 * @function ToastMessage
 * @description Renders a single toast message and handles its auto-disappearance.
 * @param {ToastMessageProps} props - Props for the toast message.
 * @returns {JSX.Element} The individual toast message component.
 */
const ToastMessage: React.FC<ToastMessageProps> = ({
  message,
  onClose,
  autoHideDuration = 3000,
}) => {
  // Local state to manage fading out or other animations if desired
  // We'll use this for the opacity and potentially a slide animation
  const [isVisible, setIsVisible] = useState(false); // Start as false to trigger slide-in transition

  useEffect(() => {
    // Log when the component mounts and what message it is
    console.log(
      `[ToastMessage - ${message.id}] Mounted. Message: '${message.messageTxt}', Type: '${message.type}'`
    );

    // Set isVisible to true shortly after mount to trigger the slide-in animation
    // This allows the initial opacity-0 to opacity-100 transition to play
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      console.log(`[ToastMessage - ${message.id}] Set to visible.`);
    }, 100); // A small delay before showing to ensure transition works

    // Set a timer to automatically hide the message after autoHideDuration
    const hideTimer = setTimeout(() => {
      console.log(
        `[ToastMessage - ${message.id}] Auto-hide triggered after ${autoHideDuration}ms.`
      );
      setIsVisible(false); // Trigger fade-out and slide-out animation
      // After a short delay to allow for fade-out/slide-out, actually remove the message from state
      const unmountTimer = setTimeout(() => {
        onClose(); // Call the parent's onClose to remove it from the global messages array
        console.log(`[ToastMessage - ${message.id}] Unmounted from DOM.`);
      }, 300); // Small delay to allow for visual transition before unmounting
      return () => clearTimeout(unmountTimer); // Cleanup unmount timer
    }, autoHideDuration + 100); // Add the showTimer delay to total duration

    // Cleanup function to clear both timers if the component unmounts early (e.g., user clicks close)
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      console.log(`[ToastMessage - ${message.id}] Cleaned up timers.`);
    };
  }, [autoHideDuration, onClose, message.id, message.messageTxt, message.type]); // Depend on relevant props

  // Determine background and text colors based on message type
  const getColors = (type: ToastMessageObject["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-700/10 text-green-700";
      case "error":
        return "bg-red-700/10 text-red-700";
      case "info":
        return "bg-blue-700/10 text-blue-700";
      case "warning":
        // Ensure good contrast for warning messages
        return "bg-yellow-700/10 text-yellow-900";
      default:
        return "bg-gray-700/10 text-gray-700";
    }
  };

  const colors = getColors(message.type);

  // Use `transform` for a subtle slide-in/out effect along with opacity
  const transitionClasses = `transition-all duration-300 ease-out`;
  const visibilityClasses = isVisible
    ? "opacity-100 translate-x-0"
    : "opacity-0 translate-x-full";

  return (
    // Add pointer-events-auto here to allow click on this specific toast.
    // The container (ul) in ToastContext has pointer-events-none, so this is crucial.
    <li
      className={`${colors} w-full rounded-xl py-4 px-6 flex items-center gap-3 backdrop-blur-md ${transitionClasses} ${visibilityClasses} pointer-events-auto`}
    >
      <div className="flex-1">
        <span className="text-md">{message.messageTxt}</span>
      </div>
      <div className="w-fit">
        {/* Close button - user can manually dismiss messages */}
        <button
          onClick={() => {
            console.log(`[ToastMessage - ${message.id}] Manual close clicked.`);
            setIsVisible(false); // Instantly trigger fade-out/slide-out
            const unmountTimer = setTimeout(() => {
              onClose(); // Remove from global state after animation
            }, 300); // Match this delay to your transition duration
            return () => clearTimeout(unmountTimer);
          }}
          className="w-fit border-none bg-gray-100 px-2 py-0 aspect-square text-lg grid place-items-center rounded-full text-gray-600 hover:bg-gray-200"
        >
          &times;
        </button>
      </div>
    </li>
  );
};

export default ToastMessage;
