import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoGaugeLegendComponent } from './po-gauge-legend.component';

describe('PoGaugeLegendComponent', () => {
  let component: PoGaugeLegendComponent;
  let fixture: ComponentFixture<PoGaugeLegendComponent>;
  let nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoGaugeLegendComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoGaugeLegendComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('filterLabel: should filter ranges items without label', () => {
      const ranges = [
        { from: 0, to: 50 },
        { from: 50, to: 100, label: 'Aprovado', color: 'green' }
      ];

      expect(component['filterLabel'](ranges)).toEqual([ranges[1]]);
    });

    it('trackBy: should return index param', () => {
      const index = 1;
      const expectedValue = index;

      expect(component.trackBy(index)).toBe(expectedValue);
    });
  });

  describe('Properties:', () => {
    it('p-ranges: should call `filterLabel` if ranges has length', () => {
      const ranges = [
        { from: 0, to: 50 },
        { from: 50, to: 100, label: 'Aprovado', color: 'green' }
      ];

      const spyFilterLabel = spyOn(component, <any>'filterLabel');

      component.ranges = ranges;

      expect(spyFilterLabel).toHaveBeenCalledWith(ranges);
    });

    it('p-ranges: shouldn`t call `filterLabel` and apply `[]` if ranges doesn`t have a length', () => {
      const ranges = [];

      const spyFilterLabel = spyOn(component, <any>'filterLabel');

      component.ranges = ranges;

      expect(spyFilterLabel).not.toHaveBeenCalled();
      expect(component.ranges).toEqual([]);
    });
  });

  describe('Templates:', () => {
    it('should contain `po-gauge-legend-square` class', () => {
      component.ranges = [
        { from: 0, to: 50, label: 'Reprovado', color: 'red' },
        { from: 50, to: 100, label: 'Aprovado', color: 'green' }
      ];

      fixture.detectChanges();

      const legends = nativeElement.querySelectorAll('.po-gauge-legend-square');

      expect(legends).toBeTruthy();
      expect(legends.length).toBe(2);
    });

    it('should contain `po-color-01` class', () => {
      component.ranges = [
        { from: 0, to: 50, label: 'Reprovado', color: 'po-color-01' },
        { from: 50, to: 100, label: 'Aprovado', color: 'green' }
      ];

      fixture.detectChanges();

      const legends = nativeElement.querySelectorAll('.po-color-01');

      expect(legends).toBeTruthy();
      expect(legends.length).toBe(1);
    });
  });
});
