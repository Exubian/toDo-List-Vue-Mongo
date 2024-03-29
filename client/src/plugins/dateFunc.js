function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Получаем завтрашнюю дату
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
  const day = String(tomorrow.getDate()).padStart(2, '0');
  const hours = tomorrow.getHours();
  const minutes = tomorrow.getMinutes();

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getCustomDate(format='date') {
  const options = {};
  if (format.includes('date')) {
    options.day = new Date().getHours();
    options.month = new Date().getMonth();
    options.year = new Date().getFullYear();
  }
  const date = new Date();
  // здесь будет оброботка даты чтобы возвращать только переданые части
  return `${date.getHours()}:${date.getMinutes()}`;
}

function getFullDayName(abbreviatedDay) {
  const daysMap = {
      'пн': 'понедельник',
      'вт': 'вторник',
      'ср': 'среда',
      'чт': 'четверг',
      'пт': 'пятница',
      'сб': 'суббота',
      'вс': 'воскресенье'
  };

  const lowerAbbreviation = abbreviatedDay.toLowerCase();

  if (daysMap.hasOwnProperty(lowerAbbreviation)) {
      return daysMap[lowerAbbreviation];
  } else {
      return 'Invalid day abbreviation';
  }
}


window.getTomorrowDate = getTomorrowDate;
window.getCustomDate = getCustomDate;
window.getFullDayName = getFullDayName;