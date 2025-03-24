const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isAdmin: { type: Boolean, required: true }, // Indicates if the notice was created by an admin
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);
