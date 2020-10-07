import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartPathComponent } from './po-chart-path.component';

describe('PoChartPathComponent', () => {
  let component: PoChartPathComponent;
  let fixture: ComponentFixture<PoChartPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoChartPathComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
