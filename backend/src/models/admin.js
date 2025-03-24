const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ref } = require('joi');

const adminSchema = new mongoose.Schema({
  societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'society'
    },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: 'society_admin',
  },
  societyCode: {
    type: String,
    // required: function() {
    //   return this.role === 'society_admin';
    // }
  },
  isApproved: {
    type: Boolean,
    default: true // Admins are automatically approved
  },
  contactNo: {
    type: String,
  },
  profilePicture: {
    type: String, // Store path to the image file
    default: null
  },
  fcmToken: String,
  notificationSettings: {
    pushNotifications: { type: Boolean, default: true },
    guardNotifications: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8); // Using bcrypt to hash password
  }
  next();
});


const settingsSchema = new mongoose.Schema({
  financialPageEnabled: {
    type: Boolean,
    default: false, // Set to false by default (disabled)
    required: true,
  },
  // other settings can be added here if necessary
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

const Admin = mongoose.model('Admin', adminSchema);
module.exports = {Admin,Settings};