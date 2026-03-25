const express = require('express');
const router = express.Router();
const Letter = require('../models/Letter');

//
// GET ALL LETTERS
//
router.get('/', async (req, res) => {
  try {
    const letters = await Letter.find().sort({ createdAt: -1 });

    res.json(letters);
  } catch (error) {
    console.error('Error fetching letters:', error);
    res.status(500).json({ error: 'Failed to fetch letters' });
  }
});

//
// VERIFY PASSWORD FOR SPECIFIC LETTER
//
router.post('/verify', async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const letter = await Letter.findById(id);

    if (!letter) {
      return res.status(404).json({ error: 'Letter not found' });
    }

    if (password !== letter.password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    res.json(letter);

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
    const { title, content, password, sender, receiver } = req.body;

    if (!content || !sender || !receiver) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const letter = new Letter({
      title: title || 'Secret Letter 💌',
      content,
      password: password || 'bite',
      sender,
      receiver
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

    const letter = await Letter.findByIdAndUpdate(
      req.params.id,
      { title, content, password },
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
