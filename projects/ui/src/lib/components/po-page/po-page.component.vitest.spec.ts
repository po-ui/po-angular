import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoPageComponent } from './po-page.component';

describe('PoPageComponent', () => {
  let component: PoPageComponent;
  let fixture: ComponentFixture<PoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
