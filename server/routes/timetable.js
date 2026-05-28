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

async function buildResolvedTimetable(userId) {
  const [courses, constraint, rooms] = await Promise.all([
    Course.find({ userId }),
    Constraint.findOne({ userId }),
    Room.find({ userId }),
  ]);

  if (!constraint) {
    return null;
  }

  const scheduler = new Scheduler(courses, constraint.toObject(), rooms);
  return scheduler.generate();
}

// POST generate timetable
router.post('/generate', async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.userId });
    if (courses.length === 0) {
      return res.status(400).json({ error: 'No courses found. Add courses before generating.' });
    }

    let constraint = await Constraint.findOne({ userId: req.userId });
    if (!constraint) {
      constraint = await Constraint.create({ userId: req.userId });
    }

    const rooms = await Room.find({ userId: req.userId });
    const scheduler = new Scheduler(courses, constraint.toObject(), rooms);
    const result = scheduler.generate();

    // Detect conflicts in generated timetable
    const conflicts = ConflictDetector.detect(result.entries);
    result.stats.conflictCount = conflicts.length;

    // Save timetable (delete old ones for this user)
    await Timetable.deleteMany({ userId: req.userId });
    const timetable = await Timetable.create({ ...result, userId: req.userId });
    const responseTimetable = {
      ...timetable.toObject(),
      scheduleWindow: result.scheduleWindow,
    };

    const resolvedTimetable = conflicts.length > 0
      ? await buildResolvedTimetable(req.userId)
      : null;

    res.json({
      timetable: resolvedTimetable
        ? { ...resolvedTimetable, scheduleWindow: resolvedTimetable.scheduleWindow || result.scheduleWindow }
        : responseTimetable,
      originalTimetable: conflicts.length > 0 ? responseTimetable : null,
      conflicts,
      suggestions: conflicts.length > 0
        ? ConflictDetector.suggest(conflicts, result.entries, constraint.toObject())
        : [],
      resolvedTimetable: resolvedTimetable
        ? { ...resolvedTimetable, scheduleWindow: resolvedTimetable.scheduleWindow || result.scheduleWindow }
        : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET latest timetable
router.get('/', async (req, res) => {
  try {
    const timetable = await Timetable.findOne({ userId: req.userId }).sort({ createdAt: -1 });
    if (!timetable) {
      return res.json({ timetable: null, conflicts: [], suggestions: [] });
    }

    let constraint = await Constraint.findOne({ userId: req.userId });
    if (!constraint) {
      constraint = await Constraint.create({ userId: req.userId });
    }

    const conflicts = ConflictDetector.detect(timetable.entries);
    const suggestions = conflicts.length > 0
      ? ConflictDetector.suggest(conflicts, timetable.entries, constraint.toObject())
      : [];
    const resolvedTimetable = conflicts.length > 0
      ? await buildResolvedTimetable(req.userId)
      : null;
    const responseTimetable = {
      ...timetable.toObject(),
      scheduleWindow: resolvedTimetable?.scheduleWindow || timetable.scheduleWindow,
    };

    res.json({
      timetable: resolvedTimetable
        ? { ...resolvedTimetable, scheduleWindow: resolvedTimetable.scheduleWindow || responseTimetable.scheduleWindow }
        : responseTimetable,
      originalTimetable: conflicts.length > 0 ? responseTimetable : null,
      conflicts,
      suggestions,
      resolvedTimetable: resolvedTimetable
        ? { ...resolvedTimetable, scheduleWindow: resolvedTimetable.scheduleWindow || responseTimetable.scheduleWindow }
        : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET conflicts for current timetable
router.get('/conflicts', async (req, res) => {
  try {
    const timetable = await Timetable.findOne({ userId: req.userId }).sort({ createdAt: -1 });
    if (!timetable) {
      return res.json({ conflicts: [], suggestions: [] });
    }

    let constraint = await Constraint.findOne({ userId: req.userId });
    if (!constraint) {
      constraint = await Constraint.create({ userId: req.userId });
    }

    const conflicts = ConflictDetector.detect(timetable.entries);
    const suggestions = ConflictDetector.suggest(conflicts, timetable.entries, constraint.toObject());
    const resolvedTimetable = conflicts.length > 0
      ? await buildResolvedTimetable(req.userId)
      : null;
    const responseTimetable = {
      ...timetable.toObject(),
      scheduleWindow: resolvedTimetable?.scheduleWindow || timetable.scheduleWindow,
    };

    res.json({
      timetable: resolvedTimetable
        ? { ...resolvedTimetable, scheduleWindow: resolvedTimetable.scheduleWindow || responseTimetable.scheduleWindow }
        : responseTimetable,
      originalTimetable: conflicts.length > 0 ? responseTimetable : null,
      conflicts,
      suggestions,
      resolvedTimetable: resolvedTimetable
        ? { ...resolvedTimetable, scheduleWindow: resolvedTimetable.scheduleWindow || responseTimetable.scheduleWindow }
        : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
