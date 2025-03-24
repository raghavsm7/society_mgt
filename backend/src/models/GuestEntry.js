const { string } = require('joi');
const mongoose = require('mongoose');

const guestEntrySchema = new mongoose.Schema({
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // hostname:String,
  guestName: String,
 
  visitDateTime : {
    type: Date,
  },
  // flatNo: {
  //   type: String
  // },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'cancelled'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  flatNo: {
    type: String,
    // required: true
  },
  checkIn: Date,
  checkOut: Date
}, {
  timestamps: true
});

const GuestEntry = mongoose.model('GuestEntry', guestEntrySchema);
module.exports = GuestEntry;