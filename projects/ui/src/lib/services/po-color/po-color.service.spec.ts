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

      it('should return a list of data with defaultColors, overlayColors, po-color and the passed color', () => {
        spyOn(service as any, 'getCSSVariable').and.callFake((variable: string) => variable);
        const data = [
          { from: 0, to: 30 },
          { from: 30, to: 60, color: 'red' },
          { from: 60, to: 100, color: 'color-01' }
        ];
        const expectedResult = [
          { from: 0, to: 30, color: '--categorical-01', overlayColor: '--categorical-overlay-01' },
          { from: 30, to: 60, color: 'red', overlayColor: 'red', isNotTokenColor: true },
          { from: 60, to: 100, color: 'po-color-01', overlayColor: 'po-color-01', isNotTokenColor: true }
        ];

        expect(service.getColors(data, true, true)).toEqual(expectedResult);
      });

      it('the 13th item color should be black if no color is sent', () => {
        const data = [
          { label: '1', data: 8 },
          { label: '2', data: 10 },
          { label: '3', data: 14 },
          { label: '4', data: 7 },
          { label: '5', data: 6 },
          { label: '6', data: 22 },
          { label: '7', data: 11 },
          { label: '8', data: 8 },
          { label: '9', data: 2 },
          { label: '10', data: 3 },
          { label: '11', data: 14 },
          { label: '12', data: 14 },
          { label: '13', data: 14 }
        ];
        const getColor = service.getColors<any>(data);

        expect(getColor[12].color).toEqual('#000000');
      });

      it('should return an array with up to 8 predefined CSS variables when length is 8 or less', () => {
        spyOn(service as any, 'getCSSVariable').and.callFake((variable: string) => variable);

        const colors = (service as any).getDefaultCategoricalColors(5);

        expect(colors.length).toBe(5);
        expect(colors).toEqual([
          '--categorical-01',
          '--categorical-02',
          '--categorical-03',
          '--categorical-04',
          '--categorical-05'
        ]);
      });
    });

    it('should set defaultColors using getDefaultColors when categoricalColors is not provided', () => {
      const data = [
        { from: 0, to: 50 },
        { from: 50, to: 100 }
      ];

      spyOn(service as any, 'getDefaultColors').and.callThrough();
      spyOn(service as any, 'getDefaultCategoricalColors').and.callThrough();

      (service as any).verifyIfHasColorProperty(data);

      expect(service.defaultColors.length).toBeGreaterThan(0);
      expect(service['getDefaultColors']).toHaveBeenCalledWith(data.length);
      expect(service['getDefaultCategoricalColors']).not.toHaveBeenCalled();
    });
    it('should return an array with exactly 8 predefined CSS variables when length is 8', () => {
      spyOn(service as any, 'getCSSVariable').and.callFake((variable: string) => variable);

      const colors = (service as any).getDefaultCategoricalColors(8);

      expect(colors.length).toBe(8);
      expect(colors).toEqual([
        '--categorical-01',
        '--categorical-02',
        '--categorical-03',
        '--categorical-04',
        '--categorical-05',
        '--categorical-06',
        '--categorical-07',
        '--categorical-08'
      ]);
    });

    it('should fill remaining colors with random colors when length is greater than 8 and isOverlay is true', () => {
      spyOn(service as any, 'getCSSVariable').and.callFake((variable: string) => variable);
      service.defaultColors = [];
      service.defaultColors[8] = '#123456';
      service.defaultColors[9] = '#123456';

      const colors = (service as any).getDefaultCategoricalColors(10, true);

      expect(colors.length).toBe(10);
      expect(colors.slice(0, 8)).toEqual([
        '--categorical-overlay-01',
        '--categorical-overlay-02',
        '--categorical-overlay-03',
        '--categorical-overlay-04',
        '--categorical-overlay-05',
        '--categorical-overlay-06',
        '--categorical-overlay-07',
        '--categorical-overlay-08'
      ]);
      expect(colors.slice(8)).toEqual(['#123456', '#123456']);
    });

    it('should fill remaining colors with random colors when length is greater than 8', () => {
      spyOn(service as any, 'getCSSVariable').and.callFake((variable: string) => variable);
      spyOn(service as any, 'getRandomColor').and.returnValue('#123456');

      const colors = (service as any).getDefaultCategoricalColors(10);

      expect(colors.length).toBe(10);
      expect(colors.slice(0, 8)).toEqual([
        '--categorical-01',
        '--categorical-02',
        '--categorical-03',
        '--categorical-04',
        '--categorical-05',
        '--categorical-06',
        '--categorical-07',
        '--categorical-08'
      ]);
      expect(colors.slice(8)).toEqual(['#123456', '#123456']);
    });
  });

  describe('getRandomColor:', () => {
    // it('should return a valid hex color code', () => {
    //   const color = (service as any).getRandomColor();

    //   expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    // });

    it('should return different colors on multiple calls', () => {
      const color1 = (service as any).getRandomColor();
      const color2 = (service as any).getRandomColor();

      expect(color1).not.toEqual(color2);
    });
  });
});
