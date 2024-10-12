// Import fido2-lib properly
const { Fido2Lib } = require('fido2-lib');

// Initialize Fido2Lib
const fido2 = new Fido2Lib({
    timeout: 60000,
    rpId: "https://own-my-data.web.app",
    rpName: "Fingerprint PWA"
});

/// Controller to get fingerprint challenge
exports.getFingerprintChallenge = async (req, res) => {
    try {
        // Generate the options, which includes the challenge
        const options = await fido2.assertionOptions();
        
        // Send the challenge and other options to the client
        res.json({
            challenge: Buffer.from(options.challenge).toString('base64'),
            ...options  // This spreads the rest of the options returned by fido2-lib
        });
    } catch (error) {
        console.error('Error generating challenge:', error);
        res.status(500).json({ error: 'Failed to generate challenge' });
    }
};

// Controller to verify fingerprint authentication
exports.verifyFingerprint = (req, res) => {
    const { success } = req.body;

    if (success) {
        return res.json({ success: true });
    }
    return res.json({ success: false });
};