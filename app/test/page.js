"use client";

import { useState, useEffect } from "react";

export default function OCRTestPage() {
  const [text, setText] = useState("Loading...");
  const imagePath = "/test.jpg"; // image in public folder

  useEffect(() => {
    const fetchOCR = async () => {
      // Fetch the image as blob then convert to base64
      const response = await fetch(imagePath);
      const blob = await response.blob();

      const toBase64 = (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

      let base64 = await toBase64(blob);

      base64 = base64.replace(/^data:image\/\w+;base64,/, "");

      const res = await fetch("/api/ocr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      const data = await res.json();

      if (res.ok) {
        setText(data.text || "No text detected");
      } else {
        setText(`Error: ${data.error || "Unknown error"}`);
      }
    };

    fetchOCR();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">OCR Test</h1>
      <img src={imagePath} alt="Test" className="max-w-sm mb-6 rounded" />
      <div className="whitespace-pre-wrap p-4 bg-white rounded shadow w-full max-w-lg">
        {text}
      </div>
    </div>
  );
}
