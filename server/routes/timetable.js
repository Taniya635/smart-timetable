const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Constraint = require('../models/Constraint');
const Timetable = require('../models/Timetable');
const Room = require('../models/Room');
const Scheduler = require('../services/scheduler');
const ConflictDetector = require('../services/conflictDetector');
const auth = require('../middleware/auth');

router.use(auth);

// POST generate timetable
router.post('/generate', async (req, res) => {
  try {
    const [courses, existingConstraint, rooms] = await Promise.all([
      Course.find({ userId: req.userId }).lean(),
      Constraint.findOne({ userId: req.userId }),
      Room.find({ userId: req.userId }).lean(),
    ]);

    if (courses.length === 0) {
      return res.status(400).json({ error: 'No courses found. Add courses before generating.' });
    }

    let constraint = existingConstraint;
    if (!constraint) {
      constraint = await Constraint.create({ userId: req.userId });
    }

    const scheduler = new Scheduler(courses, constraint.toObject(), rooms);
    const result = scheduler.generate();

    // Detect conflicts in generated timetable
    const conflicts = ConflictDetector.detect(result.entries);
    result.stats.conflictCount = conflicts.length;

    // Save timetable (keep only one latest document per user)
    await Timetable.deleteMany({ userId: req.userId });
    const timetable = await Timetable.create({ ...result, userId: req.userId });
    const responseTimetable = {
      ...timetable.toObject(),
      scheduleWindow: result.scheduleWindow,
    };

    res.json({
      timetable: responseTimetable,
      originalTimetable: null,
      conflicts,
      suggestions: conflicts.length > 0
        ? ConflictDetector.suggest(conflicts, result.entries, constraint.toObject())
        : [],
      resolvedTimetable: null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET latest timetable
router.get('/', async (req, res) => {
  try {
    const [timetable, constraint] = await Promise.all([
      Timetable.findOne({ userId: req.userId }).sort({ createdAt: -1 }).lean(),
      Constraint.findOne({ userId: req.userId }).lean(),
    ]);

    if (!timetable) {
      return res.json({ timetable: null, conflicts: [], suggestions: [] });
    }

    const constraintData = constraint || new Constraint({ userId: req.userId }).toObject();

    const conflicts = ConflictDetector.detect(timetable.entries);
    const suggestions = conflicts.length > 0
      ? ConflictDetector.suggest(conflicts, timetable.entries, constraintData)
      : [];
    const responseTimetable = {
      ...timetable,
      scheduleWindow: timetable.scheduleWindow,
    };

    res.json({
      timetable: responseTimetable,
      originalTimetable: null,
      conflicts,
      suggestions,
      resolvedTimetable: null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET conflicts for current timetable
router.get('/conflicts', async (req, res) => {
  try {
    const [timetable, constraint] = await Promise.all([
      Timetable.findOne({ userId: req.userId }).sort({ createdAt: -1 }).lean(),
      Constraint.findOne({ userId: req.userId }).lean(),
    ]);

    if (!timetable) {
      return res.json({ conflicts: [], suggestions: [] });
    }

    const constraintData = constraint || new Constraint({ userId: req.userId }).toObject();

    const conflicts = ConflictDetector.detect(timetable.entries);
    const suggestions = ConflictDetector.suggest(conflicts, timetable.entries, constraintData);
    const responseTimetable = {
      ...timetable,
      scheduleWindow: timetable.scheduleWindow,
    };

    res.json({
      timetable: responseTimetable,
      originalTimetable: null,
      conflicts,
      suggestions,
      resolvedTimetable: null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
