const express = require('express');
const { addFund, addExpense,getExpenses,getFunds,getSocietyFinanceBalance} = require('../controllers/cashier');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes for cashier
router.get('/expense',auth,  getExpenses);
router.get('/funds', auth,getFunds);
router.post('/cashier/add-fund',auth,authorize('cashier'),addFund);
router.post('/cashier/add-expense', auth,authorize('cashier'), addExpense);
// router.get('/balance',auth,authorize('cashier'),getSocietyFinanceBalance);
router.get('/balance',auth,getSocietyFinanceBalance);

module.exports = router;
