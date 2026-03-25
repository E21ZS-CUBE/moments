const express = require('express');
const router = express.Router();
const Moment = require('../models/Moment');
const { uploadMoment, cloudinary } = require('../config/cloudinary');

// GET all moments
router.get('/', async (req, res) => {
  try {
    const moments = await Moment.find().sort({ date: 1 });
    res.json(moments);
  } catch (error) {
    console.error('Error fetching moments:', error);
    res.status(500).json({ error: 'Failed to fetch moments' });
  }
});

// GET single moment
router.get('/:id', async (req, res) => {
  try {
    const moment = await Moment.findById(req.params.id);
    if (!moment) {
      return res.status(404).json({ error: 'Moment not found' });
    }
    res.json(moment);
  } catch (error) {
    console.error('Error fetching moment:', error);
    res.status(500).json({ error: 'Failed to fetch moment' });
  }
});

// CREATE new moment with image
router.post('/', uploadMoment.single('image'), async (req, res) => {
  try {
    const { title, short, full, date } = req.body;
    
    const momentData = {
      title,
      short,
      full,
      date: new Date(date)
    };

    if (req.file) {
      momentData.imageUrl = req.file.path;
      momentData.cloudinaryId = req.file.filename;
    }

    const moment = new Moment(momentData);
    await moment.save();
    
    res.status(201).json(moment);
  } catch (error) {
    console.error('Error creating moment:', error);
    res.status(500).json({ error: 'Failed to create moment' });
  }
});

// UPDATE moment
router.put('/:id', uploadMoment.single('image'), async (req, res) => {
  try {
    const { title, short, full, date } = req.body;
    
    const updateData = {
      title,
      short,
      full,
      date: new Date(date)
    };

    // If new image uploaded, delete old one and update
    if (req.file) {
      const existingMoment = await Moment.findById(req.params.id);
      if (existingMoment && existingMoment.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(existingMoment.cloudinaryId);
        } catch (err) {
          console.log('Error deleting old image:', err);
        }
      }
      updateData.imageUrl = req.file.path;
      updateData.cloudinaryId = req.file.filename;
    }

    const moment = await Moment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!moment) {
      return res.status(404).json({ error: 'Moment not found' });
    }

    res.json(moment);
  } catch (error) {
    console.error('Error updating moment:', error);
    res.status(500).json({ error: 'Failed to update moment' });
  }
});

// DELETE moment
router.delete('/:id', async (req, res) => {
  try {
    const moment = await Moment.findById(req.params.id);
    
    if (!moment) {
      return res.status(404).json({ error: 'Moment not found' });
    }

    // Delete image from Cloudinary if exists
    if (moment.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(moment.cloudinaryId);
      } catch (err) {
        console.log('Error deleting image from Cloudinary:', err);
      }
    }

    await Moment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Moment deleted successfully' });
  } catch (error) {
    console.error('Error deleting moment:', error);
    res.status(500).json({ error: 'Failed to delete moment' });
  }
});

module.exports = router;
