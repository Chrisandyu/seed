"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";

export default function CameraPage({ setLatestImage }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // still needed for capturing image, just not rendered
  const streamRef = useRef(null);
  const { boxName } = useParams();
  const router = useRouter();

  const [lastImage, setLastImage] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [shutterFlash, setShutterFlash] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraOn(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
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

  const captureImage = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg");
    setLastImage(dataUrl);

    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 150);

    let ocrText = "";

    // try {
    //   // Remove prefix from dataUrl
    //   const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");

    //   const response = await fetch("/api/ocr", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ imageBase64: base64 }),
    //   });

    //   if (!response.ok) {
    //     console.error("OCR API error", await response.text());
    //   } else {
    //     const data = await response.json();
    //     ocrText = data.text || "No text detected";
    //     console.log("OCR Text:", ocrText);
    //   }
    // } catch (error) {
    //   console.error("Error calling OCR API:", error);
    // }

    // Save image + OCR text to localStorage
    //

    let aiJSON = {};
    ocrText = "TCP14-TD SPY3TPR (K/M) T2 10B, 1, 10 packets";

    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ocrText }),
    });

    if (response.ok) {
      aiJSON = await response.json();
    }

    const storedBoxes = localStorage.getItem("boxes");
    let boxes = storedBoxes ? JSON.parse(storedBoxes) : [];
    const index = boxes.findIndex(
      (box) => box.name === decodeURIComponent(boxName),
    );
    if (index !== -1) {
      const savedImage = { image: dataUrl, ocrText: ocrText, json: aiJSON };
      boxes[index].images = [...(boxes[index].images || []), savedImage];
      localStorage.setItem("boxes", JSON.stringify(boxes));

      if (typeof setLatestImage === "function") {
        setLatestImage(savedImage);
      }
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
    <div className="h-full bg-black flex items-center justify-center relative">
      <div className="relative w-full h-full z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-lg pointer-events-none select-none"
          autoPlay
          playsInline
          muted
        />
        {shutterFlash && (
          <div className="absolute inset-0 bg-white opacity-80 animate-fade-out pointer-events-none z-10" />
        )}

        <button
          onClick={() => router.push(`/box/${encodeURIComponent(boxName)}`)}
          className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center bg-white/80 hover:bg-white z-20"
          aria-label="Go home"
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

        <button
          onClick={toggleCamera}
          className="absolute top-2 left-2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center z-20"
        >
          {!isCameraOn ? (
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
              {/* Slash from top-right to bottom-left, extended */}
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

        <button
          onClick={captureImage}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-white hover:bg-gray-300 border-4 border-gray-800 z-20"
        ></button>
      </div>

      <ConfirmDeleteModal
        isOpen={showConfirm}
        image={lastImage}
        title="Delete this image?"
        confirmText="Delete"
        cancelText="Keep"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          deleteLastImage();
          setShowConfirm(false);
        }}
      />
    </div>
  );
}
