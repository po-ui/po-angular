import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UntypedFormControl } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { throwError } from 'rxjs';

import { getObservable } from '../../util-test/util-expect.spec';

import { PoJobSchedulerInternal } from './interfaces/po-job-scheduler-internal.interface';
import { PoPageJobSchedulerBaseComponent } from './po-page-job-scheduler-base.component';
import { PoPageJobSchedulerInternal } from './po-page-job-scheduler-internal';
import { PoPageJobSchedulerService } from './po-page-job-scheduler.service';
import { PoStepperOrientation } from '@po-ui/ng-components';
import { expectPropertiesValues } from './../../util-test/util-expect.spec';

describe('PoPageJobSchedulerBaseComponent:', () => {
  let serviceJobScheduler: PoPageJobSchedulerService;
  let component: PoPageJobSchedulerBaseComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoPageJobSchedulerService]
    });

    serviceJobScheduler = TestBed.inject(PoPageJobSchedulerService);

    component = new PoPageJobSchedulerBaseComponent(serviceJobScheduler);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('value: should set `model`', fakeAsync(() => {
      const returnValue: PoJobSchedulerInternal = {
        firstExecution: new Date('2019-02-04'),
        firstExecutionHour: '06:45',
        periodicity: 'single',
        recurrent: true
      };
      const jobSchedulerInternal = {
        firstExecution: new Date('2019-02-04'),
        periodicity: 'single',
        recurrent: true
      };

      spyOn(component['poPageJobSchedulerService'], 'convertToJobSchedulerInternal').and.returnValue(returnValue);
      component.value = jobSchedulerInternal;

      expect(component.model).toEqual(returnValue);
    }));

    it('p-orientation: should update property with `undefined` when invalid values', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', [], {}];

      expectPropertiesValues(component, 'stepperDefaultOrientation', invalidValues, undefined);
    });

    it('p-orientation: should update property with valid values', () => {
      const validValues = (<any>Object).values(PoStepperOrientation);

      expectPropertiesValues(component, 'stepperDefaultOrientation', validValues, validValues);
    });
  });

  describe('Methods:', () => {
    it('ngOnDestroy: should call unsubscribe', () => {
      const spyUnsubscribe = spyOn(component['_subscription'], 'unsubscribe');

      component.ngOnDestroy();

      expect(spyUnsubscribe).toHaveBeenCalled();
    });

    it('loadData: should set `model` with `new PoPageJobSchedulerInternal()` and exit of method if `id` is invalid.', () => {
      const invalidId = 0;
      component.model = undefined;

      component['loadData'](invalidId);

      expect(component.model instanceof PoPageJobSchedulerInternal).toBeTruthy();
    });

    it('loadData: should call `poPageJobSchedulerService.getResource()` with `id` if `id` is valid.', () => {
      const id = 1;

      spyOn(component['poPageJobSchedulerService'], 'getResource').and.callThrough();

      component['loadData'](id);

      expect(component['poPageJobSchedulerService'].getResource).toHaveBeenCalledWith(id);
    });

    it(`loadData: should set 'model' with 'response' of 'poPageJobSchedulerService.getResource()'
      if 'id' and 'response' is valid.`, fakeAsync(() => {
      const id = 1;
      const returnValue: PoJobSchedulerInternal = {
        periodicity: '',
        firstExecution: new Date(),
        firstExecutionHour: '',
        recurrent: false
      };

      spyOn(component['poPageJobSchedulerService'], 'getResource').and.returnValue(getObservable(returnValue));

      component['loadData'](id);

      tick(50);

      expect(component.model).toEqual(returnValue);
    }));

    it(`loadData: should set 'model' with 'new PoPageJobSchedulerInternal()' if 'id' is valid and
      'poPageJobSchedulerService.getResource()' return 'error'.`, fakeAsync(() => {
      const id = 1;
      const expectValue = new PoPageJobSchedulerInternal();
      component.model = undefined;

      spyOn(component['poPageJobSchedulerService'], 'getResource').and.returnValue(throwError(''));

      component['loadData'](id);

      tick(50);

      expect(component.model).toEqual(expectValue);
    }));

    it(`markAsDirtyInvalidControls: should not call 'markAsDirty()' if 'control.invalid' is 'false'.`, () => {
      const value = { login: new UntypedFormControl(null) };

      spyOn(value.login, 'markAsDirty');

      component['markAsDirtyInvalidControls'](value);

      expect(value.login.markAsDirty).not.toHaveBeenCalled();
    });

    it(`markAsDirtyInvalidControls: should call 'hasOwnProperty()' with key value 'login' and not call
      'markAsDirty()' if 'control.invalid' is 'false'.`, () => {
      const value = { login: new UntypedFormControl(null) };

      spyOn(value, <any>'hasOwnProperty');
      spyOn(value.login, 'markAsDirty');

      component['markAsDirtyInvalidControls'](value);

      expect(value['hasOwnProperty']).toHaveBeenCalledWith('login');
      expect(value.login.markAsDirty).not.toHaveBeenCalled();
    });

    it('markAsDirtyInvalidControls: should call `markAsDirty()` if `control.invalid` is `true`.', () => {
      const value = { login: new UntypedFormControl(null) };
      value.login.setErrors({ invalid: true });

      spyOn(value.login, 'markAsDirty');

      component['markAsDirtyInvalidControls'](value);

      expect(value.login.markAsDirty).toHaveBeenCalled();
    });
  });
});
