import { Injectable } from '@angular/core';

const poCalendarServiceFirstWeekDayDefault: number = 0;

@Injectable()
export class PoCalendarService {
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
    const getDayOrZero = function (date: any) {
      return date.getMonth() === month ? date : 0;
    };
    return this.monthDates(year, month, getDayOrZero);
  }

  weekStartDate(date: any) {
    const startDate = new Date(date.getTime());
    while (startDate.getDay() !== poCalendarServiceFirstWeekDayDefault) {
      startDate.setDate(startDate.getDate() - 1);
    }
    return startDate;
  }
}
