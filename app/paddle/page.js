"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CameraPage() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const ocrRef = useRef(null);

  const { boxName } = useParams();
  const router = useRouter();

  const [lastImage, setLastImage] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Initialize OCR model once
  useEffect(() => {
    const initOCR = async () => {
      const ocr = await import("@paddlejs-models/ocr");
      await ocr.init();
      ocrRef.current = ocr;
      console.log("OCR initialized");
      setIsModelLoaded(true);
    };
    initOCR();
  }, []);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
    setIsCameraOn(true);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOn(false);
  };

  const toggleCamera = () => {
    isCameraOn ? stopCamera() : startCamera();
  };

  // Capture image, save it, flash effect, and run OCR
  const captureImage = async () => {
    if (!videoRef.current || !isModelLoaded || !ocrRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg");
    setLastImage(dataUrl);

    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 150);

    // Save image to localStorage box images
    const storedBoxes = localStorage.getItem("boxes");
    let boxes = storedBoxes ? JSON.parse(storedBoxes) : [];
    const index = boxes.findIndex(
      (box) => box.name === decodeURIComponent(boxName),
    );
    if (index !== -1) {
      boxes[index].images = [...(boxes[index].images || []), dataUrl];
      localStorage.setItem("boxes", JSON.stringify(boxes));
    }

    // Run OCR and log text
    const img = new Image();
    img.src = canvas.toDataURL("image/png");
    await new Promise((resolve) => (img.onload = resolve));

    const result = await ocrRef.current.recognize(img);
    if (result?.text?.length) {
      console.log("OCR Text:", result.text.join("\n"));
    } else {
      console.log("OCR Text: No text detected");
    }
  };

  const deleteLastImage = () => {
    const storedBoxes = localStorage.getItem("boxes");
    let boxes = storedBoxes ? JSON.parse(storedBoxes) : [];
    const index = boxes.findIndex(
      (box) => box.name === decodeURIComponent(boxName),
    );
    if (index !== -1 && lastImage) {
      boxes[index].images = boxes[index].images.filter(
        (img) => img !== lastImage,
      );
      localStorage.setItem("boxes", JSON.stringify(boxes));
    }
    setLastImage(null);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      <div className="fixed inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-lg pointer-events-none select-none"
          autoPlay
          playsInline
          muted
        />

        {/* Flash effect */}
        {shutterFlash && (
          <div className="absolute inset-0 bg-white opacity-80 animate-fade-out pointer-events-none z-10" />
        )}

        {/* Back button */}
        <button
          onClick={() => router.push(`/box/${encodeURIComponent(boxName)}`)}
          className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center bg-white/80 hover:bg-white z-20"
          aria-label="Go back to box"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Toggle camera */}
        <button
          onClick={toggleCamera}
          className="absolute top-2 left-2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center z-20"
        >
          {!isCameraOn ? (
            // Camera Off Icon with red slash
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h16M4 18h16M4 6v12"
              />
              <line
                x1="20"
                y1="4"
                x2="4"
                y2="20"
                stroke="red"
                strokeWidth="2.5"
              />
            </svg>
          ) : (
            // Camera On Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h16M4 18h16M4 6v12"
              />
            </svg>
          )}
        </button>

        {/* Capture button */}
        <button
          onClick={captureImage}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-white hover:bg-gray-300 border-4 border-gray-800 z-20"
        />
      </div>
    </div>
  );
}
