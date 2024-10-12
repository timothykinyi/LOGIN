const Fido2Lib = require('fido2-lib');

// Initialize Fido2Lib instance
const fido2 = new Fido2Lib({
    timeout: 60000,
    rpId: "localhost",
    rpName: "Fingerprint PWA"
});

// Controller to get fingerprint challenge
exports.getFingerprintChallenge = async (req, res) => {
    try {
        const challenge = await fido2.assertionOptions();
        challenge.challenge = fido2.generateChallenge();
        
        res.json({
            challenge: Buffer.from(challenge.challenge).toString('base64')
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
