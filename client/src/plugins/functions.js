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

function setPaddingBasedOnOverflow() {
  var body = document.body;

  var bodyStyle = window.getComputedStyle(body);

  if (bodyStyle.overflow === 'hidden') {
      body.style.paddingRight = getScrollbarWidth() + 'px';
  } else {
      body.style.paddingRight = '0';
  }
}
function getScrollbarWidth() {
  var scrollDiv = document.createElement('div');
  scrollDiv.style.width = '100px';
  scrollDiv.style.height = '100px';
  scrollDiv.style.overflow = 'scroll';
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.top = '-9999px';

  document.body.appendChild(scrollDiv);

  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

  document.body.removeChild(scrollDiv);

  return scrollbarWidth;
}


window.excludeOne = excludeOne;
window.getTomorrowDate = getTomorrowDate;
window.getCustomDate = getCustomDate;
window.setPaddingBasedOnOverflow = setPaddingBasedOnOverflow;