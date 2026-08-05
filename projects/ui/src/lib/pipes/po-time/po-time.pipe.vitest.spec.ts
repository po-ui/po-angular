import { PoTimePipe } from './po-time.pipe';

describe('PoTimePipe:', () => {
  const pipe = new PoTimePipe();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(pipe instanceof PoTimePipe).toBeTruthy();
  });

  describe('Methods:', () => {
    describe('transform:', () => {
      it(`should call 'formatValue', 'addDotMiliseconds' and 'getFormatMiliseconds' if time is valid`, () => {
        const validTime = '23:12:55.12';

        vi.spyOn(pipe as any, 'formatValue');
        vi.spyOn(pipe as any, 'addDotMiliseconds');
        vi.spyOn(pipe as any, 'getFormatMiliseconds');

        pipe.transform(validTime);

        expect(pipe['formatValue']).toHaveBeenCalled();
        expect(pipe['addDotMiliseconds']).toHaveBeenCalled();
        expect(pipe['getFormatMiliseconds']).toHaveBeenCalled();
      });

      it(`should call methods if time is valid and has format`, () => {
        const validTime = '23:12:55.12';
        const format = 'HH:mm';

        vi.spyOn(pipe as any, 'formatValue');
        vi.spyOn(pipe as any, 'addDotMiliseconds');
        vi.spyOn(pipe as any, 'getFormatMiliseconds');

        pipe.transform(validTime, format);

        expect(pipe['formatValue']).toHaveBeenCalled();
        expect(pipe['addDotMiliseconds']).toHaveBeenCalled();
        expect(pipe['getFormatMiliseconds']).toHaveBeenCalled();
      });

      it(`shouldn't call methods if time is invalid regex`, () => {
        const invalidTime = '23-12-55.12';

        vi.spyOn(pipe as any, 'formatValue');
        vi.spyOn(pipe as any, 'addDotMiliseconds');
        vi.spyOn(pipe as any, 'getFormatMiliseconds');

        pipe.transform(invalidTime);

        expect(pipe['formatValue']).not.toHaveBeenCalled();
        expect(pipe['addDotMiliseconds']).not.toHaveBeenCalled();
        expect(pipe['getFormatMiliseconds']).not.toHaveBeenCalled();
      });

      it(`shouldn't call methods if time is undefined`, () => {
        vi.spyOn(pipe as any, 'formatValue');
        vi.spyOn(pipe as any, 'addDotMiliseconds');
        vi.spyOn(pipe as any, 'getFormatMiliseconds');

        pipe.transform(undefined);

        expect(pipe['formatValue']).not.toHaveBeenCalled();
        expect(pipe['addDotMiliseconds']).not.toHaveBeenCalled();
        expect(pipe['getFormatMiliseconds']).not.toHaveBeenCalled();
      });
    });

    describe('addDotMiliseconds:', () => {
      it('should add dot if amountOfF > 0 and has miliseconds', () => {
        expect(pipe['addDotMiliseconds']('123', 2)).toBe('.123');
      });

      it('shouldn`t add dot if amountOfF is 0', () => {
        expect(pipe['addDotMiliseconds']('123', 0)).toBe('123');
      });

      it('should return undefined if no miliseconds and amountOfF > 0', () => {
        expect(pipe['addDotMiliseconds'](undefined, 5)).toBeUndefined();
      });

      it('should return undefined if no miliseconds and amountOfF is 0', () => {
        expect(pipe['addDotMiliseconds'](undefined, 0)).toBeUndefined();
      });
    });

    describe('formatValue:', () => {
      it('should format time without miliseconds', () => {
        expect(pipe['formatValue']('23:00:00', 'HH:mm:ss', undefined, '')).toBe('23:00:00');
      });

      it('should format time with fff format but no miliseconds', () => {
        expect(pipe['formatValue']('23:00:00', 'HH:mm:ss.fff', 'fff', '')).toBe('23:00:00');
      });

      it('should format time with fff format and miliseconds', () => {
        expect(pipe['formatValue']('23:00:00.123', 'HH:mm:ss.fff', 'fff', '.123')).toBe('23:00:00.123');
      });

      it('should return value if no format', () => {
        expect(pipe['formatValue']('23:00:00.123', undefined, '', '.123')).toBe('23:00:00.123');
      });

      it('should format time with ff format and miliseconds', () => {
        expect(pipe['formatValue']('23:00:00.123', 'HH:mm:ss.ff', 'ff', '.12')).toBe('23:00:00.12');
      });

      it('should return undefined if no time', () => {
        expect(pipe['formatValue'](undefined, '', '', '')).toBeUndefined();
      });
    });

    describe('getFormatMiliseconds:', () => {
      it('should return fff when amountOfF is 3', () => {
        expect(pipe['getFormatMiliseconds'](3)).toBe('fff');
      });

      it('should return f when amountOfF is 1', () => {
        expect(pipe['getFormatMiliseconds'](1)).toBe('f');
      });

      it('should return empty when amountOfF is 0', () => {
        expect(pipe['getFormatMiliseconds'](0)).toBe('');
      });
    });
  });
});
