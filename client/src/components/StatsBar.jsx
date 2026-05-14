import '../styles/StatsBar.css';

export default function StatsBar({ stats, coursesCount }) {
  if (!stats) return null;
  return (
    <div className="stats-bar" id="stats-bar">
      <div className="stat-card purple">
        <div className="stat-icon">📊</div>
        <div className="stat-value">{stats.utilizationPercent}%</div>
        <div className="stat-label">Utilization</div>
        <div className="utilization-bar-bg">
          <div className="utilization-bar-fill" style={{ width: `${stats.utilizationPercent}%` }}></div>
        </div>
      </div>
      <div className="stat-card teal">
        <div className="stat-icon">✅</div>
        <div className="stat-value">{stats.coursesPlaced}</div>
        <div className="stat-label">Sessions Placed</div>
      </div>
      <div className="stat-card amber">
        <div className="stat-icon">📚</div>
        <div className="stat-value">{coursesCount}</div>
        <div className="stat-label">Total Courses</div>
      </div>
      <div className="stat-card coral">
        <div className="stat-icon">⚡</div>
        <div className="stat-value">{stats.conflictCount}</div>
        <div className="stat-label">Conflicts</div>
      </div>
      <div className="stat-card blue">
        <div className="stat-icon">📦</div>
        <div className="stat-value">{stats.totalSlotsAvailable - stats.totalSlotsFilled}</div>
        <div className="stat-label">Free Slots</div>
      </div>
    </div>
  );
}
