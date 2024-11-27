import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import * as UtilsFunction from '../../../../../utils/util';

import { PoTooltipModule } from 'projects/ui/src/lib/directives/po-tooltip/po-tooltip.module';
import { PoChartSeriesPointComponent } from './po-chart-series-point.component';
import { PoChartPointsCoordinates } from '../../../interfaces/po-chart-points-coordinates.interface';

describe('PoChartSeriesPointComponent', () => {
  let component: PoChartSeriesPointComponent;
  let fixture: ComponentFixture<PoChartSeriesPointComponent>;
  let nativeElement;
  const RADIUS_DEFAULT_SIZE = 5;
  const RADIUS_HOVER_SIZE = 10;

  const coordinates = {
    category: 'janeiro',
    tooltipLabel: 'Vancouver: 200',
    label: 'Vancouver',
    data: 200,
    xCoordinate: 200,
    yCoordinate: 200
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoTooltipModule],
      declarations: [PoChartSeriesPointComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartSeriesPointComponent);
    component = fixture.componentInstance;
    component.coordinates = [coordinates];
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('onClick: should emit `pointClick` with an object with `label`, `data` and `category`', () => {
      const spyPointClick = spyOn(component.pointClick, 'emit');

      component.onClick(coordinates);

      const expectedParam = {
        label: coordinates.label,
        data: coordinates.data,
        category: coordinates.category
      };

      expect(spyPointClick).toHaveBeenCalledWith(expectedParam);
    });

    it('onMouseEnter: should call `setPointAttribute` and emit `pointHover` with an object with `relativeTo`, `category`, `value` and `axisCategory`', () => {
      const event = { target: { r: '2', fill: 'red' } };

      const spyPointHover = spyOn(component.pointHover, 'emit');
      const spySetPointAttribute = spyOn(component, <any>'setPointAttribute');

      component.onMouseEnter(event, coordinates);

      const expectedParam = {
        relativeTo: undefined,
        label: coordinates.label,
        data: coordinates.data,
        category: coordinates.category
      };

      expect(spySetPointAttribute).toHaveBeenCalledWith(event.target, true);
      expect(spyPointHover).toHaveBeenCalledWith(expectedParam);
    });

    it('onMouseLeave: should call `setPointAttribute`', () => {
      const event = { target: { r: '2', fill: 'red' } };

      const spySetPointAttribute = spyOn(component, <any>'setPointAttribute');

      component.onMouseLeave(event);

      expect(spySetPointAttribute).toHaveBeenCalledWith(event.target, false);
    });

    describe('setPointAttribute:', () => {
      it('should call `setAttribute` for `r` with with properly values and `setStyle` if isHover is true', () => {
        const event = { target: { r: '2', fill: 'red' } };
        const radiusHoverSize = '10';
        const isHover = true;

        component.color = 'red';

        const spySetAttribute = spyOn(component['renderer'], 'setAttribute');
        const spysetStyle = spyOn(component['renderer'], 'setStyle');

        component['setPointAttribute'](<any>event.target, isHover);

        expect(spySetAttribute).toHaveBeenCalledWith(event.target, 'r', radiusHoverSize);
        expect(spysetStyle).toHaveBeenCalledWith(event.target, 'fill', 'red');
      });

      it('should call `setAttribute` twice if isHover is true and `colorPalletteFillColorClass` has value', () => {
        component.color = 'po-color-01';
        component['colorPalletteFillColorClass'] = 'po-border-color-01';

        const event = { target: { r: '2', fill: 'red' } };
        const isHover = true;

        spyOn(component['renderer'], 'setStyle');
        const spySetAttribute = spyOn(component['renderer'], 'setAttribute');

        component['setPointAttribute'](<any>event.target, isHover);

        expect(spySetAttribute).toHaveBeenCalledTimes(2);
      });

      it('should call `setAttribute` twice if isHover is false and `colorPalletteFillColorClass` has value', () => {
        component.color = 'po-color-01';
        component['colorPalletteFillColorClass'] = 'po-border-color-01';

        const event = { target: { r: '2', fill: 'red' } };
        const isHover = false;

        spyOn(component['renderer'], 'setStyle');
        const spySetAttribute = spyOn(component['renderer'], 'setAttribute');

        component['setPointAttribute'](<any>event.target, isHover);

        expect(spySetAttribute).toHaveBeenCalledTimes(2);
      });

      it('should call `setAttribute` for `r` with properly values and `removeStyle` if isHover is false', () => {
        const event = { target: { r: '2', fill: 'red' } };
        const radiusDefaultSize = '5';
        const isHover = false;

        component.color = 'red';

        const spySetAttribute = spyOn(component['renderer'], 'setAttribute');
        const spyRemoveStyle = spyOn(component['renderer'], 'removeStyle');

        component['setPointAttribute'](<any>event.target, isHover);

        expect(spySetAttribute).toHaveBeenCalledWith(event.target, 'r', radiusDefaultSize);
        expect(spyRemoveStyle).toHaveBeenCalledWith(event.target, 'fill', undefined);
      });

      it('setPointAttribute: should set `r` to `RADIUS_HOVER_SIZE` if isHover is true and isFixed is false', () => {
        const target = document.createElementNS('http://www.w3.org/2000/svg', 'circle') as SVGElement;
        const isHover = true;

        component.color = 'red';
        component.isFixed = false;

        const spySetAttribute = spyOn(component['renderer'], 'setAttribute');
        const spySetStyle = spyOn(component['renderer'], 'setStyle');

        component['setPointAttribute'](target, isHover);

        expect(spySetAttribute).toHaveBeenCalledWith(target, 'r', RADIUS_HOVER_SIZE.toString());
        expect(spySetStyle).toHaveBeenCalledWith(target, 'fill', component.color);
      });

      it('should set `r` to `RADIUS_DEFAULT_SIZE` if isHover is true and isFixed is true', () => {
        const target = document.createElementNS('http://www.w3.org/2000/svg', 'circle') as SVGElement;
        const isHover = true;

        component.color = 'po-color-blue';
        component.isFixed = true;

        const spySetAttribute = spyOn(component['renderer'], 'setAttribute');

        component['setPointAttribute'](target, isHover);

        expect(spySetAttribute).toHaveBeenCalledWith(target, 'r', RADIUS_DEFAULT_SIZE.toString());
      });

      it('should set `r` to `RADIUS_DEFAULT_SIZE` if isHover is false', () => {
        const target = document.createElementNS('http://www.w3.org/2000/svg', 'circle') as SVGElement;
        const isHover = false;

        component.color = 'red'; // Defina um valor válido para `color`

        const spySetAttribute = spyOn(component['renderer'], 'setAttribute');
        const spyRemoveStyle = spyOn(component['renderer'], 'removeStyle');

        component['setPointAttribute'](target, isHover);

        expect(spySetAttribute).toHaveBeenCalledWith(target, 'r', RADIUS_DEFAULT_SIZE.toString());
        expect(spyRemoveStyle).toHaveBeenCalledWith(target, 'fill', undefined);
      });
    });

    it('trackBy: should return index param', () => {
      const index = 1;
      const expectedValue = index;

      expect(component.trackBy(index)).toBe(expectedValue);
    });

    it('displayPointsWithDelay: should return an observable of coordinates and update status after a while', fakeAsync(() => {
      component.animate = true;
      let coordinatesWithDelay: Array<PoChartPointsCoordinates> = [];

      const serieA = {
        category: 'janeiro',
        tooltipLabel: 'Vancouver: 200',
        label: 'Vancouver',
        data: 200,
        xCoordinate: 200,
        yCoordinate: 200
      };
      const serieB = {
        category: 'fevereiro',
        tooltipLabel: 'Vancouver: 300',
        label: 'Vancouver',
        data: 300,
        xCoordinate: 300,
        yCoordinate: 300
      };

      spyOn(UtilsFunction, 'isIE').and.returnValue(false);

      const subscription = component['displayPointsWithDelay']([serieA, serieB]).subscribe(value => {
        coordinatesWithDelay = value;
      });

      tick();
      expect(coordinatesWithDelay.length).toBe(1);
      expect(coordinatesWithDelay).toEqual([serieA]);

      tick(700);
      expect(coordinatesWithDelay.length).toBe(2);
      expect(coordinatesWithDelay).toEqual([serieA, serieB]);
      expect(component['animationState']).toBeFalsy();

      subscription.unsubscribe();
    }));

    it('displayPointsWithDelay: shuold return an observable without any delay if animationState is false', fakeAsync(() => {
      component['animationState'] = false;
      let delayedCoordinates: Array<PoChartPointsCoordinates> = [];

      const serieA = {
        category: 'janeiro',
        tooltipLabel: 'Vancouver: 200',
        label: 'Vancouver',
        data: 200,
        xCoordinate: 200,
        yCoordinate: 200
      };
      const serieB = {
        category: 'fevereiro',
        tooltipLabel: 'Vancouver: 300',
        label: 'Vancouver',
        data: 300,
        xCoordinate: 300,
        yCoordinate: 300
      };

      spyOn(UtilsFunction, 'isIE').and.returnValue(false);

      const subscription = component['displayPointsWithDelay']([serieA, serieB]).subscribe(value => {
        delayedCoordinates = value;
      });

      tick();
      expect(delayedCoordinates.length).toBe(2);
      expect(component['animationState']).toBeFalsy();

      subscription.unsubscribe();
    }));

    it('displayPointsWithDelay: shuold return an observable without any delay if isIE is true', fakeAsync(() => {
      let delayedCoordinates: Array<PoChartPointsCoordinates> = [];

      const serieA = {
        category: 'janeiro',
        tooltipLabel: 'Vancouver: 200',
        label: 'Vancouver',
        data: 200,
        xCoordinate: 200,
        yCoordinate: 200
      };
      const serieB = {
        category: 'fevereiro',
        tooltipLabel: 'Vancouver: 300',
        label: 'Vancouver',
        data: 300,
        xCoordinate: 300,
        yCoordinate: 300
      };

      spyOn(UtilsFunction, 'isIE').and.returnValue(true);

      const subscription = component['displayPointsWithDelay']([serieA, serieB]).subscribe(value => {
        delayedCoordinates = value;
      });

      tick();
      expect(delayedCoordinates.length).toBe(2);
      expect(component['animationState']).toBeTruthy();

      subscription.unsubscribe();
    }));
  });

  describe('Properties', () => {
    it('p-coordinates: should call `displayPointsWithDelay`', () => {
      const spyDisplayPointsWithDelay = spyOn(component, <any>'displayPointsWithDelay');

      component.coordinates = [coordinates];

      expect(spyDisplayPointsWithDelay).toHaveBeenCalledWith(component.coordinates);
    });

    it('p-color: should apply `po-border-color-01` value to `strokeColor` if p-color includes `po-color`', () => {
      component.color = 'po-color-01';

      expect(component.strokeColor).toBe('po-border-color-01');
    });

    it('p-color: should apply received value to `strokeColor` if color does not contain `po-color`', () => {
      component.color = 'red';

      expect(component.strokeColor).toBe('red');
    });

    it('p-is-fixed: should render text elements only when isFixed is true', () => {
      const mockCoordinates: Array<PoChartPointsCoordinates> = [
        {
          category: 'Category A',
          label: 'Label A',
          tooltipLabel: 'Tooltip A',
          data: 100,
          xCoordinate: 100,
          yCoordinate: 200,
          isFixed: false
        },
        {
          category: 'Category B',
          label: 'Label B',
          tooltipLabel: 'Tooltip B',
          data: 200,
          xCoordinate: 150,
          yCoordinate: 250,
          isFixed: true
        }
      ];

      component.coordinates$ = of(mockCoordinates);
      fixture.detectChanges();

      const textElements = fixture.nativeElement.querySelectorAll('text');

      expect(textElements.length).toBe(1);
      expect(textElements[0].textContent.trim()).toBe('200');
      expect(textElements[0].getAttribute('x')).toBe('150');
      expect(textElements[0].getAttribute('y')).toBe('240');
    });

    it('updateTextDimensions: should update textWidth and textHeight based on text element dimensions', () => {
      const mockItem = {
        category: 'Category A',
        label: 'Label A',
        tooltipLabel: 'Tooltip A',
        data: 100,
        xCoordinate: 50,
        yCoordinate: 50
      };

      const mockSvgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      mockSvgText.setAttribute('data-id', mockItem.label);

      spyOn(mockSvgText, 'getBBox').and.returnValue({ width: 50, height: 20 } as DOMRect);
      spyOn(component['elementRef'].nativeElement, 'querySelector').and.returnValue(mockSvgText);

      component.updateTextDimensions(mockItem);

      expect(component.textWidth).toBe(50);
      expect(component.textHeight).toBe(20);
    });
  });

  describe('Template:', () => {
    it('should contain `po-chart-line-point`', () => {
      spyOn(component, <any>['displayPointsWithDelay']).and.returnValue(of(component.coordinates));
      component.coordinates = [coordinates];
      component.color = 'blue';

      fixture.detectChanges();

      const chartPoints = nativeElement.querySelectorAll('.po-chart-line-point');

      expect(chartPoints).toBeTruthy();
      expect(chartPoints.length).toBe(1);
    });

    it('should render circles with correct attributes and classes', () => {
      component.coordinates$ = of([
        {
          category: 'Janeiro',
          tooltipLabel: 'Tooltip de exemplo',
          label: 'Exemplo',
          data: 100,
          xCoordinate: 150,
          yCoordinate: 50,
          isFixed: false,
          isActive: true
        }
      ]);

      fixture.detectChanges();

      const circles = nativeElement.querySelectorAll('circle');
      expect(circles.length).toBe(1);

      const circle = circles[0];
      expect(circle.getAttribute('cx')).toBe('150');
      expect(circle.getAttribute('cy')).toBe('50');
      expect(circle.getAttribute('r')).toBe(RADIUS_DEFAULT_SIZE.toString());
      expect(circle.getAttribute('class')).toContain('po-chart-line-point');
    });

    it('should render text with correct attributes and content when item.isFixed is true', () => {
      component.coordinates$ = of([
        {
          category: 'Category A',
          label: 'Label A',
          tooltipLabel: 'Tooltip A',
          data: 100,
          xCoordinate: 50,
          yCoordinate: 100,
          isFixed: false
        },
        {
          category: 'Category B',
          label: 'Label B',
          tooltipLabel: 'Tooltip B',
          data: 200,
          xCoordinate: 150,
          yCoordinate: 200,
          isFixed: true
        }
      ]);
      fixture.detectChanges();

      const textElements = nativeElement.querySelectorAll('.po-chart-series-point-text');

      expect(textElements.length).toBe(1);
      const renderedText = textElements[0];
      expect(renderedText.getAttribute('x')).toBe('150');
      expect(renderedText.getAttribute('y')).toBe((200 - RADIUS_DEFAULT_SIZE - 5).toString());
      expect(renderedText.textContent.trim()).toBe('200');
    });
  });
});
