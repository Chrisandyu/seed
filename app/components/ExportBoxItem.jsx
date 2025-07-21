"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ExportBoxItem({
  boxName,
  isSelected,
  onToggleSelection,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: boxName });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between bg-base-200 p-3 rounded-md`}
    >
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelection}
          onClick={(e) => e.stopPropagation()}
          className="checkbox checkbox-primary"
        />
        <span>{boxName}</span>
      </div>
      <div
        {...attributes}
        {...listeners}
        className="cursor-move p-2 rounded hover:bg-base-300"
        aria-label="Drag handle"
      >
        <svg
          className="w-4 h-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 10h16M4 14h16"
          />
        </svg>
      </div>
    </div>
  );
}
