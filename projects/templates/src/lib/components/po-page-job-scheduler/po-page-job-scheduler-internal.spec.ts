import { PoPageJobSchedulerInternal } from './po-page-job-scheduler-internal';

describe('PoPageJobSchedulerInternal:', () => {
  let component: PoPageJobSchedulerInternal;

  beforeEach(() => {
    component = new PoPageJobSchedulerInternal();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('getCurrentHour: should return time with zero at the front if hour is less than 10.', () => {
      const date = new Date('2019-02-04T09:39:01.0000');

      expect(component['getCurrentHour'](date)).toBe('09:39');
    });

    it('getCurrentHour: should return minutes with zero at the front if minutes is less than 10.', () => {
      const date = new Date('2019-02-04T19:09:01.0000');

      expect(component['getCurrentHour'](date)).toBe('19:09');
    });
  });
});
