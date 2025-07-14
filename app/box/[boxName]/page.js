"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageList from "./components/ImageList";

export default function BoxPage() {
  const router = useRouter();
  const { boxName } = useParams();
  const [images, setImages] = useState([]);

  // Load images from localStorage
  useEffect(() => {
    const storedBoxes = localStorage.getItem("boxes");
    if (storedBoxes) {
      const boxes = JSON.parse(storedBoxes);
      const box = boxes.find((b) => b.name === decodeURIComponent(boxName));
      if (box) {
        setImages(box.images || []);
      }
    }
  }, [boxName]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {decodeURIComponent(boxName)} images
        </h1>
        <button
          onClick={() => router.push("/")}
          className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 mb-4"
        >
          Back to Home
        </button>
        <button
          onClick={() =>
            router.push(`/box/${encodeURIComponent(boxName)}/camera`)
          }
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mb-4"
        >
          Go to Camera
        </button>
        <ImageList
          boxName={decodeURIComponent(boxName)}
          images={images}
          setImages={setImages}
        />
      </div>
    </div>
  );
}
