import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { PoChartAreaComponent } from './po-chart-area.component';

const mouseEvent = document.createEvent('MouseEvent');
mouseEvent.initEvent('mousemove', true);

describe('PoChartAreaComponent', () => {
  let component: PoChartAreaComponent;
  let fixture: ComponentFixture<PoChartAreaComponent>;
  let nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoChartAreaComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('onEnter: should call `applyActiveItem`, `initializaListener` and set true to `activeTooltip`', () => {
      const index = 0;
      component.seriesPathsCoordinates = [{ coordinates: ' M93 21 L136 14 L178 8', color: '#29B6C5', isActive: true }];
      component.activeTooltip = false;

      const spyApplyActiveItem = spyOn(component, <any>'applyActiveItem');
      const spyInitializeListener = spyOn(component, <any>'initializeListener');

      component.onEnter(index);

      expect(spyApplyActiveItem).toHaveBeenCalledWith(component.seriesPathsCoordinates, index);
      expect(spyInitializeListener).toHaveBeenCalledWith(index);
      expect(component.activeTooltip).toBeTruthy();
    });

    it('onLeave: should call `removeListener` and `applyActiveItem` twice', () => {
      const index = 0;
      component.seriesPathsCoordinates = [{ coordinates: ' M93 21 L136 14 L178 8', color: '#29B6C5', isActive: true }];
      component.seriesPointsCoordinates = [
        [
          {
            category: undefined,
            color: 'blue',
            label: 'Vancouver',
            tooltipLabel: 'Vancouver: 5',
            data: 5,
            xCoordinate: 104,
            yCoordinate: 24,
            isActive: true
          }
        ]
      ];
      const spyRemoveListener = spyOn(component, <any>'removeListener');
      const spyApplyActiveItem = spyOn(component, <any>'applyActiveItem');

      component.onLeave(index);

      expect(spyRemoveListener).toHaveBeenCalled();
      expect(spyApplyActiveItem).toHaveBeenCalledTimes(2);
    });

    it('onSeriePointHover: should emit `pointHover`', () => {
      const selectedItem = { relativeTo: 'element', item: { data: 2, label: 'Selected item' } };

      const spyPointHover = spyOn(component.pointHover, 'emit');

      component.onSeriePointHover(selectedItem);

      expect(spyPointHover).toHaveBeenCalledWith({ item: selectedItem.item });
    });

    it('applyActiveItem: should apply `true` for the serieList item that matches with `index`', () => {
      const index = 0;
      component.seriesPathsCoordinates = [
        { coordinates: ' M93 21 L136 14 L178 8', color: '#29B6C5', isActive: false },
        { coordinates: ' M120 22 L22 70 L200 8', color: 'red', isActive: false }
      ];
      const expectedResult = [
        { coordinates: ' M93 21 L136 14 L178 8', color: '#29B6C5', isActive: true },
        { coordinates: ' M120 22 L22 70 L200 8', color: 'red', isActive: false }
      ];

      component['applyActiveItem'](component.seriesPathsCoordinates, index);

      expect(component.seriesPathsCoordinates).toEqual(expectedResult);
    });

    it('applyActiveItem: should apply `true` for each serieList item if index is undefined', () => {
      component.seriesPathsCoordinates = [
        { coordinates: ' M93 21 L136 14 L178 8', color: '#29B6C5', isActive: false },
        { coordinates: ' M120 22 L22 70 L200 8', color: 'red', isActive: false }
      ];
      const expectedResult = [
        { coordinates: ' M93 21 L136 14 L178 8', color: '#29B6C5', isActive: true },
        { coordinates: ' M120 22 L22 70 L200 8', color: 'red', isActive: true }
      ];

      component['applyActiveItem'](component.seriesPathsCoordinates);

      expect(component.seriesPathsCoordinates).toEqual(expectedResult);
    });

    it('getMouseCoordinates: should call `svgPoint.matrixTransform`', () => {
      const fakeEvent = {
        preventDefault: () => {},
        clientX: 100,
        clientY: 100
      };
      component.svgSpace = {
        svgDomMatrix: { a: 50, b: 50, c: 50, d: 0, e: 0, f: 0 },
        svgPoint: { x: undefined, y: undefined, matrixTransform: arg => {} }
      };

      const spyMatrixTransform = spyOn(component.svgSpace.svgPoint, <any>'matrixTransform');
      const spyPreventDefault = spyOn(fakeEvent, <any>'preventDefault');

      component['getMouseCoordinates'](<any>fakeEvent);

      expect(spyMatrixTransform).toHaveBeenCalledWith(component.svgSpace.svgDomMatrix);
      expect(spyPreventDefault).toHaveBeenCalled();
    });

    it('should call `applyActiveItem` with seriesPointCoordinatesIndex', fakeAsync(() => {
      const seriesIndex = 0;
      component.categoriesCoordinates = [0, 40, 80, 120];
      component.seriesPointsCoordinates = [
        [
          {
            category: undefined,
            color: 'blue',
            label: 'Vancouver',
            tooltipLabel: 'Vancouver: 5',
            data: 5,
            xCoordinate: 104,
            yCoordinate: 24,
            isActive: true
          }
        ]
      ];

      const spyGetMouseCoordinates = spyOn(component, <any>'getMouseCoordinates').and.returnValue({ x: 70, y: 35 });
      const spyApplyActiveItem = spyOn(component, <any>'applyActiveItem');

      const expectedSeriesPointIndex = 1;

      component['initializeListener'](seriesIndex);

      nativeElement.dispatchEvent(mouseEvent);

      tick(50);

      expect(spyGetMouseCoordinates).toHaveBeenCalled();
      expect(spyApplyActiveItem).toHaveBeenCalledWith(component.seriesPointsCoordinates[0], expectedSeriesPointIndex);
    }));

    it('shouldn`t call `applyActiveItem` if `verifyActiveArea` returns undefined', fakeAsync(() => {
      const seriesIndex = 0;

      component.categoriesCoordinates = [0, 40, 80, 120];
      component.seriesPointsCoordinates = [
        [
          {
            category: undefined,
            color: 'blue',
            label: 'Vancouver',
            tooltipLabel: 'Vancouver: 5',
            data: 5,
            xCoordinate: 104,
            yCoordinate: 24,
            isActive: true
          }
        ]
      ];

      const spyGetMouseCoordinates = spyOn(component, <any>'getMouseCoordinates').and.returnValue({ x: 0, y: 35 });
      const spyVerifyActiveArea = spyOn(component, <any>'verifyActiveArea').and.returnValue(undefined);
      const spyApplyActiveItem = spyOn(component, <any>'applyActiveItem');

      component['initializeListener'](seriesIndex);

      nativeElement.dispatchEvent(mouseEvent);

      tick(50);

      expect(spyGetMouseCoordinates).toHaveBeenCalled();
      expect(spyVerifyActiveArea).toHaveBeenCalled();
      expect(spyApplyActiveItem).not.toHaveBeenCalled();
    }));

    it('removeListener: should call mouseMoveSubscription$.unsubscribe', () => {
      const fakeThis = {
        mouseMoveSubscription$: {
          unsubscribe: () => {}
        }
      };

      spyOn(fakeThis.mouseMoveSubscription$, 'unsubscribe');

      component['removeListener'].apply(fakeThis);

      expect(fakeThis['mouseMoveSubscription$'].unsubscribe).toHaveBeenCalled();
    });

    it('verifyActiveArea: should return undefined if `currentActiveSerieIndex` has same value than `previousActiveSerieIndex`', () => {
      const pointPosition = { x: 42, y: 20 };
      component['previousActiveSerieIndex'] = 1;
      component.categoriesCoordinates = [0, 40, 80, 120];

      expect(component['verifyActiveArea'](<any>pointPosition)).toBeUndefined();
    });
  });
});
