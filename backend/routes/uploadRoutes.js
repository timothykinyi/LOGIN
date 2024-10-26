// server/routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const bucket = require("../config/firebaseConfig"); // Import Firebase bucket

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Log the bucket name to verify Firebase setup
console.log("Bucket initialized:", bucket.name);

// Upload a file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Check if file exists in the request
    if (!req.file || !req.file.buffer) {
      console.error("No file or buffer found in the request");
      return res.status(400).send("No file provided or file is corrupt");
    }
    
    const file = bucket.file(req.file.originalname);
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on("error", (err) => {
      console.error("Error during file upload:", err); // Log error details
      res.status(500).send("Error uploading file");
    });

    stream.on("finish", async () => {
      try {
        const [url] = await file.getSignedUrl({
          action: "read",
          expires: "03-17-2025", // Set an expiration date
        });
        res.status(200).send({ url });
      } catch (err) {
        console.error("Error generating signed URL:", err); // Log error details
        res.status(500).send("Error generating signed URL");
      }
    });

    // End the stream with the file buffer
    stream.end(req.file.buffer);
  } catch (error) {
    console.error("Error processing upload request:", error); // Log error details
    res.status(500).send("Error processing upload request");
  }
});

// Generate a signed URL for downloading
router.get("/files/:filename", async (req, res) => {
  try {
    const file = bucket.file(req.params.filename);
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000, // 1 hour from now
    });
    res.status(200).send({ url });
  } catch (error) {
    console.error("Error generating file URL:", error); // Log error details
    res.status(500).send("Error generating file URL");
  }
});

module.exports = router;
