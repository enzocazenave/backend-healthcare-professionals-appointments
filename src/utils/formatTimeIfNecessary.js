const formatTimeIfNecessary = (value) => {
  const value = this.getDataValue('start_time');

  if (typeof value === 'string') {
    const [hours, minutes, seconds] = value.split(':').map(Number);
    return new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds));
  }

  return value;
}

export default formatTimeIfNecessary;