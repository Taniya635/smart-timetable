import { useState } from 'react';
import '../styles/ConstraintForm.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ConstraintForm({ constraints, onSubmit, onClose }) {
  const [form, setForm] = useState({
    maxHoursPerDay: constraints?.maxHoursPerDay || 6,
    lunchBreakStart: constraints?.lunchBreakStart || 12,
    lunchBreakEnd: constraints?.lunchBreakEnd || 13,
    breakBetweenClasses: constraints?.breakBetweenClasses || 0,
    dayStartHour: constraints?.dayStartHour || 8,
    dayEndHour: constraints?.dayEndHour || 18,
    activeDays: constraints?.activeDays || DAYS.slice(0, 5),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: Number(value) }));
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
    onSubmit(form);
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
              <select className="form-select" name="dayStartHour" value={form.dayStartHour} onChange={handleChange}>
                {[6,7,8,9,10,11].map(h => <option key={h} value={h}>{h}:00</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Day End</label>
              <select className="form-select" name="dayEndHour" value={form.dayEndHour} onChange={handleChange}>
                {[14,15,16,17,18,19,20].map(h => <option key={h} value={h}>{h}:00</option>)}
              </select>
            </div>
          </div>

          <div className="constraint-section-label">🍽 Lunch Break</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Lunch Start</label>
              <select className="form-select" name="lunchBreakStart" value={form.lunchBreakStart} onChange={handleChange}>
                {[11,12,13,14].map(h => <option key={h} value={h}>{h}:00</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Lunch End</label>
              <select className="form-select" name="lunchBreakEnd" value={form.lunchBreakEnd} onChange={handleChange}>
                {[12,13,14,15].map(h => <option key={h} value={h}>{h}:00</option>)}
              </select>
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
