const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const { generateAlphanumericVerificationCode } = require('../services/verificationcode');
const { generateRegistrationOptions, verifyRegistrationResponse } = require('@simplewebauthn/server');
const sendEmail = require('../services/emailService');
require('dotenv').config();

const getWebAuthnOptions = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate WebAuthn challenge
    const registrationOptions = generateRegistrationOptions({
      rpName: 'own-my-data.web.app',
      userID: user.eID.toString(),
      userName: user.email,
      attestationType: 'direct',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',  // Use platform authenticator (e.g., fingerprint on device)
        userVerification: 'required',         // Ensure user verification (e.g., fingerprint)
      },
    });

    // Store the challenge temporarily for later verification
    user.challenge = registrationOptions.challenge;
    await user.save();

    res.json(registrationOptions);  // Send challenge to the client
  } catch (error) {
    console.error('Error generating WebAuthn options:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const handleWebAuthnRegistration = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the WebAuthn response from the user (includes fingerprint data)
    const verification = await verifyRegistrationResponse({
      credential: req.body,                // The credential object from the client
      expectedChallenge: user.challenge,   // The stored challenge
      expectedOrigin: 'https://own-my-data.web.app',  // Origin must match
      expectedRPID: 'own-my-data.web.app',
      requireUserVerification: true,
    });

    if (verification.verified) {
      // Save the WebAuthn data for this user
      user.credentialID = verification.credentialID;
      user.publicKey = verification.credentialPublicKey;
      user.counter = verification.counter;
      user.credentialType = verification.credentialType || 'public-key';
      user.transports = req.body.response.transports || [];

      await user.save();
      res.status(201).json({ message: 'WebAuthn registration successful' });
    } else {
      res.status(400).json({ message: 'Verification failed' });
    }
  } catch (error) {
    console.error('Error during WebAuthn registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const registerUser = async (req, res) => {
  const { fullName, email, password, confirmPassword, phoneNumber, username, dateOfBirth, gender, category } = req.body;

  const isDateValid = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const enteredDate = new Date(date);
    return enteredDate <= today;
  };

  const isDate18Valid = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const enteredDate = new Date(date);
    const minAgeDate = new Date(today.setFullYear(today.getFullYear() - 18));
    return enteredDate < minAgeDate;
  };

  const isDate18upValid = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const enteredDate = new Date(date);
    const minAgeDate = new Date(today.setFullYear(today.getFullYear() - 18));
    return enteredDate > minAgeDate;
  };

  if (!isDateValid(dateOfBirth)) {
    return res.status(400).json({ message: 'Date cannot be past today.' });
  }else if(category == 'Self' && (!isDate18Valid(dateOfBirth)))
  {
    return res.status(400).json({ message: 'You have to be at least 18 years old to join this site or have your parents open an account for you' });
  } else if  (category == 'Child' && (!isDate18upValid(dateOfBirth)))
  {
    return res.status(400).json({ message: 'You have to be less than 18 years old to join this site as a child.' });
  }
  

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  } else if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  } else if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least one uppercase letter.' });
  } else if (!/[a-z]/.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least one lowercase letter.' });
  } else if (!/\d/.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least one number.' });
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least one special character.' });
  }

  try {
// Check if user already exists
let user = await User.findOne({ $or: [{ email }, { username }] });
if (user) {
  return res.status(400).json({ message: 'User already exists' });
}

// Generate verification code
const alphanumericCode = generateAlphanumericVerificationCode(6);
const subject = "Verification - " + alphanumericCode;

// HTML message with inline CSS
const vermessage = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
      /* You can include some basic CSS for email clients */
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
        padding: 0;
        margin: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      .email-header {
        background-color: #0171ad;
        padding: 20px;
        text-align: center;
        color: #ffffff;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      .email-body {
        padding: 20px;
      }
      .email-body h2 {
        color: #333;
        font-size: 24px;
      }
      .email-body p {
        line-height: 1.5;
        margin-bottom: 20px;
        color: #555;
      }
      .verification-code {
        display: inline-block;
        background-color: #f0f0f0;
        padding: 10px 20px;
        font-size: 20px;
        letter-spacing: 2px;
        font-weight: bold;
        color: #0171ad;
        margin-bottom: 20px;
        border-radius: 4px;
      }
      .email-footer {
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #999;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h1>eID Verification</h1>
      </div>
      <div class="email-body">
        <h2>Dear ${username},</h2>
        <p>Thank you for registering with eID. Please use the following verification code to complete your registration:</p>
        <p class="verification-code">${alphanumericCode}</p>
        <p>
          Follow this link to verify your account:<br />
          <a href="https://own-my-data.web.app/verification" style="color: #0171ad; text-decoration: none;">https://own-my-data.web.app/verification</a>
        </p>
        <p>Best regards,<br />The eID Team</p>
      </div>
      <div class="email-footer">
        <p>&copy; 2024 eID. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;

// Send verification email
try {
  await sendEmail(email, subject, vermessage);
  console.log('Email sent successfully');
} catch (error) {
  console.error('Error sending email:', error);
  return res.status(500).json({ message: 'Error sending verification email' });
}


    // Generate E ID (minimum 6-digit number)
    const generateEID = () => {
      return Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
    };

    const eID = generateEID();

    // Format the date of birth using moment
    const formattedDateOfBirth = moment(dateOfBirth).format('YYYY-MM-DD');

    // Create new user
    user = new User({
      fullName,
      email,
      password,
      phoneNumber,
      username,
      dateOfBirth: formattedDateOfBirth,
      gender,
      category,
      eID,
      verificationCode: alphanumericCode,
      isVerified: false,
      active: false,
      resetPasswordToken: "undefined",
      resetPasswordExpires: "undefined",
    });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Server error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
/*
  try {
    const newFields = {
      active: false,
    };

    const updateFields = {};
    for (const [key, value] of Object.entries(newFields)) {
        updateFields[key] = { $ifNull: [`$${key}`, value] };
    }
    

    await User.updateMany(
      {
        $or: Object.keys(newFields).map((key) => ({ [key]: { $exists: false } })),
      },
      { $set: newFields }
    );

    console.log('New fields added to users that were missing them');
  } catch (error) {
    console.error('Error updating users:', error);
  }
*/

  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your account first' });
    }
    if (user.category == 'Child') {
      const isDate18Valid = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const enteredDate = new Date(date);
        const minAgeDate = new Date(today.setFullYear(today.getFullYear() - 18));
        return enteredDate < minAgeDate;
      };
      if (!isDate18Valid(user.dateOfBirth)) {
        user.category = 'Self';
        await user.save();
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password '});
    }
    user.active = true;
    await user.save();
    const token = jwt.sign({ id: user._id, eID: user.eID, username: user.username, email: user.email, category: user.category }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token ,eID: user.eID, category: user.category});
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};

const verifyUser = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Account verified successfully' });
  } catch (error) {
    console.error('Server error during verification:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateEmail = async (req, res) => {
  const { oldEmail, newEmail } = req.body;

  try {
    const user = await User.findOne({ email: oldEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.email = newEmail;
    await user.save();
    const subject = "Verification - " + user.verificationCode;
    const vermessage = `Dear ${user.username},

Thank you for registering with eID. Please use the following verification code to complete your registration:

Verification Code: ${user.verificationCode}

Follow this link https://own-my-data.web.app/verification to verify your account

Best regards,
eID`;
    try {
      await sendEmail(email, subject, vermessage);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending verification email' });
    }
    try {
      const token = jwt.sign({ id: user._id, username: user.username, email: user.email, category: user.category }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      res.status(200).json({ message: 'Email updated successfully', token });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred token' });
    }

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating email' });
  }
};

const resendVerificationCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email});
    if (!user) {
      return res.status(404).json({ message: 'User not found register first and try again.' });
    }


    const subject = "Verification - " + user.verificationCode;
    const vermessage = `Dear ${user.username},

Thank you for registering with eID. Please use the following verification code to complete your registration:

Verification Code: ${user.verificationCode}

Follow this link https://own-my-data.web.app/verification to verify your account

Best regards,
eID`;
    try {
      await sendEmail(user.email, subject, vermessage);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending verification email' });
    }

    res.status(200).json({ message: 'Verification code sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while sending verification code.' });
  }
};

const newrecoverPassword = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.passwordRecoveryToken = token;
    user.tokenExpiry = moment().add(1, 'hour').toDate();
    

    // Send the recovery email
    const subject = 'Password Reset Request';
    const message = `Dear ${user.username},

You have requested to reset your password. Please use the following token to reset your password:

Password Reset Token: ${user.passwordRecoveryToken}

Follow this link https://own-my-data.web.app/reset-password to reset your password.

This token is valid for 1 hour. 

Best regards,
eID`;

    try {
      await sendEmail(user.email, subject, message);
      await user.save();
      res.status(200).json({ message: 'Password recovery email sent successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending password recovery email' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during password recovery.' });
  }
};

const resetPassword = async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.passwordRecoveryToken !== verificationCode) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    if (moment().isAfter(user.tokenExpiry)) {
      return res.status(400).json({ message: 'Token has expired' });
    }

    user.password = newPassword;
    user.passwordRecoveryToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during password reset.' });
  }
};

const logout = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.active = false;
    await user.save();

    res.status(200).json({ message: 'User logged out successfully.' });
  } catch (error) {
    console.error('Logout failed:', error);
    res.status(500).json({ message: 'Logout failed.' });
  }
};

const changeusername = async (req, res) => {
  const { lemail, newUsername } = req.body;

  try {
    const user = await User.findOne({ email: lemail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let checkuser = await User.findOne({ newUsername });
    if (checkuser) {
      return res.status(400).json({ message: 'Username already exists try a different one.' });
    }
    user.username = newUsername;
    await user.save();
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, category: user.category }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'Username updated successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating Username' });
  }
};

const changepassword = async (req, res) => {
  const { lemail, newPassword } = req.body;

  try {
    const user = await User.findOne({ email: lemail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, category: user.category }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'Password updated successfully', token});
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating password' });
  }
};

const changephonenumber = async (req, res) => {
  const { lemail, newPhoneNumber } = req.body;

  try {
    const user = await User.findOne({ email: lemail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.phoneNumber = newPhoneNumber;
    await user.save();
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, category: user.category }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'Phone number updated successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating phone number' });
  }
};

const changeemail = async (req, res) => {
  const { lemail, newEmail } = req.body;

  try {
    const user = await User.findOne({ email: lemail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let checkuser = await User.findOne({ newEmail });
    if (checkuser) {
      return res.status(400).json({ message: 'Email already exists try a different one.' });
    }
    user.email = newEmail;
    await user.save();
    const subject = "Verification - " + user.verificationCode;
    const vermessage = `Dear ${user.username},

Thank you for registering with eID. Please use the following verification code to complete your registration:

Verification Code: ${user.verificationCode}

Follow this link https://own-my-data.web.app/verification to verify your account

Best regards,
eID`;
    try {
      await sendEmail(lemail, subject, vermessage);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending verification email' });
    }
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, category: user.category }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'Email updated successfully', token});
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating Email' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerUser,
  login,
  verifyUser,
  updateEmail,
  resendVerificationCode,
  newrecoverPassword,
  resetPassword,
  changeusername,
  changepassword,
  changephonenumber,
  changeemail,
  logout,
  getUser,
  getWebAuthnOptions,
  handleWebAuthnRegistration,
};
