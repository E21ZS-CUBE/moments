const express = require('express');
const router = express.Router();
const Letter = require('../models/Letter');
const User = require('../models/User');

//
// GET LETTERS (Inbox + Sent)
//
router.get('/', async (req, res) => {
  try {
    const { userId, spaceId } = req.query;

    const letters = await Letter.find({
      spaceId,
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
      .populate('sender', 'username')
      .populate('receiver', 'username')
      .sort({ createdAt: -1 });

    res.json(letters);

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch letters' });
  }
});

//
// CREATE LETTER
//
router.post('/', async (req, res) => {
  try {
    const { subject, body, senderId, receiverUsername, spaceId } = req.body;

    const receiver = await User.findOne({ username: receiverUsername });

    if (!receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    const letter = new Letter({
      subject,
      body,
      sender: senderId,
      receiver: receiver._id,
      spaceId
    });

    await letter.save();

    res.status(201).json(letter);

  } catch (err) {
    res.status(500).json({ error: 'Failed to send letter' });
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

    res.json(updated);

  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
});

//
// DELETE LETTER
//
router.delete('/:id', async (req, res) => {
  try {
    await Letter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
