import {
  applyDecimalFormat,
  getFormatLimits,
  parseDecimalFormat,
  validateAgainstFormat
} from './utils/po-decimal-format.util';

describe('po-decimal-format.util: ', () => {
  describe('Methods: ', () => {
    describe('parseDecimalFormat: ', () => {
      it('should return null when format is null', () => {
        expect(parseDecimalFormat(null)).toBeNull();
      });

      it('should return null when format is empty string', () => {
        expect(parseDecimalFormat('')).toBeNull();
      });

      it('should return null when format is undefined', () => {
        expect(parseDecimalFormat(undefined)).toBeNull();
      });

      it('should parse simple integer format "999" with 3 integer digits and 0 decimals', () => {
        const result = parseDecimalFormat('999');

        expect(result.integerDigitCount).toBe(3);
        expect(result.decimalDigitCount).toBe(0);
        expect(result.allowNegative).toBe(false);
        expect(result.originalFormat).toBe('999');
      });

      it('should parse format with decimal ">>9.99" with 3 integer digits and 2 decimals', () => {
        const result = parseDecimalFormat('>>9.99');

        expect(result.integerDigitCount).toBe(3);
        expect(result.decimalDigitCount).toBe(2);
        expect(result.allowNegative).toBe(false);
      });

      it('should parse format with group separators ">>>,>>>,>>9.99" with 9 integer digits and 2 group positions', () => {
        const result = parseDecimalFormat('>>>,>>>,>>9.99');

        expect(result.integerDigitCount).toBe(9);
        expect(result.decimalDigitCount).toBe(2);
        expect(result.groupSeparatorPositions.length).toBe(2);
      });

      it('should parse format with negative sign "->>,>>9.99" with allowNegative true', () => {
        const result = parseDecimalFormat('->>,>>9.99');

        expect(result.allowNegative).toBe(true);
        expect(result.integerDigitCount).toBe(5);
        expect(result.decimalDigitCount).toBe(2);
      });

      it('should parse format with float decimals ">>9.9<<<<<<" with 7 decimal digits', () => {
        const result = parseDecimalFormat('>>9.9<<<<<<');

        expect(result.integerDigitCount).toBe(3);
        expect(result.decimalDigitCount).toBe(7);
      });

      it('should parse format without decimal separator ">9,99,99,99" as purely integer format', () => {
        const result = parseDecimalFormat('>9,99,99,99');

        expect(result.integerDigitCount).toBe(8);
        expect(result.decimalDigitCount).toBe(0);
      });

      it('should parse format "99,999,9,99.9999" with 8 integer and 4 decimal digits', () => {
        const result = parseDecimalFormat('99,999,9,99.9999');

        expect(result.integerDigitCount).toBe(8);
        expect(result.decimalDigitCount).toBe(4);
      });

      it('should parse format ">>>>>>>>9.99" with 9 integer digits and 2 decimal digits', () => {
        const result = parseDecimalFormat('>>>>>>>>9.99');

        expect(result.integerDigitCount).toBe(9);
        expect(result.decimalDigitCount).toBe(2);
      });

      it('should store originalFormat correctly', () => {
        const result = parseDecimalFormat('->>>,>>9.99');

        expect(result.originalFormat).toBe('->>>,>>9.99');
      });

      it('should correctly identify integerFormat array characters', () => {
        const result = parseDecimalFormat('>>9.99');

        expect(result.integerFormat).toEqual(['>', '>', '9']);
      });

      it('should correctly identify decimalFormat array characters', () => {
        const result = parseDecimalFormat('>>9.9<');

        expect(result.decimalFormat).toEqual(['9', '<']);
      });

      it('should parse format with only suppression symbols ">>>.>>>"', () => {
        const result = parseDecimalFormat('>>>.>>>');

        expect(result.integerDigitCount).toBe(3);
        expect(result.decimalDigitCount).toBe(3);
      });

      it('should parse format with mixed group separators "9,9,9.99" detecting 2 group positions', () => {
        const result = parseDecimalFormat('9,9,9.99');

        expect(result.integerDigitCount).toBe(3);
        expect(result.groupSeparatorPositions.length).toBe(2);
      });
    });

    describe('applyDecimalFormat: ', () => {
      it('should return isValid false and empty viewValue when parsed is null', () => {
        const result = applyDecimalFormat(123, null, ',', '.');

        expect(result.viewValue).toBe('');
        expect(result.isValid).toBe(false);
        expect(result.modelValue).toBe(undefined);
      });

      it('should return isValid false and empty viewValue when parsed is undefined', () => {
        const result = applyDecimalFormat(123, undefined, ',', '.');

        expect(result.viewValue).toBe('');
        expect(result.isValid).toBe(false);
      });

      it('should return isValid true and empty viewValue when value is null', () => {
        const parsed = parseDecimalFormat('>>9.99');
        const result = applyDecimalFormat(null, parsed, ',', '.');

        expect(result.viewValue).toBe('');
        expect(result.isValid).toBe(true);
        expect(result.modelValue).toBe(undefined);
      });

      it('should return isValid true and empty viewValue when value is undefined', () => {
        const parsed = parseDecimalFormat('>>9.99');
        const result = applyDecimalFormat(undefined, parsed, ',', '.');

        expect(result.viewValue).toBe('');
        expect(result.isValid).toBe(true);
      });

      it('should return isValid true and empty viewValue when value is NaN', () => {
        const parsed = parseDecimalFormat('>>9.99');
        const result = applyDecimalFormat(NaN, parsed, ',', '.');

        expect(result.viewValue).toBe('');
        expect(result.isValid).toBe(true);
      });

      it('should format 4567.888888888 with format ">>>,>>>,>>9.99" using pt separators', () => {
        const parsed = parseDecimalFormat('>>>,>>>,>>9.99');
        const result = applyDecimalFormat(4567.888888888, parsed, ',', '.');

        expect(result.isValid).toBe(true);
        expect(result.viewValue).toContain('4.567');
        expect(result.viewValue).toContain(',89');
      });

      it('should format 4567.8 with format ">>>>>>>>9.99" using pt separators', () => {
        const parsed = parseDecimalFormat('>>>>>>>>9.99');
        const result = applyDecimalFormat(4567.8, parsed, ',', '.');

        expect(result.isValid).toBe(true);
        expect(result.viewValue).toContain('4567');
        expect(result.viewValue).toContain(',80');
      });

      it('should format 4567.8 with format "->>,>,>>>,>>9" rounding to integer', () => {
        const parsed = parseDecimalFormat('->>,>,>>>,>>9');
        const result = applyDecimalFormat(4567.8, parsed, ',', '.');

        expect(result.isValid).toBe(true);
        expect(result.viewValue).toContain('4.568');
      });

      it('should format negative value with allowNegative format prepending minus sign', () => {
        const parsed = parseDecimalFormat('->>,>>9.99');
        const result = applyDecimalFormat(-123.45, parsed, ',', '.');

        expect(result.isValid).toBe(true);
        expect(result.viewValue).toContain('-');
        expect(result.viewValue).toContain('123');
        expect(result.viewValue).toContain(',45');
      });

      it('should not prepend minus sign for negative value when format does not allow negative', () => {
        const parsed = parseDecimalFormat('>>>,>>9.99');
        const result = applyDecimalFormat(-123.45, parsed, ',', '.');

        expect(result.isValid).toBe(true);
        expect(result.viewValue).not.toContain('-');
        expect(result.viewValue).toContain('123');
      });

      it('should suppress trailing zeros with "<" symbol in decimal part', () => {
        const parsed = parseDecimalFormat('>>>,>>>,>>9.9<<<<<<');
        const result = applyDecimalFormat(4567.843, parsed, ',', '.');

        expect(result.isValid).toBe(true);
        expect(result.viewValue).toContain('4.567');
        expect(result.viewValue).toContain(',843');
        expect(result.viewValue).not.toMatch(/,8430+/);
      });

      it('should return isValid false when integer part overflows format capacity', () => {
        const parsed = parseDecimalFormat('999.99');
        const result = applyDecimalFormat(1234.56, parsed, ',', '.');

        expect(result.isValid).toBe(false);
        expect(result.viewValue).toBe('');
        expect(result.modelValue).toBe(1234.56);
      });

      it('should pad with leading zeros for mandatory "9" format chars', () => {
        const parsed = parseDecimalFormat('999.99');
        const result = applyDecimalFormat(5.1, parsed, ',', '.');

        expect(result.isValid).toBe(true);
        expect(result.viewValue).toBe('005,10');
      });

      it('should handle zero value correctly', () => {
        const parsed = parseDecimalFormat('>>9.99');
        const result = applyDecimalFormat(0, parsed, ',', '.');

        expect(result.isValid).toBe(true);
        expect(result.viewValue).toContain('0');
        expect(result.viewValue).toContain(',00');
      });

      it('should use english separators (decimal=. thousand=,)', () => {
        const parsed = parseDecimalFormat('>>>,>>9.99');
        const result = applyDecimalFormat(1234.56, parsed, '.', ',');

        expect(result.isValid).toBe(true);
        expect(result.viewValue).toContain('1,234');
        expect(result.viewValue).toContain('.56');
      });

      it('should format integer-only format without decimal separator in output', () => {
        const parsed = parseDecimalFormat('>>>,>>9');
        const result = applyDecimalFormat(1234, parsed, ',', '.');

        expect(result.isValid).toBe(true);
        expect(result.viewValue).toContain('1.234');
        expect(result.viewValue).not.toContain(',');
      });

      it('should suppress leading zeros with ">" symbol', () => {
        const parsed = parseDecimalFormat('>>>,>>9.99');
        const result = applyDecimalFormat(5.1, parsed, ',', '.');

        expect(result.isValid).toBe(true);
        expect(result.viewValue).toContain('5');
        expect(result.viewValue).toContain(',10');
      });

      it('should preserve modelValue in result', () => {
        const parsed = parseDecimalFormat('>>9.99');
        const result = applyDecimalFormat(42.5, parsed, ',', '.');

        expect(result.modelValue).toBe(42.5);
      });

      it('should format with russian locale (decimal=, thousand= )', () => {
        const parsed = parseDecimalFormat('>>>,>>9.99');
        const result = applyDecimalFormat(1234.56, parsed, ',', ' ');

        expect(result.isValid).toBe(true);
        expect(result.viewValue).toContain('1 234');
        expect(result.viewValue).toContain(',56');
      });
    });

    describe('validateAgainstFormat: ', () => {
      it('should return true when rawValue is empty string', () => {
        const parsed = parseDecimalFormat('>>9.99');

        expect(validateAgainstFormat('', parsed, ',')).toBe(true);
      });

      it('should return true when rawValue is null', () => {
        const parsed = parseDecimalFormat('>>9.99');

        expect(validateAgainstFormat(null, parsed, ',')).toBe(true);
      });

      it('should return true when parsed is null', () => {
        expect(validateAgainstFormat('123,45', null, ',')).toBe(true);
      });

      it('should return true when value fits within format limits', () => {
        const parsed = parseDecimalFormat('>>>,>>9.99');

        expect(validateAgainstFormat('1234,56', parsed, ',')).toBe(true);
      });

      it('should return false when integer part exceeds format limit', () => {
        const parsed = parseDecimalFormat('999.99');

        expect(validateAgainstFormat('1234,56', parsed, ',')).toBe(false);
      });

      it('should return false when decimal part exceeds format limit', () => {
        const parsed = parseDecimalFormat('>>9.99');

        expect(validateAgainstFormat('12,567', parsed, ',')).toBe(false);
      });

      it('should return true when value has no decimal part and format allows decimals', () => {
        const parsed = parseDecimalFormat('>>9.99');

        expect(validateAgainstFormat('123', parsed, ',')).toBe(true);
      });

      it('should return false when value has decimal separator but format has 0 decimal digits', () => {
        const parsed = parseDecimalFormat('999');

        expect(validateAgainstFormat('12,5', parsed, ',')).toBe(false);
      });

      it('should return true when integer part is at exact max length', () => {
        const parsed = parseDecimalFormat('999.99');

        expect(validateAgainstFormat('999,99', parsed, ',')).toBe(true);
      });

      it('should validate correctly with english decimal separator', () => {
        const parsed = parseDecimalFormat('>>9.99');

        expect(validateAgainstFormat('12.56', parsed, '.')).toBe(true);
      });

      it('should return false when decimal part at exact max plus one', () => {
        const parsed = parseDecimalFormat('>>9.99');

        expect(validateAgainstFormat('12,123', parsed, ',')).toBe(false);
      });
    });

    describe('getFormatLimits: ', () => {
      it('should return null when parsed is null', () => {
        expect(getFormatLimits(null)).toBeNull();
      });

      it('should return null when parsed is undefined', () => {
        expect(getFormatLimits(undefined)).toBeNull();
      });

      it('should return correct limits for ">>>,>>9.99"', () => {
        const parsed = parseDecimalFormat('>>>,>>9.99');
        const limits = getFormatLimits(parsed);

        expect(limits.decimalsLength).toBe(2);
        expect(limits.thousandMaxlength).toBe(6);
      });

      it('should return correct limits for "999.9999"', () => {
        const parsed = parseDecimalFormat('999.9999');
        const limits = getFormatLimits(parsed);

        expect(limits.decimalsLength).toBe(4);
        expect(limits.thousandMaxlength).toBe(3);
      });

      it('should return correct limits for integer-only format ">>>,>>9"', () => {
        const parsed = parseDecimalFormat('>>>,>>9');
        const limits = getFormatLimits(parsed);

        expect(limits.decimalsLength).toBe(0);
        expect(limits.thousandMaxlength).toBe(6);
      });

      it('should return correct limits for ">>>,>>>,>>9.9<<<<<<" with float decimals', () => {
        const parsed = parseDecimalFormat('>>>,>>>,>>9.9<<<<<<');
        const limits = getFormatLimits(parsed);

        expect(limits.decimalsLength).toBe(7);
        expect(limits.thousandMaxlength).toBe(9);
      });
    });

    describe('formatIntegerPart (truncated path): ', () => {
      it('should skip group separators when format is truncated by reduced integerDigitCount', () => {
        const parsed = parseDecimalFormat('>>>,>>>,>>9.99');
        // Format has 9 integer digits. Truncating to 4 means digitFormats.length < allDigitFormats.length
        const truncatedParsed = { ...parsed, integerDigitCount: 4 };
        const result = applyDecimalFormat(1234.56, truncatedParsed, ',', '.');

        expect(result.isValid).toBe(true);
        expect(result.viewValue).toBe('1234,56');
        // No group separator because format was truncated
        expect(result.viewValue).not.toContain('.');
      });
    });
  });
});
