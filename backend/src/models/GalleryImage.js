const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
galleryImageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
