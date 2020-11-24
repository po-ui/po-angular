import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { PoChartCircular } from '../po-chart-circular/po-chart-circular';
import { PoChartGaugeComponent } from './po-chart-gauge.component';
import { PoChartType } from '../../enums/po-chart-type.enum';

describe('PoChartGaugeComponent:', () => {
  let component: PoChartGaugeComponent;
  let fixture: ComponentFixture<PoChartGaugeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PoChartGaugeComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartGaugeComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof PoChartGaugeComponent).toBeTruthy();
    expect(component instanceof PoChartCircular).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngAfterViewInit: should call `createComponent` and `drawBasePath`', () => {
      spyOn(component, <any>'createComponent');
      spyOn(component, <any>'drawBasePath');

      component.ngAfterViewInit();

      expect(component['createComponent']).toHaveBeenCalled();
      expect(component['drawBasePath']).toHaveBeenCalled();
    });

    it(`createComponent: should call 'resolveComponentFactory', 'svgContainerRef.createComponent'
    and 'resizeListenerSubscription' `, () => {
      const componentRef: any = { instance: {} };
      component.colors = ['#29B6C5'];
      component['series'] = [{ value: 200, description: 'description' }];
      component.svgHeight = 300;

      spyOn(component['componentFactoryResolver'], 'resolveComponentFactory');
      spyOn(component.svgContainerRef, 'createComponent').and.returnValue(componentRef);
      spyOn(component, <any>'resizeListenerSubscription');

      component['createComponent']();

      expect(component['componentFactoryResolver'].resolveComponentFactory).toHaveBeenCalled();
      expect(component.svgContainerRef.createComponent).toHaveBeenCalled();
      expect(component['resizeListenerSubscription']).toHaveBeenCalled();
    });

    it('drawBasePath: should call `drawPath`', () => {
      const basePath = fixture.debugElement.nativeElement.querySelector('.po-chart-gauge-base-path');

      spyOn(component, <any>'drawPath');

      component['drawBasePath']();

      expect(component['drawPath']).toHaveBeenCalledWith(basePath, component.chartItemStartAngle, 0);
    });

    it(`resizeListenerSubscription: should call 'getGaugeBaseWidth' and 'changeDetection.detectChanges'
    if windowResizeEmitter emits`, () => {
      const instance: any = {};

      component['windowResizeEmitter'] = <any>of([]);

      spyOn(component, <any>'getGaugeBaseWidth');
      spyOn(component['changeDetection'], 'detectChanges');

      component['resizeListenerSubscription'](instance);

      expect(component['getGaugeBaseWidth']).toHaveBeenCalled();
      expect(component['changeDetection'].detectChanges).toHaveBeenCalled();
    });

    it('checkGaugeValueLimits: should return properly number values', () => {
      const items = [
        { value: -5, expectedValue: 0 },
        { value: 0, expectedValue: 0 },
        { value: 100, expectedValue: 100 },
        { value: 1000, expectedValue: 100 },
        { value: 72, expectedValue: 72 }
      ];

      items.forEach(item => {
        const expectedResult = component['checkGaugeValueLimits'](item.value);

        expect(expectedResult).toBe(item.expectedValue);
      });
    });

    describe('getGaugeSerie:', () => {
      it('should spread `series` with `color`', () => {
        const expectedValue = [{ value: 2, description: 'description', color: '#29B6C5' }];
        component.colors = ['#29B6C5'];
        component.series = [{ value: 2, description: 'description' }];

        spyOn(component, <any>'checkGaugeValueLimits').and.callThrough();

        const expectedResult = component['getGaugeSerie'](component.series);

        expect(component['checkGaugeValueLimits']).toHaveBeenCalled();
        expect(expectedResult).toEqual(expectedValue);
      });

      it('should return an empty array if series is also an empty array', () => {
        const expectedValue = [];
        component.colors = ['#29B6C5'];

        spyOn(component, <any>'checkGaugeValueLimits');

        const expectedResult = component['getGaugeSerie']();

        expect(component['checkGaugeValueLimits']).not.toHaveBeenCalled();
        expect(expectedResult).toEqual(expectedValue);
      });
    });

    it('getGaugeBaseWidth: should return the `po-chart-gauge-base-path` element width', () => {
      component.type = PoChartType.Gauge;
      component.colors = ['#29B6C5', '#29B6C5'];
      component['series'] = [
        { value: 20, description: 'desc' },
        { value: 30, description: 'desc' }
      ];

      spyOn(component['el'].nativeElement, 'querySelector').and.callFake(() => {
        return {
          getBoundingClientRect: () => {
            return { width: 200 };
          }
        };
      });

      const expectedResult = component['getGaugeBaseWidth']();

      expect(expectedResult).toBe(200);
    });

    it('getGaugeBaseWidth: shouldn`t return the `po-chart-gauge-base-path` element width', () => {
      component.type = PoChartType.Gauge;
      component.colors = ['#29B6C5', '#29B6C5'];
      component['series'] = [
        { value: 20, description: 'desc' },
        { value: 30, description: 'desc' }
      ];

      spyOn(component['el'].nativeElement, 'querySelector').and.callFake(() => undefined);

      const expectedResult = component['getGaugeBaseWidth']();

      expect(expectedResult).toBe(undefined);
    });
  });
});
