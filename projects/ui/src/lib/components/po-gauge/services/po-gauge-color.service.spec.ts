import { TestBed } from '@angular/core/testing';

import { PoGaugeColors } from '../po-gauge-colors.constant';
import { PoGaugeColorService } from './po-gauge-color.service';

describe('PoGaugeColorService', () => {
  let service: PoGaugeColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoGaugeColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Methods:', () => {
    describe('getColors:', () => {
      it('should apply value to `defaultColors` if ranges doesn`t contain property `color`', () => {
        const ranges = [{ from: 0, to: 50 }];

        service.getColors(ranges);

        expect(service.defaultColors).toEqual(PoGaugeColors[0]);
      });

      it('should apply value to `defaultColors` if one of ranges list doesn`t contain property `color`', () => {
        const ranges = [
          { from: 0, to: 50, color: 'red' },
          { from: 50, to: 100 }
        ];

        service.getColors(ranges);

        expect(service.defaultColors).toEqual(PoGaugeColors[1]);
      });

      it('should apply value to `defaultColors` if ranges has a lengh greater than 12 and doesn`t have property color', () => {
        const ranges = [
          { from: 0, to: 10 },
          { from: 20, to: 30 },
          { from: 30, to: 40 },
          { from: 40, to: 50 },
          { from: 50, to: 60 },
          { from: 60, to: 70 },
          { from: 70, to: 80 },
          { from: 80, to: 90 },
          { from: 90, to: 100 },
          { from: 100, to: 110 },
          { from: 110, to: 120 },
          { from: 120, to: 130 },
          { from: 130, to: 140 },
          { from: 140, to: 150 }
        ];

        service.getColors(ranges);

        expect(service.defaultColors.length).toEqual(14);
      });

      it('shouldn`t apply value to `defaultColors` if ranges list have property `color`', () => {
        const ranges = [
          { from: 0, to: 50, color: 'red' },
          { from: 50, to: 100, color: 'blue' }
        ];

        service.getColors(ranges);

        expect(service.defaultColors).toEqual([]);
      });

      it('should return a list of ranges containing default colors', () => {
        const ranges = [
          { from: 0, to: 50 },
          { from: 50, to: 100 }
        ];
        const expectedResult = [
          { from: 0, to: 50, color: PoGaugeColors[1][0] },
          { from: 50, to: 100, color: PoGaugeColors[1][1] }
        ];

        expect(service.getColors(ranges)).toEqual(expectedResult);
      });

      it('should return a list of ranges with defaultColors, po-color and the passed color', () => {
        const ranges = [
          { from: 0, to: 30 },
          { from: 30, to: 60, color: 'red' },
          { from: 60, to: 100, color: 'color-01' }
        ];
        const expectedResult = [
          { from: 0, to: 30, color: PoGaugeColors[2][0] },
          { from: 30, to: 60, color: 'red' },
          { from: 60, to: 100, color: 'po-color-01' }
        ];

        expect(service.getColors(ranges)).toEqual(expectedResult);
      });
    });
  });
});
