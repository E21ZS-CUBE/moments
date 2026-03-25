const express = require('express');
const router = express.Router();
const Letter = require('../models/Letter');

//
// GET ACTIVE LETTER (SAFE)
//
router.get('/', async (req, res) => {
  try {
    const letter = await Letter.findOne({ isActive: true });

    if (!letter) {
      return res.status(200).json({
        id: null,
        title: "No Letter Yet 💌",
        hasPassword: false
      });
    }

    res.json({
      id: letter._id,
      title: letter.title,
      hasPassword: !!letter.password
    });

  } catch (error) {
    console.error('Error fetching letter:', error);
    res.status(500).json({ error: 'Failed to fetch letter' });
  }
});

//
// VERIFY PASSWORD
//
router.post('/verify', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    const letter = await Letter.findOne({ isActive: true });

    if (!letter) {
      return res.status(404).json({ error: 'No letter found' });
    }

    if (password !== letter.password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    res.json({
      id: letter._id,
      title: letter.title,
      content: letter.content
    });

  } catch (error) {
    console.error('Error verifying letter:', error);
    res.status(500).json({ error: 'Failed to verify letter' });
  }
});

//
// CREATE NEW LETTER
//
router.post('/', async (req, res) => {
  try {
    const { title, content, password } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // deactivate old letters
    await Letter.updateMany({}, { isActive: false });

    const letter = new Letter({
      title: title || 'Secret Letter 💌',
      content,
      password: password || 'bite',
      isActive: true
    });

    await letter.save();

    res.status(201).json(letter);

  } catch (error) {
    console.error('Error creating letter:', error);
    res.status(500).json({ error: 'Failed to create letter' });
  }
});

//
// UPDATE LETTER
//
router.put('/:id', async (req, res) => {
  try {
    const { title, content, password } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (password !== undefined) updateData.password = password;

    const letter = await Letter.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!letter) {
      return res.status(404).json({ error: 'Letter not found' });
    }

    res.json(letter);

  } catch (error) {
    console.error('Error updating letter:', error);
    res.status(500).json({ error: 'Failed to update letter' });
  }
});

//
// DELETE LETTER
//
router.delete('/:id', async (req, res) => {
  try {
    const letter = await Letter.findByIdAndDelete(req.params.id);

    if (!letter) {
      return res.status(404).json({ error: 'Letter not found' });
    }

    res.json({ message: 'Letter deleted successfully' });

  } catch (error) {
    console.error('Error deleting letter:', error);
    res.status(500).json({ error: 'Failed to delete letter' });
  }
});

module.exports = router;
