import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoCustomAreaComponent } from './po-custom-area.component';

describe('PoCustomAreaComponent', () => {
  let component: PoCustomAreaComponent;
  let fixture: ComponentFixture<PoCustomAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoCustomAreaComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCustomAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
