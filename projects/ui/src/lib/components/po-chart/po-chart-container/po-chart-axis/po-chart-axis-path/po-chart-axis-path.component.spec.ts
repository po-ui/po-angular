import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartAxisPathComponent } from './po-chart-axis-path.component';

describe('PoChartAxisPathComponent', () => {
  let component: PoChartAxisPathComponent;
  let fixture: ComponentFixture<PoChartAxisPathComponent>;
  let nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoChartAxisPathComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartAxisPathComponent);
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
    it('should contain `po-chart-axis-path`', () => {
      component.axisXCoordinates = [{ coordinates: 'M 10 10, L 20 200' }, { coordinates: 'M 10 10, L 20 200' }];
      component.axisYCoordinates = [{ coordinates: 'M 10 10, L 20 200' }, { coordinates: 'M 10 10, L 20 200' }];

      fixture.detectChanges();

      const chartPaths = nativeElement.querySelectorAll('.po-chart-axis-path');

      expect(chartPaths).toBeTruthy();
      expect(chartPaths.length).toBe(4);
    });
  });
});
