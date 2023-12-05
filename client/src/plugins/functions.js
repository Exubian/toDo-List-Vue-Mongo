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

function getCustomDate(...a) { 
  const date = new Date();
  // здесь будет обробка даты чтобы возвращать только переданые части
  return `${date.getHours()}:${date.getMinutes()}`;
}

function excludeOne (obj, exclude) {
  const result = {};
  for (let key in obj) {
    if (key !== exclude) {
      result[key] = obj[key];
    }
  }
  return result;
}



window.excludeOne = excludeOne;
window.getTomorrowDate = getTomorrowDate;
window.getCustomDate = getCustomDate;