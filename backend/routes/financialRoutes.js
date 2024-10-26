const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Endpoint to update preferences based on eID, allowing multiple entries
router.post('/', async (req, res) => {
    const { eID, entries } = req.body;

    try {
        // Check if user with given eID exists
        const user = await User.findOne({ eID });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add each entry to the user's finance array
        entries.forEach(entry => {
            const financialInfo = {
                bankAccountNumber: entry.bankAccountNumber,
                bankName: entry.bankName,
                income: entry.income,
                creditScore: entry.creditScore,
                taxId: entry.taxId,
                mobileNumber: entry.mobileNumber
            };
            user.finance.push(financialInfo);
        });

        // Save the user with updated financial info
        await user.save();

        res.status(200).json({ message: 'Financial info updated successfully' });
    } catch (error) {
        console.error('Error updating finance:', error);
        res.status(500).json({ message: 'Server error, please try again' });
    }
});

// Retrieve all financial information based on eID
router.get('/all', async (req, res) => {
    const { eID } = req.query;

    try {
        // Find user by eID and return financial data if user exists
        const user = await User.findOne({ eID });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ data: user.finance });
    } catch (error) {
        console.error('Error retrieving finance:', error);
        res.status(500).json({ message: 'Server error, please try again' });
    }
});

module.exports = router;
