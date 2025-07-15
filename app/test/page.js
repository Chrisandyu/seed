"use client";

import { useState, useEffect } from "react";

export default function OCRTestPage() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ocrText: "TGH CS349180 homozygous 3 Gabi-kat",
      }),
    })
      .then((res) => res.json())
      .then((data) => setResult(data));
  }, []);

  return (
    <div>
      <h1>OCR Test Result</h1>
      <pre>{result ? JSON.stringify(result, null, 2) : "Loading..."}</pre>
    </div>
  );
}
