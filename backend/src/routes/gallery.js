const express = require('express');
const router = express.Router();
const GalleryImage = require('../models/GalleryImage');
const { uploadGallery, cloudinary } = require('../config/cloudinary');

// GET all gallery images
router.get('/', async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

// GET single gallery image
router.get('/:id', async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json(image);
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    res.status(500).json({ error: 'Failed to fetch gallery image' });
  }
});

// UPLOAD new image(s)
router.post('/', uploadGallery.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const uploadedImages = [];
    
    for (const file of req.files) {
      const galleryImage = new GalleryImage({
        imageUrl: file.path,
        cloudinaryId: file.filename,
        caption: req.body.caption || ''
      });
      
      await galleryImage.save();
      uploadedImages.push(galleryImage);
    }

    res.status(201).json(uploadedImages);
  } catch (error) {
    console.error('Error uploading gallery images:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// UPDATE image caption
router.put('/:id', async (req, res) => {
  try {
    const { caption } = req.body;
    
    const image = await GalleryImage.findByIdAndUpdate(
      req.params.id,
      { caption },
      { new: true }
    );

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json(image);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({ error: 'Failed to update image' });
  }
});

// DELETE image
router.delete('/:id', async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete image from Cloudinary
    if (image.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(image.cloudinaryId);
      } catch (err) {
        console.log('Error deleting image from Cloudinary:', err);
      }
    }

    await GalleryImage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;
