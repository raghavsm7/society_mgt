const mongoose = require('mongoose');

const societySchema = new mongoose.Schema({
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
  societyCode: {
    type: String,
    required: true,
    unique: true // Ensure uniqueness
  },
  address: {
    type: String,
    required: true
  },
  reraNumber: String,
  contactDetails: {
    email: String,
    phone: String
  },
  subscriptionEndDate: {
    type: Date,
    required: true
  },
  committeeMembers: [{
    name: String,
    role: String,
    contactNo: String
  }],
  settings: {
    showFundManagement: {
      type: Boolean,
      default: true
    },
    vehicleLimit: {
      type: Number,
      default: 2
    }
  }
}, {
  timestamps: true
});

const Society = mongoose.model('Society', societySchema);
module.exports = Society;
