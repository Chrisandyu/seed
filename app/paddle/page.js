"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function TestPaddleOCRPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const ocrRef = useRef(null); // 👈 store OCR module
  const router = useRouter();

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [detectedText, setDetectedText] = useState("");
  const [error, setError] = useState("");

  // Init OCR model once
  useEffect(() => {
    const init = async () => {
      try {
        const ocr = await import("@paddlejs-models/ocr");
        await ocr.init();
        ocrRef.current = ocr;
        console.log("OCR initialized");
        setIsModelLoaded(true);
      } catch (err) {
        console.error("OCR init error", err);
        setError("Failed to initialize PaddleOCR model: " + err.message);
      }
    };
    init();
  }, []);

  const startCamera = async () => {
    try {
      setError("");
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            video.play().then(resolve);
          };
        });
      } else {
        setError("Video element not found");
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      setError("Error accessing camera: " + err.message);
    }
  };

  // Auto-start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const captureImage = async () => {
    console.log("Capture button clicked");

    if (!videoRef.current || !canvasRef.current) {
      setError("Camera or canvas not ready");
      return;
    }

    if (!isModelLoaded || !ocrRef.current) {
      setError("OCR model not loaded");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video.videoWidth || !video.videoHeight) {
      setError("Video feed not active");
      return;
    }

    const context = canvas.getContext("2d");

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      setError("");
      setDetectedText("Processing...");
      console.log("Running OCR...");
      const img = new Image();

      img.src = canvas.toDataURL("image/png");

      await new Promise((resolve) => (img.onload = resolve));

      const result = await ocrRef.current.recognize(img);

      console.log("a " + result.text);
      if (result?.text?.length) {
        setDetectedText(result.text.join("\n"));
      } else {
        setDetectedText("No text detected");
      }
    } catch (err) {
      console.error("OCR processing failed:", err);
      setError("OCR processing failed: " + err.message);
      setDetectedText("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Test PaddleOCR</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {!isModelLoaded && !error && (
          <p className="text-gray-500 text-sm mb-4">Loading model...</p>
        )}

        <video
          ref={videoRef}
          className="w-full rounded-md mb-4"
          autoPlay
          muted
        />

        <canvas
          ref={canvasRef}
          className="w-full border border-gray-300 rounded-md mb-4"
        />

        <div className="w-full bg-gray-100 p-4 rounded-md mb-4 max-h-[150px] overflow-y-auto font-mono text-sm">
          {detectedText || "No text detected yet"}
        </div>

        <div className="space-y-2">
          <button
            onClick={startCamera}
            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 disabled:bg-green-300"
            disabled={!isModelLoaded}
          >
            Start Camera
          </button>
          <button
            onClick={captureImage}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            disabled={!isModelLoaded}
          >
            Capture
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
