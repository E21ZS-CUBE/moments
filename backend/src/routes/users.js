const express = require('express');
const router = express.Router();
const User = require('../models/User');

//
// CREATE USER (signup)
//
router.post('/', async (req, res) => {
  try {
    const { username, email } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.json(existing);

    const user = new User({ username, email });
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// GET USERS (for autocomplete)
//
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

//
// SEARCH USERS (IMPORTANT 🔥)
//
router.get('/search', async (req, res) => {
  const { q } = req.query;

  const users = await User.find({
    username: { $regex: q, $options: 'i' }
  }).limit(5);

  res.json(users);
});

module.exports = router;
