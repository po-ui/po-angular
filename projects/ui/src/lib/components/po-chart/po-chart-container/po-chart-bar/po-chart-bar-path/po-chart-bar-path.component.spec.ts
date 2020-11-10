import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartModule } from '../../../po-chart.module';
import { PoChartBarPathComponent } from './po-chart-bar-path.component';

describe('PoChartBarPathComponent', () => {
  let component: PoChartBarPathComponent;
  let fixture: ComponentFixture<PoChartBarPathComponent>;
  let nativeElement;

  const coordinates = {
    category: 'janeiro',
    tooltipLabel: 'Vancouver: 200',
    label: 'Vancouver',
    data: 200,
    coordinates: 'M20 20 L20 20 L20 20 L20 20z'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoChartModule],
      declarations: [PoChartBarPathComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartBarPathComponent);
    component = fixture.componentInstance;
    component.coordinates = [coordinates];
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('onClick: should emit `barClick` with an object with `label`, `data` and `category`', () => {
      const spyBarClick = spyOn(component.barClick, 'emit');

      component.onClick(coordinates);

      const expectedParam = {
        label: coordinates.label,
        data: coordinates.data,
        category: coordinates.category
      };

      expect(spyBarClick).toHaveBeenCalledWith(expectedParam);
    });

    it('onMouseEnter: should emit `barHover` with an object with `category`, `value` and `axisCategory`', () => {
      const spyBarHover = spyOn(component.barHover, 'emit');

      component.onMouseEnter(coordinates);

      const expectedParam = {
        label: coordinates.label,
        data: coordinates.data,
        category: coordinates.category
      };

      expect(spyBarHover).toHaveBeenCalledWith(expectedParam);
    });

    it('trackBy: should return index param', () => {
      const index = 1;
      const expectedValue = index;

      expect(component.trackBy(index)).toBe(expectedValue);
    });
  });

  describe('Template:', () => {
    it('should contain `po-chart-bar-path`', () => {
      const chartPaths = nativeElement.querySelectorAll('.po-chart-bar-path');

      expect(chartPaths).toBeTruthy();
      expect(chartPaths.length).toBe(1);
    });
  });
});
