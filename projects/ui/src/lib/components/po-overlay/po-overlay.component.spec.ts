import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from './../../util-test/util-expect.spec';
import { PoOverlayComponent } from './po-overlay.component';

describe('PoOverlayComponent', () => {
  let component: PoOverlayComponent;
  let fixture: ComponentFixture<PoOverlayComponent>;
  let nativeElement: any;

  beforeEach(() => {
    fixture = TestBed.createComponent(PoOverlayComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Template:', () => {
    it('should set class `po-overlay-fixed` when p-screen-locked is true', () => {
      component.screenLock = true;
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-overlay-fixed')).toBeTruthy();
    });
  });
});
