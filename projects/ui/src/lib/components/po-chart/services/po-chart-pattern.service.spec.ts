import { TestBed } from '@angular/core/testing';

import { PoChartType } from '../enums/po-chart-type.enum';
import { PoChartPatternService } from './po-chart-pattern.service';

describe('PoChartPatternService', () => {
  let service: PoChartPatternService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoChartPatternService]
    });

    service = TestBed.inject(PoChartPatternService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose PATTERN_COUNT equal to 8', () => {
    expect(PoChartPatternService.PATTERN_COUNT).toBe(8);
  });

  describe('normalizePatternIndex:', () => {
    it('should keep values already in range 0..7 unchanged', () => {
      for (let i = 0; i <= 7; i++) {
        expect(service.normalizePatternIndex(i)).toBe(i);
      }
    });

    it('should normalize 8 to 0', () => {
      expect(service.normalizePatternIndex(8)).toBe(0);
    });

    it('should normalize 9 to 1', () => {
      expect(service.normalizePatternIndex(9)).toBe(1);
    });

    it('should normalize -1 to 7 using non-negative modulo', () => {
      expect(service.normalizePatternIndex(-1)).toBe(7);
    });

    it('should normalize 13 to 5', () => {
      expect(service.normalizePatternIndex(13)).toBe(5);
    });

    it('should follow the formula ((v % 8) + 8) % 8 for a range of integers', () => {
      for (let v = -20; v <= 20; v++) {
        expect(service.normalizePatternIndex(v)).toBe(((v % 8) + 8) % 8);
      }
    });

    it('should be periodic with period 8 (v and v + 8 map to the same index)', () => {
      for (let v = -10; v <= 10; v++) {
        expect(service.normalizePatternIndex(v)).toBe(service.normalizePatternIndex(v + 8));
      }
    });
  });

  describe('isPatternSupportedType:', () => {
    it('should return true for supported types (pie, donut, bar, column)', () => {
      expect(service.isPatternSupportedType(PoChartType.Pie)).toBeTrue();
      expect(service.isPatternSupportedType(PoChartType.Donut)).toBeTrue();
      expect(service.isPatternSupportedType(PoChartType.Bar)).toBeTrue();
      expect(service.isPatternSupportedType(PoChartType.Column)).toBeTrue();
    });

    it('should return false for unsupported types (line, area, radar, gauge)', () => {
      expect(service.isPatternSupportedType(PoChartType.Line)).toBeFalse();
      expect(service.isPatternSupportedType(PoChartType.Area)).toBeFalse();
      expect(service.isPatternSupportedType(PoChartType.Radar)).toBeFalse();
      expect(service.isPatternSupportedType(PoChartType.Gauge)).toBeFalse();
    });

    it('should return false for an unknown type', () => {
      expect(service.isPatternSupportedType('unknown' as PoChartType)).toBeFalse();
    });
  });

  describe('getPatternFill:', () => {
    it('should return an object in the format { image, repeat: "repeat" }', () => {
      const fill = service.getPatternFill('#c9357d', 0);

      expect(fill.repeat).toBe('repeat');
      expect(fill.image instanceof HTMLCanvasElement).toBeTrue();
    });

    it('should create a canvas with the expected tile dimensions', () => {
      const fill = service.getPatternFill('#c9357d', 0);

      expect(fill.image.width).toBe(12);
      expect(fill.image.height).toBe(12);
    });

    it('should paint the background with the Effective_Color', () => {
      const backgroundHex = '#204080'; // r=32, g=64, b=128
      const fill = service.getPatternFill(backgroundHex, 6); // vertical line: corner pixel stays background

      const ctx = fill.image.getContext('2d')!;
      // Sample a corner pixel unlikely to be covered by the (centered) stroke.
      const { data } = ctx.getImageData(0, 0, 1, 1);

      expect(data[0]).toBe(32);
      expect(data[1]).toBe(64);
      expect(data[2]).toBe(128);
      expect(data[3]).toBe(255);
    });

    it('should normalize an out-of-range index before drawing (8 behaves like 0)', () => {
      const color = '#808080';
      const fillZero = service.getPatternFill(color, 0);
      const fillEight = service.getPatternFill(color, 8);

      expect(getSignature(fillZero.image)).toEqual(getSignature(fillEight.image));
    });

    it('should draw a distinct stroke for each index 0..7 (pixel sampling)', () => {
      const color = '#808080'; // neutral background so the stroke is well contrasted
      const signatures = [];

      for (let index = 0; index <= 7; index++) {
        const fill = service.getPatternFill(color, index);
        signatures.push(getSignature(fill.image).join(','));
      }

      const uniqueSignatures = new Set(signatures);

      expect(uniqueSignatures.size).toBe(8);
    });

    it('should throw when the 2D context is unavailable', () => {
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      spyOn(HTMLCanvasElement.prototype, 'getContext').and.returnValue(null);

      expect(() => service.getPatternFill('#000000', 0)).toThrow();

      HTMLCanvasElement.prototype.getContext = originalGetContext;
    });
  });
});

/**
 * Builds a coarse signature of a canvas by counting, for each pixel, whether it
 * differs from the solid background. Patterns that draw different strokes produce
 * different signatures, allowing distinctness verification without depending on
 * exact anti-aliased pixel values.
 */
function getSignature(canvas: HTMLCanvasElement): Array<number> {
  const ctx = canvas.getContext('2d')!;
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height) as ImageData;

  // Assume the top-left pixel is the untouched background color.
  const bgR = data[0];
  const bgG = data[1];
  const bgB = data[2];

  const signature: Array<number> = [];
  for (let y = 0; y < height; y++) {
    let rowMask = 0;
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      const differs =
        Math.abs(data[offset] - bgR) > 8 ||
        Math.abs(data[offset + 1] - bgG) > 8 ||
        Math.abs(data[offset + 2] - bgB) > 8;
      if (differs) {
        rowMask |= 1 << x;
      }
    }
    signature.push(rowMask);
  }

  return signature;
}
