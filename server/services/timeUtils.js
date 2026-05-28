const formatTimeValue = (value) => {
  if (value === null || value === undefined || value === '') return '';

  const time = Number(value);
  if (Number.isNaN(time)) return '';

  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

module.exports = {
  formatTimeValue,
};