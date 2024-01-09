import dateFilter from "@/filters/dateFilter";

export const repeatStatuses = {
  once: {
    title: 'однократно', value: 1  // dueDate
  },
  everyDay: {
    title: 'ежедневно', value: 365
  },
  onWeekdays: {
    title: 'По будням(пн-пт)',
    value: 'all from 1 to 5 day'
  },
  onWeekend: {
    title: 'По выходным(сб-нд)',
    value: '6 and 0'
  },
  everyWeek: {
    title: 'Еженедельно(каждый/е {ВЫБРАНЫЙ ДЕНЬ})',
    value: 'selected from 0 to 6',
    next: {
      next:false
    }
  },
  everyMonthDays: {
    title: 'Ежемесячно(каждый/е {СООТВЕТСВУЮЩИЙ ДЕНЬ})',
    value: 'selected from 0 to lastDay', // multiply weeks
    next: {
      select: ''
    }
  },
  everyMonthNumbers: {
    title: 'Ежемесячно(каждое/ые {ВЫБРАНОЕ ЧИСЛО})',
    value: 'selected from 1 to lastMonthDay',
    next: {
      select: ''
    }
  },
  everyYear: {
    title: 'Ежегодно(КАЖДЫЙ {ДЕНЬ МЕСЯЦ})',
    value: 'selected from 1 to lastMonthDay', // multiply months
    next: {
      select: ''
    }
  },
  special: {
    title: 'Особый'
  }
}
const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const months = [ "январь", "февраль", "март", "апрель", "май", "июнь", "июль", 
  "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
]
const monthNumbers = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
]
export function RepeatStatuses() {
  this.once = {
    title: 'однократно', value: 1 // dueDate
  }
  this.everyDay = {
    title: 'ежедневно', value: 365
  }
  this.onWeekdays = {
    title: 'По будням(пн-пт)',
    value: 'all from 1 to 5 day'
  }
  this.onWeekend = {
    title: 'По выходным(сб-нд)',
    value: '6 and 0'
  }
  this.everyWeek = {
    title: `Еженедельно(каждый/е ${dateFilter(Date.now(), 'day')})`,
    value: 'selected from 0 to 6',
    next: {
      select: days,
      interval: 100 // input
    }
  }
  this.everyMonthDays = {
    title: 'Ежемесячно(каждый/е {СООТВЕТСВУЮЩИЙ ДЕНЬ})',
    value: 'selected from 0 to lastDay', // multiply weeks
    next: {
      select: {
        week: ['Первая', 'Вторая', 'Третья', 'Четвёртая', 'Последняя'],
        day: days
      },  // неделя-день
      interval: 100 // input
    }
  }
  this.everyMonthNumbers = {
    title: 'Ежемесячно(каждое/ые {ВЫБРАНОЕ ЧИСЛО})',
    value: 'selected from 1 to lastMonthDay',
    next: {
      select: monthNumbers,
      interval: 100 // input
    }
  }
  this.everyYear = {
    title: 'Ежегодно(КАЖДЫЙ {ДЕНЬ МЕСЯЦ})',
    value: 'selected from 1 to lastMonthDay', // multiply months
    next: {
      select: '--not done--',
      interval: 100 // input
    }
  }
  this.special = {
    title: 'Особый',
    value: 'very lot statuses'
  }
}
