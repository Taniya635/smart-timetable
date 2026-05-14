/**
 * Conflict Detection & Resolution Suggestions
 */

class ConflictDetector {
  /**
   * Detect all conflicts in a set of timetable entries
   */
  static detect(entries) {
    const conflicts = [];

    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const a = entries[i];
        const b = entries[j];

        if (a.day !== b.day) continue;

        // Time overlap
        const overlaps = !(a.endSlot <= b.startSlot || b.endSlot <= a.startSlot);
        if (!overlaps) continue;

        // Determine conflict type
        const sameInstructor = a.instructor === b.instructor;
        const sameCourse = a.courseId.toString() === b.courseId.toString();
        const sameRoom = a.roomId && b.roomId && a.roomId.toString() === b.roomId.toString();

        let type = 'time_overlap';
        let severity = 'medium';
        if (sameRoom) { type = 'room_double_booking'; severity = 'high'; }
        if (sameInstructor) { type = 'instructor_clash'; severity = 'high'; }
        if (sameCourse) { type = 'same_course_overlap'; }

        if (overlaps) {
          conflicts.push({
            type,
            entryA: {
              id: a._id,
              courseName: a.courseName,
              instructor: a.instructor,
              day: a.day,
              startSlot: a.startSlot,
              endSlot: a.endSlot,
              roomName: a.roomName,
            },
            entryB: {
              id: b._id,
              courseName: b.courseName,
              instructor: b.instructor,
              day: b.day,
              startSlot: b.startSlot,
              endSlot: b.endSlot,
              roomName: b.roomName,
            },
            severity,
            message: ConflictDetector.buildMessage(a, b, sameInstructor, sameRoom),
          });
        }
      }
    }

    return conflicts;
  }

  /**
   * Build a human-readable conflict message
   */
  static buildMessage(a, b, sameInstructor, sameRoom) {
    const timeA = `${a.startSlot}:00–${a.endSlot}:00`;
    const timeB = `${b.startSlot}:00–${b.endSlot}:00`;

    if (sameRoom) {
      return `Room "${a.roomName}" is double-booked on ${a.day}: "${a.courseName}" (${timeA}) overlaps with "${b.courseName}" (${timeB}).`;
    }
    if (sameInstructor) {
      return `Instructor "${a.instructor}" is double-booked on ${a.day}: "${a.courseName}" (${timeA}) overlaps with "${b.courseName}" (${timeB}).`;
    }
    return `Time conflict on ${a.day}: "${a.courseName}" (${timeA}) overlaps with "${b.courseName}" (${timeB}).`;
  }

  /**
   * Generate resolution suggestions for detected conflicts
   */
  static suggest(conflicts, entries, constraints) {
    const suggestions = [];
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const { dayStartHour, dayEndHour, lunchBreakStart, lunchBreakEnd, activeDays } = constraints;

    for (const conflict of conflicts) {
      // Try to find alternative slots for entryB
      const entryB = conflict.entryB;
      const duration = entryB.endSlot - entryB.startSlot;
      const alternativeSlots = [];

      for (const day of activeDays) {
        for (let hour = dayStartHour; hour <= dayEndHour - duration; hour++) {
          // Skip lunch
          let overlapsLunch = false;
          for (let h = hour; h < hour + duration; h++) {
            if (h >= lunchBreakStart && h < lunchBreakEnd) {
              overlapsLunch = true;
              break;
            }
          }
          if (overlapsLunch) continue;

          // Check if this slot is free
          const wouldConflict = entries.some(e => {
            if (e._id && e._id.toString() === entryB.id?.toString()) return false; // Skip self
            if (e.day !== day) return false;
            return !(hour + duration <= e.startSlot || e.endSlot <= hour);
          });

          if (!wouldConflict) {
            alternativeSlots.push({ day, startSlot: hour, endSlot: hour + duration });
            if (alternativeSlots.length >= 3) break; // Limit to 3 suggestions per conflict
          }
        }
        if (alternativeSlots.length >= 3) break;
      }

      suggestions.push({
        conflict,
        moveEntry: entryB.courseName,
        alternatives: alternativeSlots.map(s => ({
          day: s.day,
          time: `${s.startSlot}:00 – ${s.endSlot}:00`,
          startSlot: s.startSlot,
          endSlot: s.endSlot,
        })),
      });
    }

    return suggestions;
  }
}

module.exports = ConflictDetector;
