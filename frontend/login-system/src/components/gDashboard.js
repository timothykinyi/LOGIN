// client/src/FileUpload.js
import axios from "axios";
import React, { useState } from "react";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("https://login-9ebe.onrender.com/api/j/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFileUrl(response.data.url);
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {fileUrl && <a href={fileUrl} target="_blank" rel="noopener noreferrer">View Uploaded File</a>}
    </div>
  );
}

export default FileUpload;
