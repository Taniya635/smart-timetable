import { useState } from 'react';
import '../styles/CourseForm.css';
import { formatTimeValue, parseTimeValue } from '../utils/time';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function RoomForm({ room, onSubmit, onClose }) {
  const [form, setForm] = useState(room ? {
    name: room.name,
    capacity: room.capacity,
    availableDays: room.availableDays || DAYS.slice(0, 5),
    availableFrom: formatTimeValue(room.availableFrom || 8),
    availableTo: formatTimeValue(room.availableTo || 18),
  } : {
    name: '',
    capacity: 30,
    availableDays: DAYS.slice(0, 5),
    availableFrom: formatTimeValue(8),
    availableTo: formatTimeValue(18),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'capacity' ? Number(value) : value }));
  };

  const toggleDay = (day) => {
    setForm(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({
      ...form,
      availableFrom: parseTimeValue(form.availableFrom),
      availableTo: parseTimeValue(form.availableTo),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{room ? '✏️ Edit Room' : '🏫 Add Room'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form className="course-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Room Name</label>
            <input
              className="form-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Room 101, Lab A"
              required
              id="room-name-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Capacity</label>
            <input
              className="form-input"
              name="capacity"
              type="number"
              min="1"
              max="500"
              value={form.capacity}
              onChange={handleChange}
              id="room-capacity-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Available Days</label>
            <div className="day-chips">
              {DAYS.map(d => (
                <span
                  key={d}
                  className={`chip ${form.availableDays.includes(d) ? 'active' : ''}`}
                  onClick={() => toggleDay(d)}
                >
                  {d.slice(0, 3)}
                </span>
              ))}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Available From</label>
              <input
                className="form-input"
                type="time"
                name="availableFrom"
                value={form.availableFrom}
                onChange={handleChange}
                step="1800"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Available Until</label>
              <input
                className="form-input"
                type="time"
                name="availableTo"
                value={form.availableTo}
                onChange={handleChange}
                step="1800"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" id="room-submit-btn">
              {room ? 'Update Room' : 'Add Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
