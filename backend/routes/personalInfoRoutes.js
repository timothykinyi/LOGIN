const express = require("express");
const { submitPersonalInfo } = require("../controllers/personalInfoController");

const router = express.Router();

// POST route for submitting personal info
router.post("/", submitPersonalInfo);

module.exports = router;
