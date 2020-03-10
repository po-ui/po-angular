import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite, expectPropertiesValues } from './../../../util-test/util-expect.spec';

import { PoStepperModule } from '../po-stepper.module';
import { PoStepperOrientation } from '../enums/po-stepper-orientation.enum';
import { PoStepperStatus } from '../enums/po-stepper-status.enum';
import { PoStepperStepComponent } from './po-stepper-step.component';

describe('PoStepperStepComponent:', () => {
  let component: PoStepperStepComponent;
  let fixture: ComponentFixture<PoStepperStepComponent>;

  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoStepperModule]
    });
  });

  beforeEach(() => {
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

    it('halfStepSize: should return half of step size.', () => {
      const expectedValue = 24;

      component.stepSize = 48;

      expect(component.halfStepSize).toBe(expectedValue);
    });

    it('isVerticalOrientation: should return `true` if `orientation` is `vertical`.', () => {
      component.orientation = PoStepperOrientation.Vertical;

      expect(component.isVerticalOrientation).toBeTruthy();
    });

    it('isVerticalOrientation: should return `false` if `orientation` is `horizontal`.', () => {
      component.orientation = PoStepperOrientation.Horizontal;

      expect(component.isVerticalOrientation).toBeFalsy();
    });

    it('marginHorizontalBar: should return half of step size if `orientation` is `horizontal`.', () => {
      const defaultHalftStepSize = 12;

      component.stepSize = 24;
      component.orientation = PoStepperOrientation.Horizontal;

      expect(component.marginHorizontalBar).toBe(defaultHalftStepSize);
    });

    it('marginHorizontalBar: should return undefined if `orientation` is `vertical`.', () => {
      component.orientation = PoStepperOrientation.Vertical;

      expect(component.marginHorizontalBar).toBeUndefined();
    });

    it('p-step-icons: should update property with valid values to `true`.', () => {
      const booleanValidTrueValues = [true, 'true', 1, ''];

      expectPropertiesValues(component, 'stepIcons', booleanValidTrueValues, true);
    });

    it('p-step-icons: should update property with invalid values to `false`.', () => {
      const booleanInvalidValues = [undefined, null, 2, 'string'];

      expectPropertiesValues(component, 'stepIcons', booleanInvalidValues, false);
    });
  });

  describe('Methods:', () => {
    it('getStatusClass: should return `po-stepper-step-active` if status is `active`.', () => {
      const result = component.getStatusClass(PoStepperStatus.Active);

      expect(result).toBe('po-stepper-step-active');
    });

    it('getStatusClass: should return `po-stepper-step-disabled` if status is `disabled`.', () => {
      const result = component.getStatusClass(PoStepperStatus.Disabled);

      expect(result).toBe('po-stepper-step-disabled');
    });

    it('getStatusClass: should return `po-stepper-step-done` if status is `done`.', () => {
      const result = component.getStatusClass(PoStepperStatus.Done);

      expect(result).toBe('po-stepper-step-done');
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
  });

  describe('Templates:', () => {
    const elementByClass = (className: string) => nativeElement.querySelector(`.${className}`);

    it(`should find 'po-stepper-step-container' and style.width is stepSize value if 'isVerticalOrientation' is 'true'.`, () => {
      component.orientation = PoStepperOrientation.Vertical;
      component.stepSize = 60;

      fixture.detectChanges();

      const stepperContainer = elementByClass('po-stepper-step-container');

      expect(stepperContainer).toBeTruthy();
      expect(stepperContainer.style.width).toBe('60px');
    });

    it('should find `po-stepper-step-container` and it not contains width if `orientation` is `horizontal`.', () => {
      component.orientation = PoStepperOrientation.Horizontal;
      component.stepSize = 60;

      fixture.detectChanges();

      const stepperContainer = elementByClass('po-stepper-step-container');

      expect(stepperContainer).toBeTruthy();
      expect(stepperContainer.style.width).toBe('');
    });

    it(`should create class 'po-stepper-step-bar-left' and 'po-stepper-step-bar-right' if 'p-orientation' is 'horizontal'.`, () => {
      component.orientation = PoStepperOrientation.Horizontal;
      component.label = 'Step 1';

      fixture.detectChanges();

      const stepperBarLeft = elementByClass('po-stepper-step-bar-left');
      const stepperBarRight = elementByClass('po-stepper-step-bar-right');

      expect(stepperBarLeft).toBeTruthy();
      expect(stepperBarRight).toBeTruthy();
      expect(elementByClass('po-stepper-bar-top')).toBeFalsy();
      expect(elementByClass('po-stepper-bar-bottom')).toBeFalsy();
    });

    it(`should create class 'po-stepper-step-bar-top' and 'po-stepper-step-bar-bottom' if 'p-orientation' is 'vertical'.`, () => {
      component.orientation = PoStepperOrientation.Vertical;
      component.label = 'Step 1';

      fixture.detectChanges();

      const stepperBarLeft = elementByClass('po-stepper-step-bar-left');
      const stepperBarRight = elementByClass('po-stepper-step-bar-right');

      expect(stepperBarLeft).toBeFalsy();
      expect(stepperBarRight).toBeFalsy();
      expect(elementByClass('po-stepper-step-bar-top')).toBeTruthy();
      expect(elementByClass('po-stepper-step-bar-bottom')).toBeTruthy();
    });

    it(`should add margin-left and margin-right in 'step-bar-left' and 'step-bar-right' with 'marginHorizontalBar'.`, () => {
      const marginHorizontalBar = 12;
      component.orientation = PoStepperOrientation.Horizontal;
      component.label = 'Step 1';

      spyOnProperty(component, 'marginHorizontalBar').and.returnValue(marginHorizontalBar);

      fixture.detectChanges();

      const stepperBarLeft = elementByClass('po-stepper-step-bar-left');
      const stepperBarRight = elementByClass('po-stepper-step-bar-right');

      expect(stepperBarLeft.style.marginRight).toBe(`${marginHorizontalBar}px`);
      expect(stepperBarRight.style.marginLeft).toBe(`${marginHorizontalBar}px`);
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

    it('should add class `po-stepper-step-active` if step active.', () => {
      component.orientation = PoStepperOrientation.Horizontal;
      component.status = PoStepperStatus.Active;
      component.label = 'Step 1';

      fixture.detectChanges();

      expect(elementByClass('po-stepper-step-active')).toBeTruthy();
    });

    it('should add class `po-stepper-step-disabled` if step disabled.', () => {
      component.status = PoStepperStatus.Disabled;
      component.label = 'Step 1';

      fixture.detectChanges();

      expect(elementByClass('po-stepper-step-disabled')).toBeTruthy();
    });

    it('should add class `po-stepper-step-done` if step done.', () => {
      component.status = PoStepperStatus.Done;
      component.label = 'Step 1';

      fixture.detectChanges();

      expect(elementByClass('po-stepper-step-done')).toBeTruthy();
    });

    it('should add class `po-stepper-step-default` if step default.', () => {
      component.status = PoStepperStatus.Default;
      component.label = 'Step 1';

      fixture.detectChanges();

      expect(elementByClass('po-stepper-step-default')).toBeTruthy();
    });
  });
});
