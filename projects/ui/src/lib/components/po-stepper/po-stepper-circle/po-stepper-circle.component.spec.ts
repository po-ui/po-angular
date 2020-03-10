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
    it('should change `tabindex` to `-1` if component is disabled', () => {
      component.status = PoStepperStatus.Disabled;
      fixture.detectChanges();

      const poStepperCircleElement = nativeElement.querySelector('.po-stepper-circle[tabindex="-1"]');

      expect(poStepperCircleElement).toBeTruthy();
    });

    it('should change `tabindex` to `0` if component isn`t disabled', () => {
      component.status = PoStepperStatus.Active;
      fixture.detectChanges();

      const poStepperCircleElement = nativeElement.querySelector('.po-stepper-circle[tabindex="0"]');

      expect(poStepperCircleElement).toBeTruthy();
    });

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

    it('should find `po-stepper-circle-with-icon` if `icons` is `true`.', () => {
      component.icons = true;

      fixture.detectChanges();
      const StepperCircleWitchIcon = nativeElement.querySelector('.po-stepper-circle-with-icon');
      const iconClass = nativeElement.querySelector('.po-icon');

      expect(StepperCircleWitchIcon).toBeTruthy();
      expect(iconClass).toBeTruthy();
    });

    it('shouldn`t find `po-stepper-circle-with-icon` and `po-icon` if `icons` is `false`.', () => {
      component.icons = false;

      fixture.detectChanges();
      const StepperCircleWitchIcon = nativeElement.querySelector('.po-stepper-circle-with-icon');
      const iconClass = nativeElement.querySelector('.po-icon');

      expect(StepperCircleWitchIcon).toBeNull();
      expect(iconClass).toBeNull();
    });

    it('should find `po-icon-info` if `status` is `Active`, `Default` or `Disabled` and `icons` is true.', () => {
      component.icons = true;

      component.status = PoStepperStatus.Active;
      fixture.detectChanges();
      expect(PoIconInfo()).toBeTruthy();

      component.status = PoStepperStatus.Default;
      fixture.detectChanges();
      expect(PoIconInfo()).toBeTruthy();

      component.status = PoStepperStatus.Disabled;
      fixture.detectChanges();
      expect(PoIconInfo()).toBeTruthy();

      component.status = PoStepperStatus.Error;
      fixture.detectChanges();
      expect(PoIconInfo()).toBeNull();
    });

    it('should find `po-icon-ok` if `status` is `Done` and `icons` is true.', () => {
      component.icons = true;

      component.status = PoStepperStatus.Done;
      fixture.detectChanges();
      expect(PoIconOk()).toBeTruthy();

      component.status = PoStepperStatus.Default;
      fixture.detectChanges();
      expect(PoIconOk()).toBeNull();

      component.status = PoStepperStatus.Disabled;
      fixture.detectChanges();
      expect(PoIconOk()).toBeNull();

      component.status = PoStepperStatus.Error;
      fixture.detectChanges();
      expect(PoIconOk()).toBeNull();
    });

    it('should find `icon-exclamation` if `status` is `Error` and `icons` is true.', () => {
      component.icons = true;

      component.status = PoStepperStatus.Error;
      fixture.detectChanges();
      expect(PoIconExclamation()).toBeTruthy();

      component.status = PoStepperStatus.Default;
      fixture.detectChanges();
      expect(PoIconExclamation()).toBeNull();

      component.status = PoStepperStatus.Disabled;
      fixture.detectChanges();
      expect(PoIconExclamation()).toBeNull();
    });
  });

  function PoIconInfo() {
    return nativeElement.querySelector('.po-icon-info');
  }

  function PoIconOk() {
    return nativeElement.querySelector('.po-icon-ok');
  }

  function PoIconExclamation() {
    return nativeElement.querySelector('.po-icon-exclamation');
  }
});
