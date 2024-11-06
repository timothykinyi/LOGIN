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

  // Iterate over each field in selectedData
  for (const [field, selection] of Object.entries(selectedData)) {
    // Check if it's a boolean (simple field selection) or an object (nested selection)
    if (selection === true) {
      // If selectedData requests this field, check if it's in userData
      if (userData[field] !== undefined) {
        filteredData[field] = userData[field];
      }
    } else if (typeof selection === 'object') {
      // If it's an object, we assume it's a nested structure
      if (userData[field]) {
        filteredData[field] = {};
        // Loop through the nested fields within the selectedData
        for (const [nestedField, isSelected] of Object.entries(selection)) {
          if (isSelected && userData[field][nestedField] !== undefined) {
            filteredData[field][nestedField] = userData[field][nestedField];
          }
        }
      }
    }
  }

  console.log(filteredData);
  return filteredData;
};

// Example of how to use this:
const retrieveSelectedData = async (req, res) => {
  try {
    const { dataID } = req.params;

    // Fetch the DataShare document by dataID
    const dataShare = await DataShare.findOne({ dataID });

    if (!dataShare) {
      return res.status(404).json({ message: 'Data not found for the provided ID' });
    }

    const { eID, selectedData } = dataShare;

    // Fetch the User data by eID
    const user = await User.findOne({ eID });

    if (!user) {
      return res.status(404).json({ message: 'User not found for the provided eID' });
    }

    // Ensure selectedData is not empty
    if (!selectedData) {
      return res.status(400).json({ message: 'No data selected for retrieval' });
    }

    // Filter the user data based on the selected fields
    const filteredData = filterData(user, selectedData);

    // Return the filtered data to the frontend
    console.log(filteredData);
    return res.status(200).json(filteredData);


  } catch (error) {
    console.error('Error retrieving selected data:', error);
    return res.status(500).json({ message: 'Error retrieving selected data', error: error.message });
  }
};


module.exports = {
  storeSelectedData,
  retrieveSelectedData,
};
