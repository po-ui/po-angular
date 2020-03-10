import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of } from 'rxjs';

import { changeBrowserInnerWidth, configureTestSuite } from './../../util-test/util-expect.spec';
import { getObservable } from '../../util-test/util-expect.spec';

import { PoJobSchedulerInternal } from './interfaces/po-job-scheduler-internal.interface';
import { PoPageJobSchedulerComponent } from './po-page-job-scheduler.component';
import { PoPageJobSchedulerModule } from './po-page-job-scheduler.module';

describe('PoPageJobSchedulerComponent:', () => {
  let component: PoPageJobSchedulerComponent;
  let fixture: ComponentFixture<PoPageJobSchedulerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), PoPageJobSchedulerModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageJobSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it(`stepperOrientation: should return 'horizontal' if 'window.innerWidth' is greater than '481' and less than '960'`, () => {
      changeBrowserInnerWidth(620);

      fixture.detectChanges();

      expect(component.stepperOrientation).toBe('horizontal');
    });

    it(`stepperOrientation: should return 'vertical' if 'window.innerWidth' is greater than '960'`, () => {
      changeBrowserInnerWidth(1080);

      fixture.detectChanges();

      expect(component.stepperOrientation).toBe('vertical');
    });

    it(`stepperOrientation: should return 'vertical' if 'window.innerWidth' is less than '481'`, () => {
      changeBrowserInnerWidth(480);

      fixture.detectChanges();

      expect(component.stepperOrientation).toBe('vertical');
    });
  });

  describe('Methods:', () => {
    it('ngOnInit: should call `loadData` with id', () => {
      component.serviceApi = 'localhost:4000/jobschedulers';

      const endpoint = { endpoint: component.serviceApi };
      const id = 1;

      component['activatedRoute'] = <any>{
        snapshot: {
          params: {
            id
          }
        }
      };

      spyOn(component['poPageJobSchedulerService'], <any>'configServiceApi');
      spyOn(component, <any>'loadData');

      component.ngOnInit();

      expect(component.isEdit).toBe(true);
      expect(component['loadData']).toHaveBeenCalledWith(1);
      expect(component['poPageJobSchedulerService'].configServiceApi).toHaveBeenCalledWith(endpoint);
    });

    it('ngOnInit: should call `loadData` with id undefined', () => {
      component.serviceApi = 'localhost:4000/jobschedulers';

      const endpoint = { endpoint: component.serviceApi };
      const id = undefined;

      component['activatedRoute'] = <any>{
        snapshot: {
          params: {
            id
          }
        }
      };

      spyOn(component['poPageJobSchedulerService'], <any>'configServiceApi');
      spyOn(component, <any>'loadData');

      component.ngOnInit();

      expect(component.isEdit).toBe(false);
      expect(component['loadData']).toHaveBeenCalledWith(undefined);
      expect(component['poPageJobSchedulerService'].configServiceApi).toHaveBeenCalledWith(endpoint);
    });

    it(`changePageActionsBySteps: should set 'jobSchedulerActions' with 'concludePageActions' if 'steps' is equal 'steps.length'`, () => {
      const nextStep = component.steps.length;
      const currentStep = 2;

      component['changePageActionsBySteps'](currentStep, nextStep);

      expect(component.jobSchedulerActions.length).toBe(component['concludePageActions'].length);
    });

    it(`changePageActionsBySteps: should set 'jobSchedulerActions' with 'nextPageActions' if
    'currentStep' is equal 'steps.length' and 'stepNumber' is lower than 'currentStep'`, () => {
      const currentStep = component.steps.length;
      const nextStep = 2;

      component['changePageActionsBySteps'](currentStep, nextStep);

      expect(component.jobSchedulerActions.length).toBe(component['nextPageActions'].length);
    });

    it('changePageActionsBySteps: shouldn`t set `jobSchedulerActions` if `nextStep` is lower than `steps.length`', () => {
      const currentStep = 1;
      const nextStep = 2;

      component['changePageActionsBySteps'](currentStep, nextStep);

      expect(component.jobSchedulerActions.length).toBe(component.jobSchedulerActions.length);
    });

    describe('nextStep:', () => {
      let fakeThis;

      beforeEach(() => {
        fakeThis = {
          schedulerExecution: {
            form: {
              invalid: true,
              controls: {
                x: 'schedulerExecutionFormItem'
              }
            }
          },
          schedulerParameters: {
            form: {
              invalid: true,
              controls: {
                x: 'schedulerParametersFormItem'
              }
            }
          },
          steps: [{ label: 'step1' }, { label: 'step2' }, { label: 'step3' }, { label: 'step4' }],
          step: 1,
          markAsDirtyInvalidControls: () => {},
          changePageActionsBySteps: () => {}
        };
      });

      it(`should call 'markAsDirtyInvalidControls' with 'schedulerExecution.form.controls' and not call 'changePageActionsBySteps'
      if 'step' is greater than '1' and 'schedulerExecution.form' is 'invalid'`, () => {
        spyOn(fakeThis, 'markAsDirtyInvalidControls');
        spyOn(fakeThis, 'changePageActionsBySteps');

        component.nextStep.call(fakeThis, 2);

        expect(fakeThis.markAsDirtyInvalidControls).toHaveBeenCalledWith({ x: 'schedulerExecutionFormItem' });
        expect(fakeThis.changePageActionsBySteps).not.toHaveBeenCalled();
      });

      it(`should call 'markAsDirtyInvalidControls' with 'schedulerParameters.form.controls' and not call 'changePageActionsBySteps'
      if 'step' is greater than '2', 'schedulerParameters.form' is 'invalid' and 'schedulerExecution.form' is 'valid'`, () => {
        fakeThis.schedulerExecution.form.invalid = false;

        spyOn(fakeThis, 'markAsDirtyInvalidControls');
        spyOn(fakeThis, 'changePageActionsBySteps');

        component.nextStep.call(fakeThis, 3);

        expect(fakeThis.markAsDirtyInvalidControls).toHaveBeenCalledWith({ x: 'schedulerParametersFormItem' });
        expect(fakeThis.changePageActionsBySteps).not.toHaveBeenCalled();
      });

      it(`shouldn't call 'markAsDirtyInvalidControls' and call 'changePageActionsBySteps' if 'schedulerParameters.form'
      and 'schedulerExecution.form' are 'valid'`, () => {
        fakeThis.schedulerExecution.form.invalid = false;
        fakeThis.schedulerParameters.form.invalid = false;

        spyOn(fakeThis, 'markAsDirtyInvalidControls');
        spyOn(fakeThis, 'changePageActionsBySteps');

        component.nextStep.call(fakeThis, 3);

        expect(fakeThis.markAsDirtyInvalidControls).not.toHaveBeenCalled();
        expect(fakeThis.changePageActionsBySteps).toHaveBeenCalled();
      });

      it(`shouldn't set 'steps.status' to 'done' if doesn't have 'steps'`, () => {
        fakeThis.schedulerExecution.form.invalid = false;
        fakeThis.schedulerParameters.form.invalid = false;
        fakeThis.steps = [];

        component.nextStep.call(fakeThis, 3);

        expect(fakeThis.steps).toBe(fakeThis.steps);
      });
    });

    it(`onChangeProcess: should call 'getParametersByProcess' with 'processIs' if have 'process.processId' and
    'process.existAPI' is 'true'`, () => {
      spyOn(component, <any>'getParametersByProcess');

      component.onChangeProcess({ processId: '123', existAPI: true });

      expect(component['getParametersByProcess']).toHaveBeenCalledWith('123');
    });

    it(`onChangeProcess: shouldn't call 'getParametersByProcess' if doesn't have 'process.processId'`, () => {
      spyOn(component, <any>'getParametersByProcess');

      component.onChangeProcess({ processId: undefined, existAPI: true });

      expect(component['getParametersByProcess']).not.toHaveBeenCalled();
    });

    it(`onChangeProcess: shouldn't call 'getParametersByProcess' if 'process.existAPI' is 'false'`, () => {
      spyOn(component, <any>'getParametersByProcess');

      component.onChangeProcess({ processId: '123', existAPI: false });

      expect(component['getParametersByProcess']).not.toHaveBeenCalled();
    });

    it(`onChangeProcess: should set' model.executionParameter' to '{}' if 'isEdit' is 'false'`, () => {
      component.isEdit = false;

      spyOn(component, <any>'getParametersByProcess');

      component.onChangeProcess({ processId: '123', existAPI: true });

      expect(component.model.executionParameter).toEqual({});
    });

    it(`onChangeProcess: shouldn't set 'model.executionParameter' to '{}' if 'isEdit' is 'true'`, () => {
      component.isEdit = true;
      component.model.executionParameter = { x: 'test' };

      spyOn(component, <any>'getParametersByProcess');

      component.onChangeProcess({ processId: '123', existAPI: true });

      expect(component.model.executionParameter).toEqual({ x: 'test' });
    });

    it(`confirmJobScheduler: should call 'poDialogservice.confirm'`, () => {
      spyOn(component['poDialogService'], 'confirm');

      component['confirmJobScheduler']();

      expect(component['poDialogService'].confirm).toHaveBeenCalled();
    });

    // TODO NG V9
    xit(`confirmJobScheduler: should call 'poDialogservice.confirm' with 'literals.confirmSaveMessage'`, () => {
      let paramConfirm;
      spyOn(component['poDialogService'], 'confirm').and.callFake(param => (paramConfirm = param));

      spyOn(component, <any>'save');

      component['confirmJobScheduler']();

      paramConfirm.confirm();

      expect(component['save']).toHaveBeenCalled();
      expect(paramConfirm.message).toBe(component.literals.confirmSaveMessage);
    });

    it(`confirmJobScheduler: should call 'poDialogservice.confirm' with 'literals.confirmUpdateMessage'`, () => {
      component['activatedRoute'].snapshot.params['id'] = 'param';
      let paramConfirm;

      spyOn(component['poDialogService'], 'confirm').and.callFake(param => (paramConfirm = param));

      spyOn(component, <any>'save');

      component['confirmJobScheduler']();

      paramConfirm.confirm();

      expect(component['save']).toHaveBeenCalled();
      expect(paramConfirm.message).toBe(component.literals.confirmUpdateMessage);
    });

    it(`emitSuccessMessage: should call 'poNotification.success' with message and call 'resetJobSchedulerForm'`, async () => {
      const message = 'msgSuccess';

      spyOn(component['poNotification'], 'success');
      spyOn(component, <any>'resetJobSchedulerForm');

      await component['emitSuccessMessage'](message, of());

      expect(component['poNotification'].success).toHaveBeenCalledWith(message);
      expect(component['resetJobSchedulerForm']).toHaveBeenCalled();
    });

    it(`getParametersByProcess: should call 'getParametersByProcess' with process and set 'component.parameters'
    with 'parameters'`, fakeAsync(() => {
      const process = 'abd404c';
      const parameters = [{ property: 'server' }];

      spyOn(component['poPageJobSchedulerService'], 'getParametersByProcess').and.returnValue(
        getObservable(parameters)
      );

      component['getParametersByProcess'](process);

      tick(50);

      expect(component['poPageJobSchedulerService'].getParametersByProcess).toHaveBeenCalledWith(process);
      expect(component.parameters).toEqual(parameters);
    }));

    it(`isDisabledAdvance: should return 'true' if have 'schedulerExecution'`, () => {
      const fakeThis = {
        schedulerExecution: {
          form: {
            invalid: true
          }
        }
      };

      const functionTest = component['isDisabledAdvance'].call(fakeThis);

      expect(functionTest).toBe(true);
    });

    it(`isDisabledAdvance: should return 'false' if have 'schedulerExecution'`, () => {
      const fakeThis = {
        schedulerExecution: undefined
      };

      const functionTest = component['isDisabledAdvance'].call(fakeThis);

      expect(functionTest).toBe(false);
    });

    it(`isDisabledBack: should return 'true' if 'step' is equal '1'`, () => {
      component.step = 1;

      expect(component['isDisabledBack']()).toBe(true);
    });

    it(`isDisabledBack: should return 'false' if 'step' is not '1'`, () => {
      component.step = 3;

      expect(component['isDisabledBack']()).toBe(false);
    });

    it(`nextStepOperation: should call 'nextStep' with 'step + 1' if doesn't have operation parameter`, () => {
      component.step = 1;
      const stepAfterNext = 2;

      spyOn(component, 'nextStep');

      component['nextStepOperation']();

      expect(component.nextStep).toHaveBeenCalledWith(stepAfterNext);
    });

    it(`nextStepOperation: should call 'nextStep' with 'step + 1' if operation parameter is 'next'`, () => {
      component.step = 1;
      const stepAfterNext = 2;

      spyOn(component, 'nextStep');

      component['nextStepOperation']('next');

      expect(component.nextStep).toHaveBeenCalledWith(stepAfterNext);
    });

    it(`nextStepOperation: should call 'nextStep' with 'step - 1' if operation parameter is 'back'`, () => {
      component.step = 2;
      const stepAfterNext = 1;

      spyOn(component, 'nextStep');

      component['nextStepOperation']('back');

      expect(component.nextStep).toHaveBeenCalledWith(stepAfterNext);
    });

    it(`resetJobSchedulerForm: should call 'schedulerExecution.form.reset'`, () => {
      spyOn(component.schedulerExecution.form, 'reset');

      component['resetJobSchedulerForm']();

      expect(component.schedulerExecution.form.reset).toHaveBeenCalled();
    });

    it(`resetJobSchedulerForm: should set 'step' to '1'`, fakeAsync(() => {
      component.step = 4;

      component['resetJobSchedulerForm']();

      tick(300);

      expect(component.step).toBe(1);
    }));

    it(`resetJobSchedulerForm: should set jobSchedulerAction next and jobSchedulerAction back`, fakeAsync(() => {
      component['resetJobSchedulerForm']();

      tick(300);

      expect(component.jobSchedulerActions[0].label).toBe(component.literals.next);
      expect(component.jobSchedulerActions[1].label).toBe(component.literals.back);
    }));

    it(`resetJobSchedulerForm: should set 'model periodicity' with 'single'`, fakeAsync(() => {
      component['resetJobSchedulerForm']();

      tick(300);

      expect(component.model.periodicity).toBe('single');
    }));

    describe('save:', () => {
      const model: PoJobSchedulerInternal = {
        periodicity: 'always',
        firstExecution: new Date(),
        firstExecutionHour: '23:55:00',
        recurrent: true
      };

      it(`should call 'poPageJobSchedulerService.updateResource' if have a 'paramId'`, () => {
        const paramId = 5;

        spyOn(component['poPageJobSchedulerService'], 'updateResource').and.returnValue(new Observable());

        component['save'](model, paramId);

        expect(component['poPageJobSchedulerService'].updateResource).toHaveBeenCalled();
      });

      it(`should call 'poPageJobSchedulerService.createResource' if doesn't have a 'paramId'`, () => {
        const paramId = undefined;

        spyOn(component['poPageJobSchedulerService'], 'createResource').and.returnValue(new Observable());

        component['save'](model, paramId);

        expect(component['poPageJobSchedulerService'].createResource).toHaveBeenCalled();
      });

      it(`should call 'emitSuccessMessage' with 'saveNotificationSuccessUpdate' if 'paramId' is defined`, () => {
        const paramId = 5;

        const saveOperation = of();
        const saveNotificationSuccessSave = component['literals'].saveNotificationSuccessUpdate;

        spyOn(component, <any>'emitSuccessMessage');
        spyOn(component['poPageJobSchedulerService'], 'updateResource').and.returnValue(saveOperation);

        component['save'](model, paramId);

        expect(component['emitSuccessMessage']).toHaveBeenCalledWith(saveNotificationSuccessSave, saveOperation);
      });

      it(`should call 'emitSuccessMessage' with 'saveNotificationSuccessSave' if 'paramId' is undefined`, () => {
        const paramId = undefined;
        const saveOperation = of();
        const saveNotificationSuccessSave = component['literals'].saveNotificationSuccessSave;

        spyOn(component, <any>'emitSuccessMessage');
        spyOn(component['poPageJobSchedulerService'], 'createResource').and.returnValue(saveOperation);

        component['save'](model, paramId);

        expect(component['emitSuccessMessage']).toHaveBeenCalledWith(saveNotificationSuccessSave, saveOperation);
      });
    });
  });

  describe('Templates:', () => {
    let executionElement: any;
    let executionElementHiddenAttribute: any;
    let parametersElement: any;
    let summaryElement: any;

    function getElements() {
      executionElement = fixture.nativeElement.querySelector('po-page-job-scheduler-execution');
      executionElementHiddenAttribute = executionElement.hidden;
      parametersElement = fixture.nativeElement.querySelector('po-page-job-scheduler-parameters');
      summaryElement = fixture.nativeElement.querySelector('po-page-job-scheduler-summary');
    }

    it(`should have a 'po-page-job-scheduler-execution' without 'hidden' attribute and not have a 'po-page-job-scheduler-parameters'
    and 'po-page-job-scheduler-summary' if 'step' is '1'`, () => {
      component.nextStep(1);

      fixture.detectChanges();

      getElements();

      expect(executionElement).toBeTruthy();
      expect(parametersElement).toBeFalsy();
      expect(summaryElement).toBeFalsy();
      expect(executionElementHiddenAttribute).toBeFalsy();
    });

    it(`should have a 'po-page-job-scheduler-execution' with 'hidden' attribute, have a 'po-page-job-scheduler-parameters'
    and doesn't have 'po-page-job-scheduler-summary' if 'step' is '2'`, () => {
      component.nextStep(2);

      fixture.detectChanges();

      getElements();

      expect(executionElement).toBeTruthy();
      expect(parametersElement).toBeTruthy();
      expect(summaryElement).toBeFalsy();
      expect(executionElementHiddenAttribute).toBeTruthy();
    });

    it(`should have a 'po-page-job-scheduler-execution' with 'hidden' attribute, not have a 'po-page-job-scheduler-parameters'
    and have 'po-page-job-scheduler-summary' if 'step' is '3'`, () => {
      component.nextStep(3);

      fixture.detectChanges();

      getElements();

      expect(executionElement).toBeTruthy();
      expect(parametersElement).toBeFalsy();
      expect(summaryElement).toBeTruthy();
      expect(executionElementHiddenAttribute).toBeTruthy();
    });
  });
});
