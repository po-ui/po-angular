import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoStepComponent } from './po-step.component';
import { PoStepperModule } from '../po-stepper.module';
import { PoStepperStatus } from '../enums/po-stepper-status.enum';

describe('PoStepComponent:', () => {
  let component: PoStepComponent;
  let fixture: ComponentFixture<PoStepComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoStepperModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoStepComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoStepComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('status: should call `setDisplayOnActiveOrError`', () => {
      spyOn(component, <any>'setDisplayOnActiveOrError');

      component.status = PoStepperStatus.Active;

      expect(component['setDisplayOnActiveOrError']).toHaveBeenCalled();
    });
  });

  describe('Methods:', () => {
    it('ngAfterContentInit: should call `setDisplayOnActiveOrError`', () => {
      spyOn(component, <any>'setDisplayOnActiveOrError');

      component.ngAfterContentInit();

      expect(component['setDisplayOnActiveOrError']).toHaveBeenCalled();
    });

    it('setDisplayOnActiveOrError: should set display style of `elementRef` to `none` if `status` is `Default`', () => {
      component['elementRef'].nativeElement.style.display = 'block';
      component.status = PoStepperStatus.Default;

      component['setDisplayOnActiveOrError']();

      expect(component['elementRef'].nativeElement.style.display).toBe('none');
    });

    it('setDisplayOnActiveOrError: should set display style of `elementRef` to empty if `status` is `Active`', () => {
      component['elementRef'].nativeElement.style.display = 'none';
      component.status = PoStepperStatus.Active;

      component['setDisplayOnActiveOrError']();

      expect(component['elementRef'].nativeElement.style.display).toBe('');
    });

    it('setDisplayOnActiveOrError: should set display style of `elementRef` to empty if `status` is `Error`', () => {
      component['elementRef'].nativeElement.style.display = 'none';
      component.status = PoStepperStatus.Error;

      component['setDisplayOnActiveOrError']();

      expect(component['elementRef'].nativeElement.style.display).toBe('');
    });
  });
});
