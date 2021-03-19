import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartAxisLabelComponent } from './po-chart-axis-label.component';
import { PoChartType } from '../../../enums/po-chart-type.enum';

describe('PoChartAxisXLabelComponent', () => {
  let component: PoChartAxisLabelComponent;
  let fixture: ComponentFixture<PoChartAxisLabelComponent>;
  let nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoChartAxisLabelComponent]
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
