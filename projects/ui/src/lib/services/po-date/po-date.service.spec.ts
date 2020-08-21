import * as utilsFunctions from '../../utils/util';

import { PoDateService } from './po-date.service';

describe('PoDateTimeService:', () => {
  const dateService = new PoDateService();

  it('should be created', () => {
    expect(dateService instanceof PoDateService).toBeTruthy();
  });

  describe('Methods:', () => {
    describe('convertIsoToDate:', () => {
      it('should return `undefined` if date is falsy', () => {
        const date = '';

        expect(dateService.convertIsoToDate(date, false, false)).toBeUndefined();
      });

      it('should return date if minDate and maxDate are false', () => {
        const stringDate = new Date(2017, 1, 1).toISOString();
        const hour = 60000;
        const timezoneOffset = 1;
        const dateParse = 1234;
        const newDate = new Date(dateParse + hour);

        spyOn(Date.prototype, 'getTimezoneOffset').and.returnValue(timezoneOffset);
        spyOn(Date, 'parse').and.returnValue(dateParse);

        const result = dateService.splitDate(dateService.convertIsoToDate(stringDate, false, false));

        expect(result).toEqual(dateService.splitDate(newDate));
      });

      it('should return date with `00:00:00` hour if minDate is true', () => {
        const stringDate = new Date(2017, 10, 30).toISOString();
        const minDate = true;

        const result = dateWithoutTimeZone(dateService.convertIsoToDate(stringDate, minDate, false));

        expect(result).toEqual('2017-10-30T00:00:00');
      });

      it('should return date with `23:59:59` hour if maxDate is true and minDate is false', () => {
        const stringDate = new Date(2017, 10, 30).toISOString();
        const minDate = false;
        const maxDate = true;

        const result = dateWithoutTimeZone(dateService.convertIsoToDate(stringDate, minDate, maxDate));

        expect(result).toEqual('2017-10-30T23:59:59');
      });
    });

    describe('convertDateToISO:', () => {
      it('should return null if date is undefined', () => {
        const date = undefined;
        expect(dateService.convertDateToISO(date)).toBeNull();
      });

      it('should return a ISO', () => {
        const date = new Date(2017, 10, 28);

        const result = dateService.convertDateToISO(date);

        expect(result).toBe('2017-11-28');
      });

      it('should return an extended ISO with 0 in the first year number if year is between 100 and 999', () => {
        const date = new Date(600, 10, 28);
        expect(dateService.convertDateToISO(date)).toBe('0600-11-28');

        const date2 = new Date(100, 10, 28);
        expect(dateService.convertDateToISO(date2)).toBe('0100-11-28');

        const date3 = new Date(999, 10, 28);
        expect(dateService.convertDateToISO(date3)).toBe('0999-11-28');
      });

      it('should return the date starting with zero on month and day if they are less than 10', () => {
        const date = new Date(2017, 5, 5);
        expect(dateService.convertDateToISO(date)).toBe('2017-06-05');
      });
    });

    describe('formatYear:', () => {
      it(`should return 'year.toString' if year is greater than 99`, () => {
        expect(dateService.formatYear(1000)).toBe('1000');
        expect(dateService.formatYear(2018)).toBe('2018');
        expect(dateService.formatYear(1999)).toBe('1999');
      });

      it(`should return '0 + year' if year is greater than 99 and less than 1000`, () => {
        expect(dateService.formatYear(888)).toBe('0888');
        expect(dateService.formatYear(999)).toBe('0999');
        expect(dateService.formatYear(100)).toBe('0100');
      });

      it(`should return '00 + year' if year is greater than 9 and less than 100`, () => {
        expect(dateService.formatYear(88)).toBe('0088');
        expect(dateService.formatYear(99)).toBe('0099');
        expect(dateService.formatYear(10)).toBe('0010');
      });

      it(`should return '000 + year' if year is greater or equal 0 and less than 10`, () => {
        expect(dateService.formatYear(8)).toBe('0008');
        expect(dateService.formatYear(9)).toBe('0009');
        expect(dateService.formatYear(0)).toBe('0000');
      });

      it(`should return 'undefined' if year is less than 0`, () => {
        expect(dateService.formatYear(-1)).toBeUndefined();
      });
    });

    it(`getDateForDateRange: should return date object and '00:00:00' hour if date param is instance of Date and isMinDate is true`, () => {
      const dateParam = new Date(2018, 2, 15);
      const isMinDate = true;
      const splitDate = { year: 2018, month: 2, day: 15 };
      const newDate = new Date(splitDate.year, splitDate.month, splitDate.day, 0, 0, 0);

      spyOn(dateService, 'splitDate').and.returnValue(splitDate);

      const result = dateService.getDateForDateRange(dateParam, isMinDate);

      expect(dateWithoutTimeZone(result)).toEqual(dateWithoutTimeZone(newDate));
    });

    it(`getDateForDateRange: should return date object and '23:59:59' hour if date param is
      instance of Date and isMinDate is false`, () => {
      const dateParam = new Date(2018, 2, 15);
      const isMinDate = false;
      const splitDate = { year: 2018, month: 2, day: 15 };
      const newDate = new Date(splitDate.year, splitDate.month, splitDate.day, 23, 59, 59);

      spyOn(dateService, 'splitDate').and.returnValue(splitDate);

      const result = dateService.getDateForDateRange(dateParam, isMinDate);

      expect(dateWithoutTimeZone(result)).toEqual(dateWithoutTimeZone(newDate));
    });

    it(`getDateForDateRange: should call 'convertIsoToDate' and return its value if date param not is
      instance of Date and isValidIso is true`, () => {
      const dateParam = '2018-03-15T03:00:00.000Z';
      const date = new Date(2018, 2, 15);
      const isMinDate = false;

      spyOn(dateService, 'convertIsoToDate').and.returnValue(date);
      spyOn(dateService, 'isValidIso').and.returnValue(true);

      const result = dateService.getDateForDateRange(dateParam, isMinDate);

      expect(result).toEqual(date);
      expect(dateService.convertIsoToDate).toHaveBeenCalledWith(dateParam, isMinDate, !isMinDate);
      expect(dateService.isValidIso).toHaveBeenCalledWith(dateParam);
    });

    it(`getDateForDateRange: should return undefined if date param not is instance of Date and isValidIso is false`, () => {
      const dateParam = '2018-03-15T03:00:00.000Z';

      spyOn(dateService, 'convertIsoToDate');
      spyOn(dateService, 'isValidIso').and.returnValue(false);

      const result = dateService.getDateForDateRange(dateParam, false);

      expect(result).toBeUndefined();
      expect(dateService.convertIsoToDate).not.toHaveBeenCalled();
      expect(dateService.isValidIso).toHaveBeenCalledWith(dateParam);
    });

    it('isValidIso: should return `true` if timezone is `-00:00`.', () => {
      const isoDate = '2018-09-29T00:00:01-00:00';

      expect(dateService.isValidIso(isoDate)).toBeTruthy();
    });

    it('isValidIso: should return `true` if timezone is `-03:00`.', () => {
      const isoDate = '2018-09-18T16:26:05-03:00';

      expect(dateService.isValidIso(isoDate)).toBeTruthy();
    });

    it('isValidIso: should return `true` if year is `0500`.', () => {
      const isoDate = '0500-09-18T16:26:05-03:00';

      expect(dateService.isValidIso(isoDate)).toBeTruthy();
    });

    it('isValidIso: should return `true` if year is `3000`.', () => {
      const isoDate = '3000-09-18T16:26:05-03:00';

      expect(dateService.isValidIso(isoDate)).toBeTruthy();
    });

    it('isValidIso: should return `true` if date is short format.', () => {
      const isoDate = '2018-09-18';

      expect(dateService.isValidIso(isoDate)).toBeTruthy();
    });

    it('isValidIso: should return `false` if the timezone is incorrect.', () => {
      let isoDate = '2018-09-18T16:26:05';
      expect(dateService.isValidIso(isoDate)).toBeFalsy();

      isoDate = '2018-09-18T';
      expect(dateService.isValidIso(isoDate)).toBeFalsy();

      isoDate = '2018-09-18T16:26:05-000:00';
      expect(dateService.isValidIso(isoDate)).toBeFalsy();
    });

    it('isValidIso: should return `false` if the date is incorrect.', () => {
      let isoDate = '2018-90-18T16:26:05-000:00';
      expect(dateService.isValidIso(isoDate)).toBeFalsy();

      isoDate = '2018-0-18T16:26:05-000:00';
      expect(dateService.isValidIso(isoDate)).toBeFalsy();

      isoDate = '20-09-18T16:26:05-000:00';
      expect(dateService.isValidIso(isoDate)).toBeFalsy();

      isoDate = '2018-09-42T16:26:05-000:00';
      expect(dateService.isValidIso(isoDate)).toBeFalsy();
    });

    it('isDateRangeValid: should return `true` if the first date is greater than second date.', () => {
      const firstDate = '2018-12-22';
      const secondDate = '2018-12-21';

      expect(dateService.isDateRangeValid(firstDate, secondDate)).toBe(true);
    });

    it('isDateRangeValid: should return `false` if the first date is less than second date.', () => {
      const firstDate = '2018-12-21';
      const secondDate = '2018-12-22';

      expect(dateService.isDateRangeValid(firstDate, secondDate)).toBe(false);
    });

    it('isDateRangeValid: should return `true` if dates are equal.', () => {
      const firstDate = '2018-12-22';
      const secondDate = '2018-12-22';

      expect(dateService.isDateRangeValid(firstDate, secondDate)).toBe(true);
    });

    it('isDateRangeValid: should return `true` if first date is `undefined`.', () => {
      const firstDate = undefined;
      const secondDate = '2018-12-22';

      expect(dateService.isDateRangeValid(firstDate, secondDate)).toBe(true);
    });

    it('isDateRangeValid: should return `true` if second date is `undefined`.', () => {
      const firstDate = '2018-12-22';
      const secondDate = undefined;

      expect(dateService.isDateRangeValid(firstDate, secondDate)).toBe(true);
    });

    it('isDateRangeValid: should return `true` if dates are `undefined`.', () => {
      const firstDate = undefined;
      const secondDate = undefined;

      expect(dateService.isDateRangeValid(firstDate, secondDate)).toBe(true);
    });

    it('setYearFrom0To100: shouldn`t set `date` if year is greater than `99`.', () => {
      const date = new Date(2018, 10, 5);

      dateService.setYearFrom0To100(date, 2018);

      expect(date).toBe(date);
    });

    it('setYearFrom0To100: should set `date` if year is less than `99`.', () => {
      const date = new Date(89, 10, 5);

      dateService.setYearFrom0To100(date, 89);

      expect(date).toBe(date);
    });

    it('splitDate: should return an object with year, month and day of the date', () => {
      const dateSplited = { year: 2018, month: 3, day: 24 };
      const date = new Date(dateSplited.year, dateSplited.month, dateSplited.day);

      expect(dateService.splitDate(date)).toEqual(dateSplited);
    });

    describe('validateDateRange:', () => {
      let dateStart;
      let dateEnd;
      let date;

      beforeEach(() => {
        dateStart = undefined;
        dateEnd = undefined;
        date = new Date(2018, 6, 30);
      });

      it('should return `true` if date is between `dateStart` and `dateEnd`.', () => {
        dateStart = new Date(2018, 0, 1);
        dateEnd = new Date(2019, 0, 1);

        expect(dateService.validateDateRange(date, dateStart, dateEnd)).toBeTruthy();
      });

      it('should return `false` if date is not between `dateStart` and `dateEnd`.', () => {
        dateStart = new Date(2000, 0, 1);
        dateEnd = new Date(2001, 0, 1);

        expect(dateService.validateDateRange(date, dateStart, dateEnd)).toBeFalsy();
      });

      it('should return `true` if date is greater than `dateStart`.', () => {
        dateStart = new Date(2018, 0, 1);

        expect(dateService.validateDateRange(date, dateStart, dateEnd)).toBeTruthy();
      });

      it('should return `false` if date is less than `dateStart`.', () => {
        dateStart = new Date(2019, 0, 1);

        expect(dateService.validateDateRange(date, dateStart, dateEnd)).toBeFalsy();
      });

      it('should return `true` if date is less than `dateEnd`.', () => {
        dateEnd = new Date(2019, 0, 1);

        expect(dateService.validateDateRange(date, dateStart, dateEnd)).toBeTruthy();
      });

      it('should return `false` if date is greater than `dateEnd`.', () => {
        dateEnd = new Date(2017, 0, 1);

        expect(dateService.validateDateRange(date, dateStart, dateEnd)).toBeFalsy();
      });

      it('should return `true` if doesn`t have `dateStart` and `dateEnd`.', () => {
        expect(dateService.validateDateRange(date, dateStart, dateEnd)).toBeTruthy();
      });
    });

    describe('validateDate:', () => {
      it(`should return valid date if regex is valid and date is type 'Date'.`, () => {
        const date = new Date(2018, 5, 5);
        const validDate = '2018-06-05';

        expect(dateService['validateDate'](date)).toBe(validDate);
      });

      it(`should return valid date if regex is valid and date type is 'yyyy-mm-dd'.`, () => {
        const date = '2018-06-05';
        const validDate = '2018-06-05';

        expect(dateService['validateDate'](date)).toBe(validDate);
      });

      it(`should return valid date if regex is valid and date type is 'yyyy-mm-ddThh:mm:ss+|-hh:mm'.`, () => {
        const date = '2018-06-05T12:34:25-03:00';
        const validDate = '2018-06-05T12:34:25-03:00';

        expect(dateService['validateDate'](date)).toBe(validDate);
      });

      it(`should return undefined if date is in invalid format.`, () => {
        const date = '2018/06/05T12:34:25-03:00';

        expect(dateService['validateDate'](date)).toBeUndefined();
      });

      it(`should return undefined if date is invalid.`, () => {
        const date = '2018-13-45T12:34:25-03:00';

        expect(dateService['validateDate'](date)).toBeUndefined();
      });
    });
  });
});

function dateWithoutTimeZone(date: Date): string {
  const dateWithoutHour = new PoDateService().splitDate(date);
  const dateString = date.toString();

  return `${dateWithoutHour.year}-${dateWithoutHour.month}-${dateWithoutHour.day}T${dateString.substring(16, 24)}`;
}
