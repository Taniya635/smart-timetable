const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  courseName: String,
  instructor: String,
  color: String,
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  roomName: String,
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true,
  },
  startSlot: {
    type: Number,
    required: true,
    min: 6,
    max: 19,
  },
  endSlot: {
    type: Number,
    required: true,
    min: 7,
    max: 20,
  },
}, { _id: true });

const timetableSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  entries: [entrySchema],
  unplaced: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    courseName: String,
    reason: String,
  }],
  stats: {
    totalSlotsFilled: { type: Number, default: 0 },
    totalSlotsAvailable: { type: Number, default: 0 },
    utilizationPercent: { type: Number, default: 0 },
    conflictCount: { type: Number, default: 0 },
    coursesPlaced: { type: Number, default: 0 },
    coursesUnplaced: { type: Number, default: 0 },
  },
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
