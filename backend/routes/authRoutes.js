// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateOTP } = require('../utils/otpGenerator');

// Route: POST /api/auth/register
// Description: Register a new user and send OTP
router.post('/register', async (req, res) => {
  const { name, phoneNumber, address, location, language } = req.body;

  // Log the incoming request body for debugging
  console.log('Register Request Body:', req.body);

  try {
    // Generate OTP
    const otp = generateOTP();

    // Create a new user
    const user = new User({
      name,
      phoneNumber,
      address,
      location: {
        street: address.street,
        locality: address.locality,
        administrativeArea: address.administrativeArea,
        city: address.city,
        state: address.state,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      },
      language,
      otp,
      isVerified: false,
    });

    await user.save();

    // TODO: Integrate with an SMS service to send the OTP to the user's phone number.
    // For demonstration, we'll return the OTP in the response. **Remove this in production!**
    res.status(201).json({ message: 'User registered successfully.', otp });
  } catch (error) {
    console.error('Error in /register:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Route: POST /api/auth/verify-otp
// Description: Verify user's OTP
router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    // Find the user by phone number
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified.' });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    // Update user verification status
    user.isVerified = true;
    user.otp = undefined; // Remove OTP after verification
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (error) {
    console.error('Error in /verify-otp:', error);
    res.status(500).json({ message: 'Server error during OTP verification.' });
  }
});

module.exports = router;
