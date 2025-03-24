const express = require('express');
const { body } = require('express-validator');
const societyController = require('../controllers/societyController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Super admin routes
router.post('/', [
  // auth,
  // authorize('super_admin'),
  // authorize('society_admin'),
  body('name').notEmpty(),
  body('societyCode').notEmpty().withMessage('Society code is required'),
  body('subscriptionEndDate').isISO8601(),
], societyController.createSociety);

// Route to get all societies
router.get('/', 
  auth,
  authorize('super_admin', 'society_admin'),
  societyController.getSocieties
);

//Route to get a single society by societyCode
router.get('/:societyCode', 
  auth,
  authorize('super_admin', 'society_admin'),
  societyController.getSocietyByCode
);

router.get('/residents/:societyCode',
  auth,
  authorize('super_admin', 'society_admin','resident','committee member'),
  societyController.getresidents);


  router.get('/:societyCode/members',
    auth,
    authorize('super_admin', 'society_admin','resident','committee member'),
    societyController.getcommittemember);


router.patch('/:id', 
  auth,
  authorize('super_admin', 'society_admin'),
  societyController.updateSociety
);

router.post('/:code/residents', 
  auth,
  authorize('super_admin', 'society_admin', 'guard', 'resident'),
  societyController.changerole
);

router.post('/:code/users/:userId/approve', 
  auth,
  authorize('society_admin'),
  societyController.approveUser
);

router.post('/:code/users/:userId/disapprove',
  auth,
  authorize('society_admin'),
  societyController.disapproveUser
)

router.delete('/:id', auth,
  authorize('society_admin','super_admin'),
   societyController.deleteSociety);
   
module.exports = router;