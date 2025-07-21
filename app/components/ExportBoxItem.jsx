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
  } = useSortable({
    id: boxName,
    disabled: !isSelected,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center justify-between bg-base-200 p-3 rounded-md cursor-move`}
      onClick={(e) => {
        if (e.target.type !== "checkbox") {
          onToggleSelection();
        }
      }}
    >
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelection}
          onClick={(e) => e.stopPropagation()}
          className="checkbox checkbox-primary"
        />
        <span className="flex-grow select-none">{boxName}</span>
      </div>
    </div>
  );
}
