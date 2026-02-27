import { Injectable } from '@angular/core';

const poCalendarServiceFirstWeekDayDefault: number = 0;

@Injectable({
  providedIn: 'root'
})
export class PoCalendarService {
  private parseDate(dateValue: any): Date | undefined {
    if (!dateValue) return undefined;

    if (typeof dateValue === 'string') {
      const dateOnlyRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
      if (dateOnlyRegex.test(dateValue)) {
        const [, year, month, day] = dateValue.match(dateOnlyRegex).map(Number);
        return new Date(year, month - 1, day);
      }

      const parsed = new Date(dateValue);
      if (!isNaN(parsed.getTime())) {
        dateValue = parsed;
      } else {
        return undefined;
      }
    }

    if (dateValue instanceof Date) {
      if (dateValue.getHours() !== 0 && dateValue.getUTCHours() === 0 && dateValue.getUTCMinutes() === 0) {
        return new Date(dateValue.getUTCFullYear(), dateValue.getUTCMonth(), dateValue.getUTCDate());
      }
      return new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate());
    }

    return undefined;
  }

  getYearOptions(minDate?: Date | string, maxDate?: Date | string): Array<{ label: string; value: number }> {
    const currentYear = new Date().getFullYear();

    let minYear = currentYear - 150;
    let maxYear = currentYear + 150;

    const parsedMinDate = this.parseDate(minDate);
    if (parsedMinDate) {
      minYear = parsedMinDate.getFullYear();
    }

    const parsedMaxDate = this.parseDate(maxDate);
    if (parsedMaxDate) {
      maxYear = parsedMaxDate.getFullYear();
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
