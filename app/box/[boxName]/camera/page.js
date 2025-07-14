"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";

export default function CameraPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const { boxName } = useParams();
  const router = useRouter();

  const [lastImage, setLastImage] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg");
    setLastImage(dataUrl); // store in state

    // Save to localStorage
    const storedBoxes = localStorage.getItem("boxes");
    let boxes = storedBoxes ? JSON.parse(storedBoxes) : [];
    const index = boxes.findIndex(
      (box) => box.name === decodeURIComponent(boxName),
    );
    if (index !== -1) {
      boxes[index].images = [...(boxes[index].images || []), dataUrl];
      localStorage.setItem("boxes", JSON.stringify(boxes));
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
    const context = canvasRef.current.getContext("2d");
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Seed Packet Camera - {decodeURIComponent(boxName)}
        </h1>

        <video
          ref={videoRef}
          className="w-full rounded-md mb-4 pointer-events-none select-none"
          autoPlay
          playsInline
          muted
          disablePictureInPicture
          controls={false}
        />

        <div className="relative mb-4">
          <canvas
            ref={canvasRef}
            className="w-full border border-gray-300 rounded-md"
          />
          {lastImage && (
            <button
              onClick={() => setShowConfirm(true)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-500/20"
              aria-label="Delete image"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={startCamera}
            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
          >
            Start Camera
          </button>
          <button
            onClick={captureImage}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Take Picture
          </button>
          <button
            onClick={() => router.push(`/box/${encodeURIComponent(boxName)}`)}
            className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
          >
            Back to box
          </button>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showConfirm}
        image={lastImage}
        title="Delete this captured image?"
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
