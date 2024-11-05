const SelectedData  = require('../models/SharedData');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

const storeSelectedData = async (req, res) => {
  const { selectedFields, compId, expiryDate, viewOnce } = req.body;

  try {
    // Fetch the user data based on the selected fields
    const userId = req.user.id; // Assume you have user ID from authentication middleware
    const userData = await User.findById(userId).select(selectedFields.join(' '));

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new SelectedData entry
    const did = uuidv4(); // Generate a unique ID for the data sharing
    const selectedData = new SelectedData({
      compId,
      did,
      expiry: viewOnce ? null : new Date(expiryDate), // Set expiry date if not "View Once"
      data: userData.toObject(), // Convert mongoose document to plain object
    });

    // Save the selected data
    await selectedData.save();

    // Return success response
    return res.status(200).json({ did }); // Return the data ID for reference
  } catch (error) {
    console.error('Error sharing user data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
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
