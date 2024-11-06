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
    const { dataID } = req.params; // Assume dataID is passed as a parameter

    // Fetch the DataShare document using dataID
    const dataShare = await DataShare.findOne({ dataID, eID });
    if (!dataShare) {
      return res.status(404).json({ message: 'No shared data found for the given ID and eID' });
    }

    // Extract selectedData structure from DataShare
    const selectedData = dataShare.selectedData;

    // Fetch the User model using eID
    const user = await User.findOne({ eID });
    if (!user) {
      return res.status(404).json({ message: 'Person not found' });
    }

    // Function to retrieve the nested values from user based on selectedData structure
    const getDataFromUser = (selectedFields, data) => {
      const result = {};
      
      selectedFields.forEach(field => {
        const keys = field.split('.');
        let value = data;
        
        keys.forEach(key => {
          if (value && value[key] !== undefined) {
            value = value[key];
          } else {
            value = null; // Field not found
          }
        });

        // Set the result with the final value
        if (value !== null) {
          result[field] = value;
        }
      });
      
      return result;
    };

    // Retrieve the data based on selectedData structure
    const retrievedData = getDataFromUser(Object.keys(selectedData), user);

    // Send the retrieved data as the response
    res.status(200).json({ message: 'Data retrieved successfully', data: retrievedData });

  } catch (error) {
    console.error('Error retrieving selected data:', error);
    res.status(500).json({ message: 'Error retrieving selected data', error });
  }
};


module.exports = {
  storeSelectedData,
  getSelectedData,
};
