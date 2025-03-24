const express = require('express');
const { body, query } = require('express-validator');
const guardEntryController = require('../controllers/guardEntryController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', [
  auth,
  authorize('society_admin','guard'),
  upload.array('images', 5),
  body('entryType').isIn(['attendance_in', 'attendance_out', 'unknown_visitor', 'incident']),
  body('note').optional().notEmpty(),
  body('location.latitude').optional().isFloat(),
  body('location.longitude').optional().isFloat()
], guardEntryController.createEntry);

router.post('/manualEntries', [
  auth,
  authorize('society_admin','guard'),
  upload.array('images', 5),
  body('entryType').isIn(['manual']),
  body('visitorType')
      .isIn(['delivery', 'maid', 'garbage', 'plumber', 'electrician', 'others'])
      .withMessage('Invalid visitor type'),
  body('name').notEmpty().withMessage('Name is required'),
  body('phoneNo').isMobilePhone().withMessage('Invalid phone number'),
  body('flatNo').notEmpty().withMessage('Flat/House number is required'),
  body('vehicleNumber').optional().notEmpty().withMessage('Vehicle number is required'),
], guardEntryController.createManualEntry);

router.get('/guardDetails', auth, authorize('society_admin', 'guard'), guardEntryController.getGuardDetails);

router.get('/', [
  auth,
  authorize('society_admin', 'guard'),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('type').optional().isIn(['attendance_in', 'attendance_out', 'unknown_visitor', 'incident'])
], guardEntryController.getEntries);

router.get('/attendance/:guardId', [
  auth,
  authorize('society_admin'),
  query('startDate').isISO8601(),
  query('endDate').isISO8601()
], guardEntryController.getGuardAttendance);

module.exports = router;