import React, { useState, useEffect, useRef, useCallback } from "react";

// ContextMenu Component - Defined within the same file for compilation
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
  const menuRef = useRef<any>(null);

  // Handle clicks outside the menu to close it
  const handleClickOutside = useCallback(
    (event: Event) => {
      // If the menu is visible and the click is outside the menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose(); // Call the parent's close handler
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isVisible) {
      // Attach click listener to the document only when menu is visible
      document.addEventListener("click", handleClickOutside);
    } else {
      // Remove listener when menu is hidden
      document.removeEventListener("click", handleClickOutside);
    }

    // Cleanup function to remove the event listener when component unmounts
    // or when isVisible changes to false
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isVisible, handleClickOutside]); // Re-run effect if isVisible or handleClickOutside changes

  if (!isVisible || !selectedText) {
    return null; // Don't render if not visible or no text selected
  }

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white border border-gray-300 rounded-md shadow-lg py-1 w-48 transition-opacity duration-100 ease-out"
      style={{
        top: yPos + window.scrollY, // Account for scroll position
        left: xPos + window.scrollX, // Account for scroll position
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none", // Disable interaction when hidden
      }}
    >
      {/* Display selected text snippet */}
      <div className="px-3 py-2 text-xs text-gray-500 font-semibold border-b border-gray-200 truncate">
        "
        {selectedText.length > 20
          ? selectedText.substring(0, 17) + "..."
          : selectedText}
        "
      </div>
      {/* Menu Options */}
      <button
        onClick={onLookUp}
        className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
      >
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
        SmartLink "
        {selectedText.length > 10
          ? selectedText.substring(0, 7) + "..."
          : selectedText}
        "
      </button>
    </div>
  );
}

export function SelectableText({
  text,
  textStyleClasses,
}: {
  text: JSX.Element;
  textStyleClasses: string;
}) {
  const [menuState, setMenuState] = useState({
    visible: false,
    x: 0,
    y: 0,
    selectedText: "",
  });

  // Ref for the content area where text will be selected
  const contentRef = useRef<any>(null);

  // Function to get the currently selected text
  const getSelectedText = useCallback(() => {
    if (window.getSelection) {
      return window.getSelection()?.toString();
    }
    return "";
  }, []);

  // Event handler for mouse up (after text selection)
  const handleMouseUp = useCallback(() => {
    const text = getSelectedText();
    if (!text) {
      // If no text is selected, ensure the menu is hidden
      setMenuState((prev) => ({ ...prev, visible: false, selectedText: "" }));
    } else {
      // If text is selected, just update selectedText,
      // the contextmenu event will handle visibility.
      setMenuState((prev) => ({ ...prev, selectedText: text }));
    }
  }, [getSelectedText]);

  // Event handler for right-click (context menu)
  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      const text = getSelectedText();
      if (text) {
        e.preventDefault(); // Prevent default browser context menu

        // Get mouse coordinates
        setMenuState({
          visible: true,
          x: e.clientX,
          y: e.clientY,
          selectedText: text,
        });
      } else {
        // If no text is selected, ensure the menu is hidden
        setMenuState((prev) => ({ ...prev, visible: false }));
      }
    },
    [getSelectedText]
  );

  // Callback to close the menu, passed to ContextMenu component
  const handleCloseMenu = useCallback(() => {
    setMenuState((prev) => ({ ...prev, visible: false, selectedText: "" }));
  }, []);

  useEffect(() => {
    const currentContentRef = contentRef.current;
    if (currentContentRef) {
      // Attach mouseup and contextmenu listeners to the content area
      currentContentRef.addEventListener("mouseup", handleMouseUp);
      currentContentRef.addEventListener("contextmenu", handleContextMenu);
    }

    // Clean up event listeners when component unmounts
    return () => {
      if (currentContentRef) {
        currentContentRef.removeEventListener("mouseup", handleMouseUp);
        currentContentRef.removeEventListener("contextmenu", handleContextMenu);
      }
    };
  }, [handleMouseUp, handleContextMenu]); // Dependencies

  // --- Menu Item Action Handlers ---
  const handleLookUp = useCallback(() => {
    if (menuState.selectedText) {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(
          menuState.selectedText
        )}`,
        "_blank"
      );
    }
    handleCloseMenu(); // Close menu after action
  }, [menuState.selectedText, handleCloseMenu]);

  return (
    <div>
      {/* Main content area */}
      <div ref={contentRef} className={`${textStyleClasses}`}>
        {text}
      </div>

      {/* Render the ContextMenu component */}
      <ContextMenu
        isVisible={menuState.visible}
        xPos={menuState.x}
        yPos={menuState.y}
        selectedText={menuState.selectedText}
        onLookUp={handleLookUp}
        onClose={handleCloseMenu}
      />
    </div>
  );
}
