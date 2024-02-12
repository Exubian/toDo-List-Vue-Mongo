import { cloneDeep } from 'lodash';
import './dateFunc';

function excludeOne (obj, exclude) {
  const result = {};
  const tempObj = cloneDeep(obj);
  for (let key in tempObj) {
    if (key !== exclude) {
      result[key] = tempObj[key];
    }
  }
  return result;
}

function setPaddingBasedOnOverflow() {
  const body = document.body;

  let bodyStyle = window.getComputedStyle(body);

  if (bodyStyle.overflow === 'hidden' && isScroll() ) {
      body.style.paddingRight = getScrollbarWidth() + 'px';
  } else {
      body.style.paddingRight = '0';
  }
}
function getScrollbarWidth() {
  const scrollDiv = document.createElement('div');
  scrollDiv.style.width = '100px';
  scrollDiv.style.height = '100px';
  scrollDiv.style.overflow = 'scroll';
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.top = '0px';

  document.body.appendChild(scrollDiv);

  let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

  document.body.removeChild(scrollDiv);

  return scrollbarWidth;
}
function isScroll(a='Height') {
  var d = document,
      b = d.body,
      e = d.documentElement,
      c = "client" + a;
      a = "scroll" + a;
  return /CSS/.test(d.compatMode)? (e[c]< e[a]) : (b[c]< b[a])
};

function customSort(opt){
  function customComparator(a, b) {
    const typeA = typeof a;

    if (typeA === 'number' || !isNaN(a)) {
      return a - b; // Сортировка чисел от меньшего к большему
    } else if(opt == 'week-day') {
      return getIndexDate(opt, a) - getIndexDate(opt, b)
    } else if (opt == 'month') {
      return getIndexDate(opt, a) - getIndexDate(opt, b)
    } else if (opt == 'word') {
      return getIndexDate(opt, a) - getIndexDate(opt, b)
    }  else if (typeA === 'string') {
      return a.localeCompare(b); // Сортировка строк по лексикографии
    }
  }
  this.sort(customComparator)
  return this
}
function getIndexDate(opt, value) {
  const mapWeekDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
  const mapMonths = [ "январь", "февраль", "март", "апрель", "май", "июнь", "июль", 
    "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
  ]
  const mapWeekOrder = ['Первая', 'Вторая', 'Третья', 'Четвёртая', 'Последняя']

  switch (opt) {
    case 'week-day':
      return mapWeekDays.indexOf(value)
    case 'month':
      return mapMonths.indexOf(value)
    case 'word':
      return mapWeekOrder.indexOf(value)
    default:
      break;
  }
}


window.excludeOne = excludeOne;
window.setPaddingBasedOnOverflow = setPaddingBasedOnOverflow;
window.getScrollbarWidth = getScrollbarWidth;
window.isScroll = isScroll;
Array.prototype.customSort = customSort