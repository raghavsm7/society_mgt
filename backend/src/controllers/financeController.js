const Finance = require('../models/Finance');
const { validationResult } = require('express-validator');
const { sendNotification } = require('../utils/notifications');

exports.addTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const finance = new Finance({
      ...req.body,
      societyCode: req.user.societyCode,
      createdBy: req.user._id,
      receiptImage: req.file?.filename
    });

    await finance.save();
    res.status(201).json(finance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const query = { societyCode: req.user.societyCode };
    
    // Date filters
    if (req.query.startDate) {
      query.date = { $gte: new Date(req.query.startDate) };
    }
    if (req.query.endDate) {
      query.date = { ...query.date, $lte: new Date(req.query.endDate) };
    }
    
    // Transaction type filter
    if (req.query.type) {
      query.transactionType = req.query.type;
    }

    const transactions = await Finance.find(query)
      .populate('residentId', 'name flatNo')
      .populate('createdBy', 'name')
      .sort({ date: -1 });

    // Calculate summary
    const summary = await Finance.aggregate([
      { $match: query },
      { $group: {
        _id: null,
        totalIncome: {
          $sum: { $cond: [{ $eq: ['$transactionType', 'income'] }, '$amount', 0] }
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ['$transactionType', 'expense'] }, '$amount', 0] }
        }
      }}
    ]);

    res.json({
      transactions,
      summary: summary[0] || { totalIncome: 0, totalExpense: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const transactions = await Finance.aggregate([
      {
        $match: {
          societyCode: req.user.societyCode,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          transactions: { $push: '$$ROOT' }
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.financialpage async (req, res) => {
//   try {
//     const user = req.user;  // Assuming user details are stored in req.user
//     const settings = await Settings.findOne();  // Fetch the settings from DB

//     if (!settings || !settings.financialPageEnabled) {
//       return res.status(403).json({
//         status: false,
//         message: 'Financial page is not enabled by the admin.',
//       });
//     }

//     // Fetching the financial records - Filter based on user if needed
//     const finances = await Finance.find({
//       $or: [
//         { residentId: user._id },   // Showing finances for the logged-in user (if they have a residentId associated)
//         { createdBy: user._id },     // Or showing if the user is the creator of the finance record (admin or creator)
//       ],
//     }).populate('residentId createdBy', 'name email'); // Populate resident details and creator details

//     res.status(200).json({
//       status: true,
//       message: 'Financial records fetched successfully',
//       data: finances,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: false,
//       message: 'Error fetching financial records',
//       error: error.message,
//     });
//   }
// });

