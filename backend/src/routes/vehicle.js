const express = require('express');
const { body } = require('express-validator');
const vehicleController = require('../controllers/vehicleController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', [
  auth,
  authorize('resident'),
  body('vehicleNumber').notEmpty(),
  body('vehicleType').isIn(['2-wheeler', '4-wheeler', 'other'])
], vehicleController.addVehicle);

router.get('/my', 
  auth,
  authorize('resident'),
  vehicleController.getUserVehicles
);

router.get('/user/:userId',
  auth,
  authorize('society_admin', 'guard'),
  vehicleController.getUserVehicles
);

router.delete('/:vehicleId',
  auth,
  authorize('resident'),
  vehicleController.removeVehicle
);

module.exports = router;