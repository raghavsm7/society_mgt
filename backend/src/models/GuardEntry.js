const mongoose = require('mongoose');

const guardEntrySchema = new mongoose.Schema({
  guardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visitorType: {
    type: String,
    enum: ['delivery', 'maid', 'garbage', 'plumber', 'electrician', 'others'],
    required: true
  },
  vehicleNo: {
    type: String,
    default: null
  },
  flatNo: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String,
    required: true
  },
  societyCode: {
    type: String,
    // required: true
  },
  entryType: {
    type: String,
    enum: ['attendance_in', 'attendance_out', 'unknown_visitor' ],
    // required: true
  },
  note: String,
  // images: [String],
  location: {
    latitude: Number,
    longitude: Number
  },
  startDate: { 
    type: Date,
    // required: true  
  },
  endDate: { 
    type: Date,
    // required: true  
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  } 
}, {
  timestamps: true 
});

const GuardEntry = mongoose.model('GuardEntry', guardEntrySchema);
module.exports = GuardEntry;
