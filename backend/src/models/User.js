const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true
    },
  name: {
    type: String,
    required: true,
    trim: true
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
    enum: ['super_admin', 'society_admin', 'cashier', 'guard', 'resident','committee member']
  },
  societyCode: {
    type: String,
    // required: true
    required: function() {
      return this.role !== 'super_admin';
    }
  },
  flatNo: {
    type: String,
    required: function() {
      return this.role === 'resident';
    }
  },
  isApproved: {
    type: Boolean,
    default: function() {
      return this.role === 'super_admin' || this.role === 'society_admin';
    },
    contactNo: {
      type: String,
      required: true
    },
  },
    

    profilePicture: {
      type: String, // This will store the path to the image file
      default: null,
    },
   
  fcmToken: String,
  notificationSettings: {
    pushNotifications: { type: Boolean, default: true },
    guardNotifications: { type: Boolean, default: true }
  },
  pushToken: {
    type: String,
    default: null
  }
  
}, {
  timestamps: true
});


// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;