import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoModalFooterComponent } from './po-modal-footer.component';

describe('PoModalFooterComponent', () => {
  let component: PoModalFooterComponent;
  let fixture: ComponentFixture<PoModalFooterComponent>;
  let nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoModalFooterComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoModalFooterComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should align content on the right by default', () => {
    component.disabledAlign = true;

    fixture.detectChanges();

    const poModalFooter = nativeElement.querySelector('.po-modal-footer-align-right');

    expect(poModalFooter).toBeFalsy();
  });

  it(`shouldn't align content on the right by default`, () => {
    component.disabledAlign = false;

    fixture.detectChanges();

    const poModalFooter = nativeElement.querySelector('.po-modal-footer-align-right');

    expect(poModalFooter).toBeTruthy();
  });
});
