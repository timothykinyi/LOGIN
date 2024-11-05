const SelectedData  = require('../models/SharedData');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');


  const storeSelectedData = async (req, res) => {
    try {
      const { selectedFields, compId, expiryDate, viewOnce } = req.body;
  
      // Check if required data is present
      if (!selectedFields || !compId || !expiryDate) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }
  
      // Retrieve user data based on selected fields
      const userId = req.user.id; // Ensure you have middleware to set req.user
      const userData = await User.findById(userId).select(selectedFields.join(' '));
  
      if (!userData) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Prepare data to store
      const selectedData = new SelectedData({
        compId,
        did: generateUniqueId(), // Implement this function to create a unique ID
        expiry: new Date(expiryDate),
        data: userData.toObject(), // Convert mongoose document to plain object
      });
  
      await selectedData.save();
  
      res.status(200).json({ message: 'Data stored successfully.', did: selectedData.did });
    } catch (error) {
      console.error('Error sharing user data:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  
  // Helper function to generate a unique ID
  const generateUniqueId = () => {
    return `did-${Date.now()}`; // Example of generating a unique ID, adjust as necessary
  };


// Auto-delete expired data every hour
const deleteExpiredData = async () => {
  try {
    await SelectedData.deleteMany({ expiry: { $lt: new Date() } });
    console.log('Expired data removed.');
  } catch (error) {
    console.error('Error deleting expired data:', error);
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
  storeSelectedData,
  deleteExpiredData,
  getSharedDataByEID,
};
