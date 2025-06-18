import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import loadingImg from "@/assets/images/loading.png";

// Dynamically import ReactReader to ensure it's only loaded on the client-side.
// This is essential because epub.js (which react-reader uses) interacts with the DOM
// and browser-specific APIs, which are not available during server-side rendering.
const ReactReader = dynamic(
  () => import("react-reader").then((mod) => mod.ReactReader),
  {
    ssr: false, // Disable server-side rendering for this component
    loading: () => (
      <div className="flex justify-center items-center h-full text-lg text-gray-600">
        <Image src={loadingImg} alt="Loading..." width={300} height={300} />
      </div>
    ),
  }
);

export default function BookReader({
  title,
  file,
}: {
  title: string;
  file: string;
}) {
  const epubUrl = file;

  // State to hold the current reading location (CFI - Canonical Fragment Identifier).
  // This can be used to save and restore the reader's position.
  const [location, setLocation] = useState(null);

  // State to manage potential errors during loading or rendering.
  const [error, setError] = useState<string | null>(null);

  /**
   * Callback function called when the reading location changes.
   * This is where you would typically save the user's progress.
   * @param {string} epubcifi - The Canonical Fragment Identifier of the current location.
   */
  const handleLocationChanged = (epubCifi: any) => {
    setLocation(epubCifi);
    console.log("Current reading location (CFI):", epubCifi);
    // In a real application, you might save epubcifi to localStorage or a database
    // to allow the user to resume reading later.
  };

  /**
   * Callback function for handling errors from the ReactReader component.
   * @param {Error} err - The error object.
   */
  const handleError = (err: any) => {
    console.error("Error loading EPUB:", err);
    setError(
      "Failed to load EPUB file. Please check the URL and CORS settings."
    );
  };

  // The main UI structure for the EPUB reader.
  // Uses Tailwind CSS for a clean, responsive layout.
  return (
    <div className="w-screen h-screen relative">
      <ReactReader
        url={epubUrl}
        location={location}
        locationChanged={handleLocationChanged}
        title={title}
        pageTurnOnScroll={true}
        swipeable={true}
        loadingView={
          <div className="flex justify-center items-center h-full text-lg text-gray-600">
            <Image src={loadingImg} alt="Loading..." width={300} height={300} />
          </div>
        }
        getRendition={(rendition) => {
          rendition.on("started", () => {
            console.log("Rendition has started.");
          });
          rendition.on("rendered", (section: any) => {
            console.log("Section rendered:", section);
          });
          rendition.on("relocated", (location: any) => {
            console.log("Rendition relocated to:", location.start.cfi);
          });
          rendition.on("error", (err: any) => {
            handleError(err);
          });
        }}
        epubOptions={{
          flow: "paginated",
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
}
