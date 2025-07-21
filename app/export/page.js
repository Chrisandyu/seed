"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ExportBoxItem from "../components/ExportBoxItem";

export default function ExportPage() {
  const router = useRouter();
  const [boxes, setBoxes] = useState([]);
  const [selectedBoxes, setSelectedBoxes] = useState([]);
  const [boxOrder, setBoxOrder] = useState([]);

  useEffect(() => {
    const storedBoxes = localStorage.getItem("boxes");
    if (storedBoxes) {
      const parsed = JSON.parse(storedBoxes);
      setBoxes(parsed);
      setBoxOrder(parsed.map((b) => b.name));
    }
  }, []);

  const toggleBoxSelection = (boxName) => {
    setSelectedBoxes((prev) =>
      prev.includes(boxName)
        ? prev.filter((name) => name !== boxName)
        : [...prev, boxName],
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const oldIndex = boxOrder.findIndex((name) => name === active.id);
    const newIndex = boxOrder.findIndex((name) => name === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      setBoxOrder((prev) => {
        const newOrder = [...prev];
        const [movedBox] = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, movedBox);
        return newOrder;
      });
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Box Name",
      "Construct Name",
      "Background",
      "Generations",
      "Description",
    ];
    const rows = [];
    selectedBoxes.forEach((boxName, boxIndex) => {
      const box = boxes.find((b) => b.name === boxName);
      if (box && box.images) {
        box.images.forEach((imageData, imageIndex) => {
          const data = imageData.json || {};
          rows.push(
            [
              imageIndex === 0 ? boxName : "",
              data["Construct Name"] || "null",
              data.Background || "null",
              data.Generations || "null",
              data.Description || "null",
            ]
              .map((value) => `"${String(value).replace(/"/g, '""')}"`)
              .join(","),
          );
        });
      }
    });
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "boxes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-base-200 flex items-center justify-center select-none">
        <div className="bg-base-100 card-border border-base-300 card-sm p-6 rounded-lg shadow-lg w-full max-w-md text-base-content">
          <button
            onClick={() => router.push("/")}
            className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center hover:bg-neutral z-50"
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
          <h1 className="text-2xl font-bold mb-4 text-center">Export Boxes</h1>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Select Boxes to Export</h2>
            {boxes.length === 0 ? (
              <p>No boxes created yet</p>
            ) : (
              <SortableContext
                items={boxOrder}
                strategy={verticalListSortingStrategy}
              >
                <ul className="space-y-2">
                  {boxOrder.map((boxName) => {
                    const box = boxes.find((b) => b.name === boxName);
                    if (!box) return null;
                    return (
                      <ExportBoxItem
                        key={box.name}
                        boxName={box.name}
                        isSelected={selectedBoxes.includes(box.name)}
                        onToggleSelection={() => toggleBoxSelection(box.name)}
                      />
                    );
                  })}
                </ul>
              </SortableContext>
            )}
          </div>
          {selectedBoxes.length > 0 && (
            <div className="mt-6 bg-base-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Preview Selected Boxes</h2>
              <button
                onClick={exportToCSV}
                className="w-full p-2 rounded-md btn btn-primary mb-4"
              >
                Export Selected as CSV
              </button>
              <div className="overflow-x-auto bg-base-100 rounded-lg">
                <table className="table table-zebra w-full text-sm">
                  <thead>
                    <tr>
                      <th>Box Name</th>
                      <th>Construct Name</th>
                      <th>Background</th>
                      <th>Generations</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBoxes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-gray-500">
                          No boxes selected
                        </td>
                      </tr>
                    ) : (
                      selectedBoxes.flatMap((boxName, boxIndex) => {
                        const box = boxes.find((b) => b.name === boxName);
                        if (!box || !box.images || box.images.length === 0) {
                          return [
                            <tr key={boxName}>
                              <td>{boxName}</td>
                              <td
                                colSpan={4}
                                className="text-center text-gray-500"
                              >
                                No images in this box
                              </td>
                            </tr>,
                          ];
                        }
                        return box.images.map((imageData, imageIndex) => {
                          const data = imageData.json || {};
                          return (
                            <tr key={`${boxName}-${imageIndex}`}>
                              <td>{imageIndex === 0 ? boxName : ""}</td>
                              <td>{data["Construct Name"] || "null"}</td>
                              <td>{data.Background || "null"}</td>
                              <td>{data.Generations || "null"}</td>
                              <td>{data.Description || "null"}</td>
                            </tr>
                          );
                        });
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
}
