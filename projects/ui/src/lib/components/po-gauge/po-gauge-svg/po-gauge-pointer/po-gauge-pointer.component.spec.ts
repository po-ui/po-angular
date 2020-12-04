import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoGaugePointerComponent } from './po-gauge-pointer.component';

describe('PoGaugePointerComponent', () => {
  let component: PoGaugePointerComponent;
  let fixture: ComponentFixture<PoGaugePointerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoGaugePointerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoGaugePointerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngAfterViewInit: should call `applyPointerRotation` if `coordinates` has value and set afterViewInit with true', () => {
      component.coordinates = {
        coordinates: 'M 0 188 A 188 188 0 0,1 376 188 A 1 1 0 0,1 360 188 A 172 172 0 0,0 16 188 A 1 1 0 0,1 0 188 Z',
        pointerDegrees: 7
      };

      const spyApplyPointerRotation = spyOn(component, <any>'applyPointerRotation');

      component.ngAfterViewInit();

      expect(spyApplyPointerRotation).toHaveBeenCalledWith(component.coordinates.pointerDegrees);
      expect(component['afterViewInit']).toBeTruthy();
    });

    it('ngAfterViewInit: shouldn`t call `applyPointerRotation` if `coordinates` is undefined', () => {
      component.coordinates = undefined;

      const spyApplyPointerRotation = spyOn(component, <any>'applyPointerRotation');

      component.ngAfterViewInit();

      expect(spyApplyPointerRotation).not.toHaveBeenCalled();
    });

    it('ngAfterViewInit: shouldn`t call `applyPointerRotation` if `coordinates.pointerDegrees` is undefined', () => {
      component.coordinates = {
        coordinates: 'M 0 188 A 188 188 0 0,1 376 188 A 1 1 0 0,1 360 188 A 172 172 0 0,0 16 188 A 1 1 0 0,1 0 188 Z'
      };

      const spyApplyPointerRotation = spyOn(component, <any>'applyPointerRotation');

      component.ngAfterViewInit();

      expect(spyApplyPointerRotation).not.toHaveBeenCalled();
    });

    it('calculateRadiusScale: should calculate radiusScale', () => {
      const expectedResult = 8;

      component['calculateRadiusScale'](160);

      expect(component.radiusScale).toBe(expectedResult);
    });

    it('calculateRadiusScale: should return 24 if scale calcules returns more than 24', () => {
      const expectedResult = 24;

      component['calculateRadiusScale'](2000);

      expect(component.radiusScale).toBe(expectedResult);
    });

    it('applyPointerRotation: should call `renderer.style` twice', () => {
      component.coordinates = {
        coordinates: 'M 0 188 A 188 188 0 0,1 376 188 A 1 1 0 0,1 360 188 A 172 172 0 0,0 16 188 A 1 1 0 0,1 0 188 Z',
        pointerDegrees: 7
      };

      const spySetStyle = spyOn(component['renderer'], 'setStyle');

      component['applyPointerRotation'](21);

      expect(spySetStyle).toHaveBeenCalledTimes(2);
    });
  });

  describe('Properties:', () => {
    it('p-coordinates: should call calculateRadiusScale if coordinates.radius has value', () => {
      const spyCalculateRadiusScale = spyOn(component, <any>'calculateRadiusScale');

      component.coordinates = {
        coordinates: 'M 0 188 A 188 188 0 0,1 376 188 A 1 1 0 0,1 360 188 A 172 172 0 0,0 16 188 A 1 1 0 0,1 0 188 Z',
        radius: 160
      };

      expect(spyCalculateRadiusScale).toHaveBeenCalledWith(component.coordinates.radius);
    });

    it('p-coordinates: shouldn`t call calculateRadiusScale if coordinates.radius is undefined', () => {
      const spyCalculateRadiusScale = spyOn(component, <any>'calculateRadiusScale');

      component.coordinates = {
        coordinates: 'M 0 188 A 188 188 0 0,1 376 188 A 1 1 0 0,1 360 188 A 172 172 0 0,0 16 188 A 1 1 0 0,1 0 188 Z'
      };

      expect(spyCalculateRadiusScale).not.toHaveBeenCalled();
    });

    it('p-coordinates: should call applyPointerRotation if coordinates.pointerDegrees has value and afterViewInit is true', () => {
      const spyApplyPointerRotation = spyOn(component, <any>'applyPointerRotation');

      component['afterViewInit'] = true;
      component.coordinates = {
        coordinates: 'M 0 188 A 188 188 0 0,1 376 188 A 1 1 0 0,1 360 188 A 172 172 0 0,0 16 188 A 1 1 0 0,1 0 188 Z',
        pointerDegrees: 7
      };

      expect(spyApplyPointerRotation).toHaveBeenCalledWith(component.coordinates.pointerDegrees);
    });

    it('p-coordinates: shouldn`t call applyPointerRotation if coordinates.pointerDegrees is undefined', () => {
      const spyApplyPointerRotation = spyOn(component, <any>'applyPointerRotation');

      component['afterViewInit'] = true;
      component.coordinates = {
        coordinates: 'M 0 188 A 188 188 0 0,1 376 188 A 1 1 0 0,1 360 188 A 172 172 0 0,0 16 188 A 1 1 0 0,1 0 188 Z'
      };

      expect(spyApplyPointerRotation).not.toHaveBeenCalled();
    });

    it('p-coordinates: shouldn`t call applyPointerRotation if afterViewInit is false', () => {
      const spyApplyPointerRotation = spyOn(component, <any>'applyPointerRotation');

      component['afterViewInit'] = false;
      component.coordinates = {
        coordinates: 'M 0 188 A 188 188 0 0,1 376 188 A 1 1 0 0,1 360 188 A 172 172 0 0,0 16 188 A 1 1 0 0,1 0 188 Z'
      };

      expect(spyApplyPointerRotation).not.toHaveBeenCalled();
    });
  });
});
