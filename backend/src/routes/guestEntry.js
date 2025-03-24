const express = require('express');
const { body } = require('express-validator');
const guestEntryController = require('../controllers/guestEntryController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', [
  auth,
  authorize('resident'),
  body('expectedDate').isISO8601(),
  body('guestName').optional().notEmpty(),
  body('guestContact').optional().notEmpty(),
  body('vehicleNumber').optional().notEmpty(),
  body('purpose').optional().notEmpty()
], guestEntryController.createGuestEntry);

router.get('/allGuestEntries',
  auth,
  authorize('resident', 'society_admin', 'guard'),
  guestEntryController.getAllGuestEntries
);

router.get('/myguests',
  auth, guestEntryController.getGuestEntryByUser);

router.post('/verifyCode', auth, authorize('guard'), guestEntryController.verifyCode);

router.post('/allowGuest/:entryId', auth, authorize('guard'),guestEntryController.allowedGuests);

router.post('/disallowGuest/:entryId', auth, authorize('guard'),guestEntryController.disallowingGuests);

router.patch('/:entryId', [
  auth,
  authorize('guard'),
  body('status').optional().isIn(['approved', 'completed', 'cancelled']),
  body('checkIn').optional().isISO8601(),
  body('checkOut').optional().isISO8601()
], guestEntryController.updateGuestEntry);

router.post('/gatepass', auth, guestEntryController.gatepass);

module.exports = router;