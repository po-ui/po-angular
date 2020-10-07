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

  describe('Properties:', () => {
    it('p-series: should call `colorService.getSeriesColor` and apply the returned value to `colors`', () => {
      const spyGetSeriesColor = spyOn(component['colorService'], <any>'getSeriesColor').and.callThrough();

      component.series = [
        { cat: 1, value: 2 },
        { cat: 1, value: 2 }
      ];

      expect(spyGetSeriesColor).toHaveBeenCalledWith(component.series, component.type);
      expect(component.colors.length).toBe(2);
      expect(component.colors).toEqual(['#0C6C94', '#29B6C5']);
    });
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
