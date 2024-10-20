const express = require('express');
const router = express.Router();
const SocialFamily = require('../models/SocialFamily');

// POST route to save form data
router.post('/', async (req, res) => {
  try {
    console.log('Incoming request body:', req.body);
    
    const { eID, maritalStatus, familyMembers, dependents, socialAffiliations } = req.body;

    if (!maritalStatus || !Array.isArray(familyMembers) || !Array.isArray(dependents) || !Array.isArray(socialAffiliations)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    const newSocialFamily = new SocialFamily({
      eID,
      maritalStatus,
      familyMembers,
      dependents,
      socialAffiliations,
    });

    await newSocialFamily.save();
    res.status(201).json({ message: 'Form data saved successfully!' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ message: 'Error saving form data', error });
  }
});

// GET route to fetch all social family data
router.get('/all', async (req, res) => {
  try {
    const socialFamilyData = await SocialFamily.find();
    res.status(200).json({ message: 'Data fetched successfully', data: socialFamilyData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data', error });
  }
});

module.exports = router;
