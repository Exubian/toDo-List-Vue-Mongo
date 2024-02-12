import dateFilter from "@/filters/dateFilter";


const days = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
const months = [ "январь", "февраль", "март", "апрель", "май", "июнь", "июль", 
  "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
]
const monthNumbers = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
].join().split(',')
export function RepeatStatuses(items) {
  this.once = {
    title: 'однократно', alias: 'один раз'
  }
  this.everyDay = {
    title: 'ежедневно', alias: 'каждый день'
  }
  this.onWeekdays = {
    alias: 'будни',
    title: 'По будням(пн-пт)',
  }
  this.onWeekends = {
    alias: 'выходные',
    title: 'По выходным(сб-нд)',
  }
  this.everyWeek = {
    alias: 'каждую неделю',
    get title() { 
      return `Еженедельно(кажд. ${returnCurrentValue(items.repeat.value, 'day') || dateFilter(Date.now(), 'day-short')})`
    },
    next: {
      optionValue: 'day',
      select: days,
      interval: 100 // input
    }
  }
  this.everyMonthDays = {
    alias: '', 
    get title() { 
      return 'Ежемесячно(кажд. {СООТВЕТСВУЮЩАЯ НЕДЕЛЯ - ДЕНЬ})'
    }, // multiply weeks
    next: {
      optionValue: ['week', 'day'],
      select: {
        week: ['Первая', 'Вторая', 'Третья', 'Четвёртая', 'Последняя'],
        day: days
      },  // неделя-день
      interval: 100 // input
    }
  }
  this.everyMonthNumbers = {
    alias: '',
    get title() {
      return `Ежемесячно(кажд. ${returnCurrentValue(items.repeat.value, 'number') || dateFilter(Date.now(), 'num')})`
    },
    next: {
      optionValue: 'number',
      select: monthNumbers,
      interval: 100 // input
    }
  }
  this.everyYear = {
    alias: '', // multiply months
    get title() {
      return 'Ежегодно(КАЖД. {ДЕНЬ МЕСЯЦ})'
    },
    next: {
      optionValue: ['month', 'number'],
      select: {
        month: months,
        number: monthNumbers
      },
      interval: 100 // input
    }
  }
  this.special = {
    title: 'Особый',
  }
}

function returnCurrentValue(obj: object, option: string): string|null {
  if(!obj) return undefined;
  if (obj[option]) {
    return joinObjectInString(obj);
  } else return undefined;
}
function joinObjectInString(obj: object): string {
  let returnedString: string = ''
  for (const key in obj) {
    returnedString += obj[key].join(', ')
  }
  return returnedString
}