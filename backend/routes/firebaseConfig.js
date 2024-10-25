// server/firebaseConfig.js
const admin = require("firebase-admin");
const serviceAccount = require("./eidltd-863565558301.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "own-my-data.appspot.com",
});


const bucket = admin.storage().bucket();
module.exports = bucket;
