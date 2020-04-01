import { PoCalendarService } from './po-calendar.service';

describe('PoCalendarService:', () => {
  let service: PoCalendarService;

  beforeEach(() => {
    service = new PoCalendarService();
  });

  it('should have a `service` attribute that is a PoCalendarLangService', () => {
    expect(service instanceof PoCalendarService).toBeTruthy();
  });

  it('should get month week dates', () => {
    // Agosto tem 5 semanas
    expect(service.monthDates(2017, 7).length).toBe(5);

    // invalid month
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
    // Agosto tem 5 semanas
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
