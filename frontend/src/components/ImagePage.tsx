"use client";
import { useState } from "react"

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("prompt", prompt);

    const res = await fetch("http://localhost:8000/generate-image", {
      method: "POST",
      body: formData,
    });
    
    const data = await res.json();
    console.log("Raw response data:", data);
    setImage(data.image);

    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Text to Image Generator</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt..."
        className="border p-2 w-full mb-4"
      />
      <button
        onClick={generateImage}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {image && (
        <img
          src={image}
          alt="Generated"
          className="mt-4 max-w-full rounded shadow"
        />
      )}
    </div>
  );
}
