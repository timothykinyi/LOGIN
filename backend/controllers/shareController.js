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

    // Fetch the DataShare document using dataID
    const dataShare = await DataShare.findOne({ dataID }).lean();
    if (!dataShare || !dataShare.selectedData) {
      return res.status(404).json({ message: 'No shared data found for the given ID and eID' });
    }

    // Convert selectedData to a plain object if it's stored as Map
    const selectedData = dataShare.selectedData instanceof Map
      ? Object.fromEntries(dataShare.selectedData)
      : dataShare.selectedData;

    console.log("Selected Data Structure:", selectedData);

    // Fetch the User document using the eID from dataShare
    const user = await User.findOne({ eID: dataShare.eID }).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("User Data:", user);

    // Recursive function to retrieve selected fields, including deeply nested data
    const retrieveSelectedFields = (selection, data) => {
      const result = {};

      for (const [key, value] of Object.entries(selection)) {
        if (typeof value === 'object' && value !== null) {
          // Check for nested selection and data
          if (data[key] && typeof data[key] === 'object') {
            const nestedData = retrieveSelectedFields(value, data[key]);
            if (Object.keys(nestedData).length > 0) {
              result[key] = nestedData;
            }
          }
        } else if (value === true) {
          // Direct field selection
          if (data[key] !== undefined) {
            result[key] = data[key];
          }
        }
      }

      return result;
    };

    // Retrieve data based on selectedData structure
    const retrievedData = retrieveSelectedFields(selectedData, user);

    console.log("Retrieved Data:", retrievedData); // Debugging to check the retrieved data

    // Send retrieved data if found, or a 404 if no matching data
    if (Object.keys(retrievedData).length > 0) {
      res.status(200).json({ message: 'Data retrieved successfully', data: retrievedData });
    } else {
      res.status(404).json({ message: 'No matching data found' });
    }

  } catch (error) {
    console.error("Error retrieving selected data:", error);
    res.status(500).json({ message: 'Error retrieving selected data', error: error.message });
  }
};





module.exports = {
  storeSelectedData,
  getSelectedData,
};
