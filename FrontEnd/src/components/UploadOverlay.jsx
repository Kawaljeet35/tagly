import { useState } from "react";
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export default function UploadOverlay({ closeUpload, onPostCreated }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("File size must be 50 MB or less.");
      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("content", caption);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        alert("File uploaded successfully!"); // show immediately

        setFile(null);
        setCaption("");

        closeUpload();
        onPostCreated();
      } else {
        alert("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="overlay fixed inset-0 z-[100] bg-black bg-opacity-80 flex items-center justify-center">
      <div className="upload-container bg-white dark:bg-slate-900 text-black dark:text-white rounded-lg shadow-lg p-4 gap-2 flex flex-col max-w-lg">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white p-2 rounded"
        />
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-40 h-40 object-cover rounded mt-2"
          />
        )}
        <textarea
          value={caption}
          onChange={handleCaptionChange}
          placeholder="Write a caption..."
          maxLength={1000}
          rows={3}
          className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 p-2 mb-4 rounded"
          required
        />
        <button
          onClick={handleSubmit}
          className="bg-teal-600 hover:bg-teal-700 transition duration-300 text-white rounded px-4 py-2"
        >
          Upload
        </button>
        <button
          onClick={closeUpload}
          className="bg-red-600 hover:bg-red-700 transition duration-300 text-white rounded px-4 py-2"
        >
          Close
        </button>
      </div>
    </div>
  );
}
