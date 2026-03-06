"use client";
import { useState } from "react";
import axios from "axios";

export default function FileUpload({ tripId, onSuccess }: { tripId: string, onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`http://localhost:8080/api/trips/${tripId}/reservations/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFile(null);
      onSuccess();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4 border-2 border-dashed border-gray-100 rounded-2xl p-4 bg-gray-50/50">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-3 w-full py-2 bg-blue-600 text-white rounded-xl text-sm font-bold disabled:bg-gray-300 transition-all shadow-lg shadow-blue-100"
        >
          {uploading ? "Uploading..." : "Confirm Upload"}
        </button>
      )}
    </div>
  );
}