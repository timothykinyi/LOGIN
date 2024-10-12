const SharedData = require('../models/SharedData');

// Share selected data
const shareSelectedData = async (req, res) => {
  const { selectedData, eID, deadlineDate } = req.body;

  // Validate input
  if (!selectedData || typeof selectedData !== 'object') {
    return res.status(400).json({ error: 'Invalid selected data' });
  }

  // Validate eID and deadlineDate
  if (!eID || !deadlineDate || isNaN(new Date(deadlineDate))) {
    return res.status(400).json({ error: 'Invalid eID or deadline date' });
  }

  try {
    const generatedID = () => {
      return Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
    };

    const gendid = generatedID();
    const newShare = new SharedData({
      eID,
      sharedData: selectedData,
      dID: gendid,
      expdate: deadlineDate,
    });

    const savedShare = await newShare.save();

    // Generate a shareable link or ID
    const shareId = savedShare.dID; // Use the generated ID for sharing
    res.json({ id: shareId });
  } catch (error) {
    console.error('Error sharing data:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Fetch shared data by eID
const getSharedDataByEID = async (req, res) => {
  const { eID } = req.params; // Retrieve eID from URL parameters

  try {
    const sharedData = await SharedData.find({ dID: eID }); // Fetch based on eID

    if (sharedData.length === 0) {
      return res.status(404).json({ message: 'No shared data found for this eID.' });
    }

    const currentDate = new Date();

    // Check expiration dates
    const response = sharedData.map(data => {
      const expDate = new Date(data.expdate); // Assuming expdate is stored as a date string
      if (currentDate >= expDate) {
        return { ...data._doc, accessExpired: true, message: 'Access duration has expired.' };
      }
      return { ...data._doc, accessExpired: false }; // Indicate that access is valid
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching shared data:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  shareSelectedData,
  getSharedDataByEID,
};
