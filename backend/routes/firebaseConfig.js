// server/firebaseConfig.js
const admin = require("firebase-admin");
const serviceAccount = require("./own-my-data-firebase-adminsdk-ufawq-425b30dffd.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "own-my-data.appspot.com",
});


const bucket = admin.storage().bucket();
module.exports = bucket;
