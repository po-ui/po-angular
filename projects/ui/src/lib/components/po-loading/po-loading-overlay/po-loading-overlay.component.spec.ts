import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoLoadingModule } from '../po-loading.module';
import { PoLoadingOverlayComponent } from './po-loading-overlay.component';

describe('PoLoadingOverlayComponent', () => {
  let component: PoLoadingOverlayComponent;
  let fixture: ComponentFixture<PoLoadingOverlayComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoLoadingModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoLoadingOverlayComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoLoadingOverlayComponent).toBeTruthy();
  });

  describe('Template:', () => {
    it('should set class `po-overlay-fixed` when p-screen-locked is true', () => {
      component.screenLock = true;
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-overlay-fixed')).toBeTruthy();
      expect(nativeElement.querySelector('.po-overlay-overlay-absolute')).toBeFalsy();
    });

    it('should set class `po-loading-absolute` when p-screen-locked is true', () => {
      component.screenLock = false;
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-overlay-fixed')).toBeFalsy();
      expect(nativeElement.querySelector('.po-overlay-absolute')).toBeTruthy();
    });

    it('should set class `po-loading-overlay-absolute` when p-screen-locked is not defined', () => {
      component.screenLock = undefined;
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-overlay-fixed')).toBeFalsy();
      expect(nativeElement.querySelector('.po-overlay-absolute')).toBeTruthy();
    });
  });
});
