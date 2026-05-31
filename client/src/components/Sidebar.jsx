import '../styles/Sidebar.css';

export default function Sidebar({
  courses,
  rooms,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
  onAddRoom,
  onDeleteRoom,
  onGenerate,
  onShowConstraints,
  onExport,
  isGenerating,
  hasTimetable,
  mobileOpen,
  onToggleMobile,
}) {
  const closeMobileSidebar = () => {
    if (mobileOpen) {
      onToggleMobile();
    }
  };

  return (
    <>
      <button
        className={`sidebar-backdrop ${mobileOpen ? 'visible' : ''}`}
        onClick={closeMobileSidebar}
        aria-label="Close sidebar"
        type="button"
      />

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`} id="sidebar">
        {/* Add Course Button */}
        <div className="sidebar-section">
          <button className="btn btn-primary btn-lg generate-btn" onClick={() => { onAddCourse(); closeMobileSidebar(); }} id="add-course-btn">
            ➕ Add Course
          </button>
        </div>

        {/* Course List */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <span className="icon">📚</span>
            Courses ({courses.length})
          </div>
          {courses.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <div className="empty-state-icon">📖</div>
              <div className="empty-state-text">No courses yet. Add your first course to get started!</div>
            </div>
          ) : (
            <div className="course-list">
              {courses.map((course, idx) => (
                <div
                  className="course-card"
                  key={course._id}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="course-color-dot" style={{ backgroundColor: course.color, color: course.color }} />
                  <div className="course-info">
                    <div className="course-name">{course.name}</div>
                    <div className="course-meta">
                      {course.instructor} · {course.duration}h · {course.sessionsPerWeek}x/wk
                    </div>
                  </div>
                  <div className="course-actions">
                    <button className="course-action-btn" onClick={() => onEditCourse(course)} title="Edit">✏️</button>
                    <button className="course-action-btn delete" onClick={() => onDeleteCourse(course._id)} title="Delete">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rooms */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <span className="icon">🏫</span>
            Classrooms ({rooms.length})
          </div>
          <div className="sidebar-actions" style={{ marginBottom: rooms.length > 0 ? 10 : 0 }}>
            <button className="btn btn-ghost" onClick={() => { onAddRoom(); closeMobileSidebar(); }} id="add-room-btn" style={{ width: '100%' }}>
              ➕ Add Room
            </button>
          </div>
          {rooms.length > 0 && (
            <div className="course-list">
              {rooms.map((room, idx) => (
                <div className="course-card" key={room._id} style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="course-color-dot" style={{ backgroundColor: '#74b9ff', color: '#74b9ff' }} />
                  <div className="course-info">
                    <div className="course-name">{room.name}</div>
                    <div className="course-meta">
                      Cap: {room.capacity} · {room.availableDays?.length || 0} days
                    </div>
                  </div>
                  <div className="course-actions">
                    <button className="course-action-btn delete" onClick={() => onDeleteRoom(room._id)} title="Delete">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Constraints */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <span className="icon">⚙️</span>
            Settings
          </div>
          <div className="sidebar-actions">
            <button className="btn btn-ghost" onClick={() => { onShowConstraints(); closeMobileSidebar(); }} id="constraints-btn" style={{ width: '100%' }}>
              ⚙️ Configure Constraints
            </button>
          </div>
        </div>

        {/* Generate */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <span className="icon">🚀</span>
            Actions
          </div>
          <div className="sidebar-actions">
            <button
              className="btn btn-success generate-btn"
              onClick={() => { onGenerate(); closeMobileSidebar(); }}
              disabled={isGenerating || courses.length === 0}
              id="generate-btn"
            >
              {isGenerating ? (
                <>
                  <span className="spinner"></span>
                  Generating...
                </>
              ) : (
                <>🧠 Generate Timetable</>
              )}
            </button>
            {hasTimetable && (
              <button className="btn btn-ghost" onClick={() => { onExport(); closeMobileSidebar(); }} id="export-btn" style={{ width: '100%' }}>
                📥 Export as PNG
              </button>
            )}
          </div>
        </div>
      </aside>

      <button className="sidebar-toggle" onClick={onToggleMobile} id="sidebar-toggle">
        {mobileOpen ? '✕' : '☰'}
      </button>
    </>
  );
}
