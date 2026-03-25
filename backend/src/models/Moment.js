const mongoose = require('mongoose');

const momentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  short: {
    type: String,
    required: true,
    trim: true
  },
  full: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  cloudinaryId: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
momentSchema.index({ date: -1 });

module.exports = mongoose.model('Moment', momentSchema);
