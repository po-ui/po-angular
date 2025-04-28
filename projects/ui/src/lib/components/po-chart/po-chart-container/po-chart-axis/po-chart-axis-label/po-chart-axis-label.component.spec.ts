import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartAxisLabelComponent } from './po-chart-axis-label.component';
import { PoChartType } from '../../../enums/po-chart-type.enum';
import { PoChartModule } from '../../../po-chart.module';
import { PoChartLabelFormat } from '../../../enums/po-chart-label-format.enum';
import { DEFAULT_CURRENCY_CODE } from '@angular/core';

describe('PoChartAxisXLabelComponent', () => {
  let component: PoChartAxisLabelComponent;
  let fixture: ComponentFixture<PoChartAxisLabelComponent>;
  let nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoChartModule],
      declarations: [PoChartAxisLabelComponent],
      providers: [{ provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartAxisLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('trackBy: should return index param', () => {
      const index = 1;
      const expectedValue = index;

      expect(component.trackBy(index)).toBe(expectedValue);
    });

    describe('formatValueAxis:', () => {
      it('shouldn`t apply format to X axis if graphic type is bar', () => {
        const value: string = '10000.00';

        component.axisOptions = { labelType: PoChartLabelFormat.Number };
        component.type = PoChartType.Bar;

        expect(component.formatValueAxis(value, 'x')).toBe(value);
      });

      it('shouldn`t apply format to Y axis if graphic type is not bar', () => {
        const value: string = '35000.00';

        component.axisOptions = { labelType: PoChartLabelFormat.Number };
        component.type = PoChartType.Column;

        expect(component.formatValueAxis(value, 'y')).toBe(value);
      });

      it('should return original value', () => {
        const value: string = '27000.00';
        expect(component.formatValueAxis(value, 'x')).toBe(value);
      });

      it('should return formatted currency', () => {
        const value = '10000.00';
        const expectedValue: string = 'R$10,000.00';

        component.axisOptions = { labelType: PoChartLabelFormat.Currency };
        component.type = PoChartType.Column;

        expect(component.formatValueAxis(value, 'x')).toBe(expectedValue);
      });

      it('should return formatted number', () => {
        const value: string = '1291355450.00';
        const expectedValue: string = '1,291,355,450.00';

        component.axisOptions = { labelType: PoChartLabelFormat.Number };
        component.type = PoChartType.Column;

        expect(component.formatValueAxis(value, 'x')).toBe(expectedValue);
      });
    });
  });

  describe('Template:', () => {
    it('should contain `po-chart-axis-label`', () => {
      component.axisXLabelCoordinates = [
        { label: 'label', xCoordinate: 20, yCoordinate: 20 },
        { label: 'label', xCoordinate: 20, yCoordinate: 20 },
        { label: 'label', xCoordinate: 20, yCoordinate: 20 }
      ];
      component.axisYLabelCoordinates = [
        { label: 'label', xCoordinate: 20, yCoordinate: 20 },
        { label: 'label', xCoordinate: 20, yCoordinate: 20 }
      ];

      fixture.detectChanges();

      const chartAxisXLabel = nativeElement.querySelectorAll('.po-chart-axis-x-label');
      const chartAxisYLabel = nativeElement.querySelectorAll('.po-chart-axis-y-label');

      expect(chartAxisXLabel).toBeTruthy();
      expect(chartAxisXLabel.length).toBe(3);

      expect(chartAxisYLabel).toBeTruthy();
      expect(chartAxisYLabel.length).toBe(2);
    });

    it('should find `po-chart-centered-label` class if `alignByTheCorners` is true', () => {
      component.alignByTheCorners = false;

      component.axisXLabelCoordinates = [
        { label: 'label', xCoordinate: 20, yCoordinate: 20 },
        { label: 'label', xCoordinate: 20, yCoordinate: 20 },
        { label: 'label', xCoordinate: 20, yCoordinate: 20 }
      ];
      component.axisYLabelCoordinates = [
        { label: 'label', xCoordinate: 20, yCoordinate: 20 },
        { label: 'label', xCoordinate: 20, yCoordinate: 20 },
        { label: 'label', xCoordinate: 20, yCoordinate: 20 }
      ];

      fixture.detectChanges();

      const chartCenteredLabel = nativeElement.querySelectorAll('.po-chart-centered-label');
      expect(chartCenteredLabel).toBeTruthy();
      expect(chartCenteredLabel.length).toBe(3);
    });

    it('shouldn`t find `po-chart-centered-label` class if `alignByTheCorners` is true', () => {
      component.alignByTheCorners = true;

      component.axisXLabelCoordinates = [
        { label: 'label', xCoordinate: 20, yCoordinate: 20 },
        { label: 'label', xCoordinate: 20, yCoordinate: 20 },
        { label: 'label', xCoordinate: 20, yCoordinate: 20 }
      ];
      component.axisYLabelCoordinates = [
        { label: 'label', xCoordinate: 20, yCoordinate: 20 },
        { label: 'label', xCoordinate: 20, yCoordinate: 20 }
      ];

      fixture.detectChanges();

      const chartCenteredLabel = nativeElement.querySelectorAll('.po-chart-centered-label');
      expect(chartCenteredLabel.length).toBe(0);
    });
  });
});
