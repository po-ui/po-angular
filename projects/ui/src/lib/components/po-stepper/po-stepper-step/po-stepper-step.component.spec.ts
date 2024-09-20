import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expectPropertiesValues } from './../../../util-test/util-expect.spec';

import { PoStepperModule } from '../po-stepper.module';
import { PoStepperOrientation } from '../enums/po-stepper-orientation.enum';
import { PoStepperStatus } from '../enums/po-stepper-status.enum';
import { PoStepperStepComponent } from './po-stepper-step.component';

describe('PoStepperStepComponent:', () => {
  let component: PoStepperStepComponent;
  let fixture: ComponentFixture<PoStepperStepComponent>;

  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoStepperModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PoStepperStepComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoStepperStepComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-label: should update label with valid values if valid values.', () => {
      const validValues = ['step', 'passo', '0', 'done'];

      expectPropertiesValues(component, 'label', validValues, validValues);
    });

    it('p-label: should update label with `literals.label circleContent` if invalid values.', () => {
      const invalidValues = [undefined, null, [], {}, 0, 10];
      component.circleContent = 1;

      component.literals.label = 'Step';

      expectPropertiesValues(component, 'label', invalidValues, `Step 1`);
    });

    it('p-status: should update property with `undefined` if invalid values.', () => {
      const invalidValues = [false, 0, undefined, null];

      expectPropertiesValues(component, 'status', invalidValues, undefined);
    });

    it('p-status: should call `activated.emit` if status is `active`.', () => {
      spyOn(component.activated, 'emit');

      component.status = PoStepperStatus.Active;

      expect(component.activated.emit).toHaveBeenCalled();
    });

    it('p-status: shouldn´t call `activated.emit` if status is different of `active`.', () => {
      spyOn(component.activated, 'emit');

      component.status = PoStepperStatus.Default;
      expect(component.activated.emit).not.toHaveBeenCalled();

      component.status = PoStepperStatus.Disabled;
      expect(component.activated.emit).not.toHaveBeenCalled();

      component.status = PoStepperStatus.Done;
      expect(component.activated.emit).not.toHaveBeenCalled();
    });

    it('p-step-size: should update property with valid values', () => {
      const validValues = [24, 32, 48, 64];

      expectPropertiesValues(component, 'stepSize', validValues, validValues);
    });

    it('p-step-size: should update property with `24` if invalid values', () => {
      const invalidValues = [undefined, null, 0, NaN, {}, [], '', 65, 23];
      const poStepperStepSizeDefault = 24;

      expectPropertiesValues(component, 'stepSize', invalidValues, poStepperStepSizeDefault);
    });

    it('p-step-icons: should update property with valid values to `true`.', () => {
      const booleanValidTrueValues = [true, 'true', 1, ''];

      expectPropertiesValues(component, 'stepIcons', booleanValidTrueValues, true);
    });

    it('p-step-icons: should update property with invalid values to `false`.', () => {
      const booleanInvalidValues = [undefined, null, 2, 'string'];

      expectPropertiesValues(component, 'stepIcons', booleanInvalidValues, false);
    });

    it('minHeightCircle: should return 32 if `stepSize` is less than or equal to 24 and orientation is vertical.', () => {
      component.stepSize = 24;
      component.isVerticalOrientation = true;

      expect(component.minHeightCircle).toBe(32);
    });

    it('minHeightCircle: should return `stepSize + 8` if `stepSize` is greater than 24 and orientation is vertical.', () => {
      component.stepSize = 40;
      component.isVerticalOrientation = true;

      expect(component.minHeightCircle).toBe(48);
    });

    it('minHeightCircle: should return 32 if `stepSize` is 24 and the orientation is horizontal.', () => {
      component.stepSize = 24;
      component.isVerticalOrientation = false;

      expect(component.minHeightCircle).toBe(32);
    });

    it('minWidthCircle: should return 32 if `stepSize` is 24 and the orientation is vertical.', () => {
      component.stepSize = 24;
      component.isVerticalOrientation = true;

      expect(component.minWidthCircle).toBe(32);
    });

    it('minWidthCircle: should return null if orientation is horizontal.', () => {
      component.isVerticalOrientation = false;

      expect(component.minWidthCircle).toBeNull();
    });
  });

  describe('Methods:', () => {
    it('getStatusClass: should return `po-stepper-step-default` if status is `active`.', () => {
      const result = component.getStatusClass(PoStepperStatus.Active);

      expect(result).toBe('po-stepper-step-default');
    });

    it('getStatusClass: should return `po-stepper-step-disabled` if status is `disabled`.', () => {
      const result = component.getStatusClass(PoStepperStatus.Disabled);

      expect(result).toBe('po-stepper-step-disabled');
    });

    it('getStatusClass: should return `po-stepper-step-default` if status is `done`.', () => {
      const result = component.getStatusClass(PoStepperStatus.Done);

      expect(result).toBe('po-stepper-step-default');
    });

    it('getStatusClass: should return `po-stepper-step-default` if status is `default`.', () => {
      const result = component.getStatusClass(PoStepperStatus.Default);

      expect(result).toBe('po-stepper-step-default');
    });

    it('getStatusClass: should return `po-stepper-step-error` if status is `error`.', () => {
      const result = component.getStatusClass(PoStepperStatus.Error);

      expect(result).toBe('po-stepper-step-error');
    });

    it('getStatusClass: should return `po-stepper-step-default` if status is `null`.', () => {
      const result = component.getStatusClass(null);

      expect(result).toBe('po-stepper-step-default');
    });

    it('getStatusClass: should return `po-stepper-step-default` if status is `undefined`.', () => {
      const result = component.getStatusClass(undefined);

      expect(result).toBe('po-stepper-step-default');
    });

    it('onClick: should call `click.emit` if `status` is different of `disabled`.', () => {
      component.status = PoStepperStatus.Active;

      spyOn(component.click, 'emit');
      component.onClick();

      expect(component.click.emit).toHaveBeenCalled();
    });

    it('onClick: shouldn´t call `click.emit` if `status` is `disabled`.', () => {
      component.status = PoStepperStatus.Disabled;

      spyOn(component.click, 'emit');
      component.onClick();

      expect(component.click.emit).not.toHaveBeenCalled();
    });

    it('onEnter: should call `click.emit` if `status` is different of `disabled`.', () => {
      component.status = PoStepperStatus.Active;

      spyOn(component.enter, 'emit');
      component.onEnter();

      expect(component.enter.emit).toHaveBeenCalled();
    });

    it('onEnter: shouldn´t call `click.emit` if `status` is `disabled`.', () => {
      component.status = PoStepperStatus.Disabled;

      spyOn(component.enter, 'emit');
      component.onEnter();

      expect(component.enter.emit).not.toHaveBeenCalled();
    });

    it('setDefaultStepSize: should increase step size by 8px if status is `Active` and step size is default.', () => {
      (component as any)._stepSize = 24;
      component.status = PoStepperStatus.Active;

      component.setDefaultStepSize();

      expect((component as any)._stepSize).toBe(32);
    });

    it('setDefaultStepSize: should increase step size by 8px if status is `Error` and stepSizeOriginal is default.', () => {
      component.stepSizeOriginal = 24;
      component.status = PoStepperStatus.Error;

      component.setDefaultStepSize();

      expect((component as any)._stepSize).toBe(32);
    });

    it('setDefaultStepSize: should keep the original step size if step size is not default.', () => {
      component.stepSizeOriginal = 64;

      component.setDefaultStepSize();

      expect((component as any)._stepSize).toBe(64);
    });

    it('should update stepSizeOriginal and call setDefaultStepSize if stepSize changes and stepSizeOriginal is undefined', () => {
      (component as any)._stepSize = 40;
      component.stepSizeOriginal = undefined;

      spyOn(component, 'setDefaultStepSize');

      const changes = {
        stepSize: { currentValue: 40, previousValue: 30, firstChange: false, isFirstChange: () => false }
      };

      component.ngOnChanges(changes);

      expect(component.stepSizeOriginal).toBe((component as any)._stepSize);
      expect(component.setDefaultStepSize).toHaveBeenCalled();
    });

    it('should call setDefaultStepSize if status changes', () => {
      component.stepSizeOriginal = 30;

      spyOn(component, 'setDefaultStepSize');

      const changes = {
        status: {
          currentValue: PoStepperStatus.Active,
          previousValue: PoStepperStatus.Default,
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.ngOnChanges(changes);

      expect(component.setDefaultStepSize).toHaveBeenCalled();
    });

    it('should call setDefaultStepSize if both stepSize and status change', () => {
      component.stepSizeOriginal = 30;

      spyOn(component, 'setDefaultStepSize');

      const changes = {
        stepSize: { currentValue: 40, previousValue: 30, firstChange: false, isFirstChange: () => false },
        status: {
          currentValue: PoStepperStatus.Active,
          previousValue: PoStepperStatus.Default,
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.ngOnChanges(changes);

      expect(component.setDefaultStepSize).toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    const elementByClass = (className: string) => nativeElement.querySelector(`.${className}`);

    it('should find `po-stepper-step-container` and it not contains width if `orientation` is `horizontal`.', () => {
      component.orientation = PoStepperOrientation.Horizontal;
      component.stepSize = 60;

      fixture.detectChanges();

      const stepperContainer = elementByClass('po-stepper-step-container');

      expect(stepperContainer).toBeTruthy();
      expect(stepperContainer.style.width).toBe('');
    });

    it('should find `po-stepper-circle` and it contains height and width with 24px if stepSize is greater than 64.', () => {
      component.orientation = PoStepperOrientation.Horizontal;
      component.label = 'Step 1';
      component.stepSize = 68;

      fixture.detectChanges();

      const stepperCircle = elementByClass('po-stepper-circle');

      expect(stepperCircle).toBeTruthy();
      expect(stepperCircle.style.width).toBe('24px');
      expect(stepperCircle.style.height).toBe('24px');
    });

    it('should find `po-stepper-circle` and it contains height and width with 24px if stepSize is less than 24.', () => {
      component.orientation = PoStepperOrientation.Horizontal;
      component.label = 'Step 1';
      component.stepSize = 23;

      fixture.detectChanges();

      const stepperCircle = elementByClass('po-stepper-circle');

      expect(stepperCircle).toBeTruthy();
      expect(stepperCircle.style.width).toBe('24px');
      expect(stepperCircle.style.height).toBe('24px');
    });

    it('should add class `po-stepper-step-default` if step active.', () => {
      component.orientation = PoStepperOrientation.Horizontal;
      component.status = PoStepperStatus.Active;
      component.label = 'Step 1';

      fixture.detectChanges();

      expect(elementByClass('po-stepper-step-default')).toBeTruthy();
    });

    it('should add class `po-stepper-step-disabled` if step disabled.', () => {
      component.status = PoStepperStatus.Disabled;
      component.label = 'Step 1';

      fixture.detectChanges();

      expect(elementByClass('po-stepper-step-disabled')).toBeTruthy();
    });

    it('should add class `po-stepper-step-default` if step done.', () => {
      component.status = PoStepperStatus.Done;
      component.label = 'Step 1';

      fixture.detectChanges();

      expect(elementByClass('po-stepper-step-default')).toBeTruthy();
    });

    it('should add class `po-stepper-step-default` if step default.', () => {
      component.status = PoStepperStatus.Default;
      component.label = 'Step 1';

      fixture.detectChanges();

      expect(elementByClass('po-stepper-step-default')).toBeTruthy();
    });

    it('should change `tabindex` to `-1` if component is disabled', () => {
      component.status = PoStepperStatus.Disabled;
      fixture.detectChanges();

      const poStepperStepElement = nativeElement.querySelector('.po-stepper-step[tabindex="-1"]');

      expect(poStepperStepElement).toBeTruthy();
    });

    it('should change `tabindex` to `0` if component isn’t disabled', () => {
      component.status = PoStepperStatus.Active;
      fixture.detectChanges();

      const poStepperStepElement = nativeElement.querySelector('.po-stepper-step[tabindex="0"]');

      expect(poStepperStepElement).toBeTruthy();
    });
  });
});
