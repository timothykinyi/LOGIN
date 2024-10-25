// server/firebaseConfig.js
const admin = require("firebase-admin");
const serviceAccount = require("./own-my-data-firebase-adminsdk-ufawq-82685da7a9");

try {
  // Initialize Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "firebase-adminsdk-ufawq@own-my-data.iam.gserviceaccount.com", // Ensure this matches your Firebase project
  });

  const bucket = admin.storage().bucket();
  console.log("Firebase initialized with bucket:", bucket.name); // Log bucket name
  module.exports = bucket;
} catch (error) {
  console.error("Error initializing Firebase:", error); // Log Firebase initialization errors
  throw error; // Stop execution if Firebase fails to initialize
}
