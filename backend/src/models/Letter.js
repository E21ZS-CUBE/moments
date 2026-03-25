const mongoose = require('mongoose');

const LetterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Secret Letter 💌'
    },

    content: {
      type: String,
      required: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      trim: true
    },

    sender: {
      type: String,
      required: true
    },

    receiver: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Letter', LetterSchema);
