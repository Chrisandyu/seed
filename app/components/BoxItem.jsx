"use client";

export default function BoxItem({ boxName, onClick, onDelete }) {
  return (
    <div
      className="flex items-center justify-between p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
      onClick={onClick}
    >
      <span>{boxName}</span>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering box click
          onDelete(); // Immediately delete without confirmation
        }}
        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-300"
        aria-label={`Delete box ${boxName}`}
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
    </div>
  );
}
