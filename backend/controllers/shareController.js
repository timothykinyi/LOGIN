const User = require('../models/User'); // The original user schema
const DataShare = require('../models/SharedData'); // The DataShare schema
const { v4: uuidv4 } = require('uuid'); // Generate unique IDs

// Share Data

const storeSelectedData = async (req, res) => {
  try {
    const {selectedFields, expiryDate, viewOnce, eID} = req.body;
    // Validate selected fields
    if (!selectedFields || selectedFields.length === 0) {
      return res.status(400).json({ message: 'No valid fields selected' });
    }

    // Fetch the Comp model using compId (cID)
    const user = await User.findOne({ eID: eID }); // Use findOne with the cID field
    if (!user) {
      return res.status(404).json({ message: 'person not found' });
    }

    const selectedData = selectedFields.reduce((acc, field) => {
      acc[field] = true;  // Set each field to true or a relevant value
      return acc;
    }, {});

    const dataID = uuidv4();
    const dataShare = new DataShare({ eID, dataID, selectedData, expiryTime, viewOnce });
    await dataShare.save();

    res.status(200).json({ message: 'Selected data stored successfully', Dataid: dataID });
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
