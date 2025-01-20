import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoStepperCircleComponent } from './po-stepper-circle.component';
import { PoStepperModule } from '../po-stepper.module';
import { PoStepperStatus } from '../enums/po-stepper-status.enum';

describe('PoStepperCircleComponent:', () => {
  let component: PoStepperCircleComponent;
  let fixture: ComponentFixture<PoStepperCircleComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoStepperModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoStepperCircleComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoStepperCircleComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('isActive: should return true only if `status` is `Active`.', () => {
      component.status = PoStepperStatus.Active;
      expect(component.isActive).toBe(true);

      component.status = PoStepperStatus.Default;
      expect(component.isActive).toBe(false);

      component.status = PoStepperStatus.Disabled;
      expect(component.isActive).toBe(false);

      component.status = PoStepperStatus.Done;
      expect(component.isActive).toBe(false);

      component.status = PoStepperStatus.Error;
      expect(component.isActive).toBe(false);
    });

    it('isDefault: should return true only if `status` is `Default`.', () => {
      component.status = PoStepperStatus.Active;
      expect(component.isDefault).toBe(false);

      component.status = PoStepperStatus.Default;
      expect(component.isDefault).toBe(true);

      component.status = PoStepperStatus.Disabled;
      expect(component.isDefault).toBe(false);

      component.status = PoStepperStatus.Done;
      expect(component.isDefault).toBe(false);

      component.status = PoStepperStatus.Error;
      expect(component.isDefault).toBe(false);
    });

    it('isDisabled: should return true only if `status` is `Disabled`.', () => {
      component.status = PoStepperStatus.Active;
      expect(component.isDisabled).toBe(false);

      component.status = PoStepperStatus.Default;
      expect(component.isDisabled).toBe(false);

      component.status = PoStepperStatus.Disabled;
      expect(component.isDisabled).toBe(true);

      component.status = PoStepperStatus.Done;
      expect(component.isDisabled).toBe(false);

      component.status = PoStepperStatus.Error;
      expect(component.isDisabled).toBe(false);
    });

    it('isDone: should return true only if `status` is `Done`.', () => {
      component.status = PoStepperStatus.Active;
      expect(component.isDone).toBe(false);

      component.status = PoStepperStatus.Default;
      expect(component.isDone).toBe(false);

      component.status = PoStepperStatus.Disabled;
      expect(component.isDone).toBe(false);

      component.status = PoStepperStatus.Done;
      expect(component.isDone).toBe(true);

      component.status = PoStepperStatus.Error;
      expect(component.isDone).toBe(false);
    });

    it('isError: should return true only if `status` is `Error`.', () => {
      component.status = PoStepperStatus.Active;
      expect(component.isError).toBe(false);

      component.status = PoStepperStatus.Default;
      expect(component.isError).toBe(false);

      component.status = PoStepperStatus.Disabled;
      expect(component.isError).toBe(false);

      component.status = PoStepperStatus.Done;
      expect(component.isError).toBe(false);

      component.status = PoStepperStatus.Error;
      expect(component.isError).toBe(true);
    });

    it('isLargeStep: should return `true` if `size` is greater than `48`.', () => {
      component.size = 64;

      expect(component.isLargeStep).toBe(true);
    });

    it('isLargeStep: should return `true` if `size` is equal than `48`.', () => {
      component.size = 48;

      expect(component.isLargeStep).toBe(true);
    });

    it('isLargeStep: should return `false` if `size` is less than `48`.', () => {
      component.size = 45;

      expect(component.isLargeStep).toBe(false);
    });

    it('isMediumStep: should return `true` if `size` is greater than `32` and `isLargeStep` is `false`.', () => {
      component.size = 40;

      spyOnProperty(component, 'isLargeStep').and.returnValue(false);

      expect(component.isMediumStep).toBe(true);
    });

    it('isMediumStep: should return `true` if `size` is equal than `32` and `isLargeStep` is `false`.', () => {
      component.size = 32;

      spyOnProperty(component, 'isLargeStep').and.returnValue(false);

      expect(component.isMediumStep).toBe(true);
    });

    it('isMediumStep: should return `false` if `size` is greater than `32` and `isLargeStep` is `true`.', () => {
      component.size = 64;

      spyOnProperty(component, 'isLargeStep').and.returnValue(true);

      expect(component.isMediumStep).toBe(false);
    });

    it('isMediumStep: should return `false` if `size` is less than `32` and `isLargeStep` is `false`.', () => {
      component.size = 31;

      spyOnProperty(component, 'isLargeStep').and.returnValue(false);

      expect(component.isMediumStep).toBe(false);
    });
  });

  describe('Templates:', () => {
    it('should find `po-stepper-circle-content-md` in `span` if `isMediumStep` is `true`.', () => {
      spyOnProperty(component, 'isMediumStep').and.returnValue(true);

      fixture.detectChanges();

      const stepperCircleContentMd = nativeElement.querySelector('.po-stepper-circle-content-md');

      expect(stepperCircleContentMd).toBeTruthy();
    });

    it('should find `po-stepper-circle-content-lg` in `span` if `isLargeStep` is `true`.', () => {
      spyOnProperty(component, 'isLargeStep').and.returnValue(true);

      fixture.detectChanges();

      const stepperCircleContentLg = nativeElement.querySelector('.po-stepper-circle-content-lg');

      expect(stepperCircleContentLg).toBeTruthy();
    });

    it('should have `po-stepper-circle-border` when not active and not error', () => {
      component.status = PoStepperStatus.Default;
      fixture.detectChanges();

      const circleElement = fixture.nativeElement.querySelector('.po-stepper-circle');
      expect(circleElement.classList).toContain('po-stepper-circle-border');
      expect(circleElement.classList).not.toContain('po-stepper-circle-done');
    });

    it('should have `po-stepper-circle-done` when isDone', () => {
      component.status = PoStepperStatus.Done;
      fixture.detectChanges();

      const circleElement = fixture.nativeElement.querySelector('.po-stepper-circle');
      expect(circleElement.classList).toContain('po-stepper-circle-done');
    });

    it('should find `po-stepper-circle-active` if `isActive` is true.', () => {
      spyOnProperty(component, 'isError').and.returnValue(false);
      spyOnProperty(component, 'isActive').and.returnValue(true);

      fixture.detectChanges();

      const stepperCircleActive = nativeElement.querySelector('.po-stepper-circle-active');

      expect(stepperCircleActive).toBeTruthy();
    });

    it('should find `po-stepper-circle-active` if `isError` is true.', () => {
      spyOnProperty(component, 'isError').and.returnValue(true);
      spyOnProperty(component, 'isActive').and.returnValue(false);

      fixture.detectChanges();

      const stepperCircleActive = nativeElement.querySelector('.po-stepper-circle-active');

      expect(stepperCircleActive).toBeTruthy();
    });

    it('shouldn`t find `po-stepper-circle-active` if `isError` and `isActive` is false.', () => {
      spyOnProperty(component, 'isError').and.returnValue(false);
      spyOnProperty(component, 'isActive').and.returnValue(false);

      fixture.detectChanges();

      const stepperCircleActive = nativeElement.querySelector('.po-stepper-circle-active');

      expect(stepperCircleActive).toBeNull();
    });

    it('should find `po-icon` if `isDone` is true.', () => {
      component.icons = false;
      spyOnProperty(component, 'isDone').and.returnValue(true);

      fixture.detectChanges();

      const poIcon = nativeElement.querySelector('.po-icon');
      expect(poIcon).toBeTruthy();
    });

    it('shouldn`t find `po-icon` if `isDone` and `icons` is false.', () => {
      component.icons = false;
      spyOnProperty(component, 'isDone').and.returnValue(false);

      fixture.detectChanges();

      const poIcon = nativeElement.querySelector('.po-icon');
      expect(poIcon).toBeNull();
    });

    it('should apply `iconActive` from Phosphor library if `status` is `Active` and `iconActive` is set.', () => {
      component.status = PoStepperStatus.Active;
      component.iconActive = 'an an-anchor';
      fixture.detectChanges();

      const activeIcon = nativeElement.querySelector('po-icon')?.querySelector('i');
      expect(activeIcon).toBeTruthy();
      expect(activeIcon.classList.contains('an-anchor')).toBeTrue();
    });

    it('should apply `iconActive` from Icons library if `status` is `Active` and `iconActive` is set.', () => {
      component.status = PoStepperStatus.Active;
      component.iconActive = 'po-icon po-icon-device-notebook';
      fixture.detectChanges();

      const activeIcon = nativeElement.querySelector('po-icon')?.querySelector('i');
      expect(activeIcon).toBeTruthy();
      expect(activeIcon.classList.contains('po-icon-device-notebook')).toBeTrue();
    });

    it('should apply `ICON_EDIT` if `status` is `Active` and `iconActive` is not set.', () => {
      component.status = PoStepperStatus.Active;
      component.iconActive = undefined;
      fixture.detectChanges();

      const activeIcon = PoIconEdit();

      expect(activeIcon).toBeTruthy();
      expect(activeIcon.classList.contains('an-pencil-simple')).toBeTrue();
    });

    it('should apply `iconDone` from Phosphor library if `status` is `Done` and `iconDone` is set.', () => {
      component.status = PoStepperStatus.Done;
      component.iconDone = 'an an-check-circle';
      fixture.detectChanges();

      const doneIcon = nativeElement.querySelector('po-icon')?.querySelector('i');

      expect(doneIcon).toBeTruthy();
      expect(doneIcon.classList.contains('an-check-circle')).toBeTrue();
    });

    it('should apply `iconDone` from Icons library if `status` is `Done` and `iconDone` is set.', () => {
      component.status = PoStepperStatus.Done;
      component.iconDone = 'po-icon-clock';
      fixture.detectChanges();

      const doneIcon = nativeElement.querySelector('po-icon')?.querySelector('i');

      expect(doneIcon.classList.contains('po-icon-clock')).toBeTrue();
    });

    it('should apply `ICON_OK` if `status` is `Done` and `iconDone` is not set.', () => {
      component.status = PoStepperStatus.Done;
      component.iconDone = undefined;
      fixture.detectChanges();

      const doneIcon = PoIconOk;
      expect(doneIcon).toBeTruthy();
    });

    it('should apply `iconDefault` from Phosphor library if `status` is `Default` or `Disabled` and `iconDefault` is set.', () => {
      component.status = PoStepperStatus.Default;
      component.iconDefault = 'an an-first-aid';
      fixture.detectChanges();

      let defaultIcon = nativeElement.querySelector('po-icon')?.querySelector('i');
      expect(defaultIcon).toBeTruthy();
      expect(defaultIcon.classList.contains('an-first-aid')).toBeTrue();

      component.status = PoStepperStatus.Disabled;
      fixture.detectChanges();

      defaultIcon = nativeElement.querySelector('po-icon')?.querySelector('i');
      expect(defaultIcon).toBeTruthy();
      expect(defaultIcon.classList.contains('an-first-aid')).toBeTrue();
    });

    it('should apply `iconDefault` from Icons library if `status` is `Default` or `Disabled` and `iconDefault` is set.', () => {
      component.status = PoStepperStatus.Default;
      component.iconDefault = 'po-icon po-icon-user';
      fixture.detectChanges();

      let defaultIcon = nativeElement.querySelector('po-icon')?.querySelector('i');
      expect(defaultIcon).toBeTruthy();
      expect(defaultIcon.classList.contains('po-icon-user')).toBeTrue();

      component.status = PoStepperStatus.Disabled;
      fixture.detectChanges();

      defaultIcon = nativeElement.querySelector('po-icon')?.querySelector('i');
      expect(defaultIcon).toBeTruthy();
      expect(defaultIcon.classList.contains('po-icon-user')).toBeTrue();
    });

    it('should apply `ICON_INFO` if `status` is `Default` or `Disabled`, `iconDefault` is not set, and `icons` is true.', () => {
      component.status = PoStepperStatus.Default;
      component.iconDefault = undefined;
      component.icons = true;
      fixture.detectChanges();

      const defaultIcon = PoIconInfo();
      expect(defaultIcon).toBeTruthy();
      expect(defaultIcon.classList.contains('an-info')).toBeTrue();

      component.status = PoStepperStatus.Disabled;
      fixture.detectChanges();

      const disabledIcon = PoIconInfo();
      expect(disabledIcon).toBeTruthy();
      expect(disabledIcon.classList.contains('an-info')).toBeTrue();
    });

    it('should display an empty string if `status` is `Default` or `Disabled`, `iconDefault` is not set, and `icons` is false.', () => {
      component.status = PoStepperStatus.Default;
      component.iconDefault = undefined;
      component.icons = false;
      fixture.detectChanges();

      const defaultIcon = nativeElement.querySelector('.po-stepper-circle-content');
      expect(defaultIcon.textContent.trim()).toBe('');

      component.status = PoStepperStatus.Disabled;
      fixture.detectChanges();

      const disabledIcon = nativeElement.querySelector('.po-stepper-circle-content');
      expect(disabledIcon.textContent.trim()).toBe('');
    });
  });

  function PoIconInfo() {
    return nativeElement.querySelector('po-icon')?.querySelector('i.an.an-info');
  }

  function PoIconOk() {
    return nativeElement.querySelector('.an-check');
  }

  function PoIconEdit() {
    return nativeElement.querySelector('po-icon')?.querySelector('i.an-pencil-simple');
  }
});
