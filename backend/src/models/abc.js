const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  societyId: { type: String, required: true },
  text: { type: String, required: false },
  image: { type: String, required: false },
  likes: { type: [String], default: [] }, // List of userIds who liked the post
  shares: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);
