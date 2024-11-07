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
    const eID = dataShare.eID;
    // Convert selectedData to plain object if it's stored as Map
    const selectedData = dataShare.selectedData instanceof Map
      ? Object.fromEntries(dataShare.selectedData)
      : dataShare.selectedData;

    console.log("Selected Data:", selectedData);

    const retrieveDataByKey = async (key, eID) => {
      switch (key) {
        case 'contacts':
          return await Contact(eID);
        case 'education':
          return await Education(eID);
        case 'employment':
          return await Employment(eID);
        case 'finance':
          return await Finance(eID);
        case 'health':
          return await Health(eID);
        case 'personalinfo':
          return await Personal(eID);
        case 'preference':
          return await Preference(eID);
        default:
          return null;
      }
    };

    // Fetch the User document using the eID from dataShare
    const user = await User.findOne({ eID: dataShare.eID }).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const retrievedData = {};

    // Iterate over selectedData and fetch data accordingly
    for (const key in selectedData) {
      if (selectedData[key] === true) {
        // Fetch data for the key
        const data = await retrieveDataByKey(key, user.eID);
        if (data) {
          retrievedData[key] = data;
        }
      } else if (typeof selectedData[key] === 'object') {
        // Nested object selection
        const nestedData = await retrieveDataByKey(key, user.eID);

        if (nestedData && Array.isArray(nestedData)) {
          // Filter based on selected subfields in nested objects
          retrievedData[key] = nestedData.map(item => {
            const selectedItem = {};
            for (const subKey in selectedData[key]) {
              if (selectedData[key][subKey] === true) {
                selectedItem[subKey] = item[subKey];
              }
            }
            return selectedItem;
          });
        }
      }
    }

    console.log("Retrieved Data:", retrievedData);

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

const Contact = async (eID) => {
  try {
    // Find user by eID and return preferences if user exists
    const user = await User.findOne({ eID });
    if (!user) {
      return ('User not found');
    }

    return(user.contacts);
  } catch (error) {
    console.error('Error retrieving preferences:', error);
    return( 'Server error, please try again');
  }
};

const Education = async (eID) => {
  try {

    if (eID) {
      // If eID is provided, find the specific user and return their education data
      const user = await User.findOne({ eID });
      if (!user) {
        return ('User not found');
      }
      return(user.education );
    }else{
    return ('no user found')
    }
  } catch (error) {
    console.error('Error fetching education data:', error);
    return('An error occurred while fetching education data');
  }
};

const Employment = async (eID) => {
  try {

    if (eID) {
      // If eID is provided, find the specific user and return their employment data
      const user = await User.findOne({ eID });
      if (!user) {
        return ('User not found');
      }
      return (user.employment);
    }else{
    return ('No user found')
    }

  } catch (error) {
    console.error('Error fetching employment data:', error);
    return('An error occurred while fetching employment data');
  }
};

const Finance = async (eID) => {
  try {
    // Find user by eID and return financial data if user exists
    const user = await User.findOne({ eID });
    if (!user) {
        return ('User not found');
    }

    return (user.finance);
} catch (error) {
    console.error('Error retrieving finance:', error);
    return('Server error, please try again');
}
};

const Health = async (eID) => {
  try {
    const healthData = await HealthData.find();
    return( healthData );
  } catch (error) {
    console.error('Error fetching health data:', error);
    return ('An error occurred while fetching health data');
  }
};

const Personal = async (eID) => {
  try {
    // Find user by eID and return preferences if user exists
    const user = await User.findOne({ eID });
    if (!user) {
      return ('User not found');
    }

    return (user.personalinfo );
  } catch (error) {
    console.error('Error retrieving preferences:', error);
    return ( 'Server error, please try again');
  }
};

const Preference = async (eID) => {
  try {
    // Find user by eID and return preferences if user exists
    const user = await User.findOne({ eID });
    if (!user) {
      return ('User not found' );
    }

    return (user.preference);
  } catch (error) {
    console.error('Error retrieving preferences:', error);
    return ('Server error, please try again');
  }
};

module.exports = {
  storeSelectedData,
  getSelectedData,
};
