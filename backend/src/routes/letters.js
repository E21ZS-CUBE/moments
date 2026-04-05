const express = require('express');
const router = express.Router();
const Letter = require('../models/Letter');
const User = require('../models/User');

//
// GET LETTERS
//
router.get('/', async (req, res) => {
  try {
    const { userId, spaceId } = req.query;

    if (!userId || !spaceId) {
      return res.status(400).json({ error: 'Missing params' });
    }

    // ✅ find user first
    const user = await User.findOne({ username: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const letters = await Letter.find({
      spaceId,
      $or: [
        { sender: user._id },
        { receiver: user._id }
      ]
    })
      .populate('sender', 'username')
      .populate('receiver', 'username')
      .sort({ createdAt: -1 });

    res.json(letters);

  } catch (error) {
    console.error('❌ GET LETTER ERROR:', error);
    res.status(500).json({ error: error.message });
  }
});


//
// CREATE LETTER
//
router.post('/', async (req, res) => {
  try {
    const { subject, body, senderId, receiverUsername, spaceId } = req.body;

    if (!subject || !body || !senderId || !receiverUsername) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // ✅ find sender + receiver properly
    const sender = await User.findOne({ username: senderId });
    const receiver = await User.findOne({ username: receiverUsername });

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    const letter = new Letter({
      subject,
      body,
      sender: sender._id,
      receiver: receiver._id,
      spaceId,
      deleted: false
    });

    await letter.save();

    res.status(201).json(letter);

  } catch (error) {
    console.error('❌ CREATE LETTER ERROR:', error);
    res.status(500).json({ error: error.message });
  }
});


//
// UPDATE LETTER
//
router.put('/:id', async (req, res) => {
  try {
    const { subject, body } = req.body;

    const updated = await Letter.findByIdAndUpdate(
      req.params.id,
      { subject, body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Letter not found' });
    }

    res.json(updated);

  } catch (error) {
    console.error('❌ UPDATE LETTER ERROR:', error);
    res.status(500).json({ error: error.message });
  }
});


//
// DELETE (SOFT DELETE)
//
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Letter.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ error: 'Letter not found' });
    }

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    console.error('❌ DELETE LETTER ERROR:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
