export const formatTimeValue = (value) => {
  if (value === '' || value === null || value === undefined) return '';

  const time = Number(value);
  if (Number.isNaN(time)) return '';

  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const parseTimeValue = (value) => {
  if (!value) return '';

  const [hoursText, minutesText = '0'] = value.split(':');
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return '';

  return hours + minutes / 60;
};