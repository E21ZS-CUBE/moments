const express = require('express');
const router = express.Router();
const Letter = require('../models/Letter');
const User = require('../models/User');

//
// GET LETTERS
//
router.get('/', async (req, res) => {
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
});

//
// CREATE LETTER
//
router.post('/', async (req, res) => {
  const { subject, body, senderId, receiverUsername, spaceId } = req.body;

  const receiver = await User.findOne({ username: receiverUsername });

  if (!receiver) {
    return res.status(404).json({ error: "User not found" });
  }

  const letter = new Letter({
    subject,
    body,
    sender: senderId,
    receiver: receiver._id,
    spaceId
  });

  await letter.save();

  res.json(letter);
});

//
// UPDATE
//
router.put('/:id', async (req, res) => {
  const { subject, body } = req.body;

  const updated = await Letter.findByIdAndUpdate(
    req.params.id,
    { subject, body },
    { new: true }
  );

  res.json(updated);
});

//
// DELETE
//
router.delete('/:id', async (req, res) => {
  await Letter.findByIdAndUpdate(req.params.id, {
  deleted: true
  });
  res.json({ message: "Deleted" });
});

module.exports = router;
