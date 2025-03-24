const mongoose = require('mongoose');

// Comment Schema
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    data: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

// Like/Dislike Schema
const likeDislikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    enum: ['like', 'dislike'],
    required: true,
  },
});

// Post Schema
const postSchema = new mongoose.Schema({
   postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
      },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  data: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  societycode: {
    type: String,
    trim: true,
  },
  likeDetails: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, enum: ['like', 'dislike'], required: true },
  }],
  comments: [commentSchema], // Array of comments
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date if not provided
  },
  username: {
    type: String,
    required: true, // Username of the person who created the post
  },
  profilePicture: {
    type: String,
    default: null, // Profile picture URL of the user (if available)
  },
});




module.exports = mongoose.model('comment',commentSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = Post;