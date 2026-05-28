/**
 * CSP-based Timetable Scheduler
 * Uses backtracking with MRV heuristic and forward checking
 * Supports room/classroom assignment
 */

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_STEP = 0.5;

const roundTime = (value) => Math.round(value * 2) / 2;

class Scheduler {
  constructor(courses, constraints, rooms = []) {
    this.courses = courses;
    this.constraints = constraints;
    this.rooms = rooms;
    this.entries = [];
    this.unplaced = [];
  }

  /**
   * Generate all valid (day, startSlot, room?) domain values for a course session
   */
  generateDomain(course) {
    const domain = [];
    const { dayStartHour, dayEndHour, lunchBreakStart, lunchBreakEnd, activeDays, blockedSlots } = this.constraints;

    const days = course.preferredDays && course.preferredDays.length > 0
      ? course.preferredDays.filter(d => activeDays.includes(d))
      : activeDays;

    // If rooms exist, iterate over rooms; otherwise use null room
    const roomList = this.rooms.length > 0 ? this.rooms : [null];

    for (const room of roomList) {
      for (const day of days) {
        // Skip if room isn't available on this day
        if (room && room.availableDays && !room.availableDays.includes(day)) continue;

        const roomStart = room ? Math.max(dayStartHour, room.availableFrom || dayStartHour) : dayStartHour;
        const roomEnd = room ? Math.min(dayEndHour, room.availableTo || dayEndHour) : dayEndHour;

        for (let hour = roundTime(roomStart); hour <= roundTime(roomEnd - course.duration) + 1e-9; hour += TIME_STEP) {
          // Check if any slot in this range overlaps with lunch break
          let overlapsLunch = false;
          for (let h = hour; h < hour + course.duration; h += TIME_STEP) {
            if (h >= lunchBreakStart && h < lunchBreakEnd) {
              overlapsLunch = true;
              break;
            }
          }
          if (overlapsLunch) continue;

          // Check if any slot is blocked
          let isBlocked = false;
          for (let h = hour; h < hour + course.duration; h += TIME_STEP) {
            if (blockedSlots && blockedSlots.some(bs => bs.day === day && bs.hour === h)) {
              isBlocked = true;
              break;
            }
          }
          if (isBlocked) continue;

          // Compute preference score (higher = better)
          let score = 0;
          if (course.preferredDays && course.preferredDays.includes(day)) score += 10;
          if (course.preferredTimeStart && course.preferredTimeEnd) {
            if (hour >= course.preferredTimeStart && hour + course.duration <= course.preferredTimeEnd) {
              score += 20;
            }
          }
          // Prefer morning slots slightly
          score += Math.max(0, 12 - hour);

          domain.push({
            day,
            startSlot: hour,
            endSlot: hour + course.duration,
            score,
            roomId: room ? room._id : null,
            roomName: room ? room.name : null,
          });
        }
      }
    }

    // Sort by score descending (best first)
    domain.sort((a, b) => b.score - a.score);
    return domain;
  }

  /**
   * Check if placing an entry conflicts with existing placements
   */
  isConsistent(entry, placements) {
    const { maxHoursPerDay, breakBetweenClasses } = this.constraints;

    for (const placed of placements) {
      // Same day overlap check
      if (placed.day === entry.day) {
        const gap = breakBetweenClasses || 0;

        // Room double-booking: same room, overlapping time
        if (entry.roomId && placed.roomId &&
            entry.roomId.toString() === placed.roomId.toString()) {
          if (!(entry.endSlot + gap <= placed.startSlot || placed.endSlot + gap <= entry.startSlot)) {
            return false;
          }
        }

        // If no rooms defined, check general time overlap
        if (!entry.roomId && !placed.roomId) {
          if (!(entry.endSlot + gap <= placed.startSlot || placed.endSlot + gap <= entry.startSlot)) {
            return false;
          }
        }

        // Instructor clash: same instructor at overlapping time (regardless of room)
        if (placed.instructor === entry.instructor && placed.courseId.toString() !== entry.courseId.toString()) {
          if (!(entry.endSlot <= placed.startSlot || placed.endSlot <= entry.startSlot)) {
            return false;
          }
        }
      }
    }

    // Max hours per day check
    const dayHours = placements
      .filter(p => p.day === entry.day)
      .reduce((sum, p) => sum + (p.endSlot - p.startSlot), 0);
    if (dayHours + (entry.endSlot - entry.startSlot) > maxHoursPerDay) {
      return false;
    }

    return true;
  }

  /**
   * Expand courses into individual session variables
   */
  buildVariables() {
    const variables = [];
    for (const course of this.courses) {
      const sessions = course.sessionsPerWeek || 2;
      for (let s = 0; s < sessions; s++) {
        variables.push({
          courseId: course._id,
          courseName: course.name,
          instructor: course.instructor,
          color: course.color,
          duration: course.duration,
          sessionIndex: s,
          preferredDays: course.preferredDays,
          preferredTimeStart: course.preferredTimeStart,
          preferredTimeEnd: course.preferredTimeEnd,
        });
      }
    }
    return variables;
  }

  /**
   * MRV: sort variables by domain size (smallest first)
   */
  orderByMRV(variables, placements) {
    return variables.map(v => {
      const domain = this.generateDomain(v);
      const validDomain = domain.filter(d => this.isConsistent({
        ...v,
        day: d.day,
        startSlot: d.startSlot,
        endSlot: d.endSlot,
        roomId: d.roomId,
        roomName: d.roomName,
      }, placements));
      return { variable: v, domainSize: validDomain.length };
    }).sort((a, b) => a.domainSize - b.domainSize);
  }

  /**
   * Prevent same course from being placed at the same day (spread sessions)
   */
  checkSessionSpread(entry, placements) {
    const sameCourse = placements.filter(p => p.courseId.toString() === entry.courseId.toString());
    if (sameCourse.some(p => p.day === entry.day)) {
      return false;
    }
    return true;
  }

  /**
   * Main backtracking solver
   */
  solve(variables, placements, index) {
    if (index >= variables.length) {
      return true;
    }

    const variable = variables[index];
    const domain = this.generateDomain(variable);

    for (const slot of domain) {
      const entry = {
        courseId: variable.courseId,
        courseName: variable.courseName,
        instructor: variable.instructor,
        color: variable.color,
        day: slot.day,
        startSlot: slot.startSlot,
        endSlot: slot.endSlot,
        roomId: slot.roomId,
        roomName: slot.roomName,
      };

      if (this.isConsistent(entry, placements) && this.checkSessionSpread(entry, placements)) {
        placements.push(entry);
        if (this.solve(variables, placements, index + 1)) {
          return true;
        }
        placements.pop();
      }
    }

    return false;
  }

  /**
   * Run the scheduler
   */
  runGeneration() {
    const variables = this.buildVariables();
    const placements = [];

    // Order by MRV
    const ordered = this.orderByMRV(variables, placements);
    const orderedVars = ordered.map(o => o.variable);

    // Try solving with backtracking
    const success = this.solve(orderedVars, placements, 0);

    if (!success) {
      placements.length = 0;
      const placed = [];
      const unplaced = [];

      for (const variable of orderedVars) {
        const domain = this.generateDomain(variable);
        let wasPlaced = false;

        for (const slot of domain) {
          const entry = {
            courseId: variable.courseId,
            courseName: variable.courseName,
            instructor: variable.instructor,
            color: variable.color,
            day: slot.day,
            startSlot: slot.startSlot,
            endSlot: slot.endSlot,
            roomId: slot.roomId,
            roomName: slot.roomName,
          };

          if (this.isConsistent(entry, placed) && this.checkSessionSpread(entry, placed)) {
            placed.push(entry);
            wasPlaced = true;
            break;
          }
        }

        if (!wasPlaced) {
          unplaced.push({
            courseId: variable.courseId,
            courseName: variable.courseName,
            reason: `Could not find a valid slot for session ${variable.sessionIndex + 1} of "${variable.courseName}" — all time slots conflict with existing placements or constraints.`,
          });
        }
      }

      this.entries = placed;
      this.unplaced = unplaced;
    } else {
      this.entries = placements;
      this.unplaced = [];
    }

    // Compute stats
    const { activeDays, dayStartHour, dayEndHour, lunchBreakStart, lunchBreakEnd } = this.constraints;
    const slotsPerDay = (dayEndHour - dayStartHour) - (lunchBreakEnd - lunchBreakStart);
    const totalSlotsAvailable = activeDays.length * slotsPerDay;
    const totalSlotsFilled = this.entries.reduce((sum, e) => sum + (e.endSlot - e.startSlot), 0);

    return {
      entries: this.entries,
      unplaced: this.unplaced,
      scheduleWindow: {
        startHour: this.constraints.dayStartHour,
        endHour: this.constraints.dayEndHour,
      },
      stats: {
        totalSlotsFilled,
        totalSlotsAvailable,
        utilizationPercent: totalSlotsAvailable > 0 ? Math.round((totalSlotsFilled / totalSlotsAvailable) * 100) : 0,
        conflictCount: 0,
        coursesPlaced: this.entries.length,
        coursesUnplaced: this.unplaced.length,
      },
    };
  }

  /**
   * Expand the timetable window if needed so all sessions can fit.
   */
  generate() {
    const originalConstraints = { ...this.constraints };
    const maxEndHour = 24;
    let lastResult = null;

    for (
      let endHour = originalConstraints.dayEndHour;
      endHour <= maxEndHour + 1e-9;
      endHour += TIME_STEP
    ) {
      this.constraints = {
        ...originalConstraints,
        dayEndHour: Number(endHour.toFixed(1)),
      };

      lastResult = this.runGeneration();
      if ((lastResult.unplaced || []).length === 0) {
        this.constraints = originalConstraints;
        return lastResult;
      }
    }

    this.constraints = originalConstraints;
    return lastResult;
  }
}

module.exports = Scheduler;
