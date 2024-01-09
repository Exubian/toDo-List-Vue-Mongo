import './dateFunc';
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



window.excludeOne = excludeOne;
window.setPaddingBasedOnOverflow = setPaddingBasedOnOverflow;
window.getScrollbarWidth = getScrollbarWidth;
window.isScroll = isScroll;