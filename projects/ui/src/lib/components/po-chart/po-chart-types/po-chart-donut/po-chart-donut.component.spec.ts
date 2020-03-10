import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartCircular } from '../po-chart-circular/po-chart-circular';
import { PoChartDonutComponent } from './po-chart-donut.component';

describe('PoChartDonutComponent:', () => {
  let component: PoChartDonutComponent;
  let fixture: ComponentFixture<PoChartDonutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PoChartDonutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartDonutComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof PoChartDonutComponent).toBeTruthy();
    expect(component instanceof PoChartCircular).toBeTruthy();
  });
});
