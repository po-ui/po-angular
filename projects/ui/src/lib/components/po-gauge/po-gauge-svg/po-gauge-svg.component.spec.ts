import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoDefaultColors } from '../../../services/po-color/po-colors.constant';

import { PoGaugeModule } from '../po-gauge.module';

import { poGaugeStartAngle, PoGaugeSvgComponent } from './po-gauge-svg.component';

describe('PoGaugeSvgComponent', () => {
  let component: PoGaugeSvgComponent;
  let fixture: ComponentFixture<PoGaugeSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoGaugeModule],
      declarations: [PoGaugeSvgComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoGaugeSvgComponent);
    component = fixture.componentInstance;
    component.ranges = [];
    component.container = { height: 20, width: 200 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngOnChanges: shouldn`t call `setCoordinates` if `container` is undefined', () => {
      const changes = { ranges: new SimpleChange(null, component.ranges, true) };
      const spySetCoordinates = spyOn(component, <any>'setCoordinates');
      component.container = undefined;

      component.ngOnChanges(changes);

      expect(spySetCoordinates).not.toHaveBeenCalled();
    });

    it('ngOnChanges: should call `setCoordinates` if  `container` has value and `ranges` has been changed', () => {
      const changes = { ranges: new SimpleChange(null, component.ranges, true) };
      const spySetCoordinates = spyOn(component, <any>'setCoordinates');
      component.ranges = [{ from: 0, to: 100 }];
      component.container = { height: 20, width: 200 };

      component.ngOnChanges(changes);

      expect(spySetCoordinates).toHaveBeenCalled();
    });

    it('ngOnChanges: should call `setCoordinates` if  `container` has value and `value` has been changed', () => {
      const changes = { ranges: new SimpleChange(null, component.value, true) };
      const spySetCoordinates = spyOn(component, <any>'setCoordinates');
      component.container = { height: 20, width: 200 };
      component.value = 20;

      component.ngOnChanges(changes);

      expect(spySetCoordinates).toHaveBeenCalled();
    });

    it('setCoordinates: should call `spySetBaseCoordinates` and `setSingleRangeCoordinates` if ranges doesn`t have length', () => {
      const spySetBaseCoordinates = spyOn(component, <any>'setBaseCoordinates');
      const spySetSingleRangeCoordinates = spyOn(component, <any>'setSingleRangeCoordinates');
      const spySetRangesCoordinates = spyOn(component, <any>'setRangesCoordinates');

      component['setCoordinates'](component.value, component.ranges, component.container);

      expect(spySetBaseCoordinates).toHaveBeenCalledWith(component.container.height);
      expect(spySetSingleRangeCoordinates).toHaveBeenCalledWith(component.container.height, component.value);
      expect(spySetRangesCoordinates).not.toHaveBeenCalled();
    });

    it('setCoordinates: should call, `spySetBaseCoordinates` and `setRangesCoordinates` if ranges has length', () => {
      const spySetBaseCoordinates = spyOn(component, <any>'setBaseCoordinates');
      const spySetSingleRangeCoordinates = spyOn(component, <any>'setSingleRangeCoordinates');
      const spySetRangesCoordinates = spyOn(component, <any>'setRangesCoordinates');
      component.ranges = [{ from: 0, to: 100 }];
      component.value = 20;

      component['setCoordinates'](component.value, component.ranges, component.container);

      expect(spySetBaseCoordinates).toHaveBeenCalledWith(component.container.height);
      expect(spySetRangesCoordinates).toHaveBeenCalledWith(
        component.container.height,
        component.value,
        component.ranges
      );
      expect(spySetSingleRangeCoordinates).not.toHaveBeenCalled();
    });

    it('setBaseCoordinates: should call `calculateCoordinates` and apply value to `baseCoordinates`', () => {
      const expectedResult = {
        coordinates: 'M 0 188 A 188 188 0 0,1 376 188 A 1 1 0 0,1 360 188 A 172 172 0 0,0 16 188 A 1 1 0 0,1 0 188 Z'
      };

      const spyCalculateCoordinates = spyOn(component, <any>'calculateCoordinates').and.callThrough();

      component['setBaseCoordinates'](200);

      expect(spyCalculateCoordinates).toHaveBeenCalledWith(200, poGaugeStartAngle, 0);
      expect(component.baseCoordinates).toEqual(expectedResult);
    });

    describe('setRangesCoordinates:', () => {
      it('should call `calculateAngleRadius` twice, `setPointerCoordinates` and `calculateMinAndMaxValues`', () => {
        component.ranges = [{ from: 0, to: 100 }];
        component.value = 20;

        const spyCalculateMinAndMaxValues = spyOn(component, <any>'calculateMinAndMaxValues').and.callThrough();
        const spyCalculateAngleRadius = spyOn(component, <any>'calculateAngleRadius');
        const spyPointerCoordinates = spyOn(component, <any>'setPointerCoordinates');

        component['setRangesCoordinates'](200, component.value, component.ranges);

        expect(spyPointerCoordinates).toHaveBeenCalledWith(200, component.value, 100, 0);
        expect(spyCalculateMinAndMaxValues).toHaveBeenCalledWith(component.ranges);
        expect(spyCalculateAngleRadius).toHaveBeenCalledTimes(2);
      });

      it('should apply 0 to value param if it is undefined', () => {
        component.ranges = [{ from: 0, to: 100 }];
        component.value = undefined;

        const spyPointerCoordinates = spyOn(component, <any>'setPointerCoordinates');

        component['setRangesCoordinates'](200, undefined, component.ranges);

        expect(spyPointerCoordinates).toHaveBeenCalledWith(200, 0, 100, 0);
      });

      it('should pass value as maxValue to `setPointerCoordinates` if value`s value is greater than `to` value`', () => {
        component.ranges = [{ from: 0, to: 100 }];
        component.value = 120;

        const spyPointerCoordinates = spyOn(component, <any>'setPointerCoordinates');

        component['setRangesCoordinates'](200, component.value, component.ranges);

        expect(spyPointerCoordinates).toHaveBeenCalledWith(200, component.value, 120, 0);
      });

      it('should pass value as min to `setPointerCoordinates` if value`s value is lower than `from` value', () => {
        component.ranges = [{ from: 0, to: 100 }];
        component.value = -40;

        const spyPointerCoordinates = spyOn(component, <any>'setPointerCoordinates');

        component['setRangesCoordinates'](200, component.value, component.ranges);

        expect(spyPointerCoordinates).toHaveBeenCalledWith(200, component.value, 100, -40);
      });

      it('should call `calculateAngleRadius` passing `2` and `99` as parameters', () => {
        component.ranges = [{ from: 2, to: 99 }];
        component.value = 20;

        const spyCalculateAngleRadius = spyOn(component, <any>'calculateAngleRadius');

        component['setRangesCoordinates'](200, component.value, component.ranges);

        expect(spyCalculateAngleRadius).toHaveBeenCalledTimes(2);
        expect(spyCalculateAngleRadius.calls.argsFor(0)).toEqual([2, 99, 2]);
        expect(spyCalculateAngleRadius.calls.argsFor(1)).toEqual([99, 99, 2]);
      });

      it('should call `calculateAngleRadius` passing `0` and `100` if ranges.from and ranges.to are not defined', () => {
        component.ranges = [{ from: undefined, to: undefined }];
        component.value = 20;

        const spyCalculateAngleRadius = spyOn(component, <any>'calculateAngleRadius');

        component['setRangesCoordinates'](200, component.value, component.ranges);

        expect(spyCalculateAngleRadius).toHaveBeenCalledTimes(2);
        expect(spyCalculateAngleRadius.calls.argsFor(0)).toEqual([0, 100, 0]);
        expect(spyCalculateAngleRadius.calls.argsFor(1)).toEqual([100, 100, 0]);
      });

      it('should call `calculateAngleRadius` passing `-10` and `100` if ranges.from is negative', () => {
        component.ranges = [{ from: -10, to: 100, color: 'red' }];
        component.value = 20;

        const spyCalculateAngleRadius = spyOn(component, <any>'calculateAngleRadius');

        component['setRangesCoordinates'](200, component.value, component.ranges);

        expect(spyCalculateAngleRadius).toHaveBeenCalledTimes(2);
        expect(spyCalculateAngleRadius.calls.argsFor(0)).toEqual([-10, 100, -10]);
        expect(spyCalculateAngleRadius.calls.argsFor(1)).toEqual([100, 100, -10]);
      });

      it('should apply value to `coordinates`', () => {
        const expectedResult = [
          {
            coordinates:
              'M 0 188 A 188 188 0 0,1 376 188 A 1 1 0 0,1 360 188 A 172 172 0 0,0 16 188 A 1 1 0 0,1 0 188 Z',
            color: 'red'
          }
        ];
        component.ranges = [{ from: 0, to: 100, color: 'red' }];
        component.value = 20;

        component['setRangesCoordinates'](200, component.value, component.ranges);

        expect(component.coordinates).toEqual(expectedResult);
      });
    });

    it('setSingleRangeCoordinates: should apply value to `coordinates`', () => {
      const expectedResult = [
        {
          coordinates: 'M 0 188 A 188 188 0 0,1 36 77 A 1 1 0 0,1 49 87 A 172 172 0 0,0 16 188 A 1 1 0 0,1 0 188 Z',
          color: PoDefaultColors[0][0]
        }
      ];
      const value = 20;
      const height = 200;

      component['setSingleRangeCoordinates'](height, value);

      expect(component.coordinates).toEqual(expectedResult);
    });

    it('setSingleRangeCoordinates: should calculate coordinates considering value as 100 instead of 200 but keep original value', () => {
      const expectedResult = [
        {
          coordinates: 'M 0 188 A 188 188 0 0,1 376 188 A 1 1 0 0,1 360 188 A 172 172 0 0,0 16 188 A 1 1 0 0,1 0 188 Z',
          color: PoDefaultColors[0][0]
        }
      ];
      component.value = 200;
      const height = 200;

      component['setSingleRangeCoordinates'](height, component.value);

      expect(component.coordinates).toEqual(expectedResult);
      expect(component.value).toBe(200);
    });

    it('setSingleRangeCoordinates: should apply undefined to `coordinates` if value is lower than zero', () => {
      const expectedResult = [
        {
          coordinates: undefined,
          color: PoDefaultColors[0][0]
        }
      ];
      const value = -10;
      const height = 200;

      component['setSingleRangeCoordinates'](height, value);

      expect(component.coordinates).toEqual(expectedResult);
    });

    it('setViewBox: should apply value to viewBox', () => {
      const expectedResult = '0 -4 376 200';
      component['setViewBox'](200);

      expect(component.viewBox).toBe(expectedResult);
    });

    it('verifyIfFloatOrInteger: should return true if valid values', () => {
      const validValues = [1, 2, 500, 50.2, -123, -123.12, 0.000001];

      validValues.forEach(value => {
        expect(component['verifyIfFloatOrInteger'](value)).toBeTruthy();
      });
    });

    it('verifyIfFloatOrInteger: should return false if invalid values', () => {
      const validValues = ['1', '-19', 'number', false, true, isNaN, Infinity];

      validValues.forEach(value => {
        expect(component['verifyIfFloatOrInteger'](<any>value)).toBeFalsy();
      });
    });
  });
});
