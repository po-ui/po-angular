import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartAxisOptions } from '../../interfaces/po-chart-axis-options.interface';
import { PoChartMinMaxValues } from '../../interfaces/po-chart-min-max-values.interface';
import { PoChartPathCoordinates } from '../../interfaces/po-chart-path-coordinates.interface';

import { PoChartModule } from '../../po-chart.module';
import { PoChartAxisComponent } from './po-chart-axis.component';

describe('PoChartAxisComponent', () => {
  let component: PoChartAxisComponent;
  let fixture: ComponentFixture<PoChartAxisComponent>;

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties: ', () => {
    describe('p-series: ', () => {
      it('should call `mathsService.seriesGreaterLength` and apply value to `seriesLength`', () => {
        const fakeSeries = [{ label: 'test 1', data: [1, 2, 3] }];
        const fakeSeriesLength = 3;
        spyOn(component['mathsService'], 'seriesGreaterLength').and.returnValue(fakeSeriesLength);

        component.series = fakeSeries;

        expect(component['mathsService'].seriesGreaterLength).toHaveBeenCalledWith(fakeSeries);
        expect(component['seriesLength']).toEqual(fakeSeriesLength);
      });

      it('should call `mathsService.calculateMinAndMaxValues` and apply value to `minMaxAxisValues`', () => {
        const fakeSeries = [{ label: 'test 1', data: [1, 2, 3] }];
        const fakeMinMaxAxisValues: PoChartMinMaxValues = {
          minValue: 1,
          maxValue: 3
        };
        spyOn(component['mathsService'], 'calculateMinAndMaxValues').and.returnValue(fakeMinMaxAxisValues);

        component.series = fakeSeries;

        expect(component['mathsService'].calculateMinAndMaxValues).toHaveBeenCalledWith(fakeSeries);
        expect(component['minMaxAxisValues']).toEqual(fakeMinMaxAxisValues);
      });

      it('should call `checkAxisOptions', () => {
        const fakeSeries = [{ label: 'test 1', data: [1, 2, 3] }];
        const fakeAxisOptions: PoChartAxisOptions = {
          minRange: 0,
          maxRange: 100,
          axisXGridLines: 5
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

      it('shouldn`t call `mathsService.calculateMinAndMaxValues` if `seriesDataArrayFilter.length` is falsy', () => {
        const fakeSeries = [{ label: 'test 1', data: '' }];
        const fakeMinMaxAxisValues: PoChartMinMaxValues = {
          minValue: 1,
          maxValue: 3
        };
        spyOn(component['mathsService'], 'calculateMinAndMaxValues').and.returnValue(fakeMinMaxAxisValues);

        component.series = fakeSeries;

        expect(component.series).toEqual([]);
        expect(component['mathsService'].calculateMinAndMaxValues).not.toHaveBeenCalledWith(fakeSeries);
      });
    });

    describe('p-categories: ', () => {
      it('should call `setAxisYCoordinates` and `setAxisYLabelCoordinates`', () => {
        const fakeMinMaxAxisValues: PoChartMinMaxValues = {
          minValue: 1,
          maxValue: 3
        };
        const fakeSeriesLength = 3;
        const fakeContainerSize = {
          svgWidth: 500,
          centerX: 250,
          svgHeight: 300,
          centerY: 150,
          svgPlottingAreaWidth: 400,
          svgPlottingAreaHeight: 280
        };
        const fakeCategories = ['jan', 'fev', 'mar'];

        spyOn(component, <any>'setAxisYCoordinates');
        spyOn(component, <any>'setAxisYLabelCoordinates');

        component['seriesLength'] = fakeSeriesLength;
        component['minMaxAxisValues'] = fakeMinMaxAxisValues;
        component.containerSize = fakeContainerSize;
        component.categories = fakeCategories;

        expect(component['setAxisYCoordinates']).toHaveBeenCalledWith(fakeContainerSize, fakeSeriesLength);
        expect(component['setAxisYLabelCoordinates']).toHaveBeenCalledWith(
          fakeContainerSize,
          fakeSeriesLength,
          fakeCategories
        );
        expect(component.categories).toEqual(fakeCategories);
      });
    });

    describe('p-container-size: ', () => {
      it('should call `setAxisXCoordinates`, `setAxisXLabelCoordinates`, `setAxisYCoordinates` and `setAxisYLabelCoordinates`', () => {
        const fakeContainerSize = {
          svgWidth: 500,
          centerX: 250,
          svgHeight: 300,
          centerY: 150,
          svgPlottingAreaWidth: 400,
          svgPlottingAreaHeight: 280
        };

        spyOn(component, <any>'checkAxisOptions');
        spyOn(component, <any>'setAxisXCoordinates');
        spyOn(component, <any>'setAxisXLabelCoordinates');
        spyOn(component, <any>'setAxisYCoordinates');
        spyOn(component, <any>'setAxisYLabelCoordinates');

        component.containerSize = fakeContainerSize;

        expect(component['checkAxisOptions']).toHaveBeenCalled();
        expect(component['setAxisXCoordinates']).toHaveBeenCalled();
        expect(component['setAxisXLabelCoordinates']).toHaveBeenCalled();
        expect(component['setAxisYCoordinates']).toHaveBeenCalled();
        expect(component['setAxisYLabelCoordinates']).toHaveBeenCalled();
      });
    });

    describe('p-options: ', () => {
      it('should call `checkAxisOptions` and `setAxisXLabelCoordinates`', () => {
        const fakeAxisXGridLines = 5;
        const fakeMinMaxAxisValues: PoChartMinMaxValues = {
          minValue: 1,
          maxValue: 3
        };
        const fakeAxisOptions: PoChartAxisOptions = {
          minRange: 0,
          maxRange: 100,
          axisXGridLines: 5
        };
        const fakeContainerSize = {
          svgWidth: 500,
          centerX: 250,
          svgHeight: 300,
          centerY: 150,
          svgPlottingAreaWidth: 400,
          svgPlottingAreaHeight: 280
        };

        spyOn(component, <any>'checkAxisOptions');
        spyOn(component, <any>'setAxisXLabelCoordinates');

        component['minMaxAxisValues'] = fakeMinMaxAxisValues;
        component['axisXGridLines'] = fakeAxisXGridLines;
        component.containerSize = fakeContainerSize;
        component.axisOptions = fakeAxisOptions;

        expect(component['checkAxisOptions']).toHaveBeenCalledWith(fakeAxisOptions);
        expect(component['setAxisXLabelCoordinates']).toHaveBeenCalledWith(
          fakeAxisXGridLines,
          fakeContainerSize,
          fakeMinMaxAxisValues
        );
      });
    });
  });

  describe('Methods', () => {
    it('setAxisXCoordinates: should apply value to `axisXCoordinates`', () => {
      const fakeAxisXGridLines = 1;
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        svgPlottingAreaWidth: 400,
        svgPlottingAreaHeight: 280
      };
      const expectedResult: Array<PoChartPathCoordinates> = [{ coordinates: 'M72 300 L500, 300' }];

      spyOn(component, <any>'calculateAxisXCoordinateY').and.returnValue(300);

      component['setAxisXCoordinates'](fakeAxisXGridLines, fakeContainerSize);

      expect(component['calculateAxisXCoordinateY']).toHaveBeenCalled();
      expect(component.axisXCoordinates).toEqual(expectedResult);
    });

    it('setAxisXLabelCoordinates: should apply value to `axisXLabelCoordinates`', () => {
      const fakeAxisXGridLines = 1;
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        svgPlottingAreaWidth: 400,
        svgPlottingAreaHeight: 280
      };
      const fakeMinMaxAxisValues: PoChartMinMaxValues = {
        minValue: 1,
        maxValue: 3
      };
      const expectedResult: any = [
        { label: '0', xCoordinate: undefined, yCoordinate: undefined },
        { label: '50', xCoordinate: undefined, yCoordinate: undefined },
        { label: '100', xCoordinate: undefined, yCoordinate: undefined },
        { label: '150', xCoordinate: undefined, yCoordinate: undefined },
        { label: '200', xCoordinate: undefined, yCoordinate: undefined }
      ];

      spyOn(component['mathsService'], <any>'range').and.returnValue([0, 50, 100, 150, 200]);
      spyOn(component, <any>'calculateAxisXLabelXCoordinate');
      spyOn(component, <any>'calculateAxisXCoordinateY');

      component['setAxisXLabelCoordinates'](fakeAxisXGridLines, fakeContainerSize, fakeMinMaxAxisValues);

      expect(component['mathsService'].range).toHaveBeenCalled();
      expect(component['calculateAxisXLabelXCoordinate']).toHaveBeenCalled();
      expect(component['calculateAxisXCoordinateY']).toHaveBeenCalled();
      expect(component.axisXLabelCoordinates).toEqual(expectedResult);
    });

    describe('formatLabel:', () => {
      it('formatLabel: should format label', () => {
        const labelValue = 0.99999999;

        expect(component['formatLabel'](labelValue)).toBe('1');
      });

      it('formatLabel: should return a decimal value with two digits', () => {
        const labelValue = 10.555555555;

        expect(component['formatLabel'](labelValue)).toBe('10.56');
      });
    });

    it('setAxisYCoordinates: should apply value to `axisYCoordinates`', () => {
      const fakeSeriesLength = 1;
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        svgPlottingAreaWidth: 400,
        svgPlottingAreaHeight: 280
      };
      const expectedResult: Array<PoChartPathCoordinates> = [
        { coordinates: '1' },
        { coordinates: '2' },
        { coordinates: 'Mundefined 8 Lundefined, 288' }
      ];
      const fakeOuterYCoordinates: Array<PoChartPathCoordinates> = [{ coordinates: '1' }, { coordinates: '2' }];

      spyOn(component, <any>'setAxisYOuterCoordinates').and.returnValue(fakeOuterYCoordinates);
      spyOn(component, <any>'calculateAxisYCoordinateX');

      component['setAxisYCoordinates'](fakeContainerSize, fakeSeriesLength);

      expect(component['setAxisYOuterCoordinates']).toHaveBeenCalled();
      expect(component['calculateAxisYCoordinateX']).toHaveBeenCalled();
      expect(component.axisYCoordinates).toEqual(expectedResult);
    });

    it('setAxisYOuterCoordinates: should return an array with `firstLineCoordinates` and `lastLineCoordinates`', () => {
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        svgPlottingAreaWidth: 400,
        svgPlottingAreaHeight: 280
      };
      const expectedResult = [{ coordinates: 'M72 8 L72 288' }, { coordinates: 'M500 8 L500 288' }];
      const fakeStartY = 8;
      const fakeEndY = fakeContainerSize.svgPlottingAreaHeight + 8;

      const result = component['setAxisYOuterCoordinates'](fakeStartY, fakeEndY, fakeContainerSize);

      expect(result).toEqual(expectedResult);
    });

    it('setAxisYLabelCoordinates: should apply value to `axisYLabelCoordinates`', () => {
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        svgPlottingAreaWidth: 400,
        svgPlottingAreaHeight: 280
      };
      const expectedResult = [{ label: 'teste', xCoordinate: 0, yCoordinate: 0 }];
      const fakeSeriesLength = 1;
      const fakeCategories = ['teste'];

      spyOn(component, <any>'calculateAxisYCoordinateX').and.returnValue(0);
      spyOn(component, <any>'calculateAxisYLabelYCoordinate').and.returnValue(0);

      component['setAxisYLabelCoordinates'](fakeContainerSize, fakeSeriesLength, fakeCategories);

      expect(component['calculateAxisYCoordinateX']).toHaveBeenCalled();
      expect(component['calculateAxisYLabelYCoordinate']).toHaveBeenCalled();
      expect(component.axisYLabelCoordinates).toEqual(expectedResult);
    });

    it('calculateAxisXLabelXCoordinate: should return the result of `PoChartAxisXLabelArea` - `labelPoChartPadding`', () => {
      const expectedResult = 64;

      const result = component['calculateAxisXLabelXCoordinate']();

      expect(result).toEqual(expectedResult);
    });

    it('calculateAxisXCoordinateY: should return the calculation result', () => {
      const expectedResult = 218;
      const fakeAxisXGridLines = 5;
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        svgPlottingAreaWidth: 400,
        svgPlottingAreaHeight: 280
      };
      const fakeIndex = 1;

      const result = component['calculateAxisXCoordinateY'](fakeAxisXGridLines, fakeContainerSize, fakeIndex);

      expect(result).toEqual(expectedResult);
    });

    it('calculateAxisYLabelYCoordinate: should return the result of `containerSize.svgHeight` - `textPoChartPadding`', () => {
      const expectedResult = 292;
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        svgPlottingAreaWidth: 400,
        svgPlottingAreaHeight: 280
      };

      const result = component['calculateAxisYLabelYCoordinate'](fakeContainerSize);

      expect(result).toEqual(expectedResult);
    });

    it('calculateAxisYCoordinateX: should return the result of `PoChartAxisXLabelArea` - `labelPoChartPadding`', () => {
      const expectedResult = 496;
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        svgPlottingAreaWidth: 400,
        svgPlottingAreaHeight: 280
      };
      const fakeIndex = 1;
      component['seriesLength'] = 2;

      spyOn(component['mathsService'], 'calculateSideSpacing').and.returnValue(24);

      const result = component['calculateAxisYCoordinateX'](fakeContainerSize, fakeIndex);

      expect(component['mathsService'].calculateSideSpacing).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('calculateAxisYCoordinateX: should calculate even if `seriesLenght - 1` is zero', () => {
      const fakeContainerSize = {
        svgWidth: 500,
        centerX: 250,
        svgHeight: 300,
        centerY: 150,
        svgPlottingAreaWidth: 400,
        svgPlottingAreaHeight: 280
      };
      component.series = [{ label: 'test 1', data: [1] }];
      component['seriesLength'] = 1;

      const result = component['calculateAxisYCoordinateX'](fakeContainerSize, 0);

      expect(result).toBe(96);
    });

    it('isValidGridLinesLengthOption: should return true', () => {
      const fakeAxisXGridLines = 5;

      const result = component['isValidGridLinesLengthOption'](fakeAxisXGridLines);

      expect(result).toBeTrue();
    });

    it('isValidGridLinesLengthOption: should return true', () => {
      const fakeAxisXGridLines = 11;

      const result = component['isValidGridLinesLengthOption'](fakeAxisXGridLines);

      expect(result).toBeFalse();
    });

    it('setAxisXGridLines: should call `setAxisXCoordinates` and `setAxisXLabelCoordinates`', () => {
      spyOn(component, <any>'setAxisXCoordinates');
      spyOn(component, <any>'setAxisXLabelCoordinates');

      component['setAxisXGridLines']();

      expect(component['setAxisXCoordinates']).toHaveBeenCalled();
      expect(component['setAxisXLabelCoordinates']).toHaveBeenCalled();
    });

    describe('checkAxisOptions: ', () => {
      it('should apply value to `minMaxAxisValues`', () => {
        const fakeMinMaxAxisValues: PoChartMinMaxValues = {
          minValue: 1,
          maxValue: 3
        };
        spyOn(component['mathsService'], <any>'calculateMinAndMaxValues').and.returnValue(fakeMinMaxAxisValues);

        component['checkAxisOptions']();

        expect(component['minMaxAxisValues']).toEqual(fakeMinMaxAxisValues);
      });

      it('should apply the highest value to `minMaxAxisValues`', () => {
        const fakeMinMaxAxisValues: PoChartMinMaxValues = {
          minValue: 1,
          maxValue: 3
        };
        const fakeOptions: PoChartAxisOptions = {
          maxRange: 4,
          minRange: 0
        };
        const expectedValue = {
          minValue: 0,
          maxValue: 4
        };
        spyOn(component['mathsService'], <any>'calculateMinAndMaxValues').and.returnValue(fakeMinMaxAxisValues);

        component['checkAxisOptions'](fakeOptions);

        expect(component['minMaxAxisValues']).toEqual(expectedValue);
      });

      it('should apply `options.axisXGridLines` value to `axisXGridLines`', () => {
        const fakeOptions: PoChartAxisOptions = {
          maxRange: 4,
          minRange: 0,
          axisXGridLines: 2
        };

        spyOn(component, <any>'isValidGridLinesLengthOption').and.returnValue(true);

        component['checkAxisOptions'](fakeOptions);

        expect(component['axisXGridLines']).toEqual(fakeOptions.axisXGridLines);
      });

      it('should apply `PoChartAxisXGridLines` value to `axisXGridLines`', () => {
        const fakeOptions: PoChartAxisOptions = {
          maxRange: 4,
          minRange: 0,
          axisXGridLines: 1
        };
        const expectedValue = 5;

        spyOn(component, <any>'isValidGridLinesLengthOption').and.returnValue(false);

        component['checkAxisOptions'](fakeOptions);

        expect(component['axisXGridLines']).toEqual(expectedValue);
      });

      it('should call `setAxisXGridLines`', () => {
        spyOn(component, <any>'setAxisXGridLines');

        component['checkAxisOptions']();

        expect(component['setAxisXGridLines']).toHaveBeenCalled();
      });
    });
  });
});
