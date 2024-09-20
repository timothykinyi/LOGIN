const Allowed = require('../models/eID');

exports.compareEID = async (req, res) => {
  const { eID } = req.body; // Extract eID from request body

  if (!eID) {
    return res.status(400).json({ message: 'eID is required' });
  }

  try {
    // Fetch the allowed eIDs from the database every time a request is made
    const allowedEIDs = await Allowed.find();

    // Assuming 'Allowed.find()' returns an array of objects like [{eID: 'eID1'}, {eID: 'eID2'}]
    const eIDList = allowedEIDs.map(item => item.eID);

    // Check if the provided eID exists in the allowed eID list
    if (eIDList.includes(eID)) {
      res.json({ code: 1 }); // Access granted
    } else {
      res.json({ code: 0 }); // Access denied
    }
  } catch (error) {
    console.error("Error fetching allowed eIDs:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
