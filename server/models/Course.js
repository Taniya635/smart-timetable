const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
  },
  instructor: {
    type: String,
    required: [true, 'Instructor name is required'],
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
    default: 1,
    comment: 'Duration in number of slots (each slot = 1 hour)',
  },
  color: {
    type: String,
    default: '#6c5ce7',
  },
  preferredDays: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    default: [],
  },
  preferredTimeStart: {
    type: Number,
    min: 8,
    max: 17,
    default: null,
  },
  preferredTimeEnd: {
    type: Number,
    min: 9,
    max: 18,
    default: null,
  },
  sessionsPerWeek: {
    type: Number,
    min: 1,
    max: 6,
    default: 2,
  },
}, { timestamps: true });

courseSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Course', courseSchema);
