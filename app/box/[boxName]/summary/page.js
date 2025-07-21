"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function SummaryPage() {
  const router = useRouter();
  const { boxName } = useParams();
  const [images, setImages] = useState([]);

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

  const exportToCSV = () => {
    const headers = [
      "Box Name",
      "Construct Name",
      "Background",
      "Generations",
      "Description",
    ];
    const rows = images.map((imageData, index) => {
      const data = imageData.json || {};
      return [
        index === 0 ? decodeURIComponent(boxName) : "",
        data["Construct Name"] || "null",
        data.Background || "null",
        data.Generations || "null",
        data.Description || "null",
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",");
    });
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${decodeURIComponent(boxName)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <button
        onClick={() => router.push(`/box/${encodeURIComponent(boxName)}`)}
        className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center hover:bg-neutral z-50"
        aria-label="Back to Box"
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
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="p-6 max-w-4xl mx-auto space-y-6">
          <div className="relative">
            <h1 className="text-2xl font-bold mb-4 text-center">
              {decodeURIComponent(boxName)} Summary
            </h1>
            <button
              onClick={exportToCSV}
              className="w-full p-2 rounded-md btn btn-primary mb-4"
            >
              Export as CSV
            </button>
            <div className="bg-base-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Data</h2>
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
                    {images.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-gray-500">
                          No images yet!
                        </td>
                      </tr>
                    ) : (
                      images.map((imageData, index) => {
                        const data = imageData.json || {};
                        return (
                          <tr key={index}>
                            <td>
                              {index === 0 ? decodeURIComponent(boxName) : ""}
                            </td>
                            <td>{data["Construct Name"] || "null"}</td>
                            <td>{data.Background || "null"}</td>
                            <td>{data.Generations || "null"}</td>
                            <td>{data.Description || "null"}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
