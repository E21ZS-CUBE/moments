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
      trim: true,
      default: 'bite'
    },

    isActive: {
      type: Boolean,
      default: true
    },

    // 🔥 future-ready fields (optional for now)
    sender: {
      type: String,
      default: 'unknown'
    },

    receiver: {
      type: String,
      default: 'unknown'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Letter', LetterSchema);
