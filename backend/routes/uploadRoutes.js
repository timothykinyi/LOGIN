// server/routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const bucket = require("../firebaseConfig"); // Adjusted path to reflect the correct import location

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload a file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = bucket.file(req.file.originalname);
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on("error", (err) => {
      console.error("Error during file upload:", err); // Log error to the console
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
        console.error("Error generating signed URL:", err); // Log error to the console
        res.status(500).send("Error generating signed URL");
      }
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error("Error processing upload request:", error); // Log error to the console
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
    console.error("Error generating file URL:", error); // Log error to the console
    res.status(500).send("Error generating file URL");
  }
});

module.exports = router;
