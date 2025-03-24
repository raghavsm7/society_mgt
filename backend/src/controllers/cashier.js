const User = require('../models/User'); // Import the User model
const Society = require('../models/Society'); // Import the Society model
const { Fund, Expense } = require('../models/cashier'); // Import the Fund and Expense models

// Add Fund Function
exports.addFund = async (req, res) => {
  try {
    const {  flatNo, description, amount, paidForMonth } = req.body;
    const userId = req.user; // Extract user ID from token middleware

    // ValispentDate required fields
    if ( !flatNo || !description || !amount || !paidForMonth ) {
      return res.status(400).json({
        success: false,
        message: 'All fields ( flatNo, description, amount) are required.',
      });
    }

    // Verify user role and society
    const user = await User.findById(userId);
    if (!user || user.role !== 'cashier') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only cashiers can perform this action.',
      });
    }

    // Find the society by societyCode
    // const society = await Society.findOne({ societyCode });

    // if (!society) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Access denied. Society mismatch or invalid society code.',
    //   });
    // }

    // // Verify the society matches the user's assigned society
    // if (society.societyCode !== user.societyCode) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Access denied. Society mismatch.',
    //   });
    // }

    // Find the member who is being assigned the fund
    // const member = await User.findById(memberId);
    // if (!member) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Member not found.',
    //   });
    // }

    // Ensure the member belongs to the same society as the cashier
    // if (String(member.societyCode) !== String(society.societyCode)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Member does not belong to the specified society.',
    //   });
    // }

    // Check if a fund already exists for this societyCode and memberId
    // const existingFund = await Fund.findOne({ societyCode, member: memberId });
    // if (existingFund) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'A fund entry already exists for this member and society.',
    //   });
    // }

    // Create a new fund entry
    const fund = new Fund({
      // spentDate,
      flatNo,
      description,
      amount,
      paidForMonth,
      // societyCode,
      createdBy: userId,
      // society: society._id, // Link the fund to the society
      // member: member._id, // Link fund to the specific member
    });

    await fund.save();

    return res.status(201).json({
      success: true,
      message: 'Fund added successfully.',
      data: fund,
    });
  } catch (error) {
    console.error('Error adding fund:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding fund.',
      error: error.message,
    });
  }
};


// Add Expense Function
// Add Expense Function
exports.addExpense = async (req, res) => {
  try {
    const { spentDate, description, amount,paidForMonth } = req.body;
    const userId = req.user; // Extract user ID from token middleware

    // ValispentspentDate required fields
    if (!spentDate || !description || !amount ) {
      return res.status(400).json({
        success: false,
        message: 'All fields (spentsDate, description, amount) are required.',
      });
    }

    // Verify user role and society
    const user = await User.findById(userId);

    if (!user || user.role !== 'cashier') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only cashiers can perform this action.',
      });
    }

    // Find the society by societyCode
    // const society = await Society.findOne({ societyCode });

    // if (!society || user.societyCode !== society.societyCode) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Access denied. Society mismatch or invalid society code.',
    //   });
    // }

    // Find the member who is being assigned the expense (could be any member of the society)
    // const member = await User.findById(memberId);

    // if (!member) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Member not found.',
    //   });
    // }

    // Ensure the member belongs to the same society as the cashier
    // if (String(member.societyCode) !== String(society.societyCode)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Member does not belong to the specified society.',
    //   });
    // }

    // Create a new expense entry
    const expense = new Expense({
      spentDate,
      description,
      amount,
      // societyCode,
      paidForMonth,
      createdBy: userId,
      // society: society._id, // Link the expense to the society
      // member: member._id, // Link expense to the specific member
    });

    await expense.save();

    return res.status(201).json({
      success: true,
      message: 'Expense added successfully.',
      data: expense,
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding expense.',
      error: error.message,
    });
  }
};

// Get Expense Function
//// Get Expense Function
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user;
    console.log("User ID from token:", userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // const society = await Society.findOne({ societyCode: user.societyCode });
    // if (!society) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Access denied. Society not found.',
    //   });
    // }

    // console.log("Society Code from user:", society.societyCode);

    // const expenses = await Expense.find({ societyCode: society.societyCode }).populate('createdBy').populate('societyCode');
    const expenses=await Expense.find({});
    console.log("Expenses data:", expenses);

    return res.status(200).json({
      success: true,
      message: 'Expenses retrieved successfully.',
      data: expenses,
    });
  } catch (error) {
    console.error('Error retrieving expenses:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving expenses.',
      error: error.message,
    });
  }
};

// Get Fund Function
exports.getFunds = async (req, res) => {
  try {
    const userId = req.user;
    console.log("User ID from token:", userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // const society = await Society.findOne({ societyCode: user.societyCode });
    // if (!society) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Access denied. Society not found.',
    //   });
    // }

    // console.log("Society from user societyCode:", society);

    // const funds = await Fund.find({ societyCode: society.societyCode});
    const funds = await Fund.find({});

    console.log("Funds data:", funds);

    return res.status(200).json({
      success: true,
      message: 'Funds retrieved successfully.',
      data: funds,
    });
  } catch (error) {
    console.error('Error retrieving Funds:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving funds.',
      error: error.message,
    });
  }
};

exports.getSocietyFinanceBalance = async (req, res) => {
  try {
    const userId = req.user; // Extract user ID from token middleware
    
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Find the society by the user's societyCode
    // const society = await Society.findOne({ societyCode: user.societyCode });
    // const society = await Society.findOne();


    // if (!society) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Access denied. Society not found.',
    //   });
    // }

    // Aggregate total funds for the society
    const totalFunds = await Fund.aggregate([
      // { $match: { societyCode: society.societyCode } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
    ]);

    // Aggregate total expenses for the society
    const totalExpenses = await Expense.aggregate([
      // {  $match: { societyCode: society.societyCode }  },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
    ]);

    // Calculate the total balance
    const fundsAmount = totalFunds.length > 0 ? totalFunds[0].totalAmount : 0;
    const expensesAmount = totalExpenses.length > 0 ? totalExpenses[0].totalAmount : 0;
    const balance = fundsAmount - expensesAmount;

    return res.status(200).json({
      success: true,
      message: 'Society finance balance retrieved successfully.',
      data: {
        totalFunds: fundsAmount,
        totalExpenses: expensesAmount,
        balance: balance,
      },
    });
  } catch (error) {
    console.error('Error retrieving society finance balance:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving society finance balance.',
      error: error.message,
    });
  }
};

