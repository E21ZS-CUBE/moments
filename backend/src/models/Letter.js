const mongoose = require('mongoose');

const letterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'Secret Letter'
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    default: 'bite'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Letter', letterSchema);
