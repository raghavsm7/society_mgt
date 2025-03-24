const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
  societyCode: {
    type: String,
    required: true
  },
  transactionType: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: String,
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  receiptImage: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});


const Finance = mongoose.model('Finance', financeSchema);
module.exports = Finance;