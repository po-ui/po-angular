import { TestBed } from '@angular/core/testing';

import { PoColorService } from './po-color.service';
import { PoDefaultColors } from './po-colors.constant';

describe('PoColorService', () => {
  let service: PoColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Methods:', () => {
    describe('getColors:', () => {
      it('should apply value to `defaultColors` if data doesn`t contain property `color`', () => {
        const data = [{ from: 0, to: 50 }];

        service.getColors<any>(data);

        expect(service.defaultColors).toEqual(PoDefaultColors[0]);
      });

      it('should apply value to `defaultColors` if data has property color but its value is undefined', () => {
        const data = [{ from: 0, to: 50, color: undefined }];

        service.getColors<any>(data);

        expect(service.defaultColors).toEqual(PoDefaultColors[0]);
      });

      it('should apply value to `defaultColors` if one of data list doesn`t contain property `color`', () => {
        const data = [
          { from: 0, to: 50, color: 'red' },
          { from: 50, to: 100 }
        ];

        service.getColors(data);

        expect(service.defaultColors).toEqual(PoDefaultColors[1]);
      });

      it('should apply value to `defaultColors` if data has a lengh greater than 12 and doesn`t have property color', () => {
        const data = [
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

        service.getColors<any>(data);

        expect(service.defaultColors.length).toEqual(14);
      });

      it('shouldn`t apply value to `defaultColors` if data list have property `color`', () => {
        const data = [
          { from: 0, to: 50, color: 'red' },
          { from: 50, to: 100, color: 'blue' }
        ];

        service.getColors(data);

        expect(service.defaultColors).toEqual([]);
      });

      it('should return a list of data containing default colors', () => {
        const data = [
          { from: 0, to: 50 },
          { from: 50, to: 100 }
        ];
        const expectedResult = [
          { from: 0, to: 50, color: PoDefaultColors[1][0] },
          { from: 50, to: 100, color: PoDefaultColors[1][1] }
        ];

        expect(service.getColors<any>(data)).toEqual(expectedResult);
      });

      it('should return a list of data with defaultColors, po-color and the passed color', () => {
        const data = [
          { from: 0, to: 30 },
          { from: 30, to: 60, color: 'red' },
          { from: 60, to: 100, color: 'color-01' }
        ];
        const expectedResult = [
          { from: 0, to: 30, color: PoDefaultColors[2][0] },
          { from: 30, to: 60, color: 'red' },
          { from: 60, to: 100, color: 'po-color-01' }
        ];

        expect(service.getColors(data)).toEqual(expectedResult);
      });
    });
  });
});
