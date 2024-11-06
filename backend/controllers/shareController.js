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
    const dataShare = await DataShare.findOne({ dataID });
    if (!dataShare) {
      return res.status(404).json({ message: 'No shared data found for the given ID and eID' });
    }

    // Extract selectedData structure from DataShare
    const selectedData = dataShare.selectedData;
    const eID = dataShare.eID;

    // Fetch the User model using eID
    const user = await User.findOne({ eID });
    if (!user) {
      return res.status(404).json({ message: 'Person not found' });
    }

    // Function to retrieve the nested values from user based on selectedData structure
    const getDataFromUser = (selectedFields, data) => {
      const result = {};

      // Loop over the selectedFields to find out the keys that are true
      for (let field in selectedFields) {
        if (selectedFields[field] === true) {
          const keys = field.split('.'); // Split the field by dot (for nested properties)
          let value = data;

          // Navigate through the nested keys to extract the value
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (value && value[key] !== undefined) {
              value = value[key];
            } else {
              value = null; // If any key does not exist, set the value to null
              break;
            }
          }

          // Only add to result if value exists
          if (value !== null) {
            result[field] = value;
          }
        }
      }

      return result;
    };

    // Debugging: Log the selectedData and user object
    console.log('Selected Data Structure:', selectedData);
    console.log('User Data:', user);

    // Retrieve the data based on selectedData structure
    const retrievedData = getDataFromUser(selectedData, user);

    // Debugging: Log the retrieved data
    console.log('Retrieved Data:', retrievedData);

    // Send the retrieved data as the response
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
