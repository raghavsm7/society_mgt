const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { auth, authorize } = require('../middleware/auth');


// Routes
router.post('/create',auth,postController.createPost);
router.post('/:postId/toggleLikeDislike', auth, postController.toggleLikePost);
router.get('/', auth,postController.getAllPosts);
router.post('/:postId/comment',auth,postController.addComment);

module.exports = router;