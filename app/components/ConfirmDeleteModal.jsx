"use client";
import React from "react";

export default function ConfirmDeleteModal({
  isOpen,
  onConfirm,
  onCancel,
  title = "Are you sure??????",
  description = "",
  image = null, //preview, optional
  confirmText = "Yes, Delete!",
  cancelText = "No, Keep It",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-200">
      <div className="bg-base-100 rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        {description && <p className="mb-4">{description}</p>}
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
            className="flex-1 btn btn-neutral py-2 rounded"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded btn btn-error"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
