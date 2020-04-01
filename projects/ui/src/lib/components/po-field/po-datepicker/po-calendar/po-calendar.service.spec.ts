import { PoCalendarService } from './po-calendar.service';

import * as UtilsFunctions from '../../../../utils/util';
import { setYearFrom0To100 } from '../../../../utils/util';

describe('PoCalendarService', () => {
  let service: PoCalendarService;

  beforeEach(() => {
    service = new PoCalendarService();
  });

  describe('Methods:', () => {
    it('monthDates: should call `setYearFrom0To100`', () => {
      spyOn(UtilsFunctions, 'setYearFrom0To100');
      service.monthDates(1, 1);
      expect(setYearFrom0To100).toHaveBeenCalled();
    });
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
});
