import { useState } from 'react';
import '../styles/CourseForm.css';

const PRESET_COLORS = [
  '#6c5ce7', '#a855f7', '#0984e3', '#00cec9', '#00b894',
  '#fdcb6e', '#e17055', '#ff6b6b', '#d63031', '#fd79a8',
  '#e84393', '#636e72',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const emptyForm = {
  name: '',
  instructor: '',
  duration: 1,
  sessionsPerWeek: 2,
  color: '#6c5ce7',
  preferredDays: [],
  preferredTimeStart: '',
  preferredTimeEnd: '',
};

export default function CourseForm({ course, onSubmit, onClose }) {
  const [form, setForm] = useState(course ? {
    name: course.name,
    instructor: course.instructor,
    duration: course.duration,
    sessionsPerWeek: course.sessionsPerWeek,
    color: course.color,
    preferredDays: course.preferredDays || [],
    preferredTimeStart: course.preferredTimeStart || '',
    preferredTimeEnd: course.preferredTimeEnd || '',
  } : { ...emptyForm });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'sessionsPerWeek' || name === 'preferredTimeStart' || name === 'preferredTimeEnd'
        ? (value === '' ? '' : Number(value))
        : value,
    }));
  };

  const toggleDay = (day) => {
    setForm(prev => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter(d => d !== day)
        : [...prev.preferredDays, day],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.instructor.trim()) return;
    const data = { ...form };
    if (data.preferredTimeStart === '') delete data.preferredTimeStart;
    if (data.preferredTimeEnd === '') delete data.preferredTimeEnd;
    onSubmit(data);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{course ? '✏️ Edit Course' : '➕ Add Course'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form className="course-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Course Name</label>
            <input
              className="form-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Data Structures"
              required
              id="course-name-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Instructor</label>
            <input
              className="form-input"
              name="instructor"
              value={form.instructor}
              onChange={handleChange}
              placeholder="e.g. Dr. Smith"
              required
              id="course-instructor-input"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Duration (hours)</label>
              <select className="form-select" name="duration" value={form.duration} onChange={handleChange} id="course-duration-select">
                <option value={1}>1 Hour</option>
                <option value={2}>2 Hours</option>
                <option value={3}>3 Hours</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Sessions / Week</label>
              <select className="form-select" name="sessionsPerWeek" value={form.sessionsPerWeek} onChange={handleChange} id="course-sessions-select">
                {[1,2,3,4,5,6].map(n => (
                  <option key={n} value={n}>{n}x per week</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Color</label>
            <div className="color-palette">
              {PRESET_COLORS.map(c => (
                <div
                  key={c}
                  className={`color-swatch ${form.color === c ? 'active' : ''}`}
                  style={{ backgroundColor: c, color: c }}
                  onClick={() => setForm(prev => ({ ...prev, color: c }))}
                />
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Preferred Days (optional)</label>
            <div className="day-chips">
              {DAYS.map(d => (
                <span
                  key={d}
                  className={`chip ${form.preferredDays.includes(d) ? 'active' : ''}`}
                  onClick={() => toggleDay(d)}
                >
                  {d.slice(0, 3)}
                </span>
              ))}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Pref. Start Hour</label>
              <select className="form-select" name="preferredTimeStart" value={form.preferredTimeStart} onChange={handleChange}>
                <option value="">Any</option>
                {Array.from({ length: 10 }, (_, i) => i + 8).map(h => (
                  <option key={h} value={h}>{h}:00</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Pref. End Hour</label>
              <select className="form-select" name="preferredTimeEnd" value={form.preferredTimeEnd} onChange={handleChange}>
                <option value="">Any</option>
                {Array.from({ length: 10 }, (_, i) => i + 9).map(h => (
                  <option key={h} value={h}>{h}:00</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" id="course-submit-btn">
              {course ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
