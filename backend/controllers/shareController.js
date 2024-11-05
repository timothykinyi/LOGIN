const SelectedData  = require('../models/SharedData');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');


// Utility function to extract nested data based on selected fields
const extractSelectedData = (data, selectedFields) => {
  const result = {};

  selectedFields.forEach(field => {
    // Handle deeply nested fields like 'personalinfo.firstName'
    const keys = field.split('.');
    let value = data;

    // Traverse the nested structure
    for (let key of keys) {
      if (value[key] === undefined) {
        value = undefined;
        break;
      }
      value = value[key];
    }

    // If the value is still undefined, check if it's a top-level property
    if (value === undefined) {
      // Check for direct existence in the data object
      value = data[field];
    }

    // Assign the found value if it exists
    if (value !== undefined) {
      result[field] = value;
    }
  });

  return result;
};

const storeSelectedData = async (req, res) => {
  const { selectedFields, compId, expiryDate, viewOnce } = req.body;

  try {
    // Fetch user data based on the compId
    const user = await User.findOne({ compId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Filter data according to selected fields using the helper function
    const selectedData = extractSelectedData(user.toObject(), selectedFields);

    // Generate a unique DID
    const did = uuidv4();

    // Set expiry date
    const expiry = viewOnce ? new Date(Date.now() + 1 * 60 * 1000) : new Date(expiryDate); // 1 min for view-once

    // Store data in SelectedData collection
    const newData = new SelectedData({
      compId,
      did,
      expiry,
      data: selectedData,
    });

    await newData.save();
    res.status(200).json({ message: 'Data stored successfully', did });
  } catch (error) {
    console.error('Error storing user data:', error); // Add more details here if needed
    res.status(500).json({ message: 'Failed to store data', error: error.message }); // Send error message in response
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
