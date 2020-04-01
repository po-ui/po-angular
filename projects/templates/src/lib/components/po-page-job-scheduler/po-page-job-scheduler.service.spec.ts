import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { PoDynamicFormField } from '@po-ui/ng-components';
import * as utilsFunctions from '../../utils/util';

import { PoJobScheduler } from './interfaces/po-job-scheduler.interface';
import { PoJobSchedulerInternal } from './interfaces/po-job-scheduler-internal.interface';
import { PoPageJobSchedulerService } from './po-page-job-scheduler.service';

describe('PoPageJobSchedulerService:', () => {
  let poPageJobSchedulerService: PoPageJobSchedulerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoPageJobSchedulerService]
    });

    poPageJobSchedulerService = TestBed.inject(PoPageJobSchedulerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(poPageJobSchedulerService).toBeTruthy();
    expect(poPageJobSchedulerService instanceof PoPageJobSchedulerService).toBeTruthy();
  });

  describe('Methods:', () => {
    it('configServiceApi: should set the endpoint', () => {
      const config = { endpoint: '/endpoint' };

      poPageJobSchedulerService.configServiceApi(config);

      expect(poPageJobSchedulerService['endpoint']).toEqual(config.endpoint);
    });

    it('configServiceApi: should set the endpoint with undefined if `config` is undefined', () => {
      const config = undefined;

      poPageJobSchedulerService.configServiceApi(config);

      expect(poPageJobSchedulerService['endpoint']).toBeUndefined();
    });

    it('createResource: should call `convertToJobScheduler` and `POST` methods', () => {
      const resource: { items: Array<PoDynamicFormField> } = {
        items: [{ property: '' }]
      };

      spyOn(poPageJobSchedulerService, <any>'convertToJobScheduler').and.returnValue(of({}));

      poPageJobSchedulerService.createResource(resource).subscribe(response => {
        expect(response).toEqual(resource);
      });

      const req = httpMock.expectOne(`${poPageJobSchedulerService['endpoint']}`);
      expect(req.request.method).toBe('POST');
      req.flush(resource);

      expect(poPageJobSchedulerService['convertToJobScheduler']).toHaveBeenCalledWith(resource);
    });

    it('getHeadProcesses: should return the response from `HEAD` method', () => {
      let headResponse;
      const headers = { 'X-PO-No-Error': 'true' };
      poPageJobSchedulerService['endpoint'] = '/endpoint';

      poPageJobSchedulerService.getHeadProcesses().subscribe(response => {
        headResponse = response;
      });

      const req = httpMock.expectOne(`${poPageJobSchedulerService['endpoint']}/processes`);
      expect(req.request.method).toBe('HEAD');
      req.flush(headers);
      expect(headResponse).toEqual(headers);
    });

    it('getParametersByProcess: should return an object with parameters from `GET` method', () => {
      let reqResponse;
      const processId = 10;
      const resource: { items: Array<PoDynamicFormField> } = {
        items: [{ property: '' }]
      };

      poPageJobSchedulerService.getParametersByProcess(processId).subscribe(response => {
        reqResponse = response;
      });

      const req = httpMock.expectOne(`${poPageJobSchedulerService['endpoint']}/processes/${processId}/parameters`);
      expect(req.request.method).toBe('GET');
      req.flush(resource);

      expect(reqResponse).toEqual(resource.items);
    });

    it('getProcess: should return the response from `GET` method', () => {
      let reqResponse;
      const users = [
        { name: 'Name A', id: 10 },
        { name: 'Name B', id: 11 }
      ];
      const reqId = 10;

      poPageJobSchedulerService.getProcess(reqId).subscribe(response => {
        reqResponse = response;
      });

      const req = httpMock.expectOne(`${poPageJobSchedulerService['endpoint']}/processes/${reqId}`);
      expect(req.request.method).toBe('GET');
      req.flush(users);

      expect(reqResponse).toEqual(users);
    });

    it('getProcesses: should return the response from `GET` method', () => {
      let reqResponse;
      const params = { name: 'Profile', id: 10 };
      poPageJobSchedulerService['endpoint'] = '/endpoint';

      poPageJobSchedulerService.getProcesses(params).subscribe(response => {
        reqResponse = response;
      });

      const req = httpMock.expectOne(`${poPageJobSchedulerService['endpoint']}/processes?name=Profile&id=10`);
      expect(req.request.method).toBe('GET');
      req.flush(params);

      expect(reqResponse).toEqual(params);
    });

    it('getProcesses: should pass empty params if `params` is undefined', () => {
      poPageJobSchedulerService['endpoint'] = '/endpoint';

      poPageJobSchedulerService.getProcesses().subscribe();

      const req = httpMock.expectOne(`${poPageJobSchedulerService['endpoint']}/processes`);
      expect(req.request.params.keys().length).toBe(0);
      req.flush({});
    });

    it('getResource: should call `convertToJobSchedulerInternal` passing as parameter the response from `GET` method', () => {
      const id = 10;
      const convertToJobSchedulerInternalReturn = of({});
      const resource: { items: Array<PoDynamicFormField> } = {
        items: [{ property: '' }]
      };

      spyOn(poPageJobSchedulerService, <any>'convertToJobSchedulerInternal').and.returnValue(
        convertToJobSchedulerInternalReturn
      );

      poPageJobSchedulerService.getResource(id).subscribe(response => {
        expect(response).toEqual(convertToJobSchedulerInternalReturn);
      });

      const req = httpMock.expectOne(`${poPageJobSchedulerService['endpoint']}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(resource);

      expect(poPageJobSchedulerService['convertToJobSchedulerInternal']).toHaveBeenCalledWith(resource);
    });

    it('updateResource: should call `convertToJobScheduler` and `PUT` methods', () => {
      const id = 10;
      const resource: { items: Array<PoDynamicFormField> } = {
        items: [{ property: '' }]
      };

      spyOn(poPageJobSchedulerService, <any>'convertToJobScheduler').and.returnValue(of({}));

      poPageJobSchedulerService.updateResource(id, resource).subscribe(response => {
        expect(response).toEqual(resource);
      });

      const req = httpMock.expectOne(`${poPageJobSchedulerService['endpoint']}/${id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(resource);

      expect(poPageJobSchedulerService['convertToJobScheduler']).toHaveBeenCalledWith(resource);
    });

    it('convertToJobScheduler: `jobSchedulerInternal.recurrent` should be false if `jobSchedulerInternal.periodicity` is `single`', () => {
      const jobSchedulerInternal = {
        periodicity: 'single',
        recurrent: undefined,
        firstExecution: new Date(),
        firstExecutionHour: '10:00'
      };

      spyOn(poPageJobSchedulerService, <any>'convertToPeriodicity');

      const result = poPageJobSchedulerService['convertToJobScheduler'](jobSchedulerInternal);

      expect(result.recurrent).toBeFalsy();
      expect(poPageJobSchedulerService['convertToPeriodicity']).not.toHaveBeenCalled();
    });

    it(`convertToJobScheduler: should return the merge between 'jobSchedulerInternal' and 'convertToPeriodicity' value
      if 'jobSchedulerInternal.periodicity' not is 'single'`, () => {
      const jobSchedulerInternal = {
        periodicity: 'another value',
        recurrent: undefined,
        firstExecution: undefined,
        firstExecutionHour: undefined
      };

      const convertToPeriodicityReturn: PoJobScheduler = {
        recurrent: undefined,
        firstExecution: undefined,
        processID: '1'
      };

      const resultExpected = Object.assign(jobSchedulerInternal, convertToPeriodicityReturn);

      spyOn(poPageJobSchedulerService, <any>'convertToPeriodicity').and.returnValue(convertToPeriodicityReturn);
      spyOn(poPageJobSchedulerService, <any>'removeInvalidKeys');

      const result = poPageJobSchedulerService['convertToJobScheduler'](jobSchedulerInternal);

      expect(result).toEqual(resultExpected);
      expect(poPageJobSchedulerService['convertToPeriodicity']).toHaveBeenCalledWith(jobSchedulerInternal);
    });

    it(`convertToJobScheduler: should set 'firstExecutionHour' with 'replaceHourFirstExecution' return if 'firstExecutionHour'
      is defined`, () => {
      const jobSchedulerInternal = {
        firstExecutionHour: new Date().toString(),
        firstExecution: new Date().toString()
      };

      const replaceHourFirstExecutionReturn = '00:09';

      spyOn(poPageJobSchedulerService, <any>'replaceHourFirstExecution').and.returnValue(
        replaceHourFirstExecutionReturn
      );
      spyOn(poPageJobSchedulerService, <any>'removeInvalidKeys');

      const result = poPageJobSchedulerService['convertToJobScheduler'](jobSchedulerInternal);

      expect(result.firstExecution).toEqual(replaceHourFirstExecutionReturn);

      expect(poPageJobSchedulerService['replaceHourFirstExecution']).toHaveBeenCalledWith(
        jobSchedulerInternal.firstExecution,
        jobSchedulerInternal.firstExecutionHour
      );
    });

    it(`convertToJobScheduler: should not call 'replaceHourFirstExecution' if 'firstExecutionHour' is undefined`, () => {
      const jobSchedulerInternal = {
        firstExecutionHour: undefined
      };

      spyOn(poPageJobSchedulerService, <any>'replaceHourFirstExecution');
      spyOn(poPageJobSchedulerService, <any>'removeInvalidKeys');

      poPageJobSchedulerService['convertToJobScheduler'](jobSchedulerInternal);

      expect(poPageJobSchedulerService['replaceHourFirstExecution']).not.toHaveBeenCalled();
    });

    it(`convertToJobScheduler: should delete 'executionParameter' if 'returnValidExecutionParameter' is empty`, () => {
      const jobSchedulerInternal = {
        executionParameter: {},
        firstExecution: '2018-02-20',
        processID: '1'
      };

      const jobSchedulerExpeted = {
        firstExecution: '2018-02-20',
        processID: '1'
      };

      spyOn(poPageJobSchedulerService, <any>'returnValidExecutionParameter').and.returnValue({});
      spyOn(poPageJobSchedulerService, <any>'removeInvalidKeys');

      const result = poPageJobSchedulerService['convertToJobScheduler'](jobSchedulerInternal);

      expect(result).toEqual(jobSchedulerExpeted);

      expect(poPageJobSchedulerService['returnValidExecutionParameter']).toHaveBeenCalledWith(
        jobSchedulerInternal.executionParameter
      );
    });

    it(`convertToJobScheduler: should not delete 'executionParameter' if 'returnValidExecutionParameter' has value`, () => {
      const jobSchedulerInternal: PoJobScheduler = {
        executionParameter: {},
        firstExecution: '2018-02-20',
        processID: '1'
      };

      spyOn(poPageJobSchedulerService, <any>'returnValidExecutionParameter').and.returnValue({ key: 'value' });
      spyOn(poPageJobSchedulerService, <any>'removeInvalidKeys');

      const result = poPageJobSchedulerService['convertToJobScheduler'](jobSchedulerInternal);

      expect(result).toEqual(jobSchedulerInternal);

      expect(poPageJobSchedulerService['returnValidExecutionParameter']).toHaveBeenCalledWith(
        jobSchedulerInternal.executionParameter
      );
    });

    it(`convertToJobScheduler: should call 'removeInvalidKeys' with 'jobSchedulerInternal'`, () => {
      const jobSchedulerInternal = {
        executionParameter: 'value',
        firstExecution: '2018-02-20',
        processID: '1'
      };

      spyOn(poPageJobSchedulerService, <any>'removeInvalidKeys');

      poPageJobSchedulerService['convertToJobScheduler'](jobSchedulerInternal);

      expect(poPageJobSchedulerService['removeInvalidKeys']).toHaveBeenCalledWith(jobSchedulerInternal);
    });

    it(`convertToJobSchedulerInternal: should set 'jobSchedulerInternal.firstExecutionHour' with 'getHourFirstExecution'
      return if 'firstExecution' is defined`, () => {
      const jobSchedulerInternal = {
        firstExecution: '2019-02-04'
      };

      const jobSchedulerInternalExpected = {
        firstExecution: '2019-02-04',
        firstExecutionHour: '06:45'
      };

      spyOn(poPageJobSchedulerService, <any>'removeInvalidKeys');
      spyOn(poPageJobSchedulerService, <any>'convertToPeriodicityInternal');
      spyOn(poPageJobSchedulerService, <any>'getHourFirstExecution').and.returnValue('06:45');

      poPageJobSchedulerService['convertToJobSchedulerInternal'](jobSchedulerInternal);

      expect(poPageJobSchedulerService['getHourFirstExecution']).toHaveBeenCalledWith(
        jobSchedulerInternal.firstExecution
      );

      expect(poPageJobSchedulerService['removeInvalidKeys']).toHaveBeenCalledWith(jobSchedulerInternalExpected, [
        'weekly',
        'monthly',
        'daily'
      ]);
    });

    it(`convertToJobSchedulerInternal: should not set 'jobSchedulerInternal.firstExecutionHour' with 'getHourFirstExecution'
      return if 'firstExecution' is undefined`, () => {
      const jobSchedulerInternal = {
        firstExecution: undefined,
        processID: '20'
      };

      spyOn(poPageJobSchedulerService, <any>'removeInvalidKeys');
      spyOn(poPageJobSchedulerService, <any>'convertToPeriodicityInternal');

      poPageJobSchedulerService['convertToJobSchedulerInternal'](jobSchedulerInternal);

      expect(poPageJobSchedulerService['removeInvalidKeys']).toHaveBeenCalledWith(jobSchedulerInternal, [
        'weekly',
        'monthly',
        'daily'
      ]);
    });

    it(`convertToJobSchedulerInternal: should return an empty object if 'jobScheduler' is undefined`, () => {
      const jobScheduler = undefined;

      spyOn(poPageJobSchedulerService, <any>'removeInvalidKeys');
      spyOn(poPageJobSchedulerService, <any>'convertToPeriodicityInternal');
      spyOn(poPageJobSchedulerService, <any>'getHourFirstExecution').and.returnValue('06:45');

      const result = <any>poPageJobSchedulerService['convertToJobSchedulerInternal'](jobScheduler);

      expect(result).toEqual({});
    });

    it(`convertToJobSchedulerInternal: should return the merge between 'jobSchedulerInternal' and
      the return from 'convertToPeriodicityInternal'`, () => {
      const jobSchedulerInternal = {
        processID: '20'
      };

      const jobSchedulerInternalConverted = {
        periodicity: 'single',
        firstExecution: undefined,
        firstExecutionHour: '06:45',
        recurrent: false
      };

      const jobSchedulerInternalExpected: PoJobSchedulerInternal = {
        processID: '20',
        periodicity: 'single',
        firstExecution: undefined,
        firstExecutionHour: '06:45',
        recurrent: false
      };

      spyOn(poPageJobSchedulerService, <any>'removeInvalidKeys');
      spyOn(poPageJobSchedulerService, <any>'convertToPeriodicityInternal').and.returnValue(
        jobSchedulerInternalConverted
      );
      spyOn(poPageJobSchedulerService, <any>'getHourFirstExecution').and.returnValue('06:45');

      const result = poPageJobSchedulerService['convertToJobSchedulerInternal'](jobSchedulerInternal);

      expect(result).toEqual(jobSchedulerInternalExpected);
    });

    describe('convertToPeriodicity: ', () => {
      it('should convert object to monthly periodicity', () => {
        const monthly = {
          periodicity: 'monthly',
          dayOfMonth: '05',
          hour: '10:05'
        };

        const result = {
          monthly: { day: 5, hour: 10, minute: 5 }
        };

        expect(poPageJobSchedulerService['convertToPeriodicity'](monthly)).toEqual(result);
      });

      it('should convert object to monthly periodicity with default day 0 if `dayOfMonth` is undefined', () => {
        const monthly = {
          periodicity: 'monthly',
          dayOfMonth: undefined,
          hour: '10:05'
        };

        const result = {
          monthly: { day: 0, hour: 10, minute: 5 }
        };

        expect(poPageJobSchedulerService['convertToPeriodicity'](monthly)).toEqual(result);
      });

      it('should convert object to monthly periodicity with default hour and minute `0` if `hour` is undefined', () => {
        const monthly = {
          periodicity: 'monthly',
          dayOfMonth: '05',
          hour: undefined
        };

        const result = {
          monthly: { day: 5, hour: 0, minute: 0 }
        };

        expect(poPageJobSchedulerService['convertToPeriodicity'](monthly)).toEqual(result);
      });

      it('should convert object to weekly periodicity', () => {
        const weekly = {
          periodicity: 'weekly',
          daysOfWeek: 5,
          hour: '10:05'
        };

        const result = {
          weekly: { daysOfWeek: 5, hour: 10, minute: 5 }
        };

        expect(poPageJobSchedulerService['convertToPeriodicity'](weekly)).toEqual(result);
      });

      it('should convert object to weekly periodicity with default hour and minute `0` if `hour` is undefined', () => {
        const weekly = {
          periodicity: 'weekly',
          daysOfWeek: 5,
          hour: undefined
        };

        const result = {
          weekly: { daysOfWeek: 5, hour: 0, minute: 0 }
        };

        expect(poPageJobSchedulerService['convertToPeriodicity'](weekly)).toEqual(result);
      });

      it('should return empty object if `periodicity` is undefined', () => {
        const value = { periodicity: undefined };
        const result = {};

        expect(poPageJobSchedulerService['convertToPeriodicity'](value)).toEqual(result);
      });

      it('should return object with periodicity value containing hour and minuts `0`', () => {
        const value = { periodicity: 'test' };
        const result = { test: { hour: 0, minute: 0 } };

        expect(poPageJobSchedulerService['convertToPeriodicity'](value)).toEqual(result);
      });
    });

    it('convertToPeriodicityInternal: should return monthly object if `value.monthly` is defined', () => {
      const value = {
        monthly: { hour: '8', minute: '1', day: '3' }
      };

      const result = poPageJobSchedulerService['convertToPeriodicityInternal'](value);

      expect(result).toEqual({
        periodicity: 'monthly',
        hour: '08:01',
        dayOfMonth: value.monthly.day
      });
    });

    it('convertToPeriodicityInternal: should return daily object if `value.daily` is defined', () => {
      const value = {
        daily: { hour: '8', minute: '1' }
      };

      const result = poPageJobSchedulerService['convertToPeriodicityInternal'](value);

      expect(result).toEqual({
        periodicity: 'daily',
        hour: '08:01'
      });
    });

    it('convertToPeriodicityInternal: should return weekly object if `value.weekly` is defined', () => {
      const value = {
        weekly: { hour: '8', minute: '1', daysOfWeek: ['mon', 'sat', 'sun'] }
      };

      const result = poPageJobSchedulerService['convertToPeriodicityInternal'](value);

      expect(result).toEqual({
        periodicity: 'weekly',
        hour: '08:01',
        daysOfWeek: ['mon', 'sat', 'sun']
      });
    });

    it(`convertToPeriodicityInternal: should return single object if 'value.weekly', 'value.monthly' and 'value.daily'
      are undefined`, () => {
      const value = {};

      const result = poPageJobSchedulerService['convertToPeriodicityInternal'](value);

      expect(result).toEqual({
        periodicity: 'single'
      });
    });

    it(`convertToPeriodicityInternal: should return single object if value is undefined`, () => {
      const value = undefined;

      const result = poPageJobSchedulerService['convertToPeriodicityInternal'](value);

      expect(result).toEqual({
        periodicity: 'single'
      });
    });

    it(`getCurrentHour: should return hour and minuts`, () => {
      const date = new Date(2018, 5, 12, 10, 15, 0);
      const result = '10:15';

      expect(poPageJobSchedulerService['getCurrentHour'](date)).toBe(result);
    });

    it(`getCurrentHour: should return hour and minuts with '0' if hour and minuts is less than '10'`, () => {
      const date = new Date(2018, 5, 12, 8, 5, 0);
      const result = '08:05';

      expect(poPageJobSchedulerService['getCurrentHour'](date)).toBe(result);
    });

    it(`getHourFirstExecution: should call 'getCurrentHour'`, () => {
      spyOn(poPageJobSchedulerService, <any>'getCurrentHour');
      const firstExecutionDate = new Date(2018, 5, 12, 10, 0, 0).toISOString();

      poPageJobSchedulerService['getHourFirstExecution'](firstExecutionDate);

      expect(poPageJobSchedulerService['getCurrentHour']).toHaveBeenCalled();
    });

    it(`getHourFirstExecution: should return time of the first execution`, () => {
      const firstExecutionDate = new Date(2018, 5, 12, 10, 0, 0).toISOString();
      const result = '10:00';

      expect(poPageJobSchedulerService['getHourFirstExecution'](firstExecutionDate)).toBe(result);
    });

    it('removeInvalidKeys: should remove default invalid keys if keys param is falsy', () => {
      const value: any = {
        periodicity: undefined,
        hour: undefined,
        minute: undefined,
        day: undefined,
        daysOfWeek: undefined,
        dayOfMonth: undefined,
        firstExecutionHour: undefined,
        anotherKey: 'value'
      };

      const valueExpected = {
        anotherKey: 'value'
      };

      poPageJobSchedulerService['removeInvalidKeys'](value);

      expect(value).toEqual(valueExpected);
    });

    it('removeInvalidKeys: should remove invalid keys if keys param is defined', () => {
      const value: any = {
        invalidKeyA: 'A',
        invalidKeyB: 'B',
        anotherKey: 'value'
      };

      const valueExpected = {
        anotherKey: 'value'
      };

      const invalidKeys = ['invalidKeyA', 'invalidKeyB'];

      poPageJobSchedulerService['removeInvalidKeys'](value, invalidKeys);

      expect(value).toEqual(valueExpected);
    });

    it(`replaceHourFirstExecution: should call 'convertDateToIsoExtended'`, () => {
      spyOn(utilsFunctions, 'convertDateToISOExtended');

      poPageJobSchedulerService['replaceHourFirstExecution']('2018-12-05', '12:05');

      expect(utilsFunctions.convertDateToISOExtended).toHaveBeenCalled();
    });

    it(`replaceHourFirstExecution: should replace hour`, () => {
      const initialDate = new Date(2018, 5, 12, 10, 0, 0).toISOString();
      const timeToReplace = '13:00';
      const result = '2018-06-12T13:00:00';

      poPageJobSchedulerService['replaceHourFirstExecution'](initialDate, timeToReplace);

      expect(poPageJobSchedulerService['replaceHourFirstExecution'](initialDate, timeToReplace).substring(0, 19)).toBe(
        result
      );
    });

    it('returnValidExecutionParameter: should remove keys that have undefined value', () => {
      const parameter = {
        numberKey: 1,
        stringKey: 'string',
        undefinedKey: undefined
      };
      const result = {
        numberKey: 1,
        stringKey: 'string'
      };

      expect(poPageJobSchedulerService['returnValidExecutionParameter'](parameter)).toEqual(result);
    });
  });
});
