// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register User
exports.register = async (req, res) => {
  const { name, phoneNumber, language, location } = req.body;

  try {
    let user = await User.findOne({ phoneNumber });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      phoneNumber,
      language,
      location,
      otp: '123456', // For testing purposes
    });

    await user.save();

    // TODO: Integrate SMS service to send OTP

    res.status(201).json({ message: 'User registered successfully. OTP sent.' });
  } catch (error) {
    console.error('Error in register:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error in verifyOTP:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
