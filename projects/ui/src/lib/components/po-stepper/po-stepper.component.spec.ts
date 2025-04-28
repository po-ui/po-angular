import { QueryList } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { PoStepperOrientation } from './enums/po-stepper-orientation.enum';
import { PoStepperStatus } from './enums/po-stepper-status.enum';
import { PoStepComponent } from './po-step/po-step.component';
import { PoStepperBaseComponent } from './po-stepper-base.component';
import { PoStepperComponent } from './po-stepper.component';
import { PoStepperModule } from './po-stepper.module';
import { PoStepperItem } from './po-stepper-item.interface';

describe('PoStepperComponent:', () => {
  let component: PoStepperComponent;
  let fixture: ComponentFixture<PoStepperComponent>;

  let nativeElement: any;

  let poSteps = [];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PoStepperModule]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoStepperComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;

    poSteps = [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
      { id: '5', label: 'Step 5' }
    ];
  });

  it('should be created', () => {
    expect(component instanceof PoStepperBaseComponent).toBeTruthy();
    expect(component instanceof PoStepperComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('currentStepIndex: should return `step` - 1.', () => {
      component.steps = [{ label: 'Step 1' }, { label: 'Step 2' }];
      component.step = 1;

      expect(component.currentStepIndex).toEqual(0);
    });

    it('stepList: should return `poSteps` if `usePoSteps` is true.', () => {
      Object.assign(component.usePoSteps, true);
      component.poSteps = <any>[{ label: 'Step 1' }];

      expect(component.stepList).toEqual([{ label: 'Step 1' }]);
    });

    it('stepList: should return `steps` if `usePoSteps` is false.', () => {
      Object.assign(component.usePoSteps, false);
      component.poSteps = <any>[{ label: 'Step 1' }];
      component.steps = [{ label: 'Step 1' }];

      expect(component.stepList).toEqual([{ label: 'Step 1' }]);
    });
  });

  describe('Methods:', () => {
    it('ngAfterContentInit: should call `activeFirstStep`', () => {
      const spyOnActiveFirstStep = spyOn(component, <any>'activeFirstStep');

      component.ngAfterContentInit();

      expect(spyOnActiveFirstStep).toHaveBeenCalled();
    });

    it('ngAfterContentInit: should call `controlStepsStatus` when `poSteps` is changed', () => {
      const spyOncontrolStepsStatus = spyOn(component, <any>'controlStepsStatus');

      spyOn(component.poSteps.changes, 'subscribe').and.callFake(callback => callback());

      component.ngAfterContentInit();

      expect(spyOncontrolStepsStatus).toHaveBeenCalledWith(component.poSteps.first);
    });

    it('active: shouldn`t call `getPoSteps` and `changeStep` if `usePoSteps` is false', () => {
      spyOnProperty(component, 'usePoSteps').and.returnValue(false);

      const spyOnGetPoSteps = spyOn(component, <any>'getPoSteps');
      const spyOnChangeStep = spyOn(component, 'changeStep');

      component.active(1);

      expect(spyOnGetPoSteps).not.toHaveBeenCalled();
      expect(spyOnChangeStep).not.toHaveBeenCalled();
    });

    it('active: should call `getPoSteps` and `changeStep` with `step` active if `usePoSteps` is true and `step` not is disabled', () => {
      spyOnProperty(component, 'usePoSteps').and.returnValue(true);
      const position = 2;

      poSteps[2].status = PoStepperStatus.Default;

      const spyOnGetPoSteps = spyOn(component, <any>'getPoSteps').and.returnValue(poSteps);
      const spyOnChangeStep = spyOn(component, 'changeStep');

      component.active(position);

      expect(spyOnGetPoSteps).toHaveBeenCalled();
      expect(spyOnChangeStep).toHaveBeenCalledWith(position, poSteps[position]);
    });

    it('active: should return if index is less than 0', () => {
      spyOnProperty(component, 'usePoSteps').and.returnValue(true);

      const poSteps = [{}, {}];
      const spyOnGetPoSteps = spyOn(component, <any>'getPoSteps').and.returnValue(poSteps);
      const spyOnChangeStep = spyOn(component, 'changeStep');

      component.active(-1);

      expect(spyOnGetPoSteps).toHaveBeenCalled();
      expect(spyOnChangeStep).not.toHaveBeenCalled();
    });

    it('active: should return if index is greater than or equal to steps length', () => {
      spyOnProperty(component, 'usePoSteps').and.returnValue(true);

      const poSteps = [{}, {}];
      const spyOnGetPoSteps = spyOn(component, <any>'getPoSteps').and.returnValue(poSteps);
      const spyOnChangeStep = spyOn(component, 'changeStep');

      component.active(3);

      expect(spyOnGetPoSteps).toHaveBeenCalled();
      expect(spyOnChangeStep).not.toHaveBeenCalled();
    });

    it('first: shouldn`t call `changeStep` if `usePoSteps` is false', () => {
      spyOnProperty(component, 'usePoSteps').and.returnValue(false);

      const spyOnChangeStep = spyOn(component, 'changeStep');

      component.first();

      expect(spyOnChangeStep).not.toHaveBeenCalled();
    });

    it('first: should call `changeStep` with first step if `usePoSteps` is true', () => {
      const firstStepIndex = 0;
      spyOnProperty(component, 'usePoSteps').and.returnValue(true);

      const spyOnChangeStep = spyOn(component, 'changeStep');

      component.first();

      expect(spyOnChangeStep).toHaveBeenCalledWith(firstStepIndex, component.poSteps.first);
    });

    it('next: shouldn`t call `changeStep` if `usePoSteps` is false', () => {
      spyOnProperty(component, 'usePoSteps').and.returnValue(false);

      const spyOnChangeStep = spyOn(component, 'changeStep');

      component.next();

      expect(spyOnChangeStep).not.toHaveBeenCalled();
    });

    it('next: should call `getStepsAndIndex` with `currentActiveStep` and `changeStep` with next step if `usePoSteps` is true', () => {
      const nextStepIndex = 2;
      const nextStep = poSteps[2];
      const currentStepIndex = 1;
      const currentStep = poSteps[1];

      component['currentActiveStep'] = currentStep;

      spyOnProperty(component, 'usePoSteps').and.returnValue(true);
      spyOn(component, <any>'getStepsAndIndex').and.returnValue({ steps: poSteps, stepIndex: currentStepIndex });

      const spyOnChangeStep = spyOn(component, 'changeStep');

      component.next();

      expect(spyOnChangeStep).toHaveBeenCalledWith(nextStepIndex, nextStep);
    });

    it('next: should return if next index is greater than or equal to steps length', () => {
      spyOnProperty(component, 'usePoSteps').and.returnValue(true);

      const steps = [{}, {}];
      spyOn(component, <any>'getStepsAndIndex').and.returnValue({ steps, stepIndex: 1 });
      const spyOnChangeStep = spyOn(component, 'changeStep');

      component.next();

      expect(spyOnChangeStep).not.toHaveBeenCalled();
    });

    it('previous: shouldn`t call `changeStep` if `usePoSteps` is false', () => {
      spyOnProperty(component, 'usePoSteps').and.returnValue(false);

      const spyOnChangeStep = spyOn(component, 'changeStep');

      component.previous();

      expect(spyOnChangeStep).not.toHaveBeenCalled();
    });

    it(`previous: should call 'getStepsAndIndex' with 'currentActiveStep' and 'changeStep' with previous step if
      'usePoSteps' is true`, () => {
      const previousStepIndex = 1;
      const previousStep = poSteps[1];
      const currentStepIndex = 2;
      const currentStep = poSteps[2];

      component['currentActiveStep'] = currentStep;

      spyOnProperty(component, 'usePoSteps').and.returnValue(true);
      spyOn(component, <any>'getStepsAndIndex').and.returnValue({ steps: poSteps, stepIndex: currentStepIndex });

      const spyOnChangeStep = spyOn(component, 'changeStep');

      component.previous();

      expect(spyOnChangeStep).toHaveBeenCalledWith(previousStepIndex, previousStep);
    });

    it('previous: should return if previous index is less than 0', () => {
      spyOnProperty(component, 'usePoSteps').and.returnValue(true);

      const steps = [{}, {}];
      spyOn(component, <any>'getStepsAndIndex').and.returnValue({ steps, stepIndex: 0 });
      const spyOnChangeStep = spyOn(component, 'changeStep');

      component.previous();

      expect(spyOnChangeStep).not.toHaveBeenCalled();
    });

    it(`changeStep: should call 'controlStepsStatus' and 'onChangeStep.emit' with 'step' if usePoSteps and
      allowNextStep are true and 'step' is different of 'currentActiveStep'`, () => {
      const poStepMock = { id: 'A1BC' };
      const poStepCurrentMock = { id: 'XYZ' };
      const stepIndex = 1;

      component['currentActiveStep'] = <any>poStepCurrentMock;

      spyOn(component, <any>'allowNextStep').and.returnValue(of(true));
      spyOnProperty(component, 'usePoSteps').and.returnValue(true);

      const spyOncontrolStepsStatus = spyOn(component, <any>'controlStepsStatus');
      const spyOnChangeStep = spyOn(component.onChangeStep, 'emit');

      component.changeStep(stepIndex, <any>poStepMock);

      expect(spyOncontrolStepsStatus).toHaveBeenCalledWith(<any>poStepMock);
      expect(spyOnChangeStep).toHaveBeenCalledWith(<any>poStepMock);
    });

    it(`changeStep: should call 'controlStepsStatus' and 'onChangeStep.emit' with 'step' if usePoSteps and
      allowNextStep are true and 'currentActiveStep' is undefined`, () => {
      const poStepMock = { id: 'A1BC' };
      const stepIndex = 1;

      component['currentActiveStep'] = undefined;

      spyOn(component, <any>'allowNextStep').and.returnValue(of(true));
      spyOnProperty(component, 'usePoSteps').and.returnValue(true);

      const spyOncontrolStepsStatus = spyOn(component, <any>'controlStepsStatus');
      const spyOnChangeStep = spyOn(component.onChangeStep, 'emit');

      component.changeStep(stepIndex, <any>poStepMock);

      expect(spyOncontrolStepsStatus).toHaveBeenCalledWith(<any>poStepMock);
      expect(spyOnChangeStep).toHaveBeenCalledWith(<any>poStepMock);
    });

    it('changeStep: shouldn`t call `onChangeStep.emit` if `allowNextStep` return false', () => {
      const stepNumber = 3;
      const stepMock = { id: 'step-3' } as PoStepComponent;

      component.step = 1;
      component['currentActiveStep'] = { id: 'step-99' } as PoStepComponent;

      const spyAllowNextStep = spyOn(component, <any>'allowNextStep').and.returnValue(of(false));
      const spyOnChangeStep = spyOn(component.onChangeStep, 'emit');

      component.changeStep(stepNumber, stepMock);

      expect(spyAllowNextStep).toHaveBeenCalledWith(stepNumber, stepMock);
      expect(spyOnChangeStep).not.toHaveBeenCalled();
    });

    it('changeStep: shouldn`t call `onChangeStep.emit` if `stepNumber` param is same than `step`', () => {
      const stepNumber = 1;

      spyOnProperty(component, 'currentStepIndex').and.returnValue(1);

      const spyOnChangeStep = spyOn(component.onChangeStep, 'emit');

      component.changeStep(stepNumber);

      expect(spyOnChangeStep).not.toHaveBeenCalled();
    });

    it('changeStep: should call `onChangeStep.emit` if `stepIndex` param is diff than `step` and `allowNextStep` return true', fakeAsync(() => {
      const stepIndex = 3;
      const stepMock = { id: 'step-3' } as PoStepComponent;

      spyOnProperty(component, 'currentStepIndex').and.returnValue(1);
      spyOnProperty(component, 'usePoSteps').and.returnValue(true);

      const spyAllowNextStep = spyOn(component, <any>'allowNextStep').and.returnValue(of(true));
      const spyOnChangeStep = spyOn(component.onChangeStep, 'emit');

      component.changeStep(stepIndex, stepMock);
      flush();

      expect(spyAllowNextStep).toHaveBeenCalledWith(stepIndex, stepMock);
      expect(spyOnChangeStep).toHaveBeenCalledWith(stepMock);
    }));

    it('should call `onChangeStep.emit` with `stepIndex + 1` if `usePoSteps` is false and stepIndex is different from currentStepIndex', fakeAsync(() => {
      const stepIndex = 2;
      const mockStep = { id: 'step-2' } as any;

      spyOnProperty(component, 'usePoSteps').and.returnValue(false);
      spyOnProperty(component, 'currentStepIndex').and.returnValue(0);

      const spyAllowNextStep = spyOn(component as any, 'allowNextStep').and.returnValue(of(true));
      const spyOnChangeStep = spyOn(component.onChangeStep, 'emit');

      component.changeStep(stepIndex, mockStep);
      flush();

      expect(spyAllowNextStep).toHaveBeenCalledWith(stepIndex, mockStep);
      expect(spyOnChangeStep).toHaveBeenCalledWith(stepIndex + 1);
    }));

    it('isDashedBorderTop: should return true when the step status is done and the previous step is not done or active', () => {
      const step = { status: 'done' } as PoStepComponent;
      const previousStep = { status: 'error' } as PoStepComponent;

      spyOn(component, 'getPreviousPoSteps').and.returnValue(previousStep);
      spyOn(component, 'getPreviousSteps').and.returnValue(previousStep);

      const result = component.isDashedBorderTop(step, 1);

      expect(result).toBeTrue();
    });

    it('isDashedBorderTop: should return false when the step status is done and the previous step is done', () => {
      const step = { status: 'done' } as PoStepComponent;
      const previousStep = { status: 'done' } as PoStepComponent;

      spyOn(component, 'getPreviousPoSteps').and.returnValue(previousStep);
      spyOn(component, 'getPreviousSteps').and.returnValue(previousStep);

      const result = component.isDashedBorderTop(step, 1);

      expect(result).toBeFalse();
    });

    it('isDashedBorderTop: should return true when the step status is active and the previous step status is error', () => {
      const step = { status: 'active' } as PoStepComponent;
      const previousStep = { status: 'error' } as PoStepComponent;

      spyOn(component, 'getPreviousPoSteps').and.returnValue(previousStep);
      spyOn(component, 'getPreviousSteps').and.returnValue(previousStep);

      const result = component.isDashedBorderTop(step, 1);

      expect(result).toBeTrue();
    });

    it('isDashedBorderTop: should return false when the step status is active and the previous step status is done', () => {
      const step = { status: 'active' } as PoStepComponent;
      const previousStep = { status: 'done' } as PoStepComponent;

      spyOn(component, 'getPreviousPoSteps').and.returnValue(previousStep);
      spyOn(component, 'getPreviousSteps').and.returnValue(previousStep);

      const result = component.isDashedBorderTop(step, 1);

      expect(result).toBeFalse();
    });

    it('isDashedBorderTop: should return true when the step status is error and the next step is done', () => {
      const step = { status: 'error' } as PoStepComponent;
      const nextStep = { status: 'done' } as PoStepComponent;

      spyOn(component, 'getNextPoSteps').and.returnValue(nextStep);

      const result = component.isDashedBorderTop(step, 1);

      expect(result).toBeTrue();
    });

    it('isDashedBorderTop: should return true when the step status is default and the previous step is not done', () => {
      const step = { status: 'default' } as PoStepComponent;
      const previousStep = { status: 'active' } as PoStepperItem;

      spyOn(component, 'getPreviousPoSteps').and.returnValue(previousStep as unknown as PoStepComponent);
      spyOn(component, 'getPreviousSteps').and.returnValue(previousStep);

      const result = component.isDashedBorderTop(step, 1);

      expect(result).toBeTrue();
    });

    it('isDashedBorderTop: should return true when the step status is disabled', () => {
      const step = { status: 'disabled' } as PoStepComponent;
      const previousStep = { status: 'default' } as PoStepperItem;

      spyOn(component, 'getPreviousPoSteps').and.returnValue(previousStep as unknown as PoStepComponent);
      spyOn(component, 'getPreviousSteps').and.returnValue(previousStep);

      const result = component.isDashedBorderTop(step, 1);

      expect(result).toBeTrue();
    });

    it('onStepActive: should set `currentActiveStep` to `currentActiveStep`', () => {
      component['currentActiveStep'] = undefined;

      const step = poSteps[1];

      component.onStepActive(step);

      expect(component['currentActiveStep']).toEqual(step);
    });

    it('onStepActive: should set previous steps with status Done', () => {
      const poStepsMock = new QueryList<PoStepComponent>();
      poStepsMock['_results'] = poSteps.map(step => ({ ...step, status: PoStepperStatus.Default }));
      component.poSteps = poStepsMock;
      component.poSteps.toArray()[0].status = PoStepperStatus.Active;

      const lastStepIndex = poSteps.length - 1;
      const lastStep = poSteps[lastStepIndex];

      component.onStepActive(lastStep);

      const stepsArray = component.poSteps.toArray();
      const everySteps = stepsArray.filter((step, index) => index < stepsArray.length - 1);
      const allIsDone = everySteps.every(step => step.status === PoStepperStatus.Done);

      expect(allIsDone).toBeTrue();
    });

    it('activeFirstStep: should call `changeStep` with first step if `usePoSteps` is true and has no step activated', () => {
      const firstStepIndex = 0;

      spyOnProperty(component, 'usePoSteps').and.returnValue(true);

      const poStepsMock = new QueryList<PoStepComponent>();
      poStepsMock['_results'] = poSteps;
      component.poSteps = poStepsMock;

      spyOn(component, 'changeStep');

      component['activeFirstStep']();

      expect(component.changeStep).toHaveBeenCalledWith(firstStepIndex, component.poSteps.first);
    });

    it('activeFirstStep: shouldn`t call `changeStep` with first step if `usePoSteps` is true and has step activated', () => {
      spyOnProperty(component, 'usePoSteps').and.returnValue(true);

      const poStepsMock = new QueryList<PoStepComponent>();
      poStepsMock['_results'] = poSteps;
      component.poSteps = poStepsMock;

      component.poSteps.toArray()[0].status = PoStepperStatus.Active;

      spyOn(component, 'changeStep');

      component['activeFirstStep']();

      expect(component.changeStep).not.toHaveBeenCalled();
    });

    it('activeFirstStep: shouldn`t call `changeStep` with first step if `usePoSteps` is false', () => {
      spyOnProperty(component, 'usePoSteps').and.returnValue(false);
      spyOn(component, 'changeStep');

      component['activeFirstStep']();

      expect(component.changeStep).not.toHaveBeenCalled();
    });

    it('allowNextStep: should return true if `sequential` is false', (done: DoneFn) => {
      const stepNumber = 1;

      component.sequential = false;

      component['allowNextStep'](stepNumber).subscribe(value => {
        expect(value).toBe(true);
        done();
      });
    });

    it('allowNextStep: should return false if `sequential` is true', (done: DoneFn) => {
      const stepNumber = 3;

      component.sequential = true;

      component.steps = poSteps;
      component.steps.forEach(step => (step.status = PoStepperStatus.Default));
      component.step = 1;

      component['allowNextStep'](stepNumber).subscribe(value => {
        expect(value).toBe(false);
        done();
      });
    });

    it('allowNextStep: should return true if `sequential` is true and every steps are status done', (done: DoneFn) => {
      const stepNumber = 1;

      component.sequential = true;

      component.steps = poSteps.map(step => ({ ...step, status: PoStepperStatus.Done }));

      component['allowNextStep'](stepNumber).subscribe(value => {
        expect(value).toBe(true);
        done();
      });
    });

    it(`allowNextStep: should return true if 'sequential', 'usePoSteps' and 'canActiveNextStep' are true and
    'isBeforeStep' is false`, (done: DoneFn) => {
      component.sequential = true;
      const nextStepIndex = 1;
      spyOnProperty(component, 'usePoSteps').and.returnValue(true);

      const spyOnCanActiveNextStep = spyOn(component, <any>'canActiveNextStep').and.returnValue(of(true));
      spyOn(component, <any>'isBeforeStep').and.returnValue(false);

      component['allowNextStep'](nextStepIndex).subscribe(value => {
        expect(value).toBe(true);
        done();
      });

      expect(spyOnCanActiveNextStep).toHaveBeenCalledWith(component['currentActiveStep'], nextStepIndex);
    });

    it('allowNextStep: should return false if `isBeforeStep` and `canActiveNextStep` are false', (done: DoneFn) => {
      component.sequential = true;
      const nextStepIndex = 1;
      spyOnProperty(component, 'usePoSteps').and.returnValue(true);

      spyOn(component, <any>'canActiveNextStep').and.returnValue(of(false));
      spyOn(component, <any>'isBeforeStep').and.returnValue(false);

      component['allowNextStep'](nextStepIndex).subscribe(value => {
        expect(value).toBe(false);
        done();
      });
    });

    it('allowNextStep: should continue if there is no step with status Default before the next step index', () => {
      const nextStepIndex = 2;

      spyOn(component as any, 'hasDefaultBeforeDone').and.returnValue(false);

      spyOn(component as any, 'checkAllowNextStep').and.returnValue(of(true));

      (component as any).allowNextStep(nextStepIndex).subscribe(result => {
        expect(result).toBe(true);
      });
    });

    it('allowNextStep: should return of(true) when checkAllowNextStep returns a boolean', () => {
      const nextStepIndex = 2;

      spyOn(component as any, 'hasDefaultBeforeDone').and.returnValue(false);

      spyOn(component as any, 'checkAllowNextStep').and.returnValue(true);

      (component as any).allowNextStep(nextStepIndex).subscribe(result => {
        expect(result).toBe(true);
      });
    });

    it('allowNextStep: should return the observable when checkAllowNextStep returns an observable', () => {
      const nextStepIndex = 2;

      spyOn(component as any, 'hasDefaultBeforeDone').and.returnValue(false);

      const observableMock = of(true);
      spyOn(component as any, 'checkAllowNextStep').and.returnValue(observableMock);

      (component as any).allowNextStep(nextStepIndex).subscribe(result => {
        expect(result).toBe(true);
      });
    });

    it('allowNextStep: should return of(false) if `sequential` is true, `hasStepWithCanActiveNextStep` is true, and `hasDefaultBeforeDone` is true', (done: DoneFn) => {
      component.sequential = true;
      const nextStepIndex = 1;

      spyOn(component as any, 'hasStepWithCanActiveNextStep').and.returnValue(true);

      spyOn(component as any, 'hasDefaultBeforeDone').and.returnValue(true);

      component['allowNextStep'](nextStepIndex).subscribe(value => {
        expect(value).toBe(false);
        done();
      });
    });

    it('allowNextStep: should return of(true) if `sequential` is true, `hasStepWithCanActiveNextStep` is true, but `hasDefaultBeforeDone` is false', (done: DoneFn) => {
      component.sequential = true;
      const nextStepIndex = 1;

      spyOn(component as any, 'hasStepWithCanActiveNextStep').and.returnValue(true);
      spyOn(component as any, 'hasDefaultBeforeDone').and.returnValue(false);
      spyOn(component as any, 'checkAllowNextStep').and.returnValue(true);

      component['allowNextStep'](nextStepIndex).subscribe(value => {
        expect(value).toBe(true);
        done();
      });

      expect(component['checkAllowNextStep']).toHaveBeenCalledWith(nextStepIndex);
    });

    it('canActiveNextStep: should return true if `currentActiveStep.canActiveNextStep` function return true', (done: DoneFn) => {
      const currentActiveStep = <PoStepComponent>{ canActiveNextStep: currentStep => true };

      component['canActiveNextStep'](currentActiveStep).subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });

    it('canActiveNextStep: should return false if `currentActiveStep.canActiveNextStep` function return false', (done: DoneFn) => {
      const currentActiveStep = <PoStepComponent>{
        canActiveNextStep: currentStep => false,
        status: PoStepperStatus.Default
      };

      component['canActiveNextStep'](currentActiveStep).subscribe(result => {
        expect(result).toBe(false);
        done();
      });
    });

    it(`canActiveNextStep: should return true if 'currentActiveStep.canActiveNextStep' function
      return an observable with true value`, (done: DoneFn) => {
      const currentActiveStep = <PoStepComponent>{ canActiveNextStep: currentStep => of(true) };

      component['canActiveNextStep'](currentActiveStep).subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });

    it(`canActiveNextStep: should return false if 'currentActiveStep.canActiveNextStep' function
      return an observable with false value`, (done: DoneFn) => {
      const currentActiveStep = <PoStepComponent>{
        canActiveNextStep: currentStep => of(false),
        status: PoStepperStatus.Default
      };

      component['canActiveNextStep'](currentActiveStep).subscribe(result => {
        expect(result).toBe(false);
        done();
      });
    });

    it(`canActiveNextStep: should return throw error and set 'currentActiveStep.status'
      with 'PoStepperStatus.Error' if some problem in observable`, (done: DoneFn) => {
      const currentActiveStep = <PoStepComponent>{
        label: 'po-label',
        canActiveNextStep: currentStep => <any>throwError(new Error('Error')),
        status: PoStepperStatus.Default
      };

      component['canActiveNextStep'](currentActiveStep).subscribe(
        () => {},
        error => {
          expect(error instanceof Error).toBe(true);
          expect(currentActiveStep.status).toEqual(PoStepperStatus.Error);

          done();
        }
      );
    });

    it('canActiveNextStep: should return true if `currentActiveStep` is undefined', (done: DoneFn) => {
      const currentActiveStep = undefined;

      component['canActiveNextStep'](currentActiveStep).subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });

    it(`canActiveNextStep: should return true and update the status to 'Done' if 'isBefore' is true and 'isCurrentStep' is false`, (done: DoneFn) => {
      const currentActiveStep = <PoStepComponent>{
        status: PoStepperStatus.Default,
        canActiveNextStep: currentStep => of(true)
      };
      const nextStepIndex = 1;

      spyOn(component as any, 'isBeforeStep').and.returnValue(true);
      spyOn(component as any, 'isCurrentStep').and.returnValue(false);

      component['canActiveNextStep'](currentActiveStep, nextStepIndex).subscribe(result => {
        expect(result).toBe(true);
        expect(currentActiveStep.status).toBe(PoStepperStatus.Done);
        done();
      });
    });

    it(`canActiveNextStep: should return true and update the status to 'Default' if 'isCanActiveNextStep' is false`, (done: DoneFn) => {
      const currentActiveStep = <PoStepComponent>{
        status: PoStepperStatus.Default,
        canActiveNextStep: currentStep => of(false)
      };
      const nextStepIndex = 1;

      spyOn(component as any, 'isBeforeStep').and.returnValue(true);
      spyOn(component as any, 'isCurrentStep').and.returnValue(false);

      component['canActiveNextStep'](currentActiveStep, nextStepIndex).subscribe(result => {
        expect(result).toBe(true);
        expect(currentActiveStep.status).toBe(PoStepperStatus.Default);
        done();
      });
    });

    it(`controlStepsStatus: shouldn't call 'isBeforeStep', 'setStepAsActive', 'setNextStepAsDefault' and
      'changeDetector.detectChanges' if 'usePoSteps' is false`, () => {
      spyOnProperty(component, 'usePoSteps').and.returnValue(false);

      const spyOnIsBeforeStep = spyOn(component, <any>'isBeforeStep');
      const spyOnSetStepAsActive = spyOn(component, <any>'setStepAsActive');
      const spyOnSetNextStepAsDefault = spyOn(component, <any>'setNextStepAsDefault');
      const spyOnDetectChanges = spyOn(component['changeDetector'], 'detectChanges');

      component['controlStepsStatus'](undefined);

      expect(spyOnIsBeforeStep).not.toHaveBeenCalled();
      expect(spyOnSetStepAsActive).not.toHaveBeenCalled();
      expect(spyOnSetNextStepAsDefault).not.toHaveBeenCalled();
      expect(spyOnDetectChanges).not.toHaveBeenCalled();
    });

    it(`controlStepsStatus: should set previous step status to 'Done' when previousActiveStepIndex is different from currentStepIndex`, () => {
      spyOnProperty(component, 'usePoSteps').and.returnValue(true);

      const poStepsMock = new QueryList<PoStepComponent>();
      const poStepList = [
        { id: '1', label: 'Step 1', status: PoStepperStatus.Active },
        { id: '2', label: 'Step 2', status: PoStepperStatus.Active },
        { id: '3', label: 'Step 3', status: PoStepperStatus.Disabled }
      ];
      poStepsMock['_results'] = poStepList;
      Object.defineProperty(poStepsMock, 'length', { value: poStepList.length });

      component.poSteps = poStepsMock;
      component['previousActiveStepIndex'] = 0;

      const stepIndex = 1;
      const step = poStepsMock['_results'][stepIndex];

      component['controlStepsStatus'](step);

      expect(poStepsMock['_results'][0].status).toBe(PoStepperStatus.Done);
    });

    it(`controlStepsStatus: shouldn't change previous step status if previousActiveStepIndex is the same as currentStepIndex`, () => {
      spyOnProperty(component, 'usePoSteps').and.returnValue(true);

      const poStepsMock = new QueryList<PoStepComponent>();
      const poStepList = [
        { id: '1', label: 'Step 1', status: PoStepperStatus.Done },
        { id: '2', label: 'Step 2', status: PoStepperStatus.Active },
        { id: '3', label: 'Step 3', status: PoStepperStatus.Disabled }
      ];
      poStepsMock['_results'] = poStepList;
      Object.defineProperty(poStepsMock, 'length', { value: poStepList.length });

      component.poSteps = poStepsMock;
      component['previousActiveStepIndex'] = 1;

      const stepIndex = 1;
      const step = poStepsMock['_results'][stepIndex];

      component['controlStepsStatus'](step);

      expect(poStepsMock['_results'][1].status).toBe(PoStepperStatus.Active);
    });

    it(`controlStepsStatus: should call 'setFinalSteppersAsDisabled' if 'usePoSteps' is true, 
      'isBeforeStep' returns true, and the next step is disabled`, () => {
      const currentStep = {
        id: '1',
        label: 'Step 1',
        status: PoStepperStatus.Active,
        canActiveNextStep: () => of(true)
      } as unknown as PoStepComponent;

      const nextStep = {
        id: '2',
        label: 'Step 2',
        status: PoStepperStatus.Disabled
      } as unknown as PoStepComponent;

      component.poSteps = new QueryList<PoStepComponent>();
      component.poSteps['_results'] = [currentStep, nextStep];
      Object.defineProperty(component.poSteps, 'length', { value: 2 });
      component['previousActiveStepIndex'] = 0;

      spyOnProperty(component, 'usePoSteps').and.returnValue(true);
      spyOn(component, <any>'isBeforeStep').and.returnValue(true);

      const spyOnSetFinalSteppersAsDisabled = spyOn(component, <any>'setFinalSteppersAsDisabled');

      component['controlStepsStatus'](currentStep);

      expect(spyOnSetFinalSteppersAsDisabled).toHaveBeenCalledWith(0);
    });

    it('calculateDividerPosition: should return the stepSize if it is between 24 and 64', () => {
      component.stepSize = 32;

      const result = component['calculateDividerPosition']();

      expect(result).toBe(32);
    });

    it('calculateDividerPosition: should return 24 if stepSize is less than 24', () => {
      component.stepSize = 20;

      const result = component['calculateDividerPosition']();

      expect(result).toBe(24);
    });

    it('calculateDividerPosition: should return 24 if stepSize is greater than 64', () => {
      component.stepSize = 70;

      const result = component['calculateDividerPosition']();

      expect(result).toBe(24);
    });

    it('getStepsAndIndex: should return the `steps` and the index of the step parameter', () => {
      const step = poSteps[0];
      const stepIndex = 0;

      spyOn(component, <any>'getPoSteps').and.returnValue(poSteps);

      const result = component['getStepsAndIndex'](step);

      expect(result).toEqual({ steps: poSteps, stepIndex });
    });

    it('getStepsAndIndex: should return the `steps` and the index with `-1` if `step` is undefined', () => {
      const step = undefined;
      const stepIndex = -1;

      spyOn(component, <any>'getPoSteps').and.returnValue(poSteps);

      const result = component['getStepsAndIndex'](step);

      expect(result).toEqual({ steps: poSteps, stepIndex });
    });

    it('getPoSteps: should return `poSteps` array', () => {
      const poStepsMock = new QueryList<PoStepComponent>();
      poStepsMock['_results'] = poSteps;
      component.poSteps = poStepsMock;

      const result = component['getPoSteps']();

      expect(result).toEqual(poSteps);
    });

    it('handleNextStep: should call `setFinalSteppersAsDisabled` if `isBeforeStep` returns true', () => {
      const currentStepIndex = 0;
      const steps = [
        { status: PoStepperStatus.Active } as PoStepComponent,
        { status: PoStepperStatus.Disabled } as PoStepComponent
      ];

      spyOn(component, <any>'isBeforeStep').and.returnValue(true);
      const spyOnSetFinalSteppersAsDisabled = spyOn(component, <any>'setFinalSteppersAsDisabled');

      component['handleNextStep'](steps, currentStepIndex);

      expect(spyOnSetFinalSteppersAsDisabled).toHaveBeenCalledWith(currentStepIndex);
    });

    it('hasDefaultBeforeDone: should return true if there is a step with status Default before the next step index', () => {
      const nextStepIndex = 2;

      spyOn(component as any, 'getPoSteps').and.returnValue([
        { status: PoStepperStatus.Active } as PoStepComponent,
        { status: PoStepperStatus.Default } as PoStepComponent,
        { status: PoStepperStatus.Done } as PoStepComponent
      ]);

      const result = (component as any).hasDefaultBeforeDone(nextStepIndex);

      expect(result).toBe(true);
    });

    it(`isBeforeStep: should return true if 'currentActiveStep' is defined and 'currentActiveStepIndex' is
      greater than 'stepIndex'`, () => {
      const stepIndex = 2;
      component['currentActiveStep'] = poSteps[3];

      spyOn(component, <any>'getPoSteps').and.returnValue(poSteps);

      const result = component['isBeforeStep'](stepIndex);

      expect(result).toBe(true);
    });

    it(`isBeforeStep: should return true if 'currentActiveStep' is defined and 'currentActiveStepIndex' is equal to 'stepIndex'`, () => {
      const stepIndex = 2;
      component['currentActiveStep'] = poSteps[2];

      spyOn(component, <any>'getPoSteps').and.returnValue(poSteps);

      const result = component['isBeforeStep'](stepIndex);

      expect(result).toBe(true);
    });

    it(`isBeforeStep: should return false if 'currentActiveStep' is defined and 'currentActiveStepIndex' is less than 'stepIndex'`, () => {
      const stepIndex = 3;
      component['currentActiveStep'] = poSteps[2];

      spyOn(component, <any>'getPoSteps').and.returnValue(poSteps);

      const result = component['isBeforeStep'](stepIndex);

      expect(result).toBe(false);
    });

    it(`isBeforeStep: should return false if 'currentActiveStep' is undefined`, () => {
      const stepIndex = 3;
      component['currentActiveStep'] = undefined;

      spyOn(component, <any>'getPoSteps').and.returnValue(poSteps);

      const result = component['isBeforeStep'](stepIndex);

      expect(result).toBe(false);
    });

    it('isCurrentStep: should return true when the currentActiveStep id matches the stepIndex', () => {
      spyOn(component as any, 'getPoSteps').and.returnValue([
        { id: 'step-1', status: PoStepperStatus.Active } as PoStepComponent,
        { id: 'step-2', status: PoStepperStatus.Default } as PoStepComponent,
        { id: 'step-3', status: PoStepperStatus.Disabled } as PoStepComponent
      ]);

      component['currentActiveStep'] = { id: 'step-1' } as PoStepComponent;
      const stepIndex = 0;

      const result = component['isCurrentStep'](stepIndex);
      expect(result).toBe(true);
    });

    it('setFinalSteppersAsDisabled: should set steppers as `disabled` if stepper index is greather than stepper active + 2.', () => {
      const stepIndex = 0;
      const poStepsMock = new QueryList<PoStepComponent>();
      poStepsMock['_results'] = poSteps;
      component.poSteps = poStepsMock;

      component['setFinalSteppersAsDisabled'](stepIndex);

      const steppers = component.poSteps.toArray();

      expect(steppers[2].status).toEqual(PoStepperStatus.Disabled);
      expect(steppers[3].status).toEqual(PoStepperStatus.Disabled);
      expect(steppers[4].status).toEqual(PoStepperStatus.Disabled);
    });

    it('setStepAsActive: should set `step.status` as `active`.', () => {
      const step: PoStepComponent = <any>{ label: 'Step 1', status: PoStepperStatus.Default };

      component['setStepAsActive'](step);

      expect(step.status).toEqual(PoStepperStatus.Active);
    });

    it('setNextStepAsDefault: should call `getStepsAndIndex` with `currentStep`.', () => {
      const step = poSteps[0];
      spyOn(component, <any>'getStepsAndIndex').and.returnValue({ step: step, stepIndex: 0 });

      component['setNextStepAsDefault'](step);

      expect(component['getStepsAndIndex']).toHaveBeenCalledWith(step);
    });

    it('setNextStepAsDefault: should set next step as `Default` if nextIndex is less than poSteps.length.', () => {
      component.poSteps = <any>poSteps;

      spyOn(component, <any>'getStepsAndIndex').and.returnValue({ steps: poSteps, stepIndex: 0 });

      component['setNextStepAsDefault'](poSteps[0]);

      expect(component.poSteps[1].status).toEqual(PoStepperStatus.Default);
    });

    it('setNextStepAsDefault: shouldn`t set next step as `Default` if nextIndex is equal to poSteps.length.', () => {
      component.poSteps = <any>poSteps;
      const lastStepIndex = poSteps.length - 1;

      component.poSteps[lastStepIndex].status = PoStepperStatus.Active;

      spyOn(component, <any>'getStepsAndIndex').and.returnValue({ steps: poSteps, stepIndex: lastStepIndex });

      component['setNextStepAsDefault'](poSteps[lastStepIndex]);

      expect(component.poSteps[lastStepIndex].status).not.toEqual(PoStepperStatus.Default);
    });

    it('setStepAsActive: should set `step.status` as `active`.', () => {
      const step: PoStepComponent = <any>{ label: 'Step 1', status: PoStepperStatus.Default };

      component['setStepAsActive'](step);

      expect(step.status).toEqual(PoStepperStatus.Active);
    });

    it('setNextStepAsDefault: should call `getStepsAndIndex` with `currentStep`.', () => {
      const step = poSteps[0];
      spyOn(component, <any>'getStepsAndIndex').and.returnValue({ step: step, stepIndex: 0 });

      component['setNextStepAsDefault'](step);

      expect(component['getStepsAndIndex']).toHaveBeenCalledWith(step);
    });

    it('setNextStepAsDefault: should set next step as `Default` if nextIndex is less than poSteps.length.', () => {
      component.steps = poSteps;
      spyOn(component, <any>'getStepsAndIndex').and.returnValue({ step: poSteps[0], stepIndex: 0 });

      component['setNextStepAsDefault'](poSteps[0]);

      expect(component.steps[1].status).toEqual(PoStepperStatus.Default);
    });

    it('getStepperStatusByCanActive: should return status `done` if canActiveNextStep is true.', () => {
      expect(component['getStepperStatusByCanActive'](true)).toBe(PoStepperStatus.Done);
    });

    it('getStepperStatusByCanActive: should return status `error` if canActiveNextStep is true.', () => {
      expect(component['getStepperStatusByCanActive'](false)).toBe(PoStepperStatus.Error);
    });
  });

  it('getCanActiveNextStepObservable: should return result of canActiveNextStep', (done: DoneFn) => {
    const canActivateNextStepResult = true;
    const currentActiveStep = {
      canActiveNextStep: jasmine.createSpy().and.returnValue(canActivateNextStepResult)
    } as unknown as PoStepComponent;

    const step = { status: PoStepperStatus.Done } as unknown as PoStepComponent;

    component['getCanActiveNextStepObservable'](currentActiveStep).subscribe(result => {
      expect(result).toBe(canActivateNextStepResult);
      expect(currentActiveStep.canActiveNextStep).toHaveBeenCalled();
      done();
    });
  });

  it('getCanActiveNextStepObservable: should call canActiveNextStep of currentActiveStep if step.status is not Done', (done: DoneFn) => {
    const currentActiveStep = {
      canActiveNextStep: jasmine.createSpy().and.returnValue(of(true)),
      label: 'Step 1',
      status: PoStepperStatus.Default,
      elementRef: { nativeElement: {} },
      ngAfterContentInit: () => {},
      setDisplayOnActiveOrError: () => {}
    } as unknown as PoStepComponent;

    const step = { status: PoStepperStatus.Active } as PoStepComponent;

    component['getCanActiveNextStepObservable'](currentActiveStep).subscribe(result => {
      expect(result).toBe(true);
      expect(currentActiveStep.canActiveNextStep).toHaveBeenCalledWith(currentActiveStep);
      done();
    });
  });

  describe('Templates:', () => {
    const elementByClass = (className: string) => nativeElement.querySelector(`.${className}`);

    it('should add the class `po-stepper-vertical` if `p-orientation` is `vertical` and remove `po-stepper-horizontal`.', () => {
      component.orientation = PoStepperOrientation.Vertical;

      fixture.detectChanges();

      expect(elementByClass('po-stepper-vertical')).toBeTruthy();
      expect(elementByClass('po-stepper-horizontal')).toBeFalsy();
    });

    it('should set `p-orientation` to `horizontal` if assigned value not included in PoStepperOrientation.', () => {
      component.orientation = <any>'diagonal';

      fixture.detectChanges();

      expect(component.orientation).toBe(PoStepperOrientation.Horizontal);
      expect(elementByClass('po-stepper-horizontal')).toBeTruthy();
      expect(elementByClass('po-stepper-vertical')).toBeFalsy();
    });

    it('should set `p-steps` with an empty array if the input `p-steps` param is undefined or invalid.', () => {
      component.steps = undefined;

      fixture.detectChanges();

      expect(component.steps).not.toBeUndefined();
      expect(component.steps instanceof Array).toBeTruthy();
      expect(component.steps.length).toBe(0);
    });

    it('should add the class `po-stepper-step-default` to the first step.', () => {
      component.step = 1;
      component.steps = poSteps;

      fixture.detectChanges();

      expect(elementByClass('po-stepper-step-default')).toBeTruthy();
    });

    it('should create `po-stepper-content` if `usePoSteps` is `true`.', () => {
      spyOnProperty(component, 'usePoSteps').and.returnValue(true);

      fixture.detectChanges();

      expect(elementByClass('po-stepper-content')).toBeTruthy();
    });

    it('shouldm`t create `po-stepper-content` if `usePoSteps` is `false`.', () => {
      spyOnProperty(component, 'usePoSteps').and.returnValue(false);

      fixture.detectChanges();

      expect(elementByClass('po-stepper-content')).toBeFalsy();
    });
  });

  describe('Integration:', () => {
    it('changeStep: shouldn`t call `onChangeStep.emit` if steps aren`t done status and sequential is true', () => {
      const stepNumber = 3;
      const stepMock = { id: 'step-3' } as PoStepComponent;

      component.step = 1;
      component.steps = poSteps;
      component.sequential = true;
      component['currentActiveStep'] = { id: 'step-99' } as PoStepComponent;

      const spyAllowNextStep = spyOn(component, <any>'allowNextStep').and.callThrough();
      const spyOnChangeStep = spyOn(component.onChangeStep, 'emit');

      component.changeStep(stepNumber, stepMock);

      expect(spyAllowNextStep).toHaveBeenCalledWith(stepNumber, stepMock);
      expect(spyOnChangeStep).not.toHaveBeenCalled();
    });

    it('changeStep: should call `onChangeStep.emit` with `stepIndex` if steps are done status and sequential is true', () => {
      const stepIndex = 3;
      const stepMock = { id: 'step-3' } as PoStepComponent;

      component.steps = poSteps;
      component.steps.forEach(step => (step.status = PoStepperStatus.Done));
      component.sequential = true;
      component['currentActiveStep'] = { id: 'step-99' } as PoStepComponent;

      spyOnProperty(component, 'currentStepIndex').and.returnValue(1);
      spyOnProperty(component, 'usePoSteps').and.returnValue(true);
      const spyAllowNextStep = spyOn(component, <any>'allowNextStep').and.callThrough();
      const spyOnChangeStep = spyOn(component.onChangeStep, 'emit');

      component.changeStep(stepIndex, stepMock);

      expect(spyAllowNextStep).toHaveBeenCalledWith(stepIndex, stepMock);
      expect(spyOnChangeStep).toHaveBeenCalledWith(stepMock);
    });

    it(`should initialize first step as active, second as default and others as disabled,
      and should set step clicked as 'active', the previous as 'done', the next as 'default'and the last as 'disabled'.`, fakeAsync(() => {
      const poStepsMock = new QueryList<PoStepComponent>();
      const poStepList = [
        { id: '1', label: 'Step 1', status: PoStepperStatus.Active },
        { id: '2', label: 'Step 2', status: PoStepperStatus.Default },
        { id: '3', label: 'Step 3', status: PoStepperStatus.Disabled },
        { id: '4', label: 'Step 4', status: PoStepperStatus.Disabled },
        { id: '5', label: 'Step 5', status: PoStepperStatus.Disabled }
      ];
      poStepsMock['_results'] = poStepList;
      Object.defineProperty(poStepsMock, 'length', { value: 5 });

      const eventClick = document.createEvent('MouseEvents');
      eventClick.initEvent('click', true, true);

      component.poSteps = poStepsMock;
      component['currentActiveStep'] = poStepsMock['_results'][0];

      spyOnProperty(component, 'usePoSteps').and.returnValue(true);

      fixture.detectChanges();
      flush();

      const steps = nativeElement.querySelectorAll('.po-stepper-step');

      expect(steps[0].classList.contains('po-stepper-step-default')).toBeTruthy();
      expect(steps[1].classList.contains('po-stepper-step-default')).toBeTruthy();
      expect(steps[2].classList.contains('po-stepper-step-disabled')).toBeTruthy();
      expect(steps[3].classList.contains('po-stepper-step-disabled')).toBeTruthy();
      expect(steps[4].classList.contains('po-stepper-step-disabled')).toBeTruthy();

      steps[1].dispatchEvent(eventClick);

      fixture.detectChanges();
      flush();

      expect(steps[0].classList.contains('po-stepper-step-default')).toBeTruthy();
      expect(steps[1].classList.contains('po-stepper-step-default')).toBeTruthy();
      expect(steps[2].classList.contains('po-stepper-step-default')).toBeTruthy();
      expect(steps[3].classList.contains('po-stepper-step-disabled')).toBeTruthy();
      expect(steps[4].classList.contains('po-stepper-step-disabled')).toBeTruthy();
    }));

    it(`should initialize step 4 as active, step 5 as default and others as disabled`, fakeAsync(() => {
      const poStepsMock = new QueryList<PoStepComponent>();
      const poStepList = [
        { id: '1', label: 'Step 1', status: PoStepperStatus.Done },
        { id: '2', label: 'Step 2', status: PoStepperStatus.Done },
        { id: '3', label: 'Step 3', status: PoStepperStatus.Done },
        { id: '4', label: 'Step 4', status: PoStepperStatus.Active },
        { id: '5', label: 'Step 5', status: PoStepperStatus.Default }
      ];
      poStepsMock['_results'] = poStepList;
      Object.defineProperty(poStepsMock, 'length', { value: 5 });

      component.poSteps = poStepsMock;
      component['currentActiveStep'] = poStepsMock['_results'][0];

      spyOnProperty(component, 'usePoSteps').and.returnValue(true);

      fixture.detectChanges();
      flush();

      const steps = nativeElement.querySelectorAll('.po-stepper-step');

      expect(steps[0].classList.contains('po-stepper-step-default')).toBeTruthy();
      expect(steps[1].classList.contains('po-stepper-step-default')).toBeTruthy();
      expect(steps[2].classList.contains('po-stepper-step-default')).toBeTruthy();
      expect(steps[3].classList.contains('po-stepper-step-default')).toBeTruthy();
      expect(steps[4].classList.contains('po-stepper-step-default')).toBeTruthy();
    }));
  });
});
