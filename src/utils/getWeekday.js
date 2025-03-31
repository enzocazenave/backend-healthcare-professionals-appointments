const getWeekday = (date) => {
  const day = new Date(date).getDay();
  const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return weekdays[day];
}

export default getWeekday;