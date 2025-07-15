"use client";

import { useState, useEffect } from "react";
import ImageView from "../components/ImageView";

export default function ImageViewTestPage() {
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    const storedBoxes = localStorage.getItem("boxes");
    const boxes = storedBoxes ? JSON.parse(storedBoxes) : [];
    const box = boxes.find((box) => box.name === "test");
    if (box && box.images && box.images.length > 0) {
      setImageData(box.images[0]);
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-auto bg-gray-50">
      {imageData ? (
        <ImageView imageData={imageData} index={0} />
      ) : (
        <p className="p-4">No images found for test</p>
      )}
    </div>
  );
}
