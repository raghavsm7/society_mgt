const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const noticeController = require('../controllers/noticeController');

// Route to fetch all notices created by admins
router.get('/admin',noticeController.getAllNoticesByAdmin);
router.post('/create-notice',auth,authorize('society_admin'),noticeController.createNotice);

module.exports = router;
