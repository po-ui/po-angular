import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoGaugeTitleComponent } from './po-gauge-title.component';

describe('PoGaugeTitleComponent', () => {
  let component: PoGaugeTitleComponent;
  let fixture: ComponentFixture<PoGaugeTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoGaugeTitleComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoGaugeTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
