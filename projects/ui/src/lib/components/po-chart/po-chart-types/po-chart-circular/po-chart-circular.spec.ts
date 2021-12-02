import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, ElementRef, NgZone, Renderer2 } from '@angular/core';

import { PoDefaultColors, PoDefaultColorsTextBlack } from 'projects/ui/src/lib/services/po-color/po-colors.constant';

import { PoChartCircular } from './po-chart-circular';
import { poChartCompleteCircle } from './po-chart-circular.constant';
import { PoChartDynamicTypeComponent } from '../po-chart-dynamic-type.component';
import { PoChartType } from '../../enums/po-chart-type.enum';

@Component({
  selector: 'po-chart-circular-test',
  templateUrl: '../po-chart-dynamic-type.component.html'
})
class PoChartCircularComponent extends PoChartCircular {
  constructor(el: ElementRef, ngZone: NgZone, renderer: Renderer2) {
    super(el, ngZone, renderer);
  }
}

describe('PoChartCircular:', () => {
  let component: PoChartCircularComponent;
  let fixture: ComponentFixture<PoChartCircularComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PoChartCircularComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartCircularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoChartCircular).toBeTruthy();
    expect(component instanceof PoChartDynamicTypeComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngOnDestroy: should call `removeWindowResizeListener`, `removeWindowScrollListener` and set `animationRunning` to false', () => {
      component['animationRunning'] = true;
      spyOn(component, <any>'removeWindowResizeListener').and.callThrough();
      spyOn(component, <any>'removeWindowScrollListener').and.callThrough();

      component.ngOnDestroy();

      expect(component['removeWindowResizeListener']).toHaveBeenCalled();
      expect(component['removeWindowScrollListener']).toHaveBeenCalled();
      expect(component['animationRunning']).toBeFalsy();
    });

    it('ngOnInit: should call `chartInitSetup` and `setEventListeners`', () => {
      spyOn(component, <any>'chartInitSetup');
      spyOn(component, <any>'setEventListeners');

      component.ngOnInit();

      expect(component['chartInitSetup']).toHaveBeenCalled();
      expect(component['setEventListeners']).toHaveBeenCalled();
    });

    it('animationSetup: should set `chartItemEndAngle` with `chartItemsEndAngleList` item first', () => {
      const itemFirstAngle = 123;
      component['chartItemEndAngle'] = undefined;
      component['chartItemsEndAngleList'] = [itemFirstAngle, 456];

      component['animationSetup']();

      expect(component['chartItemEndAngle']).toBe(itemFirstAngle);
    });

    it('animationSetup: should set `animationRunning` with `true`', () => {
      component['animationRunning'] = undefined;

      component['animationSetup']();

      expect(component['animationRunning']).toBeTruthy();
    });

    it('animationSetup: should call `drawPathInit`', () => {
      spyOn(component, <any>'drawPathInit');

      component['animationSetup']();

      expect(component['drawPathInit']).toHaveBeenCalled();
    });

    it('calculateAngleRadians: should set `chartItemsEndAngleList` with items end angle', () => {
      const itemsEndAngle = [0.1, 0.2, 0.3, 0.4];

      spyOn(component, <any>'calculateEndAngle').and.returnValues(...itemsEndAngle);

      component.colors = PoDefaultColors[3];
      component['series'] = [
        { label: '1', data: 1 },
        { label: '2', data: 2 },
        { label: '3', data: 3 },
        { label: '4', data: 4 }
      ];

      component['calculateAngleRadians']();

      expect(component['chartItemsEndAngleList']).toEqual(itemsEndAngle);
    });

    it('calculateAngleRadians: should set `chartItemsEndAngleList` with items end angle even if serie.category and serie.value', () => {
      const itemsEndAngle = [0.1, 0.2, 0.3, 0.4];

      spyOn(component, <any>'calculateEndAngle').and.returnValues(...itemsEndAngle);

      component.colors = PoDefaultColors[3];
      component['series'] = [
        { category: '1', value: 1 },
        { category: '2', value: 2 },
        { category: '3', value: 3 },
        { category: '4', value: 4 }
      ];

      component['calculateAngleRadians']();

      expect(component['chartItemsEndAngleList']).toEqual(itemsEndAngle);
    });

    it(`calculateAngleRadians: should set 'chartItemsEndAngleList' with items end angle even if serie.data, serie.value,
    serie.category and serie.label are mixed`, () => {
      const itemsEndAngle = [0.1, 0.2, 0.3, 0.4];

      spyOn(component, <any>'calculateEndAngle').and.returnValues(...itemsEndAngle);

      component.colors = PoDefaultColors[3];
      component['series'] = [
        { label: '1', data: 1 },
        { category: '2', data: 2 },
        { category: '3', value: 3 },
        { label: '4', value: 4 }
      ];

      component['calculateAngleRadians']();

      expect(component['chartItemsEndAngleList']).toEqual(itemsEndAngle);
    });

    it('calculateAngleRadians: should call `calculateEndAngle` with value series and `totalValue`', () => {
      spyOn(component, <any>'calculateEndAngle');
      component['totalValue'] = 24;

      component.colors = PoDefaultColors[3];
      component['series'] = [
        { category: '1', value: 1 },
        { category: '2', value: 2 },
        { category: '3', value: 3 },
        { category: '4', value: 4 }
      ];

      component['calculateAngleRadians']();

      expect(component['calculateEndAngle']).toHaveBeenCalledWith(1, component['totalValue']);
      expect(component['calculateEndAngle']).toHaveBeenCalledWith(2, component['totalValue']);
      expect(component['calculateEndAngle']).toHaveBeenCalledWith(3, component['totalValue']);
      expect(component['calculateEndAngle']).toHaveBeenCalledWith(4, component['totalValue']);
    });

    it('calculateCurrentEndAngle: should return value of end angle if the series drawing is completed', () => {
      const angleCurrentPosition = 22;

      component['chartItemStartAngle'] = 10;
      component['chartItemEndAngle'] = 20;
      const endAngleValue = component['chartItemStartAngle'] + component['chartItemEndAngle'] - poChartCompleteCircle;

      const result = component['calculateCurrentEndAngle'](angleCurrentPosition);

      expect(result).toBe(endAngleValue);
    });

    it('calculateCurrentEndAngle: should return value of next angle if the series drawing is not completed', () => {
      const angleCurrentPosition = 15;

      component['chartItemStartAngle'] = 10;
      component['chartItemEndAngle'] = 20;
      const endAngleValue = component['chartItemStartAngle'] + angleCurrentPosition;

      const result = component['calculateCurrentEndAngle'](angleCurrentPosition);

      expect(result).toBe(endAngleValue);
    });

    it(`chartInitSetup: should call 'calculateSVGDimensions', 'calculateTotalValue',
      'calculateAngleRadians', 'createSVGElements' and 'animationSetup'`, () => {
      spyOn(component, <any>'calculateSVGDimensions');
      spyOn(component, 'calculateTotalValue');
      spyOn(component, <any>'calculateAngleRadians');
      spyOn(component, <any>'createSVGElements');
      spyOn(component, <any>'animationSetup');

      component['chartInitSetup']();

      expect(component['calculateSVGDimensions']).toHaveBeenCalled();
      expect(component.calculateTotalValue).toHaveBeenCalled();
      expect(component['calculateAngleRadians']).toHaveBeenCalled();
      expect(component['createSVGElements']).toHaveBeenCalled();
      expect(component['animationSetup']).toHaveBeenCalled();
    });

    it('createPath: should create a svg path element with some attributes and append it into `svgPathsWrapper`', () => {
      const serie = { category: 'po', value: 2 };
      const svgPathsWrapper = { appendChild: () => {} };
      component.colors = PoDefaultColors[0];

      spyOn(component['renderer'], 'setAttribute');
      spyOn(component['renderer'], 'appendChild');

      component['createPath'](serie, svgPathsWrapper);

      expect(component['renderer'].setAttribute).toHaveBeenCalledTimes(5);
      expect(component['renderer'].appendChild).toHaveBeenCalledTimes(1);
      expect(component['svgPathElementsList'].length).toEqual(1);
    });

    it(`createPath: should call 'setElementAttributes' with 'svgPath' and 'serie'`, () => {
      const tooltipText = 'tooltipText';
      const serie = { category: 'po', value: 2, tooltip: tooltipText };
      const svgPath = '<svg></svg>';
      const svgPathsWrapper = { appendChild: () => {} };
      component.colors = PoDefaultColors[0];

      spyOn(component['renderer'], 'setAttribute');
      spyOn(component['renderer'], 'createElement').and.returnValue(svgPath);
      spyOn(component['renderer'], 'appendChild');
      spyOn(component, <any>'setElementAttributes');

      component['createPath'](serie, svgPathsWrapper);

      expect(component['setElementAttributes']).toHaveBeenCalledWith(svgPath, serie);
    });

    it('onMouseEnter: should emit serie object and set `chartElementDescription` if type is gauge', () => {
      const eventMock = { target: { getAttributeNS: () => 'First' } };
      const serie = { value: 10, description: 'First' };

      component.colors = PoDefaultColors[0];
      component['series'] = [{ ...serie }];

      spyOn(component, <any>'emitEventOnEnter')(eventMock);
      spyOn(eventMock.target, 'getAttributeNS').and.callThrough();

      component['onMouseEnter'](eventMock);

      expect(component['chartElementDescription']).toEqual('First');
      expect(eventMock.target.getAttributeNS).toHaveBeenCalled();
      expect(component['emitEventOnEnter']).toHaveBeenCalledWith(serie);
    });

    describe('removeTooltip:', () => {
      it('expect that `tooltipElement` has the class `po-invisible` being added', () => {
        component.tooltipElement = component.chartBody.nativeElement.lastChild;

        spyOn(component['renderer'], 'addClass');

        component['removeTooltip']();

        expect(component['renderer'].addClass).toHaveBeenCalledWith(component.tooltipElement, 'po-invisible');
      });

      it('should not call `renderer` if tooltipElement is not declared', () => {
        component.tooltipElement = undefined;

        spyOn(component['renderer'], 'addClass');

        component['removeTooltip']();

        expect(component['renderer'].addClass).not.toHaveBeenCalled();
      });
    });

    it('onWindowResize: should call `calculateSVGDimensions` and set `svgElement` attribute values ', () => {
      spyOn(component['renderer'], 'setAttribute');
      spyOn(component, <any>'calculateSVGDimensions');

      component['onWindowResize']();

      expect(component['renderer'].setAttribute).toHaveBeenCalledTimes(2);
      expect(component['calculateSVGDimensions']).toHaveBeenCalled();
    });

    it('removeWindowResizeListener: should remove resize listener', () => {
      spyOn(component, <any>'windowResizeListener');

      component['removeWindowResizeListener']();

      expect(component['windowResizeListener']).toHaveBeenCalled();
    });

    it('removeWindowResizeListener: shouldn`t remove resize listener', () => {
      spyOn(component, <any>'windowResizeListener');

      component['windowResizeListener'] = undefined;
      component['removeWindowResizeListener']();

      expect(component['windowResizeListener']).toBeUndefined();
    });

    it('removeWindowResizeListener: shouldn`t remove Scroll Listener', () => {
      spyOn(component, <any>'windowScrollListener');

      component['windowScrollListener'] = undefined;
      component['removeWindowScrollListener']();

      expect(component['windowScrollListener']).toBeUndefined();
    });

    it('drawPath: should call `setAttribute` with `d` and `coordinates` of path object', () => {
      const chartItemStartAngle = 10;
      const chartItemEndAngle = 20;

      const path = {
        d: '',
        setAttribute: function f(attr, value) {
          this[attr] = value;
        }
      };

      component['centerX'] = 10;

      spyOn(path, 'setAttribute').and.callThrough();

      component['drawPath'](path, chartItemStartAngle, chartItemEndAngle);

      expect(typeof path.d === 'string').toBe(true);
      expect(path.setAttribute).toHaveBeenCalled();
      expect(path.d.includes('M')).toBe(true);
      expect(path.d.includes('A')).toBe(true);
      expect(path.d.includes('Z')).toBe(true);
    });

    it(`onMouseClick: should call 'onSerieClick.next' passing the serie object if type is gauge`, () => {
      const serie = { value: 10, description: 'First' };

      component.colors = PoDefaultColors[0];
      component['series'] = [{ ...serie }];

      spyOn(component['onSerieClick'], 'next');

      component['onMouseClick']();

      expect(component['onSerieClick'].next).toHaveBeenCalledWith(serie);
    });

    it('emitEventOnEnter: should call `onSerieHover.next`', () => {
      spyOn(component['onSerieHover'], 'next');

      component['emitEventOnEnter']({ description: 'Data', value: 1 });

      expect(component['onSerieHover'].next).toHaveBeenCalled();
    });

    it('drawSeries: should return undefined if `isFinishedDrawingCurrentSeries` is true', () => {
      component['svgPathElementsList'].length = 3;

      spyOn(component, <any>'calculateCurrentEndAngle');
      spyOn(window, 'requestAnimationFrame');

      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
      expect(component['calculateCurrentEndAngle']).not.toHaveBeenCalled();
    });

    it('drawSeries: should update values if `isFinishedDrawingAllSeries` is false and `isFinishedDrawingCurrentSeries` is true', () => {
      const currentSerieIndex = 2;
      const angleCurrentPosition = 2;
      component['svgPathElementsList'].length = 3;
      component['chartItemEndAngle'] = 1;
      component['chartItemsEndAngleList'] = [angleCurrentPosition];
      const expectedChartItemStartAngleValue: number =
        component['chartItemStartAngle'] + component['chartItemEndAngle'];

      spyOn(component, <any>'drawPath');
      spyOn(component, <any>'calculateCurrentEndAngle');
      spyOn(window, 'requestAnimationFrame');

      component['drawSeries'](currentSerieIndex, angleCurrentPosition);

      expect(component['chartItemStartAngle']).toEqual(expectedChartItemStartAngleValue);
      expect(currentSerieIndex).toEqual(currentSerieIndex);
      expect(component['chartItemEndAngle']).toEqual(component['chartItemsEndAngleList'][currentSerieIndex]);
      expect(component['drawPath']).not.toHaveBeenCalled();
      expect(component['calculateCurrentEndAngle']).not.toHaveBeenCalled();
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('drawSeries: should call `drawPath` if `isFinishedDrawingCurrentSeries` and `isFinishedDrawingAllSeries` are false', () => {
      const currentSerieIndex = 2;
      const angleCurrentPosition = 2;
      component['svgPathElementsList'].length = 3;
      component['chartItemEndAngle'] = 2;
      component['chartItemsEndAngleList'] = [angleCurrentPosition];

      spyOn(component, <any>'drawPath');
      spyOn(component, <any>'calculateCurrentEndAngle');
      spyOn(window, 'requestAnimationFrame');

      component['drawSeries'](currentSerieIndex, angleCurrentPosition);

      expect(component['drawPath']).toHaveBeenCalled();
      expect(window.requestAnimationFrame).toHaveBeenCalled();
      expect(component['calculateCurrentEndAngle']).toHaveBeenCalled();
    });

    it('createPaths: should call `renderer.createElement` and call `createPath`', () => {
      component.colors = PoDefaultColors[2];
      component['series'] = [
        { value: 10, category: 'First' },
        { value: 20, category: 'Second' }
      ];

      spyOn(component['renderer'], 'createElement');
      spyOn(component['series'], 'forEach').and.callThrough();
      spyOn(component, <any>'createPath');

      component['createPaths']();

      expect(component['renderer'].createElement).toHaveBeenCalledWith('svg:g', 'svg');
      expect(component['series'].forEach).toHaveBeenCalled();
      expect(component['createPath']).toHaveBeenCalled();
    });

    it(`createSVGElements: should create svgElement and call 'createPaths', 'createTexts',
      append svgElement in svgContainer and setAttributes`, () => {
      component.colors = PoDefaultColors[0];
      component.series = [{ category: 'po', value: 1 }];
      spyOn(component, <any>'createPaths');
      spyOn(component, <any>'createTexts');
      spyOn(component['renderer'], <any>'createElement').and.callThrough();
      spyOn(component['renderer'], <any>'setAttribute');
      spyOn(component['svgContainer'].nativeElement, <any>'appendChild');

      component['createSVGElements']();

      expect(component.svgElement).toBeDefined();
      expect(component['createPaths']).toHaveBeenCalled();
      expect(component['createTexts']).toHaveBeenCalled();
      expect(component['renderer'].createElement).toHaveBeenCalledWith('svg:svg', 'svg');
      expect(component['renderer'].setAttribute).toHaveBeenCalledTimes(5);
      expect(component['svgContainer'].nativeElement.appendChild).toHaveBeenCalledWith(component.svgElement);
    });

    it('createSVGElements: should set `xMidYMin` to `preservAspectRatio` if type different from `gauge`', () => {
      const expectedPreserveAspectRatio = 'xMidYMin meet';
      component.type = PoChartType.Pie;
      component.colors = PoDefaultColors[0];
      component.series = [{ category: 'po', value: 1 }];
      component.centerX = 500;
      component.chartWrapper = 1000;

      component['createSVGElements']();

      expect(component['svgElement'].getAttribute('preserveAspectRatio')).toEqual(expectedPreserveAspectRatio);
    });

    it('createSVGElements: should set properly viewBox attribute values if type is different from `gauge``', () => {
      component.type = PoChartType.Pie;
      component.colors = PoDefaultColors[0];
      component.series = [{ category: 'po', value: 1 }];
      component.centerX = 500;
      component.chartWrapper = 1000;

      component['createSVGElements']();

      expect(component['svgElement'].getAttribute('viewBox')).toEqual(
        `0 0 ${component.chartWrapper} ${component.chartWrapper}`
      );
    });

    it('setEventListeners: should call `renderer.listen` set `windowResizeListener`', () => {
      const chartSeries = [
        '<svg:path class="po-path-item" fill="#0C6C94" data-tooltip-value="1"></svg:path>',
        '<svg:path class="po-path-item" fill="#0B92B4" data-tooltip-value="2"></svg:path>'
      ];

      component['el'] = <any>{
        nativeElement: {
          querySelectorAll: () => {}
        }
      };

      component['windowResizeListener'] = undefined;
      component['windowScrollListener'] = undefined;

      spyOn(component['el'].nativeElement, 'querySelectorAll').and.returnValue(chartSeries);
      spyOn(component, <any>'checkingIfScrollsWithPoPage').and.returnValue(window);

      spyOn(component['renderer'], 'listen').and.returnValue(() => {});

      component['setEventListeners']();
      expect(component['windowResizeListener']).toBeDefined();
      expect(component['windowScrollListener']).toBeDefined();
    });

    it('setEventListeners: should call `renderer.listen` twice times and set `windowResizeListener` and `windowScrollListener`', () => {
      component['el'] = <any>{
        nativeElement: {
          querySelectorAll: () => {}
        }
      };

      component['windowResizeListener'] = undefined;

      spyOn(component['el'].nativeElement, 'querySelectorAll').and.returnValue([]);
      spyOn(component['renderer'], 'listen').and.returnValue(() => {});
      spyOn(component, <any>'checkingIfScrollsWithPoPage').and.returnValue(window);

      component['setEventListeners']();

      expect(component['renderer'].listen).toHaveBeenCalledTimes(2);
      expect(component['windowResizeListener']).toBeDefined();
      expect(component['windowScrollListener']).toBeDefined();
    });

    it('checkingIfScrollsWithPoPage: expect to return `window` if poPageContent is undefined', () => {
      const poPageContent = document.getElementsByClassName('po-page-content')[0];

      if (poPageContent) {
        poPageContent.remove();
      }

      fixture.detectChanges();

      const scrollElement = component['checkingIfScrollsWithPoPage']();

      expect(scrollElement).toEqual(window);
    });

    it('checkingIfScrollsWithPoPage: expect to not return `window` if poPageContent has value', () => {
      const poPageContent = document.createElement('div');
      poPageContent.innerHTML = '<div class="po-page-content">first</div>';
      document.body.append(poPageContent);

      fixture.detectChanges();
      const scrollElement = component['checkingIfScrollsWithPoPage']();

      expect(scrollElement).not.toEqual(window);
    });

    it('drawPathInit: should only return if `animationRunning` is `false`.', () => {
      component['animationRunning'] = false;

      spyOn(component['ngZone'], <any>'runOutsideAngular');
      spyOn(component, <any>'drawSeries');
      component['drawPathInit']();

      expect(component['ngZone'].runOutsideAngular).not.toHaveBeenCalled();
      expect(component['drawSeries']).not.toHaveBeenCalled();
    });

    it('drawPathInit: shouldn call `drawSeries` if `animationRunning` is `true`.', () => {
      component['animationRunning'] = true;

      spyOn(component['ngZone'], <any>'runOutsideAngular');
      spyOn(component, <any>'drawSeries');
      component['drawPathInit']();

      expect(component['ngZone'].runOutsideAngular).toHaveBeenCalled();
    });

    it('calculateEndAngle: should return endAngle number', () => {
      const expectedResult = component['calculateEndAngle'](10, 100);
      expect(typeof expectedResult === 'number').toBe(true);
    });

    it('setElementAttributes: should call renderer.setAttribute 3 times and with `data-tooltip-text`', () => {
      const serie = { label: 'po', data: 2 };
      const svgPath = '<text></text>';
      component.type = PoChartType.Pie;

      spyOn(component['renderer'], 'setAttribute');
      spyOn(component['renderer'], 'createElement').and.returnValue(svgPath);
      spyOn(component, <any>'getTooltipValue').and.callThrough();

      component['setElementAttributes'](svgPath, serie);

      expect(component['getTooltipValue']).toHaveBeenCalledWith(serie.data);
      expect(component['renderer'].setAttribute).toHaveBeenCalledTimes(3);
      expect(component['renderer'].setAttribute).toHaveBeenCalledWith(
        svgPath,
        'data-tooltip-text',
        `${serie.label}: ${serie.data}`
      );
    });

    it('setElementAttributes: should call renderer.setAttribute 3 times and with `data-tooltip-text` even if serie.category and serie.value', () => {
      const serie = { category: 'po', value: 2 };
      const svgPath = '<text></text>';
      component.type = PoChartType.Pie;

      spyOn(component['renderer'], 'setAttribute');
      spyOn(component['renderer'], 'createElement').and.returnValue(svgPath);
      spyOn(component, <any>'getTooltipValue').and.callThrough();

      component['setElementAttributes'](svgPath, serie);

      expect(component['getTooltipValue']).toHaveBeenCalledWith(serie.value);
      expect(component['renderer'].setAttribute).toHaveBeenCalledTimes(3);
      expect(component['renderer'].setAttribute).toHaveBeenCalledWith(svgPath, 'data-tooltip-text', 'po: 2');
    });

    it('setElementAttributes: should call renderer.setAttribute 3 times and with `data-tooltip-text` even if serie.category and serie.data', () => {
      const serie = { category: 'po', data: 2 };
      const svgPath = '<text></text>';
      component.type = PoChartType.Pie;

      spyOn(component['renderer'], 'setAttribute');
      spyOn(component['renderer'], 'createElement').and.returnValue(svgPath);
      spyOn(component, <any>'getTooltipValue').and.callThrough();

      component['setElementAttributes'](svgPath, serie);

      expect(component['getTooltipValue']).toHaveBeenCalledWith(serie.data);
      expect(component['renderer'].setAttribute).toHaveBeenCalledTimes(3);
      expect(component['renderer'].setAttribute).toHaveBeenCalledWith(svgPath, 'data-tooltip-text', 'po: 2');
    });

    it('setElementAttributes: should call renderer.setAttribute 3 times and with `data-tooltip-text` even if serie.label and serie.value', () => {
      const serie = { label: 'po', value: 2 };
      const svgPath = '<text></text>';
      component.type = PoChartType.Pie;

      spyOn(component['renderer'], 'setAttribute');
      spyOn(component['renderer'], 'createElement').and.returnValue(svgPath);
      spyOn(component, <any>'getTooltipValue').and.callThrough();

      component['setElementAttributes'](svgPath, serie);

      expect(component['getTooltipValue']).toHaveBeenCalledWith(serie.value);
      expect(component['renderer'].setAttribute).toHaveBeenCalledTimes(3);
      expect(component['renderer'].setAttribute).toHaveBeenCalledWith(svgPath, 'data-tooltip-text', `po: 2`);
    });

    it('getTooltipValue: should return value as string if `type` is pie', () => {
      const value = 10;
      const expectedValue = value.toString();

      component.totalValue = 100;
      component.type = PoChartType.Pie;

      expect(component['getTooltipValue'](value)).toBe(expectedValue);
    });

    it('getTooltipValue: should return value as string with porcent if `type` is donut', () => {
      const value = 10;
      const expectedValue = '10%';

      component.totalValue = 100;
      component.type = PoChartType.Donut;

      expect(component['getTooltipValue'](value)).toBe(expectedValue);
    });

    it('getTextColor: should return black hexadecimal color', () => {
      const color = PoDefaultColorsTextBlack[0];
      const expectedValue = '#000000';

      expect(component['getTextColor'](color)).toBe(expectedValue);
    });

    it('getTextColor: should return white hexadecimal color', () => {
      const color = '#c2c2c2';
      const expectedValue = '#ffffff';

      expect(component['getTextColor'](color)).toBe(expectedValue);
    });

    it('getPercentValue: should return exact percent value if less than two decimals places', () => {
      const value = 10.5;
      const totalValue = 100;

      const expectedValue = '10,5';

      expect(component['getPercentValue'](value, totalValue)).toBe(expectedValue);
    });

    it('getPercentValue: should return percent value fixed with two decimals places if more than two decimals places', () => {
      const value = 10.431;
      const totalValue = 100;

      const expectedValue = '10,43';

      expect(component['getPercentValue'](value, totalValue)).toBe(expectedValue);
    });

    it('getFontSize: should return proportional font size of chartWrapper ', () => {
      const expectedValue = `40px`;

      component.chartWrapper = 1000;

      expect(component['getFontSize']()).toBe(expectedValue);
    });

    it('createTexts: should call `createText` 2 times if `type` is donut', () => {
      const mockSeries = [
        { value: 10, category: 'First' },
        { value: 20, category: 'Second' }
      ];

      component.colors = PoDefaultColors[mockSeries.length];
      component['series'] = mockSeries;
      component.type = PoChartType.Donut;

      spyOn(component, <any>'createText');

      component['createTexts']();

      expect(component['createText']).toHaveBeenCalledTimes(mockSeries.length);
    });

    it('createTexts: shouldn`t call `createText` if `type` is pie', () => {
      const mockSeries = [
        { value: 10, category: 'First' },
        { value: 20, category: 'Second' }
      ];

      component.colors = PoDefaultColors[mockSeries.length];
      component['series'] = mockSeries;
      component.type = PoChartType.Donut;

      spyOn(component, <any>'createText');

      component['createTexts']();

      expect(component['createText']).toHaveBeenCalledTimes(mockSeries.length);
    });

    it('createText: should create a svg text element with some attributes and add it into `svgTextElementsList`', () => {
      const serie = { description: 'po', value: 2 };

      component.colors = PoDefaultColors[0];

      spyOn(component, <any>'getFontSize');
      spyOn(component, <any>'getTextColor');
      spyOn(component, <any>'getPercentValue');
      spyOn(component, <any>'setElementAttributes');

      spyOn(component['renderer'], 'createElement').and.callThrough();
      spyOn(component['renderer'], 'setAttribute');
      spyOn(component['renderer'], 'appendChild');

      component['createText'](serie);

      expect(component['getFontSize']).toHaveBeenCalled();
      expect(component['getTextColor']).toHaveBeenCalled();
      expect(component['getPercentValue']).toHaveBeenCalled();
      expect(component['setElementAttributes']).toHaveBeenCalled();

      expect(component['renderer'].createElement).toHaveBeenCalledTimes(2);
      expect(component['renderer'].setAttribute).toHaveBeenCalledTimes(4);
      expect(component['renderer'].appendChild).toHaveBeenCalledTimes(2);

      expect(component['svgTextElementsList'].length).toEqual(1);
    });

    it('createText: should create a svg text element with some attributes and add it into `svgTextElementsList` even serie.label and serie.value', () => {
      const serie = { category: 'po', value: 2 };

      component.colors = PoDefaultColors[0];

      spyOn(component, <any>'getFontSize');
      spyOn(component, <any>'getTextColor');
      spyOn(component, <any>'getPercentValue');
      spyOn(component, <any>'setElementAttributes');

      spyOn(component['renderer'], 'createElement').and.callThrough();
      spyOn(component['renderer'], 'setAttribute');
      spyOn(component['renderer'], 'appendChild');

      component['createText'](serie);

      expect(component['getFontSize']).toHaveBeenCalled();
      expect(component['getTextColor']).toHaveBeenCalled();
      expect(component['getPercentValue']).toHaveBeenCalled();
      expect(component['setElementAttributes']).toHaveBeenCalled();

      expect(component['renderer'].createElement).toHaveBeenCalledTimes(2);
      expect(component['renderer'].setAttribute).toHaveBeenCalledTimes(4);
      expect(component['renderer'].appendChild).toHaveBeenCalledTimes(2);

      expect(component['svgTextElementsList'].length).toEqual(1);
    });

    it(`createText: should create a svg text element with some attributes and add it into 'svgTextElementsList' even serie.label, serie.value, serie.data and serie.category are mixed`, () => {
      const serie = { description: 'po', value: 2 };

      component.colors = PoDefaultColors[0];

      spyOn(component, <any>'getFontSize');
      spyOn(component, <any>'getTextColor');
      spyOn(component, <any>'getPercentValue');
      spyOn(component, <any>'setElementAttributes');

      spyOn(component['renderer'], 'createElement').and.callThrough();
      spyOn(component['renderer'], 'setAttribute');
      spyOn(component['renderer'], 'appendChild');

      component['createText'](serie);

      expect(component['getFontSize']).toHaveBeenCalled();
      expect(component['getTextColor']).toHaveBeenCalled();
      expect(component['getPercentValue']).toHaveBeenCalled();
      expect(component['setElementAttributes']).toHaveBeenCalled();

      expect(component['renderer'].createElement).toHaveBeenCalledTimes(2);
      expect(component['renderer'].setAttribute).toHaveBeenCalledTimes(4);
      expect(component['renderer'].appendChild).toHaveBeenCalledTimes(2);

      expect(component['svgTextElementsList'].length).toEqual(1);
    });

    it('setTextProperties: shouldn`t call `text.setAttribute` if `type` is pie', () => {
      const text = {
        getBBox: () => ({ width: 30, height: 10 }),
        setAttribute: (attr, val) => {}
      };

      component.type = PoChartType.Pie;

      spyOn(text, 'setAttribute');

      component['setTextProperties'](text, 1, 2);

      expect(text.setAttribute).not.toHaveBeenCalled();
    });

    it('setTextProperties: shouldn`t call `text.setAttribute` if `getClientRects.length` is zero', () => {
      const text = {
        getClientRects: () => ({ length: 0 }),
        getBBox: () => ({ width: 30, height: 10 }),
        setAttribute: (attr, val) => {}
      };

      component.type = PoChartType.Donut;

      spyOn(text, 'setAttribute');

      component['setTextProperties'](text, 1, 2);

      expect(text.setAttribute).not.toHaveBeenCalled();
    });

    it('setTextProperties: should call `text.setAttribute` if `type` is donut and `getClientRects` has length', () => {
      const startAngle = 4;
      const endAngle = 6;
      const text = {
        getClientRects: () => ({ length: 1 }),
        getBBox: () => ({ width: 30, height: 10 }),
        setAttribute: (attr, val) => {}
      };

      component.type = PoChartType.Donut;

      spyOn(text, 'getBBox').and.callThrough();
      spyOn(text, 'setAttribute');

      component['setTextProperties'](text, startAngle, endAngle);

      expect(text.getBBox).toHaveBeenCalled();
      expect(text.setAttribute).toHaveBeenCalledTimes(3);
    });

    it('calculateSVGDimensions: should call `calculateSVGContainerDimensions` and `setInnerRadius`', () => {
      component.chartWrapper = 40;
      component.chartHeader = 20;
      component.chartLegend = 10;

      spyOn(component, 'calculateSVGContainerDimensions');
      spyOn(component, <any>'setInnerRadius');

      component['calculateSVGDimensions']();

      expect(component['setInnerRadius']).toHaveBeenCalled();
      expect(component.calculateSVGContainerDimensions).toHaveBeenCalledWith(
        component.chartWrapper,
        component.chartHeader,
        component.chartLegend
      );
    });

    it('setInnerRadius: should update `innerRadius` with 0 if `type` is pie', () => {
      const expectedValue = 0;

      const type = PoChartType.Pie;

      const expectedResult = component['setInnerRadius'](type);

      expect(expectedResult).toBe(expectedValue);
    });

    it('setInnerRadius: should update `innerRadius` with `365` if `type` is donut', () => {
      const expectedValue = 365;

      component.centerX = 500;
      const type = PoChartType.Donut;

      const expectedResult = component['setInnerRadius'](type);

      expect(expectedResult).toBe(expectedValue);
    });

    it('getSeriesWithValue: should return only series with value and color attr', () => {
      const invalidSeries = [{ description: 'Valor 0', value: 0 }];
      const series = [
        { description: 'Valor 2', value: 2 },
        { description: 'Valor 3', value: 3 }
      ];
      const seriesParam = [...series, ...invalidSeries];

      component.colors = PoDefaultColors[seriesParam.length];

      const validSeries = component['getSeriesWithValue'](seriesParam);

      expect(validSeries.length).toEqual(series.length);
      expect(validSeries.every(serie => !!serie.color)).toBe(true);
    });

    it('getSeriesWithValue: should return empty array if series has value 0', () => {
      const invalidSeries = [{ description: 'Valor 0', value: 0 }];

      const validSeries = component['getSeriesWithValue'](invalidSeries);

      expect(validSeries).toEqual([]);
    });

    it('getSeriesWithValue: should return empty array if series has value -1', () => {
      const invalidSeries = [{ description: 'Valor -1', value: -1 }];

      const validSeries = component['getSeriesWithValue'](invalidSeries);

      expect(validSeries).toEqual([]);
    });

    it('getSeriesWithValue: should return only series with value and color attr even with serie.value', () => {
      const invalidSeries = [{ category: 'Valor 0', value: 0 }];
      const series = [
        { category: 'Valor 2', value: 2 },
        { category: 'Valor 3', value: 3 }
      ];
      const seriesParam = [...series, ...invalidSeries];

      component.colors = PoDefaultColors[seriesParam.length];

      const validSeries = component['getSeriesWithValue'](seriesParam);

      expect(validSeries.length).toEqual(series.length);
    });

    it('getSeriesWithValue: should return only series with value and color attr even with serie.value and serie.data', () => {
      const invalidSeries = [{ description: 'Valor 0', value: 0 }];
      const series = [{ description: 'Valor 2', value: 2 }];
      const seriesParam = [...series, ...invalidSeries];

      component.colors = PoDefaultColors[seriesParam.length];

      const validSeries = component['getSeriesWithValue'](seriesParam);

      expect(validSeries.length).toEqual(series.length);
    });
  });
});
