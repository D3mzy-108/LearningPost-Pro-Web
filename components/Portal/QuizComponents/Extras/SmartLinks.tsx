import { useToast } from "@/context/ToastContext";
import http from "@/utils/http";
import { getStoredItem } from "@/utils/local_storage_utils";
import { REQUEST_SMARTLINK_URL } from "@/utils/urls";
import React, { useState, useEffect, useRef, useCallback } from "react";

/**
 * ContextMenu Component
 * A floating menu that appears when text is selected and right-clicked.
 * Allows performing an action (e.g., "SmartLink") on the selected text.
 */
function ContextMenu({
  isVisible,
  xPos,
  yPos,
  selectedText,
  onLookUp,
  onClose,
}: {
  isVisible: boolean;
  xPos: number;
  yPos: number;
  selectedText: string;
  onLookUp: () => void;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Effect to handle clicks outside the menu, closing it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the menu is visible and the click target is not within the menu
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose(); // Trigger the close handler provided by the parent
      }
    };

    if (isVisible) {
      // Attach listener when menu becomes visible
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup: Remove listener when component unmounts or visibility changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]); // Re-run effect if visibility or close handler changes

  // Do not render the menu if it's not visible or no text is selected
  if (!isVisible || !selectedText) {
    return null;
  }

  // Truncate selected text for display within the menu for brevity
  const displaySelectedText =
    selectedText.length > 20
      ? selectedText.substring(0, 17) + "..."
      : selectedText;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white border border-gray-300 rounded-md shadow-lg py-1 w-48 transition-opacity duration-100 ease-out"
      style={{
        // Position the menu relative to the viewport, accounting for scroll
        top: yPos + window.scrollY,
        left: xPos + window.scrollX,
        opacity: isVisible ? 1 : 0, // Fade in/out effect
        pointerEvents: isVisible ? "auto" : "none", // Enable/disable interaction
      }}
    >
      {/* Display a snippet of the selected text */}
      <div className="px-3 py-2 text-xs text-gray-500 font-semibold border-b border-gray-200 truncate">
        {`"${displaySelectedText}"`}
      </div>
      {/* Button to trigger the SmartLink lookup */}
      <button
        onClick={onLookUp}
        className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
      >
        {/* Search icon SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        SmartLink
      </button>
    </div>
  );
}

/**
 * SelectableText Component
 * Renders provided text content and enables a custom context menu
 * for "SmartLink" lookups on selected text.
 */
export default function SelectableText({
  text, // JSX element to render as the main content
  textContent, // String representation of the text content for API calls
  textStyleClasses, // Tailwind CSS classes for the text container
}: {
  text: JSX.Element;
  textContent: string;
  textStyleClasses: string;
}) {
  // State for managing the context menu's visibility and position
  const [menuState, setMenuState] = useState({
    visible: false,
    x: 0,
    y: 0,
    selectedText: "",
  });
  // State for controlling the SmartLink popup's visibility and content
  const [showSmartLinkPopup, setShowSmartLinkPopup] = useState(false);
  const [smartLinkResponse, setSmartLinkResponse] = useState("");

  // Hook for displaying toast notifications
  const { showToast } = useToast();

  // Ref to the DOM element containing the selectable text
  const contentRef = useRef<HTMLDivElement>(null);

  /**
   * Utility function to get the currently selected text in the browser.
   * Memoized with useCallback to prevent unnecessary re-creations.
   */
  const getSelectedText = useCallback((): string => {
    return window.getSelection()?.toString() || "";
  }, []);

  /**
   * Handles the 'mouseup' event.
   * If no text is selected, it hides the context menu and clears selected text.
   * If text is selected, it only updates the selected text in state.
   */
  const handleMouseUp = useCallback(() => {
    const text = getSelectedText();
    if (!text) {
      // If selection is cleared, hide menu and clear selected text
      setMenuState((prev) => ({ ...prev, visible: false, selectedText: "" }));
    } else {
      // If text is selected, just update the selected text state
      setMenuState((prev) => ({ ...prev, selectedText: text }));
    }
  }, [getSelectedText]);

  /**
   * Handles the 'contextmenu' (right-click) event.
   * Prevents the default browser context menu and displays the custom menu
   * if valid text is selected.
   */
  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      const text = getSelectedText();
      if (text.trim().length > 0) {
        e.preventDefault(); // Prevent default browser context menu
        setMenuState({
          visible: true,
          x: e.clientX,
          y: e.clientY,
          selectedText: text,
        });
      } else {
        // If no text or only whitespace, ensure the menu is hidden
        setMenuState((prev) => ({ ...prev, visible: false, selectedText: "" }));
      }
    },
    [getSelectedText]
  );

  /**
   * Callback to hide the context menu.
   * Passed to the ContextMenu component.
   */
  const handleCloseMenu = useCallback(() => {
    setMenuState((prev) => ({ ...prev, visible: false }));
  }, []);

  // Effect to attach and clean up event listeners on the content area
  useEffect(() => {
    const currentContentRef = contentRef.current;
    if (currentContentRef) {
      currentContentRef.addEventListener("mouseup", handleMouseUp);
      currentContentRef.addEventListener("contextmenu", handleContextMenu);
    }

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      if (currentContentRef) {
        currentContentRef.removeEventListener("mouseup", handleMouseUp);
        currentContentRef.removeEventListener("contextmenu", handleContextMenu);
      }
    };
  }, [handleMouseUp, handleContextMenu]); // Dependencies ensure effect re-runs if handlers change

  /**
   * Asynchronously fetches the SmartLink response from the API.
   * Displays toast notifications for success or error.
   */
  const fetchSmartLink = useCallback(
    async (queryText: string, contextText: string) => {
      const user = getStoredItem("user"); // Retrieve user data from local storage
      if (!user?.username) {
        showToast("User not logged in. Cannot fetch SmartLink.", "error");
        return;
      }

      try {
        const res = await http.post(REQUEST_SMARTLINK_URL(user.username), {
          prompt: `Discuss "${queryText}" in detail in relation to "${contextText}"`,
        });

        if (res.success) {
          setSmartLinkResponse(
            res.data.smartlink_response ?? "SmartLink Failed!"
          );
        } else {
          showToast(res.message, "error");
        }
      } catch (error) {
        console.error("Error fetching SmartLink:", error);
        showToast("Failed to fetch SmartLink due to a network error.", "error");
      }
    },
    [showToast] // Dependency: showToast function
  );

  /**
   * Handles the "SmartLink" action triggered from the context menu.
   * Initiates the SmartLink popup and fetches the relevant data.
   */
  const handleLookUp = useCallback(() => {
    if (menuState.selectedText.trim().length > 0) {
      setShowSmartLinkPopup(true); // Show the popup
      fetchSmartLink(menuState.selectedText.trim(), textContent); // Fetch data
    }
    handleCloseMenu(); // Always close the context menu after an action
  }, [menuState.selectedText, textContent, fetchSmartLink, handleCloseMenu]);

  /**
   * Callback to dismiss the SmartLink popup.
   * Clears the popup's content and the selected text state.
   */
  const handleDismissSmartLinkPopup = useCallback(() => {
    setShowSmartLinkPopup(false); // Hide the popup
    setSmartLinkResponse(""); // Clear its content
    setMenuState((prev) => ({ ...prev, selectedText: "" })); // Clear selected text
  }, []);

  return (
    <>
      <div>
        {/* Main content area where text selection occurs */}
        <div ref={contentRef} className={textStyleClasses}>
          {text}
        </div>

        {/* Render the custom ContextMenu */}
        <ContextMenu
          isVisible={menuState.visible}
          xPos={menuState.x}
          yPos={menuState.y}
          selectedText={menuState.selectedText}
          onLookUp={handleLookUp}
          onClose={handleCloseMenu}
        />
      </div>
      {/* Render the SmartLink popup */}
      <SmartLinkPopUp
        queryTxt={menuState.selectedText.trim()}
        smartLinkTxt={smartLinkResponse}
        isVisible={showSmartLinkPopup}
        onDismiss={handleDismissSmartLinkPopup}
      />
    </>
  );
}

/**
 * SmartLinkPopUp Component
 * A modal/drawer component that displays the detailed SmartLink response.
 */
function SmartLinkPopUp({
  queryTxt,
  smartLinkTxt,
  isVisible,
  onDismiss,
}: {
  queryTxt: string;
  smartLinkTxt: string;
  isVisible: boolean;
  onDismiss: () => void;
}) {
  // Local state to manage the animation classes for the popup.
  // 'true' means it's animating in (slide-up), 'false' means animating out (slide-down).
  const [animationActive, setAnimationActive] = useState(false);

  // Effect to control animation based on `isVisible` prop.
  useEffect(() => {
    if (isVisible) {
      // When becoming visible, set animation to active (slide-up)
      setAnimationActive(true);
    } else {
      // When becoming invisible, trigger slide-down animation
      setAnimationActive(false);
      // After the animation duration, call onDismiss to fully unmount
      const timer = setTimeout(() => {
        onDismiss();
      }, 290); // Match this duration with your CSS transition
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  function closePopup() {
    setAnimationActive(false);

    setTimeout(() => {
      onDismiss();
    }, 290);
  }

  // Don't render the component if it's not visible and not animating out,
  // or if there's no query text.
  if (!isVisible && !animationActive) {
    return null;
  }

  return (
    <div
      id="smartlink-wrapper"
      className={`w-screen h-screen fixed top-0 left-0 z-[9999] bg-black/30 grid place-items-end ${
        animationActive ? "slide-up" : "slide-down"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closePopup();
        }
      }}
    >
      <div className="w-full max-w-md h-fit overflow-auto bg-[#fafbff] mx-auto target rounded-t-3xl flex flex-col gap-4">
        <div className="w-full flex relative pt-6 px-6">
          <legend className="text-xl font-bold text-black/60 w-full flex-1">
            <span className="italic">{`"${queryTxt}"`}</span>
          </legend>
          <button
            type="button"
            onClick={() => closePopup()} // Trigger slide-down on close button click
            className="bg-transparent border-none text-4xl -mt-3 -mr-2 text-black/80"
          >
            &times;
          </button>
        </div>
        <div className="w-full max-h-[40vh] overflow-auto pb-6 px-6">
          <div className="w-full bg-black/10 rounded-xl py-1 px-3">
            {/* Display the SmartLink response text directly */}
            <SelectableText
              text={
                <>
                  <div className="selectable">{smartLinkTxt}</div>
                </>
              }
              textContent={smartLinkTxt}
              textStyleClasses="text-black/80"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
