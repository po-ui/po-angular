import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoPageSlideFooterComponent } from './po-page-slide-footer.component';

describe('PoPageSlideFooterComponent', () => {
  let component: PoPageSlideFooterComponent;
  let fixture: ComponentFixture<PoPageSlideFooterComponent>;
  let nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoPageSlideFooterComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageSlideFooterComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`shouldn't align content on the right if 'disabledAlign' is true`, () => {
    component.disabledAlign = true;

    fixture.detectChanges();

    const poModalFooter = nativeElement.querySelector('.po-page-slide-footer-align-right');

    expect(poModalFooter).toBeFalsy();
  });

  it(`should align content on the right by default`, () => {
    component.disabledAlign = false;

    fixture.detectChanges();

    const poModalFooter = nativeElement.querySelector('.po-page-slide-footer-align-right');

    expect(poModalFooter).toBeTruthy();
  });
});
