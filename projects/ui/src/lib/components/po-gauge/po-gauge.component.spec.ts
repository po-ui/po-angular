import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoGaugeComponent } from './po-gauge.component';
import { PoChartSerie } from '../po-chart';

describe('PoGaugeComponent', () => {
  let component: PoGaugeComponent;
  let fixture: ComponentFixture<PoGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoGaugeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PoGaugeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should set options when description, showFromToLegend or showPointer change', () => {
      component.description = 'Teste';
      component.showFromToLegend = true;
      component.showPointer = false;

      component.ngOnChanges({
        description: { currentValue: 'Teste', previousValue: '', firstChange: true, isFirstChange: () => true },
        showFromToLegend: { currentValue: true, previousValue: false, firstChange: true, isFirstChange: () => true },
        showPointer: { currentValue: false, previousValue: true, firstChange: true, isFirstChange: () => true }
      });

      expect(component.options).toEqual({
        descriptionGauge: 'Teste',
        showFromToLegend: true,
        pointer: false
      });
    });

    it('should set series and valuesMultiple when ranges is defined and not empty', () => {
      const mockRanges: Array<PoChartSerie> = [{ label: 'Faixa', data: 75 }];

      component.ranges = mockRanges;
      component.value = 75;

      component.ngOnChanges({
        ranges: { currentValue: mockRanges, previousValue: [], firstChange: true, isFirstChange: () => true },
        value: { currentValue: 75, previousValue: 50, firstChange: true, isFirstChange: () => true }
      });

      expect(component.series).toEqual(mockRanges);
      expect(component.valuesMultiple).toBe(75);
    });

    it('should set series with single value when only value is defined', () => {
      component.ranges = [];
      component.value = 60;

      component.ngOnChanges({
        value: { currentValue: 60, previousValue: null, firstChange: true, isFirstChange: () => true }
      });

      expect(component.series).toEqual([{ data: 60 }]);
    });

    it('should set series to empty when neither ranges nor value are defined', () => {
      component.ranges = undefined;
      component.value = undefined;

      component.ngOnChanges({
        ranges: { currentValue: undefined, previousValue: undefined, firstChange: true, isFirstChange: () => true },
        value: { currentValue: undefined, previousValue: undefined, firstChange: true, isFirstChange: () => true }
      });

      expect(component.series).toEqual([]);
    });
  });
});
