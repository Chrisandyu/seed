"use client";
import React from "react";

export default function ConfirmDeleteModal({
  isOpen,
  onConfirm,
  onCancel,
  title = "Are you sure?",
  description = "",
  image = null, // optional image preview
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
        {description && <p className="text-gray-600 mb-4">{description}</p>}
        {image && (
          <img
            src={image}
            alt="Preview"
            className="w-full max-h-48 object-contain rounded mb-4"
          />
        )}
        <div className="flex justify-between gap-4 mt-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
