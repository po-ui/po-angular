import { TestBed } from '@angular/core/testing';

import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoDecimalFormatPipe } from './po-decimal.pipe';

describe('PoDecimalFormatPipe: ', () => {
  let pipe: PoDecimalFormatPipe;
  let languageService: PoLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoDecimalFormatPipe, PoLanguageService]
    });

    pipe = TestBed.inject(PoDecimalFormatPipe);
    languageService = TestBed.inject(PoLanguageService);
  });

  it('should be created', () => {
    expect(pipe instanceof PoDecimalFormatPipe).toBe(true);
  });

  describe('Methods: ', () => {
    describe('transform: ', () => {
      it('should return empty string when value is null', () => {
        const result = pipe.transform(null, '>>9.99');

        expect(result).toBe('');
      });

      it('should return empty string when value is undefined', () => {
        const result = pipe.transform(undefined, '>>9.99');

        expect(result).toBe('');
      });

      it('should return empty string when format is empty', () => {
        const result = pipe.transform(1234.56, '');

        expect(result).toBe('');
      });

      it('should return empty string when format is null', () => {
        const result = pipe.transform(1234.56, null);

        expect(result).toBe('');
      });

      it('should return empty string when value is NaN string', () => {
        const result = pipe.transform('abc', '>>9.99');

        expect(result).toBe('');
      });

      it('should return string of value when format is invalid and parseDecimalFormat returns null', () => {
        const result = pipe.transform(1234.56, '');

        expect(result).toBe('');
      });

      it('should format numeric value with pt locale separators', () => {
        spyOn(languageService, 'getNumberSeparators').and.returnValue({
          decimalSeparator: ',',
          thousandSeparator: '.'
        });

        const result = pipe.transform(1234.56, '>>>,>>9.99');

        expect(result).toContain('1.234');
        expect(result).toContain(',56');
      });

      it('should format numeric value with en locale separators', () => {
        spyOn(languageService, 'getNumberSeparators').and.returnValue({
          decimalSeparator: '.',
          thousandSeparator: ','
        });

        const result = pipe.transform(1234.56, '>>>,>>9.99');

        expect(result).toContain('1,234');
        expect(result).toContain('.56');
      });

      it('should format string value parsed to number', () => {
        spyOn(languageService, 'getNumberSeparators').and.returnValue({
          decimalSeparator: ',',
          thousandSeparator: '.'
        });

        const result = pipe.transform('4567.89', '>>>,>>>,>>9.99');

        expect(result).toContain('4.567');
        expect(result).toContain(',89');
      });

      it('should pass locale parameter to getNumberSeparators', () => {
        const spy = spyOn(languageService, 'getNumberSeparators').and.returnValue({
          decimalSeparator: ',',
          thousandSeparator: '.'
        });

        pipe.transform(100, '>>9.99', 'es');

        expect(spy).toHaveBeenCalledWith('es');
      });

      it('should format zero value correctly', () => {
        spyOn(languageService, 'getNumberSeparators').and.returnValue({
          decimalSeparator: ',',
          thousandSeparator: '.'
        });

        const result = pipe.transform(0, '>>9.99');

        expect(result).toContain('0');
        expect(result).toContain(',00');
      });

      it('should format negative value with allowNegative format', () => {
        spyOn(languageService, 'getNumberSeparators').and.returnValue({
          decimalSeparator: ',',
          thousandSeparator: '.'
        });

        const result = pipe.transform(-123.45, '->>,>>9.99');

        expect(result).toContain('-');
        expect(result).toContain('123');
        expect(result).toContain(',45');
      });

      it('should return empty viewValue when value overflows format capacity', () => {
        spyOn(languageService, 'getNumberSeparators').and.returnValue({
          decimalSeparator: ',',
          thousandSeparator: '.'
        });

        const result = pipe.transform(99999, '999.99');

        expect(result).toBe('');
      });

      it('should suppress trailing zeros with float decimal format', () => {
        spyOn(languageService, 'getNumberSeparators').and.returnValue({
          decimalSeparator: ',',
          thousandSeparator: '.'
        });

        const result = pipe.transform(4567.8, '>>>,>>>,>>9.9<<<<<<');

        expect(result).toContain('4.567');
        expect(result).toContain(',8');
        expect(result).not.toMatch(/,80/);
      });
    });
  });
});
