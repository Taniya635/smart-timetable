import '../styles/TimetableGrid.css';
import { formatTimeValue } from '../utils/time';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_STEP = 0.5;

export default function TimetableGrid({
  timetable,
  constraints,
  conflicts,
  title = 'Weekly Timetable',
  subtitle,
  wrapperId,
}) {
  if (!timetable || !timetable.entries || timetable.entries.length === 0) {
    return (
      <div className="timetable-wrapper" id={wrapperId}>
        <div className="timetable-header">
          <h2 className="timetable-title">
            <span className="timetable-title-icon">📅</span>
            {title}
          </h2>
        </div>
        {subtitle && <div className="timetable-subtitle">{subtitle}</div>}
        <div className="glass-card">
          <div className="empty-state">
            <div className="empty-state-icon">🎯</div>
            <div className="empty-state-title">No timetable generated yet</div>
            <div className="empty-state-text">
              Add some courses and click "Generate Timetable" to create your optimized schedule.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const startHour = timetable.scheduleWindow?.startHour ?? (constraints?.dayStartHour || 8);
  const endHour = timetable.scheduleWindow?.endHour ?? (constraints?.dayEndHour || 18);
  const lunchStart = constraints?.lunchBreakStart || 12;
  const lunchEnd = constraints?.lunchBreakEnd || 13;
  const activeDays = constraints?.activeDays || DAYS.slice(0, 5);
  const hours = [];
  for (let h = startHour; h < endHour - 1e-9; h += TIME_STEP) {
    hours.push(Number(h.toFixed(1)));
  }

  // Build a lookup: { "Monday_8": [entry, entry] }
  const grid = {};
  for (const entry of timetable.entries) {
    for (let h = entry.startSlot; h < entry.endSlot - 1e-9; h += TIME_STEP) {
      const key = `${entry.day}_${h.toFixed(1)}`;
      if (!grid[key]) grid[key] = [];
      grid[key].push(entry);
    }
  }

  // Build conflict set for entries
  const conflictEntryIds = new Set();
  if (conflicts) {
    for (const c of conflicts) {
      if (c.entryA?.id) conflictEntryIds.add(c.entryA.id);
      if (c.entryB?.id) conflictEntryIds.add(c.entryB.id);
    }
  }

  // Track which entries have already rendered their top cell
  const renderedEntries = new Set();

  const cols = activeDays.length + 1; // +1 for time column

  return (
    <div className="timetable-wrapper" id={wrapperId}>
      <div className="timetable-header">
        <h2 className="timetable-title">
          <span className="timetable-title-icon">📅</span>
          {title}
        </h2>
      </div>
      {subtitle && <div className="timetable-subtitle">{subtitle}</div>}
      <div className="timetable-grid-container">
        <div className="timetable-grid" style={{ gridTemplateColumns: `70px repeat(${activeDays.length}, 1fr)` }}>
          {/* Header row */}
          <div className="grid-header-cell time-col">Time</div>
          {activeDays.map(day => (
            <div className="grid-header-cell" key={day}>{day.slice(0, 3).toUpperCase()}</div>
          ))}

          {/* Body rows */}
          {hours.map(hour => {
            const isLunch = hour >= lunchStart && hour < lunchEnd;

            if (isLunch) {
              return [
                <div className="grid-time-cell" key={`time-${hour}`} style={{ minHeight: 40 }}>
                  {formatTimeValue(hour)}
                </div>,
                ...activeDays.map(day => (
                  <div className="grid-lunch-cell" key={`${day}-${hour}`}>
                    <span className="lunch-label">🍽 Lunch</span>
                  </div>
                )),
              ];
            }

            return [
              <div className="grid-time-cell" key={`time-${hour}`}>
                {formatTimeValue(hour)}
              </div>,
              ...activeDays.map(day => {
                const key = `${day}_${hour.toFixed(1)}`;
                const cellEntries = grid[key] || [];

                return (
                  <div className="grid-cell" key={key}>
                    {cellEntries.map(entry => {
                      const entryKey = `${entry.courseId || entry.courseName}_${entry.day}_${entry.startSlot}`;
                      // Only render the block in its first (top) cell
                      if (Math.abs(hour - entry.startSlot) > 1e-9) return null;
                      if (renderedEntries.has(entryKey)) return null;
                      renderedEntries.add(entryKey);

                      const span = (entry.endSlot - entry.startSlot) / TIME_STEP;
                      const hasConflict = entry._id && conflictEntryIds.has(entry._id.toString());

                      return (
                        <div
                          className={`grid-entry ${hasConflict ? 'has-conflict' : ''}`}
                          key={entryKey}
                          style={{
                            backgroundColor: entry.color || '#6c5ce7',
                            height: `${span * 60 - 8}px`,
                            position: span > 1 ? 'absolute' : 'relative',
                            top: span > 1 ? '4px' : undefined,
                            left: span > 1 ? '4px' : undefined,
                            right: span > 1 ? '4px' : undefined,
                            zIndex: 2,
                          }}
                        >
                          <div className="grid-entry-name">{entry.courseName}</div>
                          <div className="grid-entry-instructor">{entry.instructor}</div>
                          {entry.roomName && <div className="grid-entry-time">📍 {entry.roomName}</div>}
                          <div className="grid-entry-time">{formatTimeValue(entry.startSlot)} – {formatTimeValue(entry.endSlot)}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              }),
            ];
          })}
        </div>
      </div>

      {/* Unplaced courses warning */}
      {timetable.unplaced && timetable.unplaced.length > 0 && (
        <div className="unplaced-warning">
          <div className="unplaced-title">
            ⚠️ {timetable.unplaced.length} session{timetable.unplaced.length > 1 ? 's' : ''} could not be placed
          </div>
          {timetable.unplaced.map((u, i) => (
            <div className="unplaced-item" key={i}>
              <strong>{u.courseName}</strong>: {u.reason}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
