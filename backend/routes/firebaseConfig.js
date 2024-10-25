// server/firebaseConfig.js
const admin = require("firebase-admin");
const serviceAccount = require("./own-my-data-firebase-adminsdk-ufawq-eb06ad3795.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "own-my-data.appspot.com",
});


const bucket = admin.storage().bucket();
module.exports = bucket;
