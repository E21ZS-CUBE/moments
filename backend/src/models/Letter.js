const mongoose = require('mongoose');

const letterSchema = new mongoose.Schema({
  subject: String,
  body: String,

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  spaceId: String

}, { timestamps: true });

module.exports = mongoose.model('Letter', letterSchema);
