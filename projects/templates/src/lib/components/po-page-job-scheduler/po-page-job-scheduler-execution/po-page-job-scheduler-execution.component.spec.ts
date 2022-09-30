import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { throwError } from 'rxjs';

import { expectPropertiesValues } from './../../../util-test/util-expect.spec';
import { getObservable } from '../../../util-test/util-expect.spec';

import { PoPageJobSchedulerExecutionComponent } from './po-page-job-scheduler-execution.component';
import { PoPageJobSchedulerModule } from '../po-page-job-scheduler.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PoPageJobSchedulerExecutionComponent:', () => {
  let component: PoPageJobSchedulerExecutionComponent;
  let fixture: ComponentFixture<PoPageJobSchedulerExecutionComponent>;

  let debugElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes([]), PoPageJobSchedulerModule, HttpClientTestingModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageJobSchedulerExecutionComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    debugElement = fixture.debugElement.nativeElement;
  });

  it('should be create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('value: should set property to `{}` if invalid values', () => {
      const invalidValues = ['test', null, undefined, NaN, 0];

      expectPropertiesValues(component, 'value', invalidValues, {});
    });

    it('value: should set property with valid values', () => {
      const validValues = [{}, { processID: 1 }];

      expectPropertiesValues(component, 'value', validValues, validValues);
    });

    it('value: should set `containsFrequency` with true if value.frequency.value', () => {
      component.value = { frequency: { value: 2 } };

      expect(component.containsFrequency).toBeTrue();
    });

    it('value: should set `containsFrequency` with false if value.frequency.value is undefined', () => {
      component.value = { frequency: undefined };

      expect(component.containsFrequency).toBeFalse();
    });

    it('startDateFirstExecution: should return `Date` if `isEdit` is false', () => {
      component.isEdit = false;

      expect(component.startDateFirstExecution instanceof Date).toBe(true);
    });

    it('startDateFirstExecution: should return `undefined` if `isEdit` is true', () => {
      component.isEdit = true;

      expect(component.startDateFirstExecution instanceof Date).toBe(false);
      expect(component.startDateFirstExecution).toBeUndefined();
    });

    it('hourLabel: should return `literals.startTime` if `containsFrequency`', () => {
      component.containsFrequency = true;
      const result = component.hourLabel;
      expect(result).toEqual(component.literals.startTime);
    });

    it('hourLabel: should return `literals.time` if `containsFrequency` is false', () => {
      component.containsFrequency = false;
      const result = component.hourLabel;
      expect(result).toEqual(component.literals.time);
    });

    it('dayLabel: should return `literals.startDay` if `containsFrequency`', () => {
      component.containsFrequency = true;
      const result = component.dayLabel;
      expect(result).toEqual(component.literals.startDay);
    });

    it('dayLabel: should return `literals.day` if `containsFrequency` is false', () => {
      component.containsFrequency = false;
      const result = component.dayLabel;
      expect(result).toEqual(component.literals.day);
    });
  });

  describe('Methods:', () => {
    it('ngAfterViewInit: should call `subscribeProcessIdValueChanges`', fakeAsync(() => {
      spyOn(component, <any>'subscribeProcessIdValueChanges');

      component.ngAfterViewInit();

      tick(50);

      expect(component['subscribeProcessIdValueChanges']).toHaveBeenCalled();
    }));

    it('ngAfterViewInit: should update `frequencyOption.disabled` if `frequencyOption.value` is equal to `day`', fakeAsync(() => {
      component.value.periodicity = 'daily';
      component.frequencyOptions = [
        { label: 'Day', value: 'day' },
        { label: 'Hour', value: 'hour' },
        { label: 'minute', value: 'minute' }
      ];
      const expectedValue = [
        { label: 'Day', value: 'day', disabled: true },
        { label: 'Hour', value: 'hour', disabled: false },
        { label: 'minute', value: 'minute', disabled: false }
      ];

      component.ngAfterViewInit();

      tick(50);

      expect(component.frequencyOptions).toEqual(expectedValue);
    }));

    it('ngOnInit: should call `checkExistsProcessesAPI` and set `periodicityTemplates`, `periodicityOptions` and `weekDays`', () => {
      component.periodicityTemplates = undefined;
      component.periodicityOptions = undefined;
      component.frequencyOptions = undefined;
      component.weekDays = undefined;

      spyOn(component, <any>'checkExistsProcessesAPI');
      spyOn(component, <any>'getPeriodicityOptions').and.callThrough();
      spyOn(component, <any>'getWeekDays').and.callThrough();
      spyOn(component, <any>'getFrequencyOptions').and.callThrough();

      component.ngOnInit();

      expect(typeof component.periodicityTemplates === 'object').toBe(true);
      expect(component.periodicityOptions instanceof Array).toBe(true);
      expect(component.weekDays instanceof Array).toBe(true);
      expect(component.frequencyOptions instanceof Array).toBe(true);

      expect(component['checkExistsProcessesAPI']).toHaveBeenCalled();
      expect(component['getPeriodicityOptions']).toHaveBeenCalled();
      expect(component['getWeekDays']).toHaveBeenCalled();
      expect(component['getFrequencyOptions']).toHaveBeenCalled();
    });

    it('ngOnInit: shouldn`t call `checkExistsProcessesAPI` if `noParameters` is false', () => {
      component.noParameters = false;

      spyOn(component, <any>'checkExistsProcessesAPI');

      component.ngOnInit();

      expect(component['checkExistsProcessesAPI']).not.toHaveBeenCalled();
    });

    it('checkExistsProcessesAPI: should subscribe `getHeadProcesses` and on error set `existProcessAPI` to false', () => {
      component.existProcessAPI = true;
      component['poPageJobSchedulerService'] = <any>{
        getHeadProcesses: () => {}
      };

      spyOn(component['poPageJobSchedulerService'], <any>'getHeadProcesses').and.returnValue(throwError(''));

      component['checkExistsProcessesAPI']();

      expect(component['poPageJobSchedulerService'].getHeadProcesses).toHaveBeenCalled();
      expect(component.existProcessAPI).toBe(false);
    });

    it('getPeriodicityOptions: should return 4 periodicity options', () => {
      const periodicityLength = 4;

      const periodicityOptions = component['getPeriodicityOptions']();

      expect(periodicityOptions instanceof Array).toBe(true);
      expect(periodicityOptions.length).toBe(periodicityLength);
    });

    it('getWeekDays: should return 7 week days', () => {
      const weekDaysLength = 7;

      const weekDays = component['getWeekDays']();

      expect(weekDays instanceof Array).toBe(true);
      expect(weekDays.length).toBe(weekDaysLength);
    });

    it('getFrequencyOptions: should return 3 options', () => {
      const frequencyOptionsLength = 3;

      const frequencyOptions = component['getFrequencyOptions']();

      expect(frequencyOptions instanceof Array).toBe(true);
      expect(frequencyOptions.length).toBe(frequencyOptionsLength);
    });

    it('subscribeProcessIdValueChanges: should call `changeProcess.emit` when subscribe `processID.valueChanges`', () => {
      const processId = 1;
      component['form'] = <any>{
        controls: {
          processID: {
            valueChanges: getObservable(processId)
          }
        }
      };

      spyOn(component['form'].controls.processID.valueChanges, <any>'subscribe').and.callThrough();
      spyOn(component.changeProcess, 'emit');

      component['subscribeProcessIdValueChanges']();

      expect(component['form'].controls.processID.valueChanges.subscribe).toHaveBeenCalled();
      expect(component.changeProcess.emit).toHaveBeenCalledWith({ processId, existAPI: component.existProcessAPI });
    });

    it('changeContainsFrequency: should update `value.frequency` if `containsfrequency`', () => {
      const containsFrequency = true;
      const expectedValue = { type: 'hour', value: null };

      component.onChangeContainsFrequency(containsFrequency);

      expect(component.value.frequency).toEqual(expectedValue);
    });

    it('changeContainsFrequency: should update `value.frequency` with empty object if `containsfrequency` is false', () => {
      const containsFrequency = false;
      const expectedValue = {};

      component.onChangeContainsFrequency(containsFrequency);

      expect(component.value.frequency).toEqual(expectedValue);
    });

    it('changeContainsFrequency: should update `value.rangeLimitHour`, `value.rangeLimitDay` and `value.dayOfMonth` with null', () => {
      const containsFrequency = false;

      component.onChangeContainsFrequency(containsFrequency);

      expect(component.value.rangeLimitHour).toBeNull();
      expect(component.value.rangeLimitDay).toBeNull();
      expect(component.value.dayOfMonth).toBeNull();
    });

    it('onChangePeriodicityOptions: should update `frequencyOptions` and `value.frequency.type`', () => {
      const periodicity = 'daily';
      component.value.frequency = {};
      component.frequencyOptions = [
        { label: 'Day', value: 'day' },
        { label: 'Hour', value: 'hour' },
        { label: 'minute', value: 'minute' }
      ];
      const expectedValue = [
        { label: 'Day', value: 'day', disabled: true },
        { label: 'Hour', value: 'hour', disabled: false },
        { label: 'minute', value: 'minute', disabled: false }
      ];

      component.onChangePeriodicityOptions(periodicity);

      expect(component.frequencyOptions).toEqual(expectedValue);
      expect(component.value.frequency.type).toBeNull();
    });

    it('onChangeFrequencyOptions: should update `value.rangeLimitHour` with `null`', () => {
      component.onChangeFrequencyOptions();

      expect(component.value.rangeLimitHour).toBeNull();
    });
  });

  describe('Templates:', () => {
    it('should find po-input[name="processID"] and shouldn`t find po-lookup[name="processID"] if existProcessAPI is false', () => {
      component.existProcessAPI = false;

      fixture.detectChanges();

      const lookupComponent = debugElement.querySelector('po-lookup[name="processID"]');
      const inputComponent = debugElement.querySelector('po-input[name="processID"]');

      expect(lookupComponent).toBeFalsy();
      expect(inputComponent).toBeTruthy();
    });

    it(`shouldn't find po-lookup[name="processID"] if 'p-not-parameters' is false`, () => {
      component.noParameters = false;

      fixture.detectChanges();

      const lookupComponent = debugElement.querySelector('po-lookup[name="processID"]');

      expect(lookupComponent).toBeFalsy();
    });

    it('should find po-lookup[name="processID"] and shouldn`t find po-input[name="processID"] if existProcessAPI is true', () => {
      component.existProcessAPI = true;

      fixture.detectChanges();

      const lookupComponent = debugElement.querySelector('po-lookup[name="processID"]');
      const inputComponent = debugElement.querySelector('po-input[name="processID"]');

      expect(inputComponent).toBeFalsy();
      expect(lookupComponent).toBeTruthy();
    });

    it('should find 2 po-divider and po-switch[name="recurrent"] if value.periodicity not equal `single`', () => {
      const value = {
        periodicity: 'daily'
      };

      component.value = value;

      fixture.detectChanges();

      const poDividers = debugElement.querySelectorAll('po-divider');
      const poSwitch = debugElement.querySelector('po-switch[name="recurrent"]');

      expect(poDividers.length).toBe(2);
      expect(poSwitch).toBeTruthy();
    });

    it('should find 1 po-divider and not find po-switch[name="recurrent"] if value.periodicity is equal `single`', () => {
      const value = {
        periodicity: 'single'
      };

      component.value = value;

      fixture.detectChanges();

      const poDividers = debugElement.querySelectorAll('po-divider');
      const poSwitch = debugElement.querySelector('po-switch[name="recurrent"]');

      expect(poDividers.length).toBe(1);
      expect(poSwitch).toBeFalsy();
    });
  });
});
