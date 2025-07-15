"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BoxItem from "./components/BoxItem";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

export default function Home() {
  const [boxes, setBoxes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoxName, setNewBoxName] = useState("");

  const [boxToDelete, setBoxToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedBoxes = localStorage.getItem("boxes");
    if (storedBoxes) {
      setBoxes(JSON.parse(storedBoxes));
    }
  }, []);

  const saveBox = () => {
    if (newBoxName.trim()) {
      const updatedBoxes = [...boxes, { name: newBoxName.trim(), images: [] }];
      setBoxes(updatedBoxes);
      localStorage.setItem("boxes", JSON.stringify(updatedBoxes));
      setNewBoxName("");
      setIsModalOpen(false);
      router.push(`/box/${encodeURIComponent(newBoxName.trim())}`);
    }
  };

  const handleBoxClick = (boxName) => {
    router.push(`/box/${encodeURIComponent(boxName)}`);
  };

  const confirmDeleteBox = (boxName) => {
    setBoxToDelete(boxName);
  };

  const deleteBox = (boxName) => {
    const updatedBoxes = boxes.filter((box) => box.name !== boxName);
    setBoxes(updatedBoxes);
    localStorage.setItem("boxes", JSON.stringify(updatedBoxes));
    setBoxToDelete(null);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center ">
      <div className="bg-base-100 card-border border-base-300 card-sm p-6 rounded-lg shadow-lg w-full max-w-md text-base-content">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Seed Packet Recorder
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full p-2 rounded-md btn btn-primary mb-4"
        >
          Create New Box
        </button>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Saved Boxes</h2>
          {boxes.length === 0 ? (
            <p>No boxes created yet</p>
          ) : (
            <ul className="space-y-2">
              {boxes.map((box, index) => (
                <li key={index}>
                  <BoxItem
                    boxName={box.name}
                    onClick={() => handleBoxClick(box.name)}
                    onDelete={() => confirmDeleteBox(box.name)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-base-200 bg-opacity-50 flex items-center justify-center z-10">
            <div className="p-6 rounded-lg shadow-lg w-full max-w-sm bg-base-100">
              <h2 className="text-xl font-bold mb-4">Create New Box</h2>
              <input
                type="text"
                value={newBoxName}
                onChange={(e) => setNewBoxName(e.target.value)}
                className="w-full p-2 input input-border max-w-none resize-none rounded-md mb-4"
                placeholder="Enter box name"
              />
              <div className="flex space-x-2">
                <button
                  onClick={saveBox}
                  className="flex-1 btn btn-primary p-2"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setNewBoxName("");
                    setIsModalOpen(false);
                  }}
                  className="flex-1 p-2 btn btn-error"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDeleteModal
          isOpen={boxToDelete !== null}
          title="Delete this Box?"
          description={`All images inside "${boxToDelete}" will be lost`}
          confirmText="Yes, Delete It"
          cancelText="Keep It"
          onCancel={() => setBoxToDelete(null)}
          onConfirm={() => {
            deleteBox(boxToDelete);
          }}
        />
      </div>
    </div>
  );
}
