const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  user_id: { type: Number, required: true },
  content: { type: String, required: true },
  likeCount: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
}, {
  collection: 'posts',
  versionKey: false
});

module.exports = mongoose.model('Post', postSchema);
