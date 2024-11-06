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
  if (!userData || !selectedData) {
    console.error("Invalid userData or selectedData", userData, selectedData);
    return {}; // Return empty object if either is invalid
  }

  console.log('Filtering data with userData:', userData); // Log user data before filtering
  console.log('Using selectedData:', selectedData); // Log selected data for transparency

  return Object.keys(selectedData).reduce((filteredData, field) => {
    const value = userData[field];
    if (value) {
      filteredData[field] = value;
    } else {
      console.log(`Field '${field}' not found in user data`); // Log if field is not found
    }
    return filteredData;
  }, {});
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

    res.status(200).json(filteredData);
    
  } catch (error) {
    console.error('Error retrieving selected data:', error);
    res.status(500).json({ message: 'Error retrieving selected data', error });
  }
};

module.exports = {
  storeSelectedData,
  retrieveSelectedData,
};
