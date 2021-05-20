import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoCalendarHeaderComponent } from './po-calendar-header.component';

describe('PoCalendarHeaderComponent', () => {
  let component: PoCalendarHeaderComponent;
  let fixture: ComponentFixture<PoCalendarHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoCalendarHeaderComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCalendarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
