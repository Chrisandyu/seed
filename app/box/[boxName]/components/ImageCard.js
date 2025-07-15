"use client";
import { useState } from "react";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";

export default function ImageCard({ image, onDelete, onClick }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="relative">
      <img
        src={image}
        alt="Seed packet"
        className="w-full h-24 object-cover rounded-md cursor-pointer"
        onClick={onClick}
      />
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent triggering the image click
          setShowConfirm(true);
        }}
        className="absolute top-1 right-1 w-7 h-7 rounded-full flex items-center justify-center"
        aria-label="Delete image"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-red-600"
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

      <ConfirmDeleteModal
        isOpen={showConfirm}
        image={image}
        title="Delete this image?"
        onConfirm={() => {
          onDelete();
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
