const User = require('../models/User');
const Camp = require('../models/camp');
const Comp = require('../models/camp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const { generateAlphanumericVerificationCode } = require('../services/verificationcode');
const { generateRegistrationOptions, verifyRegistrationResponse } = require('@simplewebauthn/server');
const sendEmail = require('../services/emailService');
require('dotenv').config();
const notificationController = require('../controllers/notificationController');

// Example: Function that sends a message and posts a notification


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
    const vermessage = `Dear ${username},

Thank you for registering with eID. Please use the following verification code to complete your registration:

Verification Code: ${alphanumericCode}

Follow this link https://own-my-data.web.app/verification to verify your account

Best regards,
eID`;

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

const companyregisterUser = async (req, res) => {
  const { fullName, email, password, confirmPassword, username, category } = req.body;

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
    let user = await Camp.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    // Generate verification code
    const alphanumericCode = generateAlphanumericVerificationCode(6);
    const subject = "Verification - " + alphanumericCode;
    const vermessage = `Dear ${fullName},

Thank you for registering your company with eID. Please use the following verification code to complete your registration:

Verification Code: ${alphanumericCode}

Follow this link https://own-my-data.web.app/verification to verify your account

Best regards,
eID`;

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

    const cID = generateEID();

    // Format the date of birth using moment
    // Create new user
    user = new Camp({
      fullName,
      email,
      password,
      username,
      category,
      cID,
      verificationCode: alphanumericCode,
      isVerified: false,
      active: false,
      resetPasswordToken: "undefined",
      resetPasswordExpires: "undefined",
    });
    await user.save();

    res.status(201).json({ message: 'Company registered successfully' });
  } catch (error) {
    console.error('Server error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    
    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your account first' });
    }

    // Age verification if the user is categorized as a "Child"
    if (user.category === 'Child') {
      const isDate18Valid = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset hours to avoid time comparison issues
        const enteredDate = new Date(date);
        const minAgeDate = new Date(today.setFullYear(today.getFullYear() - 18));
        return enteredDate < minAgeDate;
      };

      // Update user category to "Self" if the user is over 18
      if (!isDate18Valid(user.dateOfBirth)) {
        user.category = 'Self';
        await user.save();
      }
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Set user as active upon successful login
    user.active = true;
    await user.save();

    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, eID: user.eID, username: user.username, email: user.email, category: user.category },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Function to send a message and create a notification


    // Send login success notification
    const messageContent = 'You are now logged in';
    await sendMessage(user.eID, messageContent);  // Make sure to await this to handle it asynchronously

    // Respond to the client
    res.json({ message: 'Login successful', token, eID: user.eID, category: user.category });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};

const companyactuallogin = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await Camp.findOne({ email: username });
    
    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid Email' });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your account first' });
    }


    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Set user as active upon successful login
    user.active = true;
    await user.save();

    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, cID: user.cID, username: user.username, email: user.email, category: user.category },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Function to send a message and create a notification


    // Send login success notification
    const messageContent = 'You are now logged in';
    await sendMessage(user.cID, messageContent);  // Make sure to await this to handle it asynchronously

    // Respond to the client
    res.json({ message: 'Login successful', token, cID: user.cID, category: user.category });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Create a predefined mapping of possible data fields
const availableFields = {
  fullName: 'fullName',
  email: 'email',
  phoneNumber: 'phoneNumber',
  dateOfBirth: 'dateOfBirth',
  gender: 'gender',
  category: 'category',
  eID: 'eID',
};

// Function to retrieve selected data from the Comp model
const retrieveStoredData = async (compId) => {
  try {
    // Fetch the Comp model using the custom cID field, not the _id
    const comp = await Comp.findOne({ cID: compId }).lean(); // Use .lean() to get a plain JS object
    if (!comp || !comp.selectedData) {
      throw new Error('No selected data found for this company');
    }

    console.log("Comp object:", comp); // Debugging - check full comp object

    // Convert the Map to an object if it's stored as a Map
    const selectedData = comp.selectedData instanceof Map ? Object.fromEntries(comp.selectedData) : comp.selectedData;

    console.log("Selected data after conversion:", selectedData); // Debugging

    // Return only the valid fields selected by the company
    const selectedFields = [];
    for (const [key, value] of Object.entries(selectedData)) {
      if (value === true && availableFields[key]) {
        selectedFields.push(availableFields[key]);
      }
    }

    console.log("Selected fields:", selectedFields); // Debugging

    return selectedFields;
  } catch (error) {
    console.error("Error retrieving selected data:", error.message);
    throw new Error(`Error retrieving selected data: ${error.message}`);
  }
};

// Main login function
const complogin = async (req, res) => {
  const { username, password, cid } = req.body;

  if (!cid) {
    return res.status(401).json({ message: 'Invalid or missing CID' });
  }

  try {
    const user = await User.findOne({ username });

    console.log("User object:", user); // Debugging - check the user object

    // Check if the user exists and is verified
    if (!user || !user.isVerified) {
      return res.status(401).json({ message: 'Invalid username or account not verified' });
    }

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Set user as active upon successful login
    user.active = true;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, eID: user.eID, username: user.username, email: user.email, category: user.category },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Retrieve the selected data for the associated company
    const selectedDataKeys = await retrieveStoredData(cid);

    console.log("Selected data keys:", selectedDataKeys); // Debugging - check selected data keys

    // Build the user-specific data object based on selected data
    const userSpecificData = selectedDataKeys.reduce((acc, field) => {
      if (user[field] !== undefined) {
        acc[field] = user[field]; // Add valid data to the response object
      } else {
        console.log(`Field ${field} not found in user object`); // Debugging - check missing fields
      }
      return acc;
    }, {});

    console.log("Final user-specific data:", userSpecificData); // Debugging - final output data

    // Send success response with the token and user-specific data
    res.json({
      message: 'Login successful',
      token,
      eID: user.eID,
      category: user.category,
      userSpecificData, // Send only the selected user data to the frontend
    });
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};



const sendMessage = async (nuserId, messageContent) => {
  try {
    // Now create a notification
    const title = 'New Message';
    const message = `You have received a new message: "${messageContent}"`;
    await notificationController.postNotification(nuserId, title, message);
    console.log('Notification sent');
  } catch (error) {
    console.error('Error sending message:', error);
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

const verifyComp = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await Camp.findOne({ email });
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

const updatecompanEmail = async (req, res) => {
  const { oldEmail, newEmail } = req.body;

  try {
    const user = await Camp.findOne({ email: oldEmail });
    if (!user) {
      return res.status(404).json({ message: 'Company email not found'+oldEmail });
    }

    user.email = newEmail;
    await user.save();
    const subject = "Verification - " + user.verificationCode;
    const vermessage = `Dear ${user.fullName},

Thank you for registering with eID. Please use the following verification code to complete your registration:

Verification Code: ${user.verificationCode}

Follow this link https://own-my-data.web.app/companyVerification to verify your account

Best regards,
eID`;
    try {
      await sendEmail(newEmail, subject, vermessage);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending verification email' });
    }
    try {
      const token = jwt.sign({ id: user._id, username: user.fullName, email: user.email, category: user.category }, process.env.JWT_SECRET, {
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

const resendcompanyVerificationCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Camp.findOne({ email});
    if (!user) {
      return res.status(404).json({ message: 'Company not found register first and try again.'+email });
    }


    const subject = "Verification - " + user.verificationCode;
    const vermessage = `Dear ${user.fullName},

Thank you for registering with eID. Please use the following verification code to complete your registration:

Verification Code: ${user.verificationCode}

Follow this link https://own-my-data.web.app/companyVerification to verify your account

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

const compnewrecoverPassword = async (req, res) => {

  try {
    const { username } = req.body;
    const user = await Comp.findOne({ email: username });

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

Follow this link https://own-my-data.web.app/compreset-password to reset your password.

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

const compresetPassword = async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  try {
    const user = await Comp.findOne({ email });

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

const storeSelectedData = async (req, res) => {
  try {
    const { selectedFields, compId } = req.body;
    console.log(compId);
    console.log(selectedFields);
    // Validate selected fields
    if (!selectedFields || selectedFields.length === 0) {
      return res.status(400).json({ message: 'No valid fields selected' });
    }

    // Fetch the Comp model using compId (cID)
    const comp = await Comp.findOne({ cID: compId }); // Use findOne with the cID field
    if (!comp) {
      return res.status(404).json({ message: 'Comp model not found' });
    }

    // Transform selectedFields array into key-value pairs for storing in a Map
    const selectedData = selectedFields.reduce((acc, field) => {
      acc[field] = true;  // Set each field to true or a relevant value
      return acc;
    }, {});

    // Store selected data in the Comp model
    comp.selectedData = selectedData;
    await comp.save();

    res.json({ message: 'Selected data stored successfully' });
  } catch (error) {
    console.error('Error storing selected data:', error);
    res.status(500).json({ message: 'Error storing selected data', error });
  }
};



module.exports = {
  registerUser,
  companyregisterUser,
  login,
  companyactuallogin,
  complogin,
  verifyUser,
  updateEmail,
  verifyComp,
  resendVerificationCode,
  newrecoverPassword,
  compresetPassword,
  resetPassword,
  changeusername,
  changepassword,
  changephonenumber,
  resendcompanyVerificationCode,
  compnewrecoverPassword,
  updatecompanEmail,
  changeemail,
  logout,
  getUser,
  getWebAuthnOptions,
  handleWebAuthnRegistration,
  storeSelectedData,
};
