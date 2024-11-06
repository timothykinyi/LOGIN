const User = require('../models/User'); // The original user schema
const DataShare = require('../models/SharedData'); // The DataShare schema
const { v4: uuidv4 } = require('uuid'); // Generate unique IDs

// Share Data

const storeSelectedData = async (req, res) => {
  try {
    const { selectedFields, expiryDate, viewOnce, eID } = req.body;

    // Validate selected fields
    if (!selectedFields || selectedFields.length === 0) {
      return res.status(400).json({ message: 'No valid fields selected' });
    }

    // Fetch the User model using eID
    const user = await User.findOne({ eID: eID });
    if (!user) {
      return res.status(404).json({ message: 'Person not found' });
    }

    // Convert selectedFields into a nested object
    const selectedData = selectedFields.reduce((acc, field) => {
      const keys = field.split('.'); // Split fields by dot notation
      keys.reduce((nestedAcc, key, index) => {
        if (index === keys.length - 1) {
          nestedAcc[key] = true;  // Set the final key to true
        } else {
          nestedAcc[key] = nestedAcc[key] || {}; // Create nested object if it doesn't exist
        }
        return nestedAcc[key];
      }, acc);
      return acc;
    }, {});

    // Ensure expiryDate is provided
    if (!expiryDate) {
      return res.status(400).json({ message: 'expiryDate is required' });
    }

    // Generate dataID and create new DataShare instance
    const dataID = uuidv4();
    const dataShare = new DataShare({ eID, dataID, selectedData, expiryDate, viewOnce });
    await dataShare.save();

    res.status(200).json({ message: 'Selected data stored successfully', DataID: dataID });
  } catch (error) {
    console.error('Error storing selected data:', error);
    res.status(500).json({ message: 'Error storing selected data', error });
  }
};


// Retrieve Data
const getData = async (req, res) => {
  try {
    const { dataID } = req.params;
    const dataShare = await DataShare.findOne({ dataID });

    // Check if data exists and is still valid
    if (!dataShare) return res.status(404).json({ error: 'Data not found' });
    if (new Date() > dataShare.expiryTime) {
      // Expired data: optionally, delete it
      await DataShare.deleteOne({ dataID });
      return res.status(410).json({ error: 'Data has expired' });
    }

    res.status(200).json({ sharedData: dataShare.sharedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving data' });
  }
};

module.exports = {
  storeSelectedData,
  getData,
};
