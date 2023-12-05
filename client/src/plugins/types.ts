
export let repeatStatuses = {
  mainStatus: ['однократно', 'ежедневно', 'По будням(пн-пт)', 'Еженедельно(каждый/е {ВЫБРАНЫЙ ДЕНЬ})', 'Ежемесячно(каждый/е {СООТВЕТСВУЮЩИЙ ДЕНЬ})', 'Ежемесячно(каждое/ые {ВЫБРАНОЕ ЧИСЛО})', 'Ежегодно(КАЖДЫЙ {ДЕНЬ МЕСЯЦ})', 'Особый' ],
  timesRepeat: 1,
  SpecialStatus: {
    times: {
      statuses: ['DayWeek', 'DayNumber', 'WeekNumber', 'Month', 'MonthNumber'],
      DayWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      DayNumber: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
      WeekNumber: ['перв(1)', 'втор(2)', 'трет(3)', 'четвёрт(4)', 'пят(5)'], // число словом + спряжение числительного
      Month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      MonthNumber: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    },
    repeat: {
      statusesConstructor: ['Day', 'W', 'everyWeekDays', 'everyWeekNumbers', 'everyMonth', 'everyMothNumbers', 'everyYear'],
      statuses: ['everyDay', 'everyDayNumbers', 'everyWeekDays', 'everyWeekNumbers', 'everyMonth', 'everyMothNumbers', 'everyYear'],
      Day: 1,
      // everyDayNumbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
      everyWeekDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      everyWeekNumbers: ['перв(1)', 'втор(2)', 'трет(3)', 'четвёрт(4)', 'пят(5)'], // число словом + спряжение числительного
      everyMonth: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      everyMothNumbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      everyYear: 'everyYear'
    }
  }
}