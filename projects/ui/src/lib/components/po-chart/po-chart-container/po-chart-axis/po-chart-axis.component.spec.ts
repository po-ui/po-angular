import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartAxisOptions } from '../../interfaces/po-chart-axis-options.interface';
import { PoChartMinMaxValues } from '../../interfaces/po-chart-min-max-values.interface';
import { PoChartPathCoordinates } from '../../interfaces/po-chart-path-coordinates.interface';

import { PoChartModule } from '../../po-chart.module';
import { PoChartAxisComponent } from './po-chart-axis.component';
import { PoChartType } from '../../enums/po-chart-type.enum';

describe('PoChartAxisComponent', () => {
  let component: PoChartAxisComponent;
  let fixture: ComponentFixture<PoChartAxisComponent>;
  let nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoChartModule],
      declarations: [PoChartAxisComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartAxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.range = { minValue: 1, maxValue: 3 };
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties: ', () => {
    describe('p-align-by-the-corners: ', () => {
      it('should apply false default value to `alignByTheCorners`', () => {
        expect(component.alignByTheCorners).toBeFalse();
      });
    });
    describe('p-series: ', () => {
      it('should call `mathsService.seriesGreaterLength` and apply value to `seriesLength`', () => {
        const fakeSeries = [{ label: 'test 1', data: [1, 2, 3] }];
        const fakeSeriesLength = 3;
        spyOn(component['mathsService'], 'seriesGreaterLength').and.returnValue(fakeSeriesLength);

        component.series = fakeSeries;

        expect(component['mathsService'].seriesGreaterLength).toHaveBeenCalledWith(fakeSeries);
        expect(component['seriesLength']).toEqual(fakeSeriesLength);
      });

      it('should call `checkAxisOptions', () => {
        const fakeSeries = [{ label: 'test 1', data: [1, 2, 3] }];
        const fakeAxisOptions: PoChartAxisOptions = {
          minRange: 0,
          maxRange: 100,
          gridLines: 5
        };
        const fakeMinMaxAxisValues: PoChartMinMaxValues = {
          minValue: 1,
          maxValue: 3
        };

        spyOn(component, <any>'checkAxisOptions');

        component['minMaxAxisValues'] = fakeMinMaxAxisValues;
        component.axisOptions = fakeAxisOptions;
        component.series = fakeSeries;

        expect(component['checkAxisOptions']).toHaveBeenCalledWith(fakeAxisOptions);
      });
    });

    describe('p-categories: ', () => {
      it('should call `setAxisYCoordinates` if type value is different than `Bar`', () => {
        component.series = [{ label: 'Label', data: [1, 2, 3], type: PoChartType.Line }];
        component.type = PoChartType.Line;

        const fakeContainerSize = {
          svgWidth: 500,
          centerX: 250,
          svgHeight: 300,
          centerY: 150,
          axisXLabelWidth: 72,
          svgPlottingAreaHeight: 280
        };
        const fakeCategories = ['jan', 'fev', 'mar'];

        spyOn(component, <any>'setAxisXCoordinates');

        component.containerSize = fakeContainerSize;
        component.categories = fakeCategories;

        expect(component['setAxisXCoordinates']).toHaveBeenCalledWith(
          component['gridLines'],
          component['seriesLength'],
          fakeContainerSize,
          component.range,
          component.type
        );
        expect(component.categories).toEqual(fakeCategories);
      });

      it('should call `setAxisXCoordinates` if type value is `Bar`', () => {
        component.series = [{ label: 'Label', data: [1, 2, 3] }];
        component.type = PoChartType.Bar;

        const fakeSeriesLength = 1;
        const fakeContainerSize = {
          svgWidth: 500,
          centerX: 250,
          svgHeight: 300,
          centerY: 150,
          axisXLabelWidth: 72,
          svgPlottingAreaHeight: 280
        };
        const fakeCategories = ['jan', 'fev', 'mar'];

        spyOn(component, <any>'setAxisXCoordinates');
        spyOn(component, <any>'setAxisYCoordinates');

        component['seriesLength'] = fakeSeriesLength;
        component.containerSize = fakeContainerSize;
        component.categories = fakeCategories;

        expect(component['setAxisXCoordinates']).toHaveBeenCalledWith(
          component['gridLines'],
          fakeSeriesLength,
          fakeContainerSize,
          component.range,
          component.type
        );
        expect(component.categories).toEqual(fakeCategories);
      });
    });

    describe('p-container-size: ', () => {
      it('should call `checkAxisOptions`, `setAxisXCoordinates` and `setAxisYCoordinates`', () => {
        const fakeContainerSize = {
          svgWidth: 500,
          centerX: 250,
          svgHeight: 300,
          centerY: 150,
          axisXLabelWidth: 72,
          svgPlottingAreaHeight: 280
        };

        spyOn(component, <any>'checkAxisOptions');
        spyOn(component, <any>'setAxisXCoordinates');
        spyOn(component, <any>'setAxisYCoordinates');

        component.containerSize = fakeContainerSize;

        expect(component['checkAxisOptions']).toHaveBeenCalled();
        expect(component['setAxisXCoordinates']).toHaveBeenCalled();
        expect(component['setAxisYCoordinates']).toHaveBeenCalled();
      });
    });

    describe('p-options: ', () => {
      it('should call `checkAxisOptions` and `setAxisYCoordinates` if type is Bar', () => {
        const fakeSeriesLength = 0;
        const fakeGridLines = 5;
        const fakeMinMaxAxisValues: PoChartMinMaxValues = {
          minValue: 1,
          maxValue: 3
        };
        const fakeAxisOptions: PoChartAxisOptions = {
          minRange: 0,
          maxRange: 100,
          gridLines: 5
        };
        const fakeContainerSize = {
          svgWidth: 500,
          centerX: 250,
          svgHeight: 300,
          centerY: 150,
          axisXLabelWidth: 72,
          svgPlottingAreaHeight: 280
        };

        spyOn(component, <any>'checkAxisOptions');
        spyOn(component, <any>'setAxisXCoordinates');
        spyOn(component, <any>'setAxisYCoordinates');

        component.type = PoChartType.Bar;
        component['minMaxAxisValues'] = fakeMinMaxAxisValues;
        component['gridLines'] = fakeGridLines;
        component.containerSize = fakeContainerSize;
        component.axisOptions = fakeAxisOptions;

        expect(component['checkAxisOptions']).toHaveBeenCalledWith(fakeAxisOptions);
        expect(component['setAxisYCoordinates']).toHaveBeenCalledWith(
          component['gridLines'],
          fakeSeriesLength,
          fakeContainerSize,
          fakeMinMaxAxisValues,
          component.type
        );
      });

      it('should call `checkAxisOptions` and `setAxisXCoordinates` if type is different than Bar', () => {
        const fakeSeriesLength = 0;
        const fakeGridLines = 5;
        const fakeMinMaxAxisValues: PoChartMinMaxValues = {
          minValue: 1,
          maxValue: 3
        };
        const fakeAxisOptions: PoChartAxisOptions = {
          minRange: 0,
          maxRange: 100,
          gridLines: 5
        };
        const fakeContainerSize = {
          svgWidth: 500,
          centerX: 250,
          svgHeight: 300,
          centerY: 150,
          axisXLabelWidth: 72,
          svgPlottingAreaHeight: 280
        };

        spyOn(component, <any>'checkAxisOptions');
        spyOn(component, <any>'setAxisXCoordinates');
        spyOn(component, <any>'setAxisYCoordinates');

        component.type = PoChartType.Line;
        component['minMaxAxisValues'] = fakeMinMaxAxisValues;
        component['gridLines'] = fakeGridLines;
        component.containerSize = fakeContainerSize;
        component.axisOptions = fakeAxisOptions;

        expect(component['checkAxisOptions']).toHaveBeenCalledWith(fakeAxisOptions);
        expect(component['setAxisXCoordinates']).toHaveBeenCalledWith(
          component['gridLines'],
          fakeSeriesLength,
          fakeContainerSize,
          fakeMinMaxAxisValues,
          component.type
        );
      });
    });
  });

  describe('Methods', () => {
    it(`setAxisXCoordinates: should call 'calculateAxisXCoordinates' and 'calculateAxisXLabelCoordinates' passing 'seriesLength' as argument if type is Bar`, () => {
      const gridLines = 5;
      const seriesLength = 3;
      const containerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const minMaxAxisValues: PoChartMinMaxValues = {
        minValue: 1,
        maxValue: 3
      };
      const type = PoChartType.Bar;

      const spyCalculateAxisXCoordinates = spyOn(component, <any>'calculateAxisXCoordinates');
      const spyCalculateAxisXLabelCoordinates = spyOn(component, <any>'calculateAxisXLabelCoordinates');

      component['setAxisXCoordinates'](gridLines, seriesLength, containerSize, minMaxAxisValues, type);

      expect(spyCalculateAxisXCoordinates).toHaveBeenCalledWith(seriesLength + 1, containerSize, minMaxAxisValues);
      expect(spyCalculateAxisXLabelCoordinates).toHaveBeenCalledWith(
        seriesLength,
        containerSize,
        minMaxAxisValues,
        type
      );
    });

    it(`setAxisXCoordinates: should call 'calculateAxisXCoordinates' and 'calculateAxisXLabelCoordinates' passing 'gridLines' as argument if type is Bar`, () => {
      const gridLines = 5;
      const seriesLength = 3;
      const containerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const minMaxAxisValues: PoChartMinMaxValues = {
        minValue: 1,
        maxValue: 3
      };
      const type = PoChartType.Line;

      const spyCalculateAxisXCoordinates = spyOn(component, <any>'calculateAxisXCoordinates');
      const spyCalculateAxisXLabelCoordinates = spyOn(component, <any>'calculateAxisXLabelCoordinates');

      component['setAxisXCoordinates'](gridLines, seriesLength, containerSize, minMaxAxisValues, type);

      expect(spyCalculateAxisXCoordinates).toHaveBeenCalledWith(gridLines, containerSize, minMaxAxisValues);
      expect(spyCalculateAxisXLabelCoordinates).toHaveBeenCalledWith(gridLines, containerSize, minMaxAxisValues, type);
    });

    it('calculateAxisXLabelCoordinates: should apply value to `axisXLabelCoordinates`', () => {
      const amountOfAxisX = 2;
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const fakeMinMaxAxisValues: PoChartMinMaxValues = {
        minValue: 1,
        maxValue: 3
      };
      const expectedResult: any = [
        { label: '1', xCoordinate: 64, yCoordinate: 288 },
        { label: '3', xCoordinate: 64, yCoordinate: 8 }
      ];
      const type = PoChartType.Column;

      spyOn(component, <any>'calculateAxisXLabelXCoordinate').and.callThrough();
      spyOn(component, <any>'calculateAxisXLabelYCoordinate').and.callThrough();

      component['calculateAxisXLabelCoordinates'](amountOfAxisX, fakeContainerSize, fakeMinMaxAxisValues, type);

      expect(component['calculateAxisXLabelXCoordinate']).toHaveBeenCalled();
      expect(component['calculateAxisXLabelYCoordinate']).toHaveBeenCalled();
      expect(component.axisXLabelCoordinates).toEqual(expectedResult);
    });

    it('calculateAxisXLabelCoordinates: should apply value to `axisXLabelCoordinates` considering that type is Bar', () => {
      component.categories = [];
      const amountOfAxisX = 2;
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const fakeMinMaxAxisValues: PoChartMinMaxValues = {
        minValue: 1,
        maxValue: 3
      };
      const type = PoChartType.Bar;
      const expectedResult: any = [
        { label: '-', xCoordinate: 64, yCoordinate: 218 },
        { label: '-', xCoordinate: 64, yCoordinate: 78 }
      ];

      component['calculateAxisXLabelCoordinates'](amountOfAxisX, fakeContainerSize, fakeMinMaxAxisValues, type);

      expect(component.axisXLabelCoordinates).toEqual(expectedResult);
    });

    it('generateAverageOfLabels: should return a list with formatted values', () => {
      const amountOfAxisLines = 5;
      const minMaxAxisValues: PoChartMinMaxValues = { minValue: 1, maxValue: 3 };
      const expectedResult = ['1', '1.50', '2', '2.50', '3'];

      expect(component['generateAverageOfLabels'](minMaxAxisValues, amountOfAxisLines)).toEqual(expectedResult);
    });

    it(`setAxisYCoordinates: should call 'calculateAxisYCoordinates' and 'calculateAxisYLabelCoordinates' passing 'gridLines' as argument if type is Bar`, () => {
      const gridLines = 5;
      const seriesLength = 3;
      const containerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      component.range = {
        minValue: 1,
        maxValue: 3
      };
      const type = PoChartType.Bar;

      const spyCalculateAxisYCoordinates = spyOn(component, <any>'calculateAxisYCoordinates');
      const spyCalculateAxisYLabelCoordinates = spyOn(component, <any>'calculateAxisYLabelCoordinates');

      component['setAxisYCoordinates'](gridLines, seriesLength, containerSize, component.range, type);

      expect(spyCalculateAxisYCoordinates).toHaveBeenCalledWith(gridLines, containerSize, type, component.range);
      expect(spyCalculateAxisYLabelCoordinates).toHaveBeenCalledWith(gridLines, containerSize, component.range, type);
    });

    it(`setAxisYCoordinates: should call 'calculateAxisYCoordinates' and 'calculateAxisYLabelCoordinates' passing 'seriesLength' as argument if type is Bar`, () => {
      const gridLines = 5;
      const seriesLength = 3;
      const containerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const type = PoChartType.Line;

      const spyCalculateAxisYCoordinates = spyOn(component, <any>'calculateAxisYCoordinates');
      const spyCalculateAxisYLabelCoordinates = spyOn(component, <any>'calculateAxisYLabelCoordinates');

      component['setAxisYCoordinates'](gridLines, seriesLength, containerSize, component.range, type);

      expect(spyCalculateAxisYCoordinates).toHaveBeenCalledWith(seriesLength, containerSize, type, component.range);
      expect(spyCalculateAxisYLabelCoordinates).toHaveBeenCalledWith(
        seriesLength,
        containerSize,
        component.range,
        type
      );
    });

    it(`setAxisYCoordinates: should call 'calculateAxisYCoordinates' and 'calculateAxisYLabelCoordinates' passing 'seriesLength' as argument if type is Bar`, () => {
      const gridLines = 5;
      const seriesLength = 3;
      const containerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const type = PoChartType.Area;

      const spyCalculateAxisYCoordinates = spyOn(component, <any>'calculateAxisYCoordinates');
      const spyGetCategoriesRangeForMouseMove = spyOn(component, <any>'getCategoriesRangeForMouseMove');
      const spyCalculateAxisYLabelCoordinates = spyOn(component, <any>'calculateAxisYLabelCoordinates');

      component['setAxisYCoordinates'](gridLines, seriesLength, containerSize, component.range, type);

      expect(spyCalculateAxisYCoordinates).toHaveBeenCalledWith(seriesLength, containerSize, type, component.range);
      expect(spyCalculateAxisYLabelCoordinates).toHaveBeenCalledWith(
        seriesLength,
        containerSize,
        component.range,
        type
      );
      expect(spyGetCategoriesRangeForMouseMove).toHaveBeenCalledWith(seriesLength, containerSize);
    });

    it('calculateAxisYCoordinates: should call `calculateAxisYCoordinateX` once if type is `Bar` and apply value to `axisYCoordinates`', () => {
      const amountOfAxisY = 2;
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const expectedResult: Array<PoChartPathCoordinates> = [
        { coordinates: 'M72 8 L72, 288' },
        { coordinates: 'M500 8 L500, 288' },
        { coordinates: 'M157 8 L157 288' }
      ];
      const type = PoChartType.Bar;

      component.range = { minValue: -30, maxValue: 120 };
      component['alignByTheCorners'] = true;

      spyOn(component, <any>'calculateAxisYCoordinateX').and.callThrough();
      spyOn(component, <any>'getCoordinatesRelatedToZero').and.callThrough();

      component['calculateAxisYCoordinates'](amountOfAxisY, fakeContainerSize, type, component.range);

      expect(component['calculateAxisYCoordinateX']).toHaveBeenCalledTimes(2);
      expect(component['getCoordinatesRelatedToZero']).toHaveBeenCalled();
      expect(component.axisYCoordinates).toEqual(expectedResult);
    });

    it('calculateAxisYCoordinates: should call `calculateAxisYCoordinateX` twice if type is different than `Bar` and apply value to `axisYCoordinates`', () => {
      const amountOfAxisY = 1;
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const expectedResult: Array<PoChartPathCoordinates> = [
        { coordinates: 'Mundefined 8 Lundefined, 288' },
        { coordinates: 'Mundefined 8 Lundefined, 288' }
      ];
      const type = PoChartType.Line;

      spyOn(component, <any>'calculateAxisYCoordinateX');

      component['calculateAxisYCoordinates'](amountOfAxisY, fakeContainerSize, type, component.range);

      expect(component['calculateAxisYCoordinateX']).toHaveBeenCalledTimes(2);
      expect(component.axisYCoordinates).toEqual(expectedResult);
    });

    it('calculateAxisYLabelCoordinates: should call `centeredInCategoryArea` and `calculateAxisYLabelYCoordinate`', () => {
      component.categories = [];
      const amountOfAxisY = 2;
      const fakeMinMaxAxisValues: PoChartMinMaxValues = {
        minValue: 1,
        maxValue: 3
      };
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const expectedResult = [
        { label: '-', xCoordinate: 0, yCoordinate: 0 },
        { label: '-', xCoordinate: 0, yCoordinate: 0 }
      ];
      const type = PoChartType.Column;

      spyOn(component, <any>'centeredInCategoryArea').and.returnValue(0);
      spyOn(component, <any>'calculateAxisYLabelYCoordinate').and.returnValue(0);

      component['calculateAxisYLabelCoordinates'](amountOfAxisY, fakeContainerSize, fakeMinMaxAxisValues, type);

      expect(component['centeredInCategoryArea']).toHaveBeenCalled();
      expect(component['calculateAxisYLabelYCoordinate']).toHaveBeenCalled();
      expect(component.axisYLabelCoordinates).toEqual(expectedResult);
    });

    it('calculateAxisXLabelXCoordinate: should return the result of `PoChartAxisXLabelArea` - `labelPoChartPadding`', () => {
      const expectedResult = 64;
      const axisXLabelWidth = 72;

      const result = component['calculateAxisXLabelXCoordinate'](axisXLabelWidth);

      expect(result).toEqual(expectedResult);
    });

    it('calculateAxisXCoordinateY: should return the calculation result considering that type is Bar', () => {
      const expectedResult = 218;
      const amountOfAxisX = 5;
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const fakeIndex = 1;

      const result = component['calculateAxisXCoordinateY'](amountOfAxisX, fakeContainerSize, fakeIndex);

      expect(result).toEqual(expectedResult);
    });

    it('calculateAxisXCoordinateY: should return the calculation result considering that type isn`t Bar', () => {
      const expectedResult = 218;
      const amountOfAxisX = 5;
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const fakeIndex = 1;

      const result = component['calculateAxisXCoordinateY'](amountOfAxisX, fakeContainerSize, fakeIndex);

      expect(result).toEqual(expectedResult);
    });

    it('calculateAxisYLabelYCoordinate: should return the result of `containerSize.svgHeight` - `textPoChartPadding`', () => {
      const expectedResult = 292;
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };

      const result = component['calculateAxisYLabelYCoordinate'](fakeContainerSize);

      expect(result).toEqual(expectedResult);
    });

    it(`centeredInCategoryArea: should return the result of the equation considering that type is Bar'`, () => {
      const expectedResult = 158;
      const amountOfAxisY = 6;
      const type = PoChartType.Bar;
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const fakeIndex = 1;

      const result = component['centeredInCategoryArea'](fakeContainerSize, amountOfAxisY, type, fakeIndex);

      expect(result).toEqual(expectedResult);
    });

    it(`centeredInCategoryArea: should return the result of the equation considering that type isn't Bar'`, () => {
      const expectedResult = 179;
      const amountOfAxisY = 6;
      const type = PoChartType.Line;
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const fakeIndex = 1;

      const result = component['centeredInCategoryArea'](fakeContainerSize, amountOfAxisY, type, fakeIndex);

      expect(result).toEqual(expectedResult);
    });

    it(`calculateAxisYCoordinateX: should return the result of equation considering that type is 'Bar'`, () => {
      const expectedResult = 158;
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const fakeIndex = 1;
      const amountOfAxisY = 6;

      component['alignByTheCorners'] = true;

      const result = component['calculateAxisYCoordinateX'](fakeContainerSize, amountOfAxisY, fakeIndex);

      expect(result).toEqual(expectedResult);
    });

    it(`calculateAxisYCoordinateX: should return the result of equation considering that type isn't 'Bar'`, () => {
      const expectedResult = 143;
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const fakeIndex = 1;
      const amountOfAxisY = 6;

      const result = component['calculateAxisYCoordinateX'](fakeContainerSize, amountOfAxisY, fakeIndex);

      expect(result).toEqual(expectedResult);
    });

    it(`calculateAxisYCoordinateX: should return the result of equation considering that type isn't 'Bar' and 'amountOfAxisX' is 0`, () => {
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const fakeIndex = 1;
      const amountOfAxisY = 0;
      const expectedResult = 72;

      const result = component['calculateAxisYCoordinateX'](fakeContainerSize, amountOfAxisY, fakeIndex);

      expect(result).toEqual(expectedResult);
    });

    it(`calculateAxisYCoordinateX: should return the result of equation considering that 'alignByTheCorners' and 'subtractCategoryWidth' are true`, () => {
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const fakeIndex = 1;
      const amountOfAxisY = 0;
      const expectedResult = -142;
      const fakeSubtractCategoryWidth = true;

      component['alignByTheCorners'] = true;

      const result = component['calculateAxisYCoordinateX'](
        fakeContainerSize,
        amountOfAxisY,
        fakeIndex,
        fakeSubtractCategoryWidth
      );

      expect(result).toEqual(expectedResult);
    });

    it('isValidGridLinesLengthOption: should return true', () => {
      const fakeGridLines = 5;

      const result = component['isValidGridLinesLengthOption'](fakeGridLines);

      expect(result).toBeTrue();
    });

    it('isValidGridLinesLengthOption: should return true', () => {
      const fakeGridLines = 11;

      const result = component['isValidGridLinesLengthOption'](fakeGridLines);

      expect(result).toBeFalse();
    });

    describe('checkAxisOptions: ', () => {
      it('should apply `options.gridLines` value to `gridLines`', () => {
        const fakeOptions: PoChartAxisOptions = {
          maxRange: 4,
          minRange: 0,
          gridLines: 2
        };

        spyOn(component, <any>'isValidGridLinesLengthOption').and.returnValue(true);

        component['checkAxisOptions'](fakeOptions);

        expect(component['gridLines']).toEqual(fakeOptions.gridLines);
      });

      it('should apply `PoChartridLines` value to `gridLines`', () => {
        const fakeOptions: PoChartAxisOptions = {
          maxRange: 4,
          minRange: 0,
          gridLines: 1
        };
        const expectedValue = 5;

        spyOn(component, <any>'isValidGridLinesLengthOption').and.returnValue(false);

        component['checkAxisOptions'](fakeOptions);

        expect(component['gridLines']).toEqual(expectedValue);
      });
    });

    describe('getAxisXCoordinates: ', () => {
      it('getAxisXCoordinates: shold call `calculateAxisYCoordinateX` if `alignByTheCorners` is true', () => {
        const fakeContainerSize = {
          svgWidth: 500,
          centerX: 250,
          svgHeight: 300,
          centerY: 150,
          axisXLabelWidth: 72,
          svgPlottingAreaHeight: 280
        };
        const fakeIndex = 1;
        const amountOfAxisY = 0;
        const type = PoChartType.Column;

        spyOn(component, <any>'calculateAxisYCoordinateX');
        spyOn(component, <any>'centeredInCategoryArea');

        component['alignByTheCorners'] = true;

        component['getAxisXCoordinates'](fakeContainerSize, amountOfAxisY, type, fakeIndex);

        expect(component['calculateAxisYCoordinateX']).toHaveBeenCalledWith(
          fakeContainerSize,
          amountOfAxisY,
          fakeIndex
        );
        expect(component['centeredInCategoryArea']).not.toHaveBeenCalledWith(
          fakeContainerSize,
          amountOfAxisY,
          type,
          fakeIndex
        );
      });

      it('getAxisXCoordinates: shold call `centeredInCategoryArea` if `alignByTheCorners` is false', () => {
        const fakeContainerSize = {
          svgWidth: 500,
          centerX: 250,
          svgHeight: 300,
          centerY: 150,
          axisXLabelWidth: 72,
          svgPlottingAreaHeight: 280
        };
        const fakeIndex = 1;
        const amountOfAxisY = 0;
        const type = PoChartType.Column;

        spyOn(component, <any>'calculateAxisYCoordinateX');
        spyOn(component, <any>'centeredInCategoryArea');

        component['alignByTheCorners'] = false;

        component['getAxisXCoordinates'](fakeContainerSize, amountOfAxisY, type, fakeIndex);

        expect(component['calculateAxisYCoordinateX']).not.toHaveBeenCalledWith(
          fakeContainerSize,
          amountOfAxisY,
          fakeIndex
        );
        expect(component['centeredInCategoryArea']).toHaveBeenCalledWith(
          fakeContainerSize,
          amountOfAxisY,
          type,
          fakeIndex
        );
      });
    });

    describe('getCategoriesRangeForMouseMove: ', () => {
      it('getCategoriesRangeForMouseMove: shold call `calculateAxisYCoordinateX`', () => {
        const fakeContainerSize = {
          svgWidth: 500,
          centerX: 250,
          svgHeight: 300,
          centerY: 150,
          axisXLabelWidth: 72,
          svgPlottingAreaHeight: 280
        };
        const fakeIndex = 0;
        const amountOfAxisY = 1;
        const fakeSubtractCategoryWidth = true;
        const result = {};

        spyOn(component, <any>'calculateAxisYCoordinateX').and.returnValue(result);
        spyOn(component.categoriesCoordinates, 'emit');

        component['alignByTheCorners'] = true;

        component['getCategoriesRangeForMouseMove'](amountOfAxisY, fakeContainerSize);

        expect(component['calculateAxisYCoordinateX']).toHaveBeenCalledWith(
          fakeContainerSize,
          amountOfAxisY,
          fakeIndex,
          fakeSubtractCategoryWidth
        );
        expect(component.categoriesCoordinates.emit).toHaveBeenCalled();
      });
    });

    it('getAxisXLabels: should call `formatCategoriesLabels` if type is `Bar`', () => {
      const type = PoChartType.Bar;
      const minMaxAxisValues: PoChartMinMaxValues = { minValue: 1, maxValue: 3 };
      const amountOfAxisX = 5;

      const spyFormatCategoriesLabels = spyOn(component, <any>'formatCategoriesLabels').and.returnValue(['-', '-']);

      component['getAxisXLabels'](type, minMaxAxisValues, amountOfAxisX);

      expect(spyFormatCategoriesLabels).toHaveBeenCalledWith(amountOfAxisX, component.categories);
    });

    it('formatCategoriesLabels: should return an array with 2 items', () => {
      const amountOfAxisX = 2;
      const categories = undefined;

      const expectedResult = component['formatCategoriesLabels'](amountOfAxisX, categories);

      expect(expectedResult).toEqual(['-', '-']);
    });

    it('getAxisXLabels: should call `generateAverageOfLabels` if type isn`t `Bar`', () => {
      const type = PoChartType.Column;
      const minMaxAxisValues: PoChartMinMaxValues = { minValue: 1, maxValue: 3 };
      const amountOfAxisX = 5;

      const spyGenerateAverageOfLabels = spyOn(component, <any>'generateAverageOfLabels');

      component['getAxisXLabels'](type, minMaxAxisValues, amountOfAxisX);

      expect(spyGenerateAverageOfLabels).toHaveBeenCalledWith(minMaxAxisValues, amountOfAxisX);
    });

    it('calculateAxisXCoordinates: should call calculateAxisXCoordinateY twice if type is Bar', () => {
      const amountOfAxisX = 2;
      const containerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const fakeMinMaxAxisValues: PoChartMinMaxValues = {
        minValue: 1,
        maxValue: 3
      };

      component['axisXLabels'] = ['-20', '11', '40'];

      const spyCalculateAxisXCoordinateY = spyOn(component, <any>'calculateAxisXCoordinateY').and.callThrough();

      component['calculateAxisXCoordinates'](amountOfAxisX, containerSize, fakeMinMaxAxisValues);

      expect(spyCalculateAxisXCoordinateY).toHaveBeenCalledTimes(2);
    });

    it('calculateAxisXCoordinates: should call calculateAxisXCoordinateY twice if type isn`t Bar', () => {
      const amountOfAxisX = 2;
      const containerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };
      const fakeMinMaxAxisValues: PoChartMinMaxValues = {
        minValue: 1,
        maxValue: 3
      };

      component['axisXLabels'] = ['-20', '11', '40'];

      const spyCalculateAxisXCoordinateY = spyOn(component, <any>'calculateAxisXCoordinateY').and.callThrough();

      component['calculateAxisXCoordinates'](amountOfAxisX, containerSize, fakeMinMaxAxisValues);

      expect(spyCalculateAxisXCoordinateY).toHaveBeenCalledTimes(2);
    });

    it('amountOfAxisXLines: should return `seriesLength` plus 1 if chart type is `Bar` and seriesLength is greater than 1', () => {
      const seriesLength = 2;
      const gridLines = 5;
      const type = PoChartType.Bar;

      const expectedResult = component['amountOfAxisXLines'](seriesLength, gridLines, type);

      expect(expectedResult).toBe(3);
    });

    it('amountOfAxisXLines: should return `2` if chart type is `Bar` and seriesLength is 1', () => {
      const seriesLength = 1;
      const gridLines = 5;
      const type = PoChartType.Bar;

      const expectedResult = component['amountOfAxisXLines'](seriesLength, gridLines, type);

      expect(expectedResult).toBe(2);
    });

    it('amountOfAxisXLines: should return `1` if chart type isn`t `Bar` and gridLines value is zero', () => {
      const seriesLength = 1;
      const gridLines = 0;
      const type = PoChartType.Line;

      const expectedResult = component['amountOfAxisXLines'](seriesLength, gridLines, type);

      expect(expectedResult).toBe(1);
    });

    it('amountOfAxisXLines: should return `gridLines` if chart type isn`t `Bar` and gridLines is different of zero', () => {
      const seriesLength = 1;
      const gridLines = 5;
      const type = PoChartType.Line;

      const expectedResult = component['amountOfAxisXLines'](seriesLength, gridLines, type);

      expect(expectedResult).toBe(5);
    });

    it('getAxisYLabels: should call `generateAverageOfLabels` if type is `Bar`', () => {
      component.series = [{ data: [1, 2, 3], label: 'Vancouver', type: PoChartType.Bar }];
      component.type = PoChartType.Bar;

      const spyGenerateAverageOfLabels = spyOn(component, <any>'generateAverageOfLabels');

      component['getAxisYLabels'](component.type, component['minMaxAxisValues'], 5);

      expect(spyGenerateAverageOfLabels).toHaveBeenCalled();
    });

    it('getCoordinatesRelatedToZero: should return the properly coordinates considering that type is Bar', () => {
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };

      const expectedResult = component['getCoordinatesRelatedToZero'](fakeContainerSize, component.range, 0, 10, true);

      expect(expectedResult).toEqual({ coordinates: 'M-142 0 L-142 10' });
    });

    it('getCoordinatesRelatedToZero: should return the properly coordinates considering that type isn`t Bar', () => {
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        axisXLabelWidth: 72,
        svgPlottingAreaHeight: 280
      };

      const expectedResult = component['getCoordinatesRelatedToZero'](fakeContainerSize, component.range, 0, 10, false);

      expect(expectedResult).toEqual({ coordinates: 'M0 428 L10 428' });
    });
  });

  describe('Template', () => {
    it(`should contain an extra axis X line related to value 'zero'`, () => {
      component.type = PoChartType.Column;
      component.range = { minValue: -25, maxValue: 83 };
      component.series = [{ data: [-25, 58, 83, 66], label: 'Vancouver', type: PoChartType.Column }];

      fixture.detectChanges();

      const chartBarElement = nativeElement.querySelectorAll('.po-chart-axis-path');
      expect(chartBarElement).toBeTruthy();
      expect(chartBarElement.length).toBe(11);
    });

    it(`shouldn't contain an extra axis X line if one of axisXLabel's value is zero`, () => {
      component.type = PoChartType.Column;
      component.series = [{ data: [0, 58, 83, 66], label: 'Vancouver', type: PoChartType.Column }];

      fixture.detectChanges();

      const chartBarElement = nativeElement.querySelectorAll('.po-chart-axis-path');
      expect(chartBarElement).toBeTruthy();
      expect(chartBarElement.length).toBe(10);
    });
  });
});
