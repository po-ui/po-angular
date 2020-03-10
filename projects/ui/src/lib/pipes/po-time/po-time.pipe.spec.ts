import { PoTimePipe } from './po-time.pipe';

describe('PoTimePipe:', () => {
  const pipe = new PoTimePipe();

  it('should be created', () => {
    expect(pipe instanceof PoTimePipe).toBeTruthy();
  });

  describe('Methods:', () => {
    describe('transform:', () => {
      it(`should call 'formatValue', 'addDotMiliseconds' and 'getFormatMiliseconds'
        if time is string type and valid regex.`, () => {
        const validTime = '23:12:55.12';

        spyOn(pipe, <any>'formatValue');
        spyOn(pipe, <any>'addDotMiliseconds');
        spyOn(pipe, <any>'getFormatMiliseconds');

        pipe.transform(validTime);

        expect(pipe['formatValue']).toHaveBeenCalled();
        expect(pipe['addDotMiliseconds']).toHaveBeenCalled();
        expect(pipe['getFormatMiliseconds']).toHaveBeenCalled();
      });

      it(`should call 'formatValue', 'addDotMiliseconds' and 'getFormatMiliseconds'
        if time is string type, valid regex and have a format.`, () => {
        const validTime = '23:12:55.12';
        const format = 'HH:mm';

        spyOn(pipe, <any>'formatValue');
        spyOn(pipe, <any>'addDotMiliseconds');
        spyOn(pipe, <any>'getFormatMiliseconds');

        pipe.transform(validTime, format);

        expect(pipe['formatValue']).toHaveBeenCalled();
        expect(pipe['addDotMiliseconds']).toHaveBeenCalled();
        expect(pipe['getFormatMiliseconds']).toHaveBeenCalled();
      });

      it(`shouldn't call 'formatValue', 'addDotMiliseconds' and 'getFormatMiliseconds'
        if time is string type and invalid regex.`, () => {
        const invalidTime = '23-12-55.12';

        spyOn(pipe, <any>'formatValue');
        spyOn(pipe, <any>'addDotMiliseconds');
        spyOn(pipe, <any>'getFormatMiliseconds');

        pipe.transform(invalidTime);

        expect(pipe['formatValue']).not.toHaveBeenCalled();
        expect(pipe['addDotMiliseconds']).not.toHaveBeenCalled();
        expect(pipe['getFormatMiliseconds']).not.toHaveBeenCalled();
      });

      it(`shouldn't call 'formatValue', 'addDotMiliseconds' and 'getFormatMiliseconds'
        if time is not string type and invalid regex.`, () => {
        const invalidTime = undefined;

        spyOn(pipe, <any>'formatValue');
        spyOn(pipe, <any>'addDotMiliseconds');
        spyOn(pipe, <any>'getFormatMiliseconds');

        pipe.transform(invalidTime);

        expect(pipe['formatValue']).not.toHaveBeenCalled();
        expect(pipe['addDotMiliseconds']).not.toHaveBeenCalled();
        expect(pipe['getFormatMiliseconds']).not.toHaveBeenCalled();
      });
    });

    describe('addDotMiliseconds:', () => {
      it('should add dot if `amountOfF` is greater then 0 and have a `miliseconds`.', () => {
        const miliseconds = '123';
        const amountOfF = 2;
        const milisecondsWithDot = '.123';

        expect(pipe['addDotMiliseconds'](miliseconds, amountOfF)).toBe(milisecondsWithDot);
      });

      it('shouldn`t add dot if `amountOfF` is 0 and have a `miliseconds`.', () => {
        const miliseconds = '123';
        const amountOfF = 0;
        const milisecondsWithoutDot = '123';

        expect(pipe['addDotMiliseconds'](miliseconds, amountOfF)).toBe(milisecondsWithoutDot);
      });

      it('should return undefined if not have a `miliseconds` and `amountOfF` is greater than 0.', () => {
        const miliseconds = undefined;
        const amountOfF = 5;

        expect(pipe['addDotMiliseconds'](miliseconds, amountOfF)).toBeUndefined();
      });

      it('should return undefined if not have a `miliseconds` and `amountOfF` is equal 0.', () => {
        const miliseconds = undefined;
        const amountOfF = 0;

        expect(pipe['addDotMiliseconds'](miliseconds, amountOfF)).toBeUndefined();
      });
    });

    describe('formatValue:', () => {
      it(`should return value formated if have 'time' without miliseconds and 'format' and not have
        a 'formatMiliseconds' and 'miliseconds'.`, () => {
        const time = '23:00:00';
        const format = 'HH:mm:ss';
        const formatMiliseconds = undefined;
        const miliseconds = '';
        const timeFormated = '23:00:00';

        expect(pipe['formatValue'](time, format, formatMiliseconds, miliseconds)).toBe(timeFormated);
      });

      it(`should return value formated if have 'time' without miliseconds, 'format' with 'fff' and 'formatMiliseconds'
        and not have a 'miliseconds'.`, () => {
        const time = '23:00:00';
        const format = 'HH:mm:ss.fff';
        const formatMiliseconds = 'fff';
        const miliseconds = '';
        const timeFormated = '23:00:00';

        expect(pipe['formatValue'](time, format, formatMiliseconds, miliseconds)).toBe(timeFormated);
      });

      it(`should return value formated if have 'time' with miliseconds, 'format' with 'fff', 'formatMiliseconds'
        and 'miliseconds'.`, () => {
        const time = '23:00:00.123';
        const format = 'HH:mm:ss.fff';
        const formatMiliseconds = 'fff';
        const miliseconds = '.123';
        const timeFormated = '23:00:00.123';

        expect(pipe['formatValue'](time, format, formatMiliseconds, miliseconds)).toBe(timeFormated);
      });

      it(`should return value if not have a format.`, () => {
        const time = '23:00:00.123';
        const format = undefined;
        const formatMiliseconds = '';
        const miliseconds = '.123';
        const timeFormated = '23:00:00.123';

        expect(pipe['formatValue'](time, format, formatMiliseconds, miliseconds)).toBe(timeFormated);
      });

      it(`should return value formated if have 'time' with miliseconds, 'format' with 'ff', 'formatMiliseconds'
        and 'miliseconds'.`, () => {
        const time = '23:00:00.123';
        const format = 'HH:mm:ss.ff';
        const formatMiliseconds = 'ff';
        const miliseconds = '.12';
        const timeFormated = '23:00:00.12';

        expect(pipe['formatValue'](time, format, formatMiliseconds, miliseconds)).toBe(timeFormated);
      });

      it(`should return undefined if not have a time.`, () => {
        const time = undefined;
        const format = '';
        const formatMiliseconds = '';
        const miliseconds = '';

        expect(pipe['formatValue'](time, format, formatMiliseconds, miliseconds)).toBeUndefined();
      });
    });

    describe('getFormatMiliseconds:', () => {
      it(`should return 'fff' when 'amountOfF' is equal 3.`, () => {
        const amountOfF = 3;
        const formatedMiliseconds = 'fff';

        expect(pipe['getFormatMiliseconds'](amountOfF)).toBe(formatedMiliseconds);
      });

      it(`should return 'f' when 'amountOfF' is equal 1.`, () => {
        const amountOfF = 1;
        const formatedMiliseconds = 'f';

        expect(pipe['getFormatMiliseconds'](amountOfF)).toBe(formatedMiliseconds);
      });

      it(`should return '' when 'amountOfF' is equal 0.`, () => {
        const amountOfF = 0;
        const formatedMiliseconds = '';

        expect(pipe['getFormatMiliseconds'](amountOfF)).toBe(formatedMiliseconds);
      });
    });
  });
});
