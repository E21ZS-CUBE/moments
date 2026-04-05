const express = require('express');
const router = express.Router();
const User = require('../models/User');

//
// CREATE USER
//
router.post('/login', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    // find or create
    let user = await User.findOne({ username });

    if (!user) {
      user = new User({ username });
      await user.save();
    }

    res.json(user);

  } catch (error) {
    console.error('USER ERROR:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
