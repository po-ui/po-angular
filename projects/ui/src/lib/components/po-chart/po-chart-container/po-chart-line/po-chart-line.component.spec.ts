import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartModule } from '../../po-chart.module';

import { PoChartLineComponent } from './po-chart-line.component';
import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';

describe('PoChartLineComponent', () => {
  let component: PoChartLineComponent;
  let fixture: ComponentFixture<PoChartLineComponent>;

  const series = [
    { label: 'category', data: [1, 2, 3], color: '#94DAE2' },
    { label: 'category B', data: [10, 20, 30], color: '#29B6C5' }
  ];
  const containerSize: PoChartContainerSize = {
    svgWidth: 200,
    svgHeight: 200,
    axisXLabelWidth: 72,
    svgPlottingAreaHeight: 20
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoChartModule],
      declarations: [PoChartLineComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartLineComponent);
    component = fixture.componentInstance;
    component.series = series;
    component.containerSize = containerSize;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('onSeriePointHover: should emit `pointHover` and call `reorderSVGGroup`', () => {
      const selectedItem = { relativeTo: 'po-chart-path-1', label: 'Vancouver', data: 200 };

      const spyReorderSVGGroup = spyOn(component, <any>'reorderSVGGroup');
      const spyPointHover = spyOn(component.pointHover, 'emit');

      component.onSeriePointHover(selectedItem);

      expect(spyPointHover).toHaveBeenCalledWith({ label: 'Vancouver', data: 200 });
      expect(spyReorderSVGGroup).toHaveBeenCalledWith('po-chart-path-1');
    });

    it('onEnter: should return null', () => {
      expect(component.onEnter(0)).toBeNull();
    });

    it('onLeave: should return null', () => {
      expect(component.onLeave(0)).toBeNull();
    });

    it('reorderSVGGroup: should apply false to `animate` and call `renderer.appendChild` and `querySelectorAll`', () => {
      const pathGroup = 'po-chart-line-path-group-0';

      const spyAppendChild = spyOn(component['renderer'], 'appendChild');

      component['reorderSVGGroup'](pathGroup);

      expect(component.animate).toBeFalsy();
      expect(spyAppendChild).toHaveBeenCalled();
    });

    it('ngOnChanges: should set `isBlur` to false for all items in `seriesPathsCoordinates` when `insideChart` is false', () => {
      component.seriesPathsCoordinates = [
        { coordinates: 'M10 10', color: '#29B6C5', isBlur: true },
        { coordinates: 'M20 20', color: '#94DAE2', isBlur: true }
      ];

      const changes = {
        insideChart: {
          currentValue: false,
          previousValue: true,
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.ngOnChanges(changes);

      expect(component.seriesPathsCoordinates[0].isBlur).toBeFalse();
      expect(component.seriesPathsCoordinates[1].isBlur).toBeFalse();
    });

    it('onEnter: should update `selectedPath`, call `onLeave`, and set `isBlur` to true for non-selected paths if `dataLabel?.fixed` is true', () => {
      const spyOnLeave = spyOn(component, 'onLeave').and.callThrough();
      component.seriesPathsCoordinates = [
        { coordinates: 'M10 10', color: '#29B6C5', isBlur: false },
        { coordinates: 'M20 20', color: '#94DAE2', isBlur: false }
      ];
      component.dataLabel = { fixed: true };

      component.onEnter(1);

      expect(spyOnLeave).toHaveBeenCalledWith(1);
      expect(component.selectedPath).toEqual(component.seriesPathsCoordinates[1]);
      expect(component.seriesPathsCoordinates[0].isBlur).toBeTrue();
      expect(component.seriesPathsCoordinates[1].isBlur).toBeFalse();
    });

    it('onLeave: should set `isBlur` to false for all items in `seriesPathsCoordinates` if `dataLabel?.fixed` is true', () => {
      component.seriesPathsCoordinates = [
        { coordinates: 'M10 10', color: '#29B6C5', isBlur: true },
        { coordinates: 'M20 20', color: '#94DAE2', isBlur: true }
      ];
      component.dataLabel = { fixed: true };

      component.onLeave(1);

      expect(component.seriesPathsCoordinates[0].isBlur).toBeFalse();
      expect(component.seriesPathsCoordinates[1].isBlur).toBeFalse();
    });

    it('ngOnChanges: should not modify `isBlur` if `insideChart` is true', () => {
      component.insideChart = true;
      component.seriesPathsCoordinates = [{ isBlur: true }, { isBlur: true }];

      const changes = { insideChart: { currentValue: true, previousValue: false, firstChange: false } };

      component.ngOnChanges(<any>changes);

      // Verificar que `isBlur` permanece inalterado
      expect(component.seriesPathsCoordinates.every(item => item.isBlur)).toBe(true);
    });
  });
});
