/* eslint-disable @next/next/no-img-element */
"use client";
import { useToast } from "@/context/ToastContext";
import http from "@/utils/http";
import { getStoredItem } from "@/utils/local_storage_utils";
import { UPDATE_PRO_USER_PROFILE_URL } from "@/utils/urls";
import {
  ScanFaceIcon,
  SparkleIcon,
  SquareDashedIcon,
  SunIcon,
} from "lucide-react"; // Only importing necessary icons
import { useRouter } from "next/navigation";
// Removed: import Image from "next/image"; // Replaced with standard <img> tag
import React, { useRef, useState, useEffect, useCallback } from "react";

export default function CompleteProfile() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null); // Explicitly type as string | null
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [isMessageDismissible, setIsMessageDismissible] = useState(true);
  const { showToast } = useToast();
  const router = useRouter();

  // Function to display custom message box
  const showMessage = (msg: string, dismissible: boolean = true) => {
    setMessage(msg);
    setShowMessageBox(true);
    setIsMessageDismissible(dismissible);
  };

  const closeMessageBox = () => {
    setShowMessageBox(false);
    setMessage("");
  };

  // Function to start the camera stream
  const startCamera = async () => {
    setIsCameraActive(true);
    setTimeout(async () => {
      if (videoRef.current) {
        // Ensure videoRef.current is not null before proceeding
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user", // Use the front-facing (selfie) camera
            },
          });
          setStream(mediaStream);
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play(); // Play the video stream
          setPhotoDataUrl(null); // Clear any previous photo
        } catch (err: any) {
          setIsCameraActive(false);

          console.error("Error accessing camera:", err);
          if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError"
          ) {
            showMessage(
              "Camera access denied. Please grant permission in your browser settings."
            );
          } else if (
            err.name === "NotFoundError" ||
            err.name === "DevicesNotFoundError"
          ) {
            showMessage(
              "No camera found. Please ensure a camera is connected and enabled."
            );
          } else {
            showMessage(`Error accessing camera: ${err.message}`);
          }
        }
      } else {
        console.warn("videoRef.current is null when trying to start camera.");
      }
    }, 1000);
  };

  // Function to stop the camera stream
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraActive(false); // Set camera inactive when stopped
    }
  }, [stream]);

  // Effect to stop camera when component unmounts or stream changes
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]); // Dependency array only includes stopCamera as it's memoized

  const takePhoto = () => {
    if (stream && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // Ensure context is available
        // Set canvas dimensions to match video stream
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current frame of the video onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get image data from canvas
        const imageDataUrl = canvas.toDataURL("image/png");
        setPhotoDataUrl(imageDataUrl);

        stopCamera(); // Stop camera after taking photo
      } else {
        showMessage("Could not get canvas context.");
      }
    } else {
      showMessage("Please open the camera first to take a photo.");
    }
  };

  const retakePhoto = () => {
    setPhotoDataUrl(null); // Clear photo preview
    setIsCameraActive(false); // Reset camera active state before starting
    startCamera(); // Restart camera
  };

  const uploadPhoto = async () => {
    const user = getStoredItem("user");
    if (user == null) return;
    if (photoDataUrl) {
      // Convert base64 data URL to Blob
      const byteString = atob(photoDataUrl.split(",")[1]);
      const mimeString = photoDataUrl.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      // Create a File object from the Blob
      const photoFile = new File([blob], "portrait.png", { type: mimeString });

      // Create FormData object and append the file
      const formData = new FormData();
      formData.append("portraitPhoto", photoFile);
      formData.append("email", user.email);

      showMessage("Updating your profile...", false); // Set dismissible to false

      // POST user portrait photo
      const res = await http.postMultiPartData(
        UPDATE_PRO_USER_PROFILE_URL,
        formData
      );

      if (res.success) {
        showMessage(res.message, false);
        setTimeout(() => {
          router.push("/portal");
        }, 3000);
      } else {
        showMessage(res.message);
      }
    } else {
      showMessage("No photo to upload. Please take a photo first.");
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen py-8 px-0">
      <div className="max-w-4xl w-full border-x border-x-gray-300 p-8 md:p-16 flex flex-col gap-6">
        <div className="w-full max-w-2xl text-center mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Upload Your Portrait Photo
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            Follow these simple guidelines to take a great portrait photo of
            yourself using your selfie camera.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-10">
          <div className="flex items-start gap-4 text-left">
            <SunIcon className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <p className="text-black/60 text-lg">
              <strong>Good Lighting:</strong> Stand in front of a window or in a
              well-lit area. Avoid harsh shadows or backlighting.
            </p>
          </div>
          <div className="flex items-start gap-4 text-left">
            <ScanFaceIcon className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <p className="text-black/60 text-lg">
              <strong>Face the Camera:</strong> Look directly into the camera
              lens. Your full face should be visible.
            </p>
          </div>
          <div className="flex items-start gap-4 text-left">
            <SquareDashedIcon className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <p className="text-black/60 text-lg">
              <strong>Center Your Face:</strong> Position your face in the
              center of the frame, from your shoulders up.
            </p>
          </div>
          <div className="flex items-start gap-4 text-left">
            <SparkleIcon className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <p className="text-black/60 text-lg">
              <strong>Neutral Expression:</strong> A relaxed, natural expression
              works best. A slight smile is perfect!
            </p>
          </div>
        </div>
        <i className="text-sm md:text-base text-gray-600 mb-6">
          Note: Failure to comply with these guidelines may affect your
          eligibility to participate in certification tests for your respective
          learning tracks.
        </i>
        {!isCameraActive && !photoDataUrl && (
          <button
            onClick={startCamera}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-full duration-300 w-full max-w-xs self-center text-lg"
          >
            Take Photo
          </button>
        )}

        {(isCameraActive || photoDataUrl) && (
          <div className="relative w-full aspect-w-4 aspect-h-3 bg-gray-200 rounded-xl overflow-hidden mb-4">
            <div className="relative w-full" style={{ paddingTop: "75%" }}>
              <video
                ref={videoRef}
                className={`absolute top-0 left-0 w-full h-full object-cover rounded-xl ${
                  !photoDataUrl && isCameraActive ? "" : "hidden"
                }`} // Only show video if camera is active and no photo taken
                autoPlay
                playsInline
              ></video>
              <canvas
                ref={canvasRef}
                className="hidden" // Canvas is only used for drawing, not directly displayed
              ></canvas>
              {photoDataUrl && (
                <img
                  src={photoDataUrl}
                  alt="Your Portrait Photo"
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                />
              )}
            </div>
          </div>
        )}
        {(isCameraActive || photoDataUrl) && (
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            {isCameraActive && (
              <button
                onClick={takePhoto}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-full duration-300 w-full max-w-xs self-center text-lg"
              >
                Take Photo
              </button>
            )}
            {photoDataUrl && (
              <>
                <button
                  onClick={retakePhoto}
                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-4 px-8 rounded-full duration-300 w-full max-w-xs self-center text-lg"
                >
                  Retake Photo
                </button>
                <button
                  onClick={uploadPhoto}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-full duration-300 w-full max-w-xs self-center text-lg"
                >
                  Upload Photo
                </button>
              </>
            )}
          </div>
        )}
        {/* Custom Message Box */}
        {showMessageBox && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 text-center flex flex-col gap-4 max-w-sm w-full">
              <p className="text-gray-800 text-lg">{message}</p>
              {isMessageDismissible && (
                <button
                  onClick={closeMessageBox}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
