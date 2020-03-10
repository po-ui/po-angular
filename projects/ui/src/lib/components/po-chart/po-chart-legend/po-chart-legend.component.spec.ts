import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartLegendComponent } from './po-chart-legend.component';

describe('PoChartLegendComponent:', () => {
  let component: PoChartLegendComponent;
  let fixture: ComponentFixture<PoChartLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PoChartLegendComponent]
    }).compileComponents();
  }));

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
        { value: 10, category: '1' },
        { value: 20, category: '2' }
      ];
      component.colors = ['red', 'green'];

      fixture.detectChanges();

      const legendSquare = fixture.debugElement.nativeElement.querySelectorAll('.po-chart-legend-square');
      const legendText = fixture.debugElement.nativeElement.querySelectorAll('.po-chart-legend-text');

      expect(legendSquare[0].getAttribute('style')).toBe('background: red;');
      expect(legendText[0].textContent.trim()).toBe(component.series[0].category);
      expect(legendSquare[1].getAttribute('style')).toBe('background: green;');
      expect(legendText[1].textContent.trim()).toBe(component.series[1].category);
    });
  });
});
