import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartModule } from '../../../po-chart.module';
import { PoChartCircularPathComponent } from './po-chart-circular-path.component';

describe('PoChartCircularPathComponent', () => {
  let component: PoChartCircularPathComponent;
  let fixture: ComponentFixture<PoChartCircularPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoChartModule],
      declarations: [PoChartCircularPathComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartCircularPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('applyCoordinates: should call `setAttribute`', () => {
      const spySetAttribute = spyOn(component['renderer'], 'setAttribute');

      component.applyCoordinates('coordinates');

      expect(spySetAttribute).toHaveBeenCalled();
    });

    it('onMouseClick: should emit `onClick`', () => {
      component.serie = { label: 'category A', data: 10, coordinates: 'coordinates' };

      const spyEmit = spyOn(component.onClick, 'emit');

      component.onMouseClick();

      expect(spyEmit).toHaveBeenCalled();
    });

    it('onMouseClick: should emit `onHover`', () => {
      component.serie = { label: 'category A', data: 10, coordinates: 'coordinates' };

      const spyEmit = spyOn(component.onHover, 'emit');

      component.onMouseEnter();

      expect(spyEmit).toHaveBeenCalled();
    });
  });
});
