import { Injectable } from '@angular/core';

const poCalendarServiceFirstWeekDayDefault: number = 0;

@Injectable({
  providedIn: 'root'
})
export class PoCalendarService {
  getYearOptions(minDate?: Date | string, maxDate?: Date | string): Array<{ label: string; value: number }> {
    const currentYear = new Date().getFullYear();

    let minYear = currentYear - 150;
    let maxYear = currentYear + 150;

    if (minDate) {
      const date = new Date(minDate);
      if (!isNaN(date.getTime())) {
        minYear = date.getFullYear();
      }
    }

    if (maxDate) {
      const date = new Date(maxDate);
      if (!isNaN(date.getTime())) {
        maxYear = date.getFullYear();
      }
    }

    const options = [];
    for (let i = minYear; i <= maxYear; i++) {
      options.push({ label: i.toString(), value: i });
    }

    return options;
  }

  monthDates(year: any, month: any, dayFormatter: any = null, weekFormatter: any = null) {
    if (typeof month !== 'number' || month < 0 || month > 11) {
      throw Error('month must be a number (Jan is 0)');
    }

    const weeks: Array<any> = [];
    let week: Array<any> = [];
    let i = 0;
    let date = new Date(year, month, 1);

    if (year >= 0 && year < 100) {
      date.setFullYear(year);
    }

    date = this.weekStartDate(date);

    do {
      for (i = 0; i < 7; i++) {
        week.push(dayFormatter ? dayFormatter(date) : date);
        date = new Date(date.getTime());
        date.setDate(date.getDate() + 1);
      }
      weeks.push(weekFormatter ? weekFormatter(week) : week);
      week = [];
    } while (date.getMonth() <= month && date.getFullYear() === year);
    return weeks;
  }

  monthDays(year: any, month: any) {
    const getDayObject = function (date: any) {
      return date;
    };
    return this.monthDates(year, month, getDayObject);
  }

  weekStartDate(date: any) {
    const startDate = new Date(date.getTime());
    while (startDate.getDay() !== poCalendarServiceFirstWeekDayDefault) {
      startDate.setDate(startDate.getDate() - 1);
    }
    return startDate;
  }
}
