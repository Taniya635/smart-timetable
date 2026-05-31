import { useMemo } from 'react';
import '../styles/ConflictPanel.css';

export default function ConflictPanel({ conflicts, suggestions }) {
  const suggestionByConflictKey = useMemo(() => {
    const map = new Map();
    for (const suggestion of suggestions || []) {
      const key = `${suggestion.conflict?.entryA?.id || ''}-${suggestion.conflict?.entryB?.id || ''}`;
      map.set(key, suggestion);
    }
    return map;
  }, [suggestions]);

  if (!conflicts || conflicts.length === 0) {
    return (
      <div className="conflict-panel">
        <div className="no-conflicts">
          <div className="no-conflicts-icon">✅</div>
          <div>
            <div className="no-conflicts-text">No Conflicts Detected</div>
            <div className="no-conflicts-sub">Your timetable is clear of scheduling issues</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="conflict-panel" id="conflict-panel">
      <div className="conflict-panel-header">
        <h3 className="conflict-panel-title">
          ⚠️ Conflicts
          <span className="conflict-count">{conflicts.length}</span>
        </h3>
      </div>
      <div className="conflict-list">
        {conflicts.map((conflict, idx) => {
          const conflictKey = `${conflict.entryA?.id || ''}-${conflict.entryB?.id || ''}`;
          const suggestion = suggestionByConflictKey.get(conflictKey) || suggestions?.[idx];

          return (
            <div className="conflict-item" key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="conflict-type">
                {conflict.type === 'room_double_booking' ? '🏫 Room Double-Booking' :
                 conflict.type === 'instructor_clash' ? '👤 Instructor Clash' :
                 conflict.type === 'same_course_overlap' ? '📕 Same Course Overlap' :
                 '⏰ Time Overlap'}
                <span className={`badge ${conflict.severity === 'high' ? 'badge-danger' : 'badge-warning'}`}>
                  {conflict.severity}
                </span>
              </div>
              <div className="conflict-message">{conflict.message}</div>

              {suggestion && suggestion.alternatives && suggestion.alternatives.length > 0 ? (
                <div className="conflict-suggestions">
                  <div className="suggestion-title">
                    💡 Solution: move "{suggestion.moveEntry}"
                  </div>
                  {suggestion.alternatives.map((alt, aIdx) => (
                    <div className="suggestion-item" key={aIdx}>
                      <span className="suggestion-badge">{alt.day}</span>
                      <span>{alt.time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="conflict-suggestions">
                  <div className="suggestion-title">💡 Solution unavailable</div>
                  <div className="suggestion-item">
                    <span>No automatic alternative could be found for this conflict.</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
