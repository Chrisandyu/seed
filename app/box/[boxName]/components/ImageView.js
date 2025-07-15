"use client";

import { useState, useEffect } from "react";

export default function ImageView({ imageData, index }) {
  const [data, setData] = useState(imageData.json || {});

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-base-200 p-4 rounded-lg shadow">
        <img
          src={imageData.image}
          alt="Seed packet"
          className="w-full max-w-md object-cover rounded-lg mb-2 mx-auto"
        />
        <p className="text-sm text-base-content/60 text-center">
          Image {index + 1}
        </p>
      </div>

      <div className="bg-base-200 p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-2">Raw OCR Text</h2>
        <pre className="bg-base-100 text-sm p-3 rounded whitespace-pre-wrap overflow-auto">
          {imageData.ocrText || "No text"}
        </pre>
      </div>

      <div className="bg-base-200 p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">Extracted Data</h2>

        <div className="overflow-x-auto bg-base-100 rounded-lg">
          <table className="table table-zebra w-full text-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Construct Name</th>
                <th>Background</th>
                <th>Generations</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{index}</td>
                <td>{data["Construct Name"] || "null"}</td>
                <td>{data.Background || "null"}</td>
                <td>{data.Generations || "null"}</td>
                <td>{data.Description || "null"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
