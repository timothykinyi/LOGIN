const express = require('express');
const multer = require('multer');
const path = require('path');
const LegalInfo = require('../models/LegalInfo');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route for submitting legal information
router.post('/', upload.fields([
  { name: 'uploadRecords', maxCount: 1 },
  { name: 'uploadContracts', maxCount: 1 },
  { name: 'uploadAgreements', maxCount: 1 },
  { name: 'uploadDisputes', maxCount: 1 },
]), async (req, res) => {
  try {
    const newLegalInfo = new LegalInfo({
      criminalRecord: req.body.criminalRecord,
      contracts: req.body.contracts,
      agreements: req.body.agreements,
      legalDisputes: req.body.legalDisputes,
      uploadRecords: req.files.uploadRecords ? req.files.uploadRecords[0].filename : null,
      uploadContracts: req.files.uploadContracts ? req.files.uploadContracts[0].filename : null,
      uploadAgreements: req.files.uploadAgreements ? req.files.uploadAgreements[0].filename : null,
      uploadDisputes: req.files.uploadDisputes ? req.files.uploadDisputes[0].filename : null,
    });

    await newLegalInfo.save();
    res.status(201).json({ message: 'Form submitted successfully!', data: newLegalInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Could not submit form.' });
  }
});

module.exports = router;
