const User = require('../models/User'); // The original user schema
const DataShare = require('../models/SharedData'); // The DataShare schema
const { v4: uuidv4 } = require('uuid'); // Generate unique IDs

// Share Data
const shareData = async (req, res) => {
  try {
    const { userId, selectedFields, expiryHours } = req.body;
    
    // Fetch user data
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Select specified fields
    const sharedData = {};
    selectedFields.forEach(field => {
      if (user[field] !== undefined) {
        sharedData[field] = user[field];
      }
    });

    // Generate a unique dataID
    const dataID = uuidv4();
    
    // Calculate expiry time
    const expiryTime = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    // Save to DataShare collection
    const dataShare = new DataShare({ dataID, sharedData, expiryTime });
    await dataShare.save();

    res.status(201).json({ dataID, expiryTime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sharing data' });
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
  shareData,
  getData,
};
