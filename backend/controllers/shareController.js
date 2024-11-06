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

const filterData = (userData, selectedData) => {
  const filteredData = {};

  // Check if selectedData exists and is an object
  if (!selectedData || typeof selectedData !== 'object') {
    throw new Error('Invalid selectedData format');
  }

  // Loop through the selectedData to filter the relevant fields from the user data
  for (const [field, selection] of Object.entries(selectedData)) {
    if (selection === true) {
      // If the field is a simple boolean (like 'email'), add it directly
      if (typeof userData[field] !== 'undefined') {
        filteredData[field] = userData[field];
      }
    } else if (typeof selection === 'object') {
      // If the field has nested selected data (like 'personalinfo')
      if (userData[field]) {
        filteredData[field] = {};
        for (const [nestedField, isSelected] of Object.entries(selection)) {
          if (isSelected && userData[field][nestedField] !== undefined) {
            filteredData[field][nestedField] = userData[field][nestedField];
          }
        }
      }
    }
  }

  return filteredData;
};

const retrieveSelectedData = async (req, res) => {
  try {
    const { dataID } = req.params;

    // Fetch the DataShare document by dataID
    const dataShare = await DataShare.findOne({ dataID });
    console.log('DataShare:', dataShare); // Log dataShare to check its content

    if (!dataShare) {
      return res.status(404).json({ message: 'Data not found for the provided ID' });
    }

    const { eID, selectedData } = dataShare;

    // Fetch the User data by eID
    const user = await User.findOne({ eID });
    console.log('User:', user); // Log user data to check its content

    if (!user) {
      return res.status(404).json({ message: 'User not found for the provided eID' });
    }

    // Check if selectedData is valid
    if (!selectedData) {
      return res.status(400).json({ message: 'Selected data is missing in DataShare' });
    }

    // Pass the user data and selectedData to filterData
    const filteredData = filterData(user, selectedData);

    // Return the filtered data to the frontend
    res.status(200).json(filteredData);

  } catch (error) {
    console.error('Error retrieving selected data:', error);
    res.status(500).json({ message: 'Error retrieving selected data', error: error.message });
  }
};

module.exports = {
  storeSelectedData,
  retrieveSelectedData,
};
