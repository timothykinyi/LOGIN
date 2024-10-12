const SharedData = require('../models/SharedData');

// Share selected data
const shareSelectedData = async (req, res) => {
  const { selectedData } = req.body;

  if (!selectedData || typeof selectedData !== 'object') {
    return res.status(400).json({ error: 'Invalid selected data' });
  }


  try {
    const { eID } = req.body; // Assuming eID is sent in the request

    const generatedID = () => {
        return Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
      };

      const gendid = generatedID();
    const newShare = new SharedData({
      eID,
      sharedData: selectedData,
      dID: gendid,
    });

    const savedShare = await newShare.save();

    // Generate a shareable link or ID (you can customize this)
    const shareId = savedShare.dID; // Use the MongoDB ID for sharing
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
      const sharedData = await SharedData.find({ eID: parseInt(eID) }); // Ensure eID is an integer
  
      if (sharedData.length === 0) {
        return res.status(404).json({ message: 'No shared data found for this eID.' });
      }
  
      res.json(sharedData);
    } catch (error) {
      console.error('Error fetching shared data:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  module.exports = {
    shareSelectedData,
    getSharedDataByEID, // Add this line to export the new function
  };

