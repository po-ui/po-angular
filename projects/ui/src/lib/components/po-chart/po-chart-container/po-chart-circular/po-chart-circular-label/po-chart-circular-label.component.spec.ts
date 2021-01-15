import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartCircularLabelComponent } from './po-chart-circular-label.component';

describe('PoChartCircularLabelComponent', () => {
  let component: PoChartCircularLabelComponent;
  let fixture: ComponentFixture<PoChartCircularLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoChartCircularLabelComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartCircularLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods', () => {
    it('applyCoordinates: should call `setAttribute`. `detectChanges` and apply true to `showLabel`', () => {
      const coordinates = { xCoordinate: 20, yCoordinate: 20 };

      const spySetAttribute = spyOn(component['renderer'], 'setAttribute');
      const spyDetectChanges = spyOn(component['changeDetection'], 'detectChanges');

      component.applyCoordinates(coordinates);

      expect(spySetAttribute).toHaveBeenCalled();
      expect(spySetAttribute).toHaveBeenCalledTimes(2);
      expect(spyDetectChanges).toHaveBeenCalled();
      expect(component.showLabel).toBe(true);
    });
  });
});
