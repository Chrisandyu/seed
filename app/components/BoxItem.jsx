"use client";

export default function BoxItem({ boxName, onClick, onDelete }) {
  return (
    <div
      className="flex items-center justify-between p-2 rounded cursor-pointer
                btn border border-secondary"
      onClick={onClick}
    >
      <span>{boxName}</span>
      <button
        onClick={(e) => {
          e.stopPropagation(); //no clicky
          onDelete();
        }}
        className="w-6 h-6 rounded-full flex items-center justify-center"
        aria-label={`Delete box ${boxName}`}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-error"
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
