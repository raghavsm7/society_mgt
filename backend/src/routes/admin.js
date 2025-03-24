const express = require('express');
const { createAdmin,financialpage,getAdminsBySociety  } = require('../controllers/admin');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Route to create a new user with the 'society_admin' role
router.post('/create-society-admin',createAdmin);
router.post('/financial-page',auth,authorize('super_admin'),financialpage);
router.get('/',auth,getAdminsBySociety );


module.exports = router;
