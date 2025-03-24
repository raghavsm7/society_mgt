const { body } = require('express-validator');
const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const authController = require('../controllers/authController');
const router = express.Router();
const upload = require('../middleware/upload');
const { sendCustomNotification } = require('../controllers/notificationController');

router.post('/register', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required'),
  // body('societyCode').notEmpty().withMessage('Society code is required'),
  body('societyCode')
  .if((value, { req }) => req.body.role !== 'super_admin') // Skip validation if role is 'super_admin'
  .notEmpty().withMessage('Society code is required'),
  body('flatNo')
  .if((value, {req}) => req.body.role === 'resident')
  .notEmpty().withMessage('Flat number is required'),
  body('flatNo')
  .if((value, {req}) => req.body.role === 'guard')
  .isEmpty().withMessage('Flat number is not required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required')
], authController.register);

// Login route
router.post('/login', authController.login);
router.post('/save-push-token', authController.savePushToken)
router.post('/send', sendCustomNotification)

// Get all users route
router.get('/users', authController.getAllUsers);
router.delete('/delete/:id',auth ,authorize('society_admin'), authController.deleteUser);
router.post('/upload-profile-picture', auth, upload.single('photo'), authController.uploadProfilePicture);
router.patch('/profile', auth, authController.updateProfile);

module.exports = router;