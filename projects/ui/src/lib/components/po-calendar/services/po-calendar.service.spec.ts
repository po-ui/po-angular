import { PoCalendarService } from './po-calendar.service';

describe('PoCalendarService:', () => {
  describe('parseDate:', () => {
    it('should return undefined for falsy values', () => {
      expect((service as any).parseDate(undefined)).toBeUndefined();
      expect((service as any).parseDate(null)).toBeUndefined();
      expect((service as any).parseDate('')).toBeUndefined();
    });

    it('should parse yyyy-mm-dd string', () => {
      const result = (service as any).parseDate('2024-06-10');
      expect(result).toEqual(new Date(2024, 5, 10));
    });

    it('should parse valid date string (ISO)', () => {
      const result = (service as any).parseDate('2024-06-10T12:00:00Z');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(10);
    });

    it('should return undefined for invalid date string', () => {
      expect((service as any).parseDate('invalid-date')).toBeUndefined();
    });

    it('should parse Date object', () => {
      const date = new Date(2024, 5, 10);
      const result = (service as any).parseDate(date);
      expect(result).toEqual(new Date(2024, 5, 10));
    });

    it('should parse Date object with non-zero hours and UTC hours zero', () => {
      const fakeDate: any = new Date(Date.UTC(2024, 5, 10, 0, 0, 0));
      fakeDate.getHours = () => 1;
      fakeDate.getUTCHours = () => 0;
      fakeDate.getUTCMinutes = () => 0;
      fakeDate.getUTCFullYear = () => 2024;
      fakeDate.getUTCMonth = () => 5;
      fakeDate.getUTCDate = () => 10;
      const result = (service as any).parseDate(fakeDate);
      expect(result).toEqual(new Date(2024, 5, 10));
    });

    it('should return undefined for non-Date, non-string values', () => {
      expect((service as any).parseDate({})).toBeUndefined();
      expect((service as any).parseDate(123)).toBeUndefined();
      expect((service as any).parseDate([])).toBeUndefined();
    });
  });
  let service: PoCalendarService;

  beforeEach(() => {
    service = new PoCalendarService();
  });

  it('should have a `service` attribute that is a PoCalendarLangService', () => {
    expect(service instanceof PoCalendarService).toBeTruthy();
  });

  it('should get month week dates', () => {
    expect(service.monthDates(2017, 7).length).toBe(5);

    try {
      expect(service.monthDates(2017, 20)).toThrow(new Error('month must be a number (Jan is 0)'));
    } catch (error) {
      expect(error.message).toBe('month must be a number (Jan is 0)');
    }

    const weekFormatter = function (week?: any) {
      return 0;
    };
    expect(service.monthDates(2017, 7, null, weekFormatter).length).toBe(5);
  });

  it('should get month days', () => {
    expect(service.monthDays(2017, 7).length).toBe(5);
  });

  describe('Methods:', () => {
    it('monthDates: should get month days with year is less than 100', () => {
      expect(service.monthDays(25, 7).length).toBe(6);
    });

    it('monthDates: should get month days with year is greater than 101', () => {
      expect(service.monthDays(158, 7).length).toBe(5);
    });
  });
});
