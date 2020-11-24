import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartModule } from '../../po-chart.module';
import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';
import { PoChartBarBaseComponent } from './po-chart-bar-base.component';

import { PoChartBarComponent } from './po-chart-bar.component';

describe('PoChartBarComponent', () => {
  let component: PoChartBarComponent;
  let fixture: ComponentFixture<PoChartBarComponent>;

  const containerSize: PoChartContainerSize = {
    svgWidth: 200,
    svgHeight: 200,
    svgPlottingAreaWidth: 20,
    svgPlottingAreaHeight: 20
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoChartModule],
      declarations: [PoChartBarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartBarComponent);
    component = fixture.componentInstance;
    component.containerSize = containerSize;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component instanceof PoChartBarBaseComponent).toBeTruthy();
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    describe('barCoordinates:', () => {
      it('should call `calculateElementsMeasurements`, `xCoordinates` and `yCoordinates`', () => {
        const seriesIndex = 0;
        const serieItemDataIndex = 0;
        const minMaxSeriesValues = { minValue: 1, maxValue: 30 };
        const serieValue = 1;

        component.series = [
          { label: 'category', data: [-10, 2, 3] },
          { label: 'category B', data: [10, 20, 30] }
        ];

        const spyCalculateElementsMeasurements = spyOn(
          component,
          <any>'calculateElementsMeasurements'
        ).and.callThrough();
        const spyXCoordinates = spyOn(component, <any>'xCoordinates').and.callThrough();
        const spyYCoordinates = spyOn(component, <any>'yCoordinates').and.callThrough();

        component['barCoordinates'](
          seriesIndex,
          serieItemDataIndex,
          component.containerSize,
          minMaxSeriesValues,
          serieValue
        );

        expect(spyCalculateElementsMeasurements).toHaveBeenCalled();
        expect(spyXCoordinates).toHaveBeenCalled();
        expect(spyYCoordinates).toHaveBeenCalled();
      });

      it('should return a string containing the coordinates:', () => {
        const seriesIndex = 0;
        const serieItemDataIndex = 0;
        const minMaxSeriesValues = { minValue: 1, maxValue: 30 };
        const serieValue = 1;

        component.series = [
          { label: 'category', data: [1, 2, 3] },
          { label: 'category B', data: [10, 20, 30] }
        ];

        const expectedResult = component['barCoordinates'](
          seriesIndex,
          serieItemDataIndex,
          component.containerSize,
          minMaxSeriesValues,
          serieValue
        );
        expect(expectedResult).toBe('M 72 12 L 72 12 L 72 10 L 72 10 z');
      });

      it('should consider serieValue as 0 for calculations if it is a negative value', () => {
        component.series = [
          { label: 'category', data: [-10, 2, 3] },
          { label: 'category B', data: [10, 20, 30] }
        ];
        const seriesIndex = 0;
        const serieItemDataIndex = 0;
        const minMaxSeriesValues = { minValue: 0, maxValue: 30 };
        const serieValue = -10;

        const expectedResult = component['barCoordinates'](
          seriesIndex,
          serieItemDataIndex,
          component.containerSize,
          minMaxSeriesValues,
          serieValue
        );
        expect(expectedResult).toBe('M 72 12 L 72 12 L 72 10 L 72 10 z');
      });

      it('shouldn`t subctract spaceBetweenBars calculation from X coordinate if series.length is lower than 2', () => {
        const seriesIndex = 0;
        const serieItemDataIndex = 0;
        const minMaxSeriesValues = { minValue: 1, maxValue: 3 };
        const serieValue = 1;

        component.series = [{ label: 'category', data: [1, 2, 3] }];

        const expectedResult = component['barCoordinates'](
          seriesIndex,
          serieItemDataIndex,
          component.containerSize,
          minMaxSeriesValues,
          serieValue
        );
        expect(expectedResult).toBe('M 72 12 L 72 12 L 72 10 L 72 10 z');
      });
    });
  });
});
