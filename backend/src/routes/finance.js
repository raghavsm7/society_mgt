const express = require('express');
const { body, query } = require('express-validator');
const financeController = require('../controllers/financeController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', [
  auth,
  authorize('society_admin', 'cashier'),
  upload.single('receipt'),
  body('transactionType').isIn(['income', 'expense']),
  body('amount').isFloat({ min: 0 }),
  body('date').isISO8601(),
  body('category').notEmpty(),
  body('description').optional().notEmpty(),
  body('residentId').optional().isMongoId()
], financeController.addTransaction);

router.get('/', [
  auth,
  authorize('society_admin', 'cashier', 'resident'),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('type').optional().isIn(['income', 'expense'])
], financeController.getTransactions);

router.get('/monthly-report', [
  auth,
  authorize('society_admin', 'cashier'),
  query('year').isInt({ min: 2000, max: 2100 }),
  query('month').isInt({ min: 1, max: 12 })
], financeController.getMonthlyReport);

module.exports = router;