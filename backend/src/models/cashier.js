const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  // spentDate: {
  //   type: Date,
  //   required: true,
  // },
  societyCode: {
    type: String
    },
  flatNo: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paidForMonth: {
    type: String,
    required: true, 
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  createdAt: {
    type:String,
    default: Date.now
    },
});

const expenseSchema = new mongoose.Schema({
    spentDate: {
      type: Date,
      required: true,
    },
    societyCode: {
      type: String
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the cashier user
      required: true,
    },
    createdAt: {
      type:String,
      default: Date.now
      },
  });
  
const Expense = mongoose.model('Expense', expenseSchema);
const Fund = mongoose.model('Fund', fundSchema);

module.exports = 
{
Fund,
Expense
};
