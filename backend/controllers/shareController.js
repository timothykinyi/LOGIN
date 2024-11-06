const User = require('../models/User'); // The original user schema
const DataShare = require('../models/SharedData'); // The DataShare schema
const { v4: uuidv4 } = require('uuid'); // Generate unique IDs

// Share Data

const storeSelectedData = async (req, res) => {
  try {
    const { selectedFields, expiryTime, viewOnce, eID } = req.body; 

    // Debug log for incoming data
    console.log("Incoming data:", req.body);

    // Validate selected fields
    if (!selectedFields || selectedFields.length === 0) {
      return res.status(400).json({ message: 'No valid fields selected' });
    }

    // Validate expiryTime and set a fallback (optional)
    if (!expiryTime) {
      return res.status(400).json({ message: 'expiryTime is required' });
    }

    // Fetch the User model using eID
    const user = await User.findOne({ eID: eID });
    if (!user) {
      return res.status(404).json({ message: 'Person not found' });
    }

    // Convert selectedFields into a nested object for dot notation
    const selectedData = selectedFields.reduce((acc, field) => {
      const keys = field.split('.');
      keys.reduce((nestedAcc, key, index) => {
        if (index === keys.length - 1) {
          nestedAcc[key] = true;
        } else {
          nestedAcc[key] = nestedAcc[key] || {};
        }
        return nestedAcc[key];
      }, acc);
      return acc;
    }, {});

    // Debug log to check selectedData structure
    console.log("Constructed selectedData:", selectedData);

    // Generate dataID and create a new DataShare instance
    const dataID = uuidv4();
    const dataShare = new DataShare({
      eID,
      dataID,
      selectedData,
      expiryTime,
      viewOnce
    });

    // Debug log to check DataShare object before saving
    console.log("DataShare object to save:", dataShare);

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
