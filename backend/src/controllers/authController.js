const User = require('../models/User');
const path = require('path');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const authController = {

// Profile Picture Upload Logic (Middleware)
 uploadProfilePicture : async (req, res, next) => {
  try {
    if (req.file) {
      // Save the file path for the profile picture
      const imagePath = `/uploads/${req.file.filename}`;
      req.body.profilePicture = imagePath; // Attach the profile picture path to the request body
    }
    next(); // Proceed to the next middleware (user registration)
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
},

// User Registration Logic (with Profile Picture)
register :async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, societyCode, role, flatNo, phone, profilePicture, pushToken } = req.body;

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    if (role !== 'super_admin') {
      const existingSocietyCode = await User.findOne({ societyCode, role: 'society_admin' });
      if (!existingSocietyCode) {
        return res.status(400).json({ error: 'Invalid society code. Society must be created by a super admin first.' });
      }
    }

    // Create new user with the provided details
    const user = new User({
      email,
      password,
      name,
      // societyCode,
      societyCode: role === 'resident' || 'society_admin' ? societyCode : null,
      // flatNo,
      flatNo: role === 'resident' ? flatNo : null,
      role,
      contactNo: phone,
      profilePicture: profilePicture || null, // Use the profile picture if provided, else null
      pushToken: pushToken || null, // Use the push token if provided, else null
    });

    // Save the user to the database
    await user.save();

    // Generate JWT token for the registered user
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // Respond with success and user data (including profile picture)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          name: user.name,
          email: user.email,
          societyCode: user.societyCode,
          flatNo: user.flatNo,
          role: user.role,
          contactNo: user.contactNo,
          profilePicture: user.profilePicture, // Return the profile picture URL
          pushToken: user.pushToken
        },
        token, // Send the JWT token
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
},

  getAllUsers: async (req, res) => {
    try {
      // Fetch all users, exclude sensitive fields like passwords
      const users = await User.find({}, '-password');
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },  

  login: async (req, res) => {
    try {
      const { email, password} = req.body;
      const user = await User.findOne({ email });
      console.log("User found: ", user);
      
      if (!user || !await bcrypt.compare(password, user.password)) {
        throw new Error('Invalid login credentials');
      }
  
      if (!user.isApproved) {
        throw new Error('Account pending approval');
      }

      console.log("Login request received for: ", email);
  
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          societyCode: user.societyCode,
          flatNo: user.flatNo,
          isApproved:user.isApproved,
          role: user.role,
          profilePicture:user.profilePicture,
        },
        token
      });
      console.log("Login Response:", {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
      
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  savePushToken: async (req, res) => {
    try {
      const { userId, pushToken } = req.body;

      if (!userId || !pushToken) {
          return res.status(400).json({ 
              message: 'User ID and Push Token are required' 
          });
      }
      
      // Find user and update push token
      const user = await User.findByIdAndUpdate(
          userId, 
          { pushToken }, 
          { new: true }
      );

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ 
          message: 'Push token saved successfully',
          user: { 
              id: user._id, 
              pushTokenSaved: !!user.pushToken 
          }
      });
  } catch (error) {
      console.error('Save Push Token Error:', error);
      res.status(500).json({ 
          message: 'Error saving push token', 
          error: error.message 
      });
  }
  },

updateProfile: async (req, res) => {    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ['name', 'password', 'contactNo', 'notificationSettings'];
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates!' });
      }

      updates.forEach(update => req.user[update] = req.body[update]);
      await req.user.save();
      
      res.json(req.user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

deleteUser: async (req, res) => {
  try {
    
    const userId = req.params.id;
    console.log("data-------",userId);// Get user ID from the URL parameter
    const user = await User.findByIdAndDelete(userId); // Delete user from DB

    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
};
module.exports = authController;
