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

const getSelectedData = async (req, res) => {
  try {
    const { dataID } = req.params;

    // Step 1: Fetch the DataShare document using dataID
    const dataShare = await DataShare.findOne({ dataID });
    if (!dataShare) {
      return res.status(404).json({ message: 'No shared data found for the given ID' });
    }

    // Extract `selectedData` structure and `eID` from DataShare
    const selectedData = dataShare.selectedData;
    const eID = dataShare.eID;

    // Step 2: Fetch the User document using eID
    const user = await User.findOne({ eID });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 3: Build the response based on `selectedData` structure
    const retrieveData = (selectedFields, userData) => {
      const result = {};

      for (const key in selectedFields) {
        if (selectedFields[key] === true) {
          const keys = key.split('.'); // Split the key by dot notation for nested properties
          let value = userData;

          for (const k of keys) {
            // Navigate through each level, checking if the property exists
            if (value && k in value) {
              value = value[k];
            } else {
              value = undefined; // Stop if any part of the path is missing
              break;
            }
          }

          // Only add the field to the result if a valid value was found
          if (value !== undefined) {
            let nestedResult = result;
            for (let i = 0; i < keys.length - 1; i++) {
              const nestedKey = keys[i];
              if (!nestedResult[nestedKey]) nestedResult[nestedKey] = {}; // Ensure the parent object exists
              nestedResult = nestedResult[nestedKey];
            }
            nestedResult[keys[keys.length - 1]] = value; // Set the final nested value
          }
        }
      }
      return result;
    };

    // Debugging: Log selectedData, user data, and the result
    console.log('Selected Data:', selectedData);
    console.log('User Data:', user);

    // Step 4: Retrieve data based on selectedData structure
    const retrievedData = retrieveData(selectedData, user);

    console.log('Retrieved Data:', retrievedData); // Log the final data

    // Send the response with retrieved data or handle empty results
    if (Object.keys(retrievedData).length > 0) {
      res.status(200).json({ message: 'Data retrieved successfully', data: retrievedData });
    } else {
      res.status(404).json({ message: 'No matching data found' });
    }

  } catch (error) {
    console.error('Error retrieving selected data:', error);
    res.status(500).json({ message: 'Error retrieving selected data', error });
  }
};








module.exports = {
  storeSelectedData,
  getSelectedData,
};
