const express = require('express');
const multer = require('multer');
const path = require('path');
const LegalInfo = require('../models/LegalInfo');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|doc|docx/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed.'));
    }
  },
});

// POST route to handle form submission
router.post('/', upload.fields([
  { name: 'uploadRecords', maxCount: 1 },
  { name: 'uploadContracts', maxCount: 1 },
  { name: 'uploadAgreements', maxCount: 1 },
  { name: 'uploadDisputes', maxCount: 1 },
]), async (req, res) => {
  try {
    const { criminalRecord, contracts, agreements, legalDisputes } = req.body;

    const legalInfo = new LegalInfo({
      criminalRecord,
      contracts,
      agreements,
      legalDisputes,
      uploadRecords: req.files.uploadRecords ? req.files.uploadRecords[0].filename : null,
      uploadContracts: req.files.uploadContracts ? req.files.uploadContracts[0].filename : null,
      uploadAgreements: req.files.uploadAgreements ? req.files.uploadAgreements[0].filename : null,
      uploadDisputes: req.files.uploadDisputes ? req.files.uploadDisputes[0].filename : null,
    });

    await legalInfo.save();
    res.status(201).json({ message: 'Form submitted successfully!', legalInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting form', error: error.message });
  }
});

module.exports = router;
