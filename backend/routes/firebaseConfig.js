// server/firebaseConfig.js
const admin = require("firebase-admin");
require('dotenv').config();
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "own-my-data.appspot.com",
});


const bucket = admin.storage().bucket();
module.exports = bucket;
