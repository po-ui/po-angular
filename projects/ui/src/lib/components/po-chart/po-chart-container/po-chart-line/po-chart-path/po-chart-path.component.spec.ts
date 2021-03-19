import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import * as UtilsFunction from '../../../../../utils/util';

import { PoChartPathComponent } from './po-chart-path.component';

describe('PoChartPathComponent', () => {
  let component: PoChartPathComponent;
  let fixture: ComponentFixture<PoChartPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoChartPathComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngAfterViewInit: should apply a value to `pathWidth` according to path width and change it after a while and call `detectChanges`', fakeAsync(() => {
      component.coordinates = 'M 0 0 L 50 0';
      fixture.detectChanges();

      spyOn(UtilsFunction, 'isIE').and.returnValue(false);
      const spyDetectChanges = spyOn(component['changeDetector'], 'detectChanges');

      component.ngAfterViewInit();

      expect(component.pathWidth).toBe(50);
      expect(spyDetectChanges).toHaveBeenCalled();

      tick(700);

      expect(component.pathWidth).toBe(0);
    }));

    it('ngAfterViewInit: shouldn`t call `pathAnimation` if `isIE` is true', () => {
      spyOn(component, <any>'pathAnimation');
      spyOn(UtilsFunction, 'isIE').and.returnValue(true);

      component.ngAfterViewInit();

      expect(component['pathAnimation']).not.toHaveBeenCalled();
    });
  });

  describe('Properties:', () => {
    it('p-animate: should apply zero to pathWidth if animate value is false', () => {
      component.animate = false;

      expect(component.pathWidth).toBe(0);
    });

    it('p-animate: shouldn`t apply a value to pathWidth if animate value is true', () => {
      const pathWidth = 20;
      component.pathWidth = pathWidth;
      component.animate = true;

      expect(component.pathWidth).toBe(pathWidth);
    });

    it('p-color: should apply `po-border-color-01` value to color if `p-color` includes `po-color` and `chartLine` is true', () => {
      component.chartLine = true;
      component.color = 'po-color-01';

      expect(component.color).toBe('po-border-color-01');
    });

    it('p-color: should apply received value to `color` if color does not contain `po-color`', () => {
      component.color = 'red';

      expect(component.color).toBe('red');
    });
  });
});
