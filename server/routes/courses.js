const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// GET all courses for current user
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create course
router.post('/', async (req, res) => {
  try {
    const course = await Course.create({ ...req.body, userId: req.userId });
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update course
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
