"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageList from "./components/ImageList";
import ImageView from "./components/ImageView";

export default function BoxPage() {
  const router = useRouter();
  const { boxName } = useParams();
  const [images, setImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

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

  if (selectedIndex !== null) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <button
          onClick={() => setSelectedIndex(null)}
          className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center
                     hover:bg-neutral z-50"
          aria-label="Close image view"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
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
        <ImageView imageData={images[selectedIndex]} index={selectedIndex} />
      </div>
    );
  }

  return (
    <div className="bg-base-200 min-h-screen flex items-center justify-center">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-md">
        <button
          onClick={() => router.push("/")}
          className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center
                     hover:bg-neutral z-50"
          aria-label="Back to Home"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
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
        <h1 className="text-2xl font-bold mb-4 text-center">
          {decodeURIComponent(boxName)} images
        </h1>
        <button
          onClick={() =>
            router.push(`/box/${encodeURIComponent(boxName)}/camera`)
          }
          className="w-full p-2 rounded-md btn btn-accent"
        >
          Go to Camera
        </button>
        <ImageList
          boxName={decodeURIComponent(boxName)}
          images={images}
          setImages={setImages}
          onSelect={setSelectedIndex}
        />
      </div>
    </div>
  );
}
