import { useState } from 'react';
import '../styles/ConstraintForm.css';
import { formatTimeValue, parseTimeValue } from '../utils/time';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ConstraintForm({ constraints, onSubmit, onClose }) {
  const [form, setForm] = useState({
    maxHoursPerDay: constraints?.maxHoursPerDay || 6,
    lunchBreakStart: formatTimeValue(constraints?.lunchBreakStart || 12),
    lunchBreakEnd: formatTimeValue(constraints?.lunchBreakEnd || 13),
    breakBetweenClasses: constraints?.breakBetweenClasses || 0,
    dayStartHour: formatTimeValue(constraints?.dayStartHour || 8),
    dayEndHour: formatTimeValue(constraints?.dayEndHour || 18),
    activeDays: constraints?.activeDays || DAYS.slice(0, 5),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: ['maxHoursPerDay', 'breakBetweenClasses'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const toggleDay = (day) => {
    setForm(prev => ({
      ...prev,
      activeDays: prev.activeDays.includes(day)
        ? prev.activeDays.filter(d => d !== day)
        : [...prev.activeDays, day],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      lunchBreakStart: parseTimeValue(form.lunchBreakStart),
      lunchBreakEnd: parseTimeValue(form.lunchBreakEnd),
      dayStartHour: parseTimeValue(form.dayStartHour),
      dayEndHour: parseTimeValue(form.dayEndHour),
    };
    onSubmit(data);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">⚙️ Scheduling Constraints</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form className="constraint-form" onSubmit={handleSubmit}>
          <div className="constraint-section-label">📆 Active Days</div>
          <div className="form-group">
            <div className="day-toggle-row">
              {DAYS.map(d => (
                <span key={d} className={`chip ${form.activeDays.includes(d) ? 'active' : ''}`} onClick={() => toggleDay(d)}>
                  {d.slice(0, 3)}
                </span>
              ))}
            </div>
          </div>

          <div className="constraint-section-label">🕐 Schedule Hours</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Day Start</label>
              <input
                className="form-input"
                type="time"
                name="dayStartHour"
                value={form.dayStartHour}
                onChange={handleChange}
                step="1800"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Day End</label>
              <input
                className="form-input"
                type="time"
                name="dayEndHour"
                value={form.dayEndHour}
                onChange={handleChange}
                step="1800"
              />
            </div>
          </div>

          <div className="constraint-section-label">🍽 Lunch Break</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Lunch Start</label>
              <input
                className="form-input"
                type="time"
                name="lunchBreakStart"
                value={form.lunchBreakStart}
                onChange={handleChange}
                step="1800"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Lunch End</label>
              <input
                className="form-input"
                type="time"
                name="lunchBreakEnd"
                value={form.lunchBreakEnd}
                onChange={handleChange}
                step="1800"
              />
            </div>
          </div>

          <div className="constraint-section-label">📏 Limits</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Max Hours/Day</label>
              <select className="form-select" name="maxHoursPerDay" value={form.maxHoursPerDay} onChange={handleChange}>
                {[3,4,5,6,7,8,9,10].map(h => <option key={h} value={h}>{h} hours</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Break Between</label>
              <select className="form-select" name="breakBetweenClasses" value={form.breakBetweenClasses} onChange={handleChange}>
                <option value={0}>No break</option>
                <option value={1}>1 hour</option>
                <option value={2}>2 hours</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Constraints</button>
          </div>
        </form>
      </div>
    </div>
  );
}
