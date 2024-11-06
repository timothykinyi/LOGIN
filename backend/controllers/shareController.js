const User = require('../models/User'); // The original user schema
const DataShare = require('../models/SharedData'); // The DataShare schema
const { v4: uuidv4 } = require('uuid'); // Generate unique IDs

// Share Data

const storeSelectedData = async (req, res) => {
  try {
    const { selectedFields, expiryDate, viewOnce, eID } = req.body; // Use expiryDate as per incoming data

    // Validate selected fields
    if (!selectedFields || selectedFields.length === 0) {
      return res.status(400).json({ message: 'No valid fields selected' });
    }


    // Fetch the User model using eID
    const user = await User.findOne({ eID });
    if (!user) {
      return res.status(404).json({ message: 'Person not found' });
    }

    // Transform selectedFields into a nested structure
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

    const dataID = uuidv4();
    const dataShare = new DataShare({
      eID,
      dataID,
      selectedData,
      expiryTime: expiryDate, // Use the correct field name for saving
      viewOnce,
    });

    await dataShare.save();
    res.status(200).json({ message: 'Selected data stored successfully', DataID: dataID });

  } catch (error) {
    console.error('Error storing selected data:', error);
    res.status(500).json({ message: 'Error storing selected data', error });
  }
};

const retrieveSelectedData = async (req, res) => {
  try {
    const { dataID } = req.params; // Get dataID from request parameters

    // Fetch the DataShare entry using the dataID
    const dataShare = await DataShare.findOne({ dataID });
    if (!dataShare) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Fetch the User associated with the eID
    const user = await User.findOne({ eID: dataShare.eID });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Recursive function to filter user data based on selectedData structure
    const filterData = (source, filter) => {
      const result = {};
      for (const key in filter) {
        if (filter[key] === true) {
          result[key] = source[key]; // Copy the field's value if set to true
        } else if (typeof filter[key] === 'object' && filter[key] !== null) {
          result[key] = filterData(source[key], filter[key]); // Recurse if it's a nested object
        }
      }
      return result;
    };

    // Filter the user data based on the selectedData structure
    const filteredData = filterData(user.toObject(), dataShare.selectedData);

    res.status(200).json({ data: filteredData });
  } catch (error) {
    console.error('Error retrieving selected data:', error);
    res.status(500).json({ message: 'Error retrieving selected data', error });
  }
};


module.exports = {
  storeSelectedData,
  retrieveSelectedData,
};
