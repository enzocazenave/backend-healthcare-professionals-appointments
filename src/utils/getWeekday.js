import { getDay } from "date-fns";

const getWeekday = (date) => {
  const day = getDay(date);
  const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return weekdays[day];
}

export default getWeekday;