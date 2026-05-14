import '../styles/Header.css';

export default function Header({ serverStatus, user, onLogout }) {
  return (
    <header className="header" id="app-header">
      <div className="header-brand">
        <div className="header-logo">📅</div>
        <div>
          <div className="header-title">
            <span>Smart</span> Timetable
          </div>
          <div className="header-subtitle">AI-Powered Scheduler</div>
        </div>
      </div>
      <div className="header-actions">
        <div className="header-status">
          <span className={`status-dot ${serverStatus ? '' : 'disconnected'}`}></span>
          {serverStatus ? 'Connected' : 'Disconnected'}
        </div>
        {user && (
          <div className="header-user">
            <span className="header-user-name">👤 {user.name}</span>
            <button className="btn btn-ghost btn-sm" onClick={onLogout} id="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
