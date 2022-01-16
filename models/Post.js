const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  postImage: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('post', postSchema);
