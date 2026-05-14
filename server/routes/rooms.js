const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const auth = require('../middleware/auth');

router.use(auth);

// GET all rooms for current user
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({ userId: req.userId }).sort({ name: 1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create room
router.post('/', async (req, res) => {
  try {
    const room = await Room.create({ ...req.body, userId: req.userId });
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update room
router.put('/:id', async (req, res) => {
  try {
    const room = await Room.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE room
router.delete('/:id', async (req, res) => {
  try {
    const room = await Room.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
