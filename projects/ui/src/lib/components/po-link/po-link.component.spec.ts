import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoLinkComponent } from './po-link.component';

describe('PoLinkComponent', () => {
  let component: PoLinkComponent;
  let fixture: ComponentFixture<PoLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoLinkComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
