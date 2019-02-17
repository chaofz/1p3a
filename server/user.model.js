const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: String,
  bookmarks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
});

module.exports = mongoose.model('User', userSchema);
