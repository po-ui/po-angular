import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PoChartLegendComponent } from './po-chart-legend.component';

describe('PoChartLegendComponent:', () => {
  let component: PoChartLegendComponent;
  let fixture: ComponentFixture<PoChartLegendComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PoChartLegendComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartLegendComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof PoChartLegendComponent).toBeTruthy();
  });

  describe('Templates:', () => {
    it('should apply valid text and color values', () => {
      component.series = <any>[
        { data: 10, label: '1', color: 'red' },
        { data: 20, label: '2', color: 'green' }
      ];

      fixture.detectChanges();

      const legendSquare = fixture.debugElement.nativeElement.querySelectorAll('.po-chart-legend-square');
      const legendText = fixture.debugElement.nativeElement.querySelectorAll('.po-chart-legend-text');

      expect(legendSquare[0].getAttribute('style')).toBe('background: red;');
      expect(legendText[0].textContent.trim()).toBe(component.series[0].label);
      expect(legendSquare[1].getAttribute('style')).toBe('background: green;');
      expect(legendText[1].textContent.trim()).toBe(component.series[1].label);
    });

    it('should apply valid text and color values when the series have value and category', () => {
      component.series = <any>[
        { value: 10, category: '1', color: 'red' },
        { value: 20, category: '2', color: 'green' }
      ];

      fixture.detectChanges();

      const legendSquare = fixture.debugElement.nativeElement.querySelectorAll('.po-chart-legend-square');
      const legendText = fixture.debugElement.nativeElement.querySelectorAll('.po-chart-legend-text');

      expect(legendSquare[0].getAttribute('style')).toBe('background: red;');
      expect(legendText[0].textContent.trim()).toBe(component.series[0].category);
      expect(legendSquare[1].getAttribute('style')).toBe('background: green;');
      expect(legendText[1].textContent.trim()).toBe(component.series[1].category);
    });

    it('should apply valid text and color values when the series have value, category, label and data', () => {
      component.series = <any>[
        { value: 10, label: '1', color: 'red' },
        { data: 20, category: '2', color: 'green' }
      ];

      fixture.detectChanges();

      const legendSquare = fixture.debugElement.nativeElement.querySelectorAll('.po-chart-legend-square');
      const legendText = fixture.debugElement.nativeElement.querySelectorAll('.po-chart-legend-text');

      expect(legendSquare[0].getAttribute('style')).toBe('background: red;');
      expect(legendText[0].textContent.trim()).toBe(component.series[0].label);
      expect(legendSquare[1].getAttribute('style')).toBe('background: green;');
      expect(legendText[1].textContent.trim()).toBe(component.series[1].category);
    });
  });
});
