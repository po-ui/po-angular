import { async, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { PoChartBaseComponent } from './po-chart-base.component';
import { PoChartColors } from './po-chart-colors.constant';
import { PoChartComponent } from './po-chart.component';
import { PoChartModule } from './po-chart.module';
import { PoChartPieComponent } from './po-chart-types/po-chart-pie/po-chart-pie.component';
import { PoChartType } from './enums/po-chart-type.enum';

describe('PoChartComponent:', () => {
  let component: PoChartComponent;
  let fixture;
  let nativeElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PoChartModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be create', () => {
    expect(component instanceof PoChartComponent).toBeTruthy();
    expect(component instanceof PoChartBaseComponent).toBeTruthy();
  });

  describe('Properties', () => {
    it('isChartGaugeType: should return `true` if type is equal `PoChartType.Gauge`', () => {
      component.type = PoChartType.Gauge;

      expect(component.isChartGaugeType).toBeTruthy();
    });

    it('isChartGaugeType: should return `false` if type is diferent from `PoChartType.Gauge`', () => {
      component.type = PoChartType.Pie;

      expect(component.isChartGaugeType).toBeFalsy();
    });
  });

  describe('Methods:', () => {
    it('ngOnDestroy: should call `removeWindowResizeListener`', () => {
      spyOn(component, <any>'removeWindowResizeListener');

      component.ngOnDestroy();

      expect(component['removeWindowResizeListener']).toHaveBeenCalled();
    });

    it('ngOnInit: should call `getSeriesColor`', () => {
      spyOn(component, <any>'getSeriesColor');

      component.ngOnInit();

      expect(component['getSeriesColor']).toHaveBeenCalled();
    });

    it('ngDoCheck: should call `getSeriesColor` and `dynamicComponentSetting` in first loading and if chartWrapper has width', () => {
      Object.defineProperty(component.chartWrapper.nativeElement, 'offsetWidth', {
        writable: true,
        value: 500
      });

      spyOn(component, <any>'getSeriesColor');
      spyOn(component, <any>'dynamicComponentSetting');

      component.ngDoCheck();

      expect(component['getSeriesColor']).toHaveBeenCalled();
      expect(component['dynamicComponentSetting']).toHaveBeenCalled();
    });

    it('ngDoCheck: shouldn`t call `getSeriesColor`and `dynamicComponentSetting` if chartWrapper width has already been calculated', () => {
      Object.defineProperty(component.chartWrapper.nativeElement, 'offsetWidth', {
        writable: true,
        value: 500
      });

      component['calculatedElement'] = true;

      spyOn(component, <any>'getSeriesColor');
      spyOn(component, <any>'dynamicComponentSetting');

      component.ngDoCheck();

      expect(component['getSeriesColor']).not.toHaveBeenCalled();
      expect(component['dynamicComponentSetting']).not.toHaveBeenCalled();
    });

    it('ngDoCheck: shouldn`t call `getSeriesColor`and `dynamicComponentSetting` if chartWrapper width is 0', () => {
      Object.defineProperty(component.chartWrapper.nativeElement, 'offsetWidth', {
        writable: true,
        value: 0
      });

      component['calculatedElement'] = false;

      spyOn(component, <any>'getSeriesColor');
      spyOn(component, <any>'dynamicComponentSetting');

      component.ngDoCheck();

      expect(component['getSeriesColor']).not.toHaveBeenCalled();
      expect(component['dynamicComponentSetting']).not.toHaveBeenCalled();
    });

    it('ngDoCheck: should call `checkingForSerieChanges`', () => {
      spyOn(component, <any>'checkingForSerieChanges');

      component.ngDoCheck();

      expect(component['checkingForSerieChanges']).toHaveBeenCalled();
    });

    it(`createComponent: should call 'getComponentType', 'resolveComponentFactory', 'chartContainer.createComponent'
      and 'setChartProperties' `, () => {
      const componentRef: any = { instance: {} };

      spyOn(component, <any>'getComponentType').and.returnValue(PoChartType.Pie);
      spyOn(component['componentFactoryResolver'], 'resolveComponentFactory');
      spyOn(component.chartContainer, 'createComponent').and.returnValue(componentRef);
      spyOn(component, <any>'setChartProperties');

      component['createComponent']();

      expect(component['getComponentType']).toHaveBeenCalled();
      expect(component['componentFactoryResolver'].resolveComponentFactory).toHaveBeenCalled();
      expect(component.chartContainer.createComponent).toHaveBeenCalled();
      expect(component['setChartProperties']).toHaveBeenCalled();
    });

    it('rebuildComponent: should call `dynamicComponentSetting`, `getSeriesColor` and destroy method from componentRef', () => {
      const sourceObject = { componentRef: { destroy: () => {} } };
      Object.assign(component, sourceObject);

      spyOn(sourceObject.componentRef, 'destroy');
      spyOn(component, <any>'dynamicComponentSetting');
      spyOn(component, <any>'getSeriesColor');

      component['rebuildComponent']();

      expect(sourceObject.componentRef.destroy).toHaveBeenCalled();
      expect(component['dynamicComponentSetting']).toHaveBeenCalled();
      expect(component['getSeriesColor']).toHaveBeenCalled();
    });

    it('checkingForSerieChanges: should call `getSeriesColor` and `rebuildComponent` if has differ and changes', () => {
      const fakeThis = {
        differ: {
          diff: (opt: any) => true
        },
        componentRef: { instance: 'instance' },
        getSeriesColor: () => {},
        rebuildComponent: () => {}
      };

      spyOn(fakeThis, <any>'getSeriesColor');
      spyOn(fakeThis, <any>'rebuildComponent');

      component['checkingForSerieChanges'].call(fakeThis);

      expect(fakeThis['getSeriesColor']).toHaveBeenCalled();
      expect(fakeThis['rebuildComponent']).toHaveBeenCalled();
    });

    it('checkingForSerieChanges: shouldn`t call `getSeriesColor` and `rebuildComponent` if doesn`t have differ', () => {
      const fakeThis = {
        differ: undefined,
        componentRef: { instance: 'instance' },
        getSeriesColor: () => {},
        rebuildComponent: () => {}
      };

      spyOn(fakeThis, <any>'getSeriesColor');
      spyOn(fakeThis, <any>'rebuildComponent');

      component['checkingForSerieChanges'].call(fakeThis);

      expect(fakeThis['getSeriesColor']).not.toHaveBeenCalled();
      expect(fakeThis['rebuildComponent']).not.toHaveBeenCalled();
    });

    it('checkingForSerieChanges: shouldn`t call `getSeriesColor` and `rebuildComponent` if series not changes', () => {
      const fakeThis = {
        differ: {
          diff: (opt: any) => false
        },
        componentRef: { instance: 'instance' },
        getSeriesColor: () => {},
        rebuildComponent: () => {}
      };

      spyOn(fakeThis, <any>'getSeriesColor');
      spyOn(fakeThis, <any>'rebuildComponent');

      component['checkingForSerieChanges'].call(fakeThis);

      expect(fakeThis['getSeriesColor']).not.toHaveBeenCalled();
      expect(fakeThis['rebuildComponent']).not.toHaveBeenCalled();
    });

    it('setChartProperties: should attribute some PoChartDynamicTypeComponent property values', () => {
      const instance: any = {
        chartHeader: { nativeElement: { offsetHeight: 200 } },
        chartLegend: { nativeElement: { offsetHeight: 200 } },
        chartWrapper: { nativeElement: { offsetWidth: 200 } }
      };

      component.height = 400;
      component['series'] = <any>[
        { category: 'A', value: 10 },
        { category: 'B', value: 10 }
      ];
      component['colors'] = ['orange', 'red'];

      component['setChartProperties'](instance);

      expect(instance.height).toBe(component.height);
      expect(instance.series).toEqual(component['series']);
      expect(instance.colors).toEqual(component['colors']);
      expect(instance.chartHeader).toBe(component.chartHeader.nativeElement.offsetHeight);
      expect(instance.chartLegend).toBe(component['chartLegend'].nativeElement.offsetHeight);
      expect(instance.chartWrapper).toBe(component.chartWrapper.nativeElement.offsetWidth);
    });

    it('setChartProperties: should set `instance.colors` with empty array if `component.colors` is undefined', () => {
      const instance: any = {};

      component['colors'] = undefined;
      component.chartHeader = { nativeElement: { offsetHeight: 200 } };
      component.chartLegend = { nativeElement: { offsetHeight: 200 } };
      component.chartWrapper = { nativeElement: { offsetWidth: 200 } };

      component['setChartProperties'](instance);

      expect(instance.colors).toEqual([]);
    });

    it('setClickSubscribe: should call `onSeriesClick` if onSerieClick emits an event', () => {
      const event = { data: 10 };

      const instance: any = {
        onSerieClick: of(event)
      };

      spyOn(component, <any>'onSeriesClick');

      component['setClickSubscribe'](instance);

      expect(component.onSeriesClick).toHaveBeenCalledWith(event);
    });

    it('setHoverSubscribe: should call `onSeriesHover` if onSeriesHover emits an event', () => {
      const event = { data: 11 };

      const instance: any = {
        onSerieHover: of(event)
      };

      spyOn(component, <any>'onSeriesHover');

      component['setHoverSubscribe'](instance);

      expect(component.onSeriesHover).toHaveBeenCalledWith(event);
    });

    it('setResizeListenerSubscribe: should call `windowResizeListener` and `chartLegendHeight` if windowResizeListener emits', () => {
      const instance: any = {};

      component.chartHeader = { nativeElement: { offsetHeight: 200 } };
      component['chartLegend'] = { nativeElement: { offsetHeight: 200 } };
      component.chartWrapper = { nativeElement: { offsetWidth: 200 } };

      component['windowResizeListener'] = <any>of([]);

      spyOn(component, <any>'windowResizeListener');
      spyOn(component, <any>'chartLegendHeight').and.callThrough();

      component['setResizeListenerSubscribe'](instance);

      expect(component['chartLegendHeight']).toHaveBeenCalledWith(component['chartLegend']);
      expect(instance.chartHeader).toBe(component.chartHeader.nativeElement.offsetHeight);
      expect(instance.chartLegend).toBe(component['chartLegend'].nativeElement.offsetHeight);
      expect(instance.chartWrapper).toBe(component.chartWrapper.nativeElement.offsetWidth);
    });

    it(`dynamicComponentSetting: should call 'createComponent', 'setResizeListenerSubscribe', 'detectChanges', 'setClickSubscribe'
      and 'setHoverSubscribe' if has type`, () => {
      spyOn(component, <any>'createComponent');
      spyOn(component, <any>'setResizeListenerSubscribe');
      spyOn(component.changeDetector, 'detectChanges');
      spyOn(component, <any>'setClickSubscribe');
      spyOn(component, <any>'setHoverSubscribe');

      component['dynamicComponentSetting']();

      expect(component['createComponent']).toHaveBeenCalled();
      expect(component['setResizeListenerSubscribe']).toHaveBeenCalled();
      expect(component.changeDetector.detectChanges).toHaveBeenCalled();
      expect(component['setClickSubscribe']).toHaveBeenCalled();
      expect(component['setHoverSubscribe']).toHaveBeenCalled();
    });

    it('getComponentType: should return component of the mappings by key', () => {
      const type = 'pie';

      expect(component['getComponentType'](type)).toBe(PoChartPieComponent);
    });

    it('getSeriesColor: should return all colors if `series` is undefined', () => {
      const poChartColorsAll = PoChartColors.length - 1;

      expect(component['getSeriesColor']()).toEqual(PoChartColors[poChartColorsAll]);
    });

    it('getSeriesColor: should return first color if type is `gauge`', () => {
      component.type = PoChartType.Gauge;
      component.series = Array(14);

      expect(component['getSeriesColor']()).toEqual(PoChartColors[0]);
    });

    it('getSeriesColor: should return four colors if `series` legth is four', () => {
      component.series = Array(4);

      expect(component['getSeriesColor']()).toEqual(PoChartColors[3]);
    });

    it('getSeriesColor: should return all colors if `series` legth is 11', () => {
      const poChartColorsAll = PoChartColors.length - 1;
      component.series = Array(12);

      expect(component['getSeriesColor']()).toEqual(PoChartColors[poChartColorsAll]);
    });

    it('getSeriesColor: should return duplicate colors if `series` legth is greater 12', () => {
      component.series = Array(14);

      expect(component['getSeriesColor']().length).toEqual(24);
    });

    it('onResize: should trigger onResize method when window is resized ', () => {
      const spyOnResize = spyOn(component, 'onResize');

      window.dispatchEvent(new Event('resize'));

      expect(spyOnResize).toHaveBeenCalled();
    });

    it('onResize: should call `windowResizeListener.next` if window is resized', () => {
      spyOn(component['windowResizeListener'], 'next');

      component.onResize();

      expect(component['windowResizeListener'].next).toHaveBeenCalled();
    });

    it('removeWindowResizeListener: shouldn`t set onResize with function if onResize is undefined', () => {
      component['onResize'] = undefined;

      component['removeWindowResizeListener']();

      expect(component['onResize']).toBeUndefined();
    });

    it('chartLegendHeight: should return `chartLegend.nativeElement.offsetHeight` if `chartLegend` has value', () => {
      component['chartLegend'] = { nativeElement: { offsetHeight: 200 } };

      const expectedResult = component['chartLegendHeight'](component['chartLegend']);

      expect(expectedResult).toBe(component['chartLegend'].nativeElement.offsetHeight);
    });

    it('chartLegendHeight: should return `0` if `chartLegend` is undefined', () => {
      component['chartLegend'] = undefined;

      const expectedResult = component['chartLegendHeight'](component['chartLegend']);

      expect(expectedResult).toBe(0);
    });
  });

  describe('Templates:', () => {
    it('should create four subtitles with the correct colors if the length of the series is four', () => {
      const colors = ['rgb(12, 108, 148)', 'rgb(11, 146, 180)', 'rgb(41, 182, 197)', 'rgb(148, 218, 226)'];

      const getBackgroundColor = subtitle => subtitle.querySelector('.po-chart-legend-square').style.backgroundColor;

      component['series'] = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'C', value: 3 },
        { category: 'D', value: 4 }
      ];

      fixture.detectChanges();

      const subtitles = nativeElement.querySelectorAll('.po-chart-legend-item');

      expect(subtitles.length).toBe(4);

      expect(getBackgroundColor(subtitles[0])).toBe(colors[0]);
      expect(getBackgroundColor(subtitles[1])).toBe(colors[1]);
      expect(getBackgroundColor(subtitles[2])).toBe(colors[2]);
      expect(getBackgroundColor(subtitles[3])).toBe(colors[3]);
    });
  });
});
