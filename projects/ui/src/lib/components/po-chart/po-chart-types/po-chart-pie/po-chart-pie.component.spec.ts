import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartCircular } from '../po-chart-circular/po-chart-circular';
import { PoChartPieComponent } from './po-chart-pie.component';

describe('PoChartPieComponent:', () => {
  let component: PoChartPieComponent;
  let fixture: ComponentFixture<PoChartPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PoChartPieComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartPieComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof PoChartPieComponent).toBeTruthy();
    expect(component instanceof PoChartCircular).toBeTruthy();
  });
});
