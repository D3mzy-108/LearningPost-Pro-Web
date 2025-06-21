// context/ToastContext.tsx
"use client"; // This context provider and its children will be client components

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import ToastMessage from "@/components/ToastMessage"; // Adjust path if necessary

/**
 * @interface ToastMessageObject
 * @description Defines the structure for a single toast message.
 * @property {string} id - A unique identifier for the message.
 * @property {'success' | 'error' | 'info' | 'warning'} type - The type of message, dictating styling.
 * @property {string} messageTxt - The text content of the message.
 */
export interface ToastMessageObject {
  id: string;
  type: "success" | "error" | "info" | "warning";
  messageTxt: string;
}

/**
 * @interface ToastContextType
 * @description Defines the interface for the context's value.
 * @property {(message: string, type: ToastMessageObject['type']) => void} showToast - Function to display a new toast message.
 * @property {(id: string) => void} hideToast - Function to hide (remove) a specific toast message by its ID.
 */
interface ToastContextType {
  showToast: (message: string, type: ToastMessageObject["type"]) => void;
  hideToast: (id: string) => void;
}

// Create the context with an undefined default value, which will be set by the provider.
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * @function ToastProvider
 * @description Provides the toast message functionality to its children.
 * It manages the state of active toast messages and renders them.
 * @param {React.PropsWithChildren} props - The children components to be wrapped.
 * @returns {JSX.Element} The provider component wrapping its children and rendering the toasts.
 */
export const ToastProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  // State to hold the array of current toast messages.
  const [messages, setMessages] = useState<ToastMessageObject[]>([]);

  /**
   * @function showToast
   * @description Adds a new toast message to the display queue.
   * A unique ID is generated for each message.
   * Messages are prepended to the array to show the newest on top.
   * @param {string} messageTxt - The text content of the toast.
   * @param {'success' | 'error' | 'info' | 'warning'} type - The type of toast (for styling).
   */
  const showToast = useCallback(
    (messageTxt: string, type: ToastMessageObject["type"]) => {
      console.log(`[ToastContext] showToast called: ${messageTxt} (${type})`); // Debug log
      const newId =
        String(Date.now()) + "-" + Math.random().toString(36).substring(2, 9);
      const newMessage: ToastMessageObject = { id: newId, type, messageTxt };

      setMessages((prevMessages) => {
        const updatedMessages = [newMessage, ...prevMessages];
        console.log(
          "[ToastContext] Messages updated:",
          updatedMessages.length,
          "messages"
        ); // Debug log
        return updatedMessages;
      });
    },
    []
  );

  /**
   * @function hideToast
   * @description Removes a toast message from the display by its ID.
   * @param {string} id - The unique ID of the message to remove.
   */
  const hideToast = useCallback((id: string) => {
    console.log(`[ToastContext] hideToast called for ID: ${id}`); // Debug log
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.filter((msg) => msg.id !== id);
      console.log(
        "[ToastContext] Messages after hide:",
        updatedMessages.length,
        "messages"
      ); // Debug log
      return updatedMessages;
    });
  }, []);

  // The context value provides the showToast and hideToast functions.
  const contextValue = useMemo(
    () => ({ showToast, hideToast }),
    [showToast, hideToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Container for all toast messages, positioned fixed on the screen */}
      {messages.length > 0 && (
        <ul className="w-full grid grid-cols-1 gap-2 fixed top-0 right-0 p-4 pointer-events-none">
          {/* Messages are prepended, so a normal map will display the newest at the top of the flex column. */}
          <div className="w-full max-w-sm ml-auto">
            {messages.map((message) => (
              <ToastMessage
                key={message.id}
                message={message}
                onClose={() => hideToast(message.id)}
              />
            ))}
          </div>
        </ul>
      )}
    </ToastContext.Provider>
  );
};

/**
 * @function useToast
 * @description A custom hook to consume the ToastContext.
 * Allows components to easily access the showToast and hideToast functions.
 * @returns {ToastContextType} The context value containing showToast and hideToast.
 * @throws Will throw an error if used outside of a ToastProvider.
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    // Using console.error for development environment to highlight missing provider
    console.error(
      "Error: useToast must be used within a ToastProvider. Check your component tree."
    );
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
