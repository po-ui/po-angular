import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { addZero, convertDateToISOExtended } from '../../utils/util';
import { PoDynamicFormField } from '@po-ui/ng-components';

import { PoJobScheduler } from './interfaces/po-job-scheduler.interface';
import { PoJobSchedulerInternal } from './interfaces/po-job-scheduler-internal.interface';

@Injectable()
export class PoPageJobSchedulerService {
  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-SCREEN-LOCK': 'true'
  });

  private endpoint = '/';

  constructor(private http: HttpClient) {}

  configServiceApi(config: { endpoint?: string } = {}) {
    this.endpoint = config.endpoint;
  }

  // Cria um recurso
  createResource(resource): Observable<any> {
    const newResouce = this.convertToJobScheduler(resource);

    return this.http.post(`${this.endpoint}`, newResouce, { headers: this.headers });
  }

  getHeadProcesses() {
    const headers = { 'X-PO-No-Error': 'true' };

    return this.http.head(`${this.endpoint}/processes`, { headers });
  }

  // Busca parametros pelo processo id
  getParametersByProcess(processId: string | number): Observable<any> {
    return this.http
      .get(`${this.endpoint}/processes/${processId}/parameters`, { headers: this.headers })
      .pipe(map((resource: { items: Array<PoDynamicFormField> }) => resource.items));
  }

  // Busca um único recurso
  getProcess(id: string | number): Observable<any> {
    return this.http.get(`${this.endpoint}/processes/${id}`, { headers: this.headers });
  }

  // Busca uma lista de processos
  getProcesses(params: {} = {}): Observable<any> {
    return this.http.get(`${this.endpoint}/processes`, { params });
  }

  // Busca um único recurso
  getResource(id: string | number): Observable<any> {
    return this.http
      .get(`${this.endpoint}/${id}`, { headers: this.headers })
      .pipe(map(resource => this.convertToJobSchedulerInternal(resource)));
  }

  // Atualiza um recurso
  updateResource(id, resource): Observable<any> {
    const newResouce = this.convertToJobScheduler(resource);
    return this.http.put(`${this.endpoint}/${id}`, newResouce, { headers: this.headers });
  }

  convertToJobScheduler(jobSchedulerInternal): PoJobScheduler {
    const jobScheduler = { ...jobSchedulerInternal };

    if (jobSchedulerInternal.periodicity) {
      if (jobSchedulerInternal.periodicity === 'single') {
        jobScheduler.recurrent = false;
      } else {
        Object.assign(jobScheduler, this.convertToPeriodicity(jobSchedulerInternal));
      }
    }

    if (jobSchedulerInternal.firstExecutionHour) {
      jobScheduler.firstExecution = this.replaceHourFirstExecution(
        jobSchedulerInternal.firstExecution,
        jobSchedulerInternal.firstExecutionHour
      );
    }

    if (jobSchedulerInternal.frequency && jobSchedulerInternal.frequency.type) {
      jobScheduler.rangeExecutions = {
        frequency: { ...jobSchedulerInternal.frequency }
      };

      if (jobSchedulerInternal.rangeLimitHour) {
        const splitRangeLimitHour = jobSchedulerInternal.rangeLimitHour.split(':');

        jobScheduler.rangeExecutions.rangeLimit = {
          hour: parseInt(splitRangeLimitHour[0], 10),
          minute: parseInt(splitRangeLimitHour[1], 10)
        };
      }

      if (jobSchedulerInternal.rangeLimitDay) {
        jobScheduler.rangeExecutions.rangeLimit = {
          ...jobScheduler.rangeExecutions.rangeLimit,
          day: jobSchedulerInternal.rangeLimitDay
        };
      }
    }

    if (!Object.keys(this.returnValidExecutionParameter(jobScheduler.executionParameter)).length) {
      delete jobScheduler.executionParameter;
    }

    this.removeInvalidKeys(jobScheduler);

    return jobScheduler;
  }

  convertToJobSchedulerInternal(jobScheduler = <any>{}): PoJobSchedulerInternal {
    const jobSchedulerInternal = { ...jobScheduler };

    if (jobScheduler.firstExecution) {
      jobSchedulerInternal.firstExecutionHour = this.getHourFirstExecution(jobScheduler.firstExecution);
    }

    Object.assign(jobSchedulerInternal, this.convertToPeriodicityInternal(jobScheduler));

    if (jobScheduler.rangeExecutions) {
      jobSchedulerInternal.rangeLimitHour = `${
        jobScheduler.rangeExecutions.rangeLimit.hour < 10
          ? '0' + jobScheduler.rangeExecutions.rangeLimit.hour
          : jobScheduler.rangeExecutions.rangeLimit.hour
      }:${
        jobScheduler.rangeExecutions.rangeLimit.minute < 10
          ? '0' + jobScheduler.rangeExecutions.rangeLimit.minute
          : jobScheduler.rangeExecutions.rangeLimit.minute
      }`;
      jobSchedulerInternal.rangeLimitDay = jobScheduler.rangeExecutions.rangeLimit.day;
      jobSchedulerInternal.frequency = {
        type: jobScheduler.rangeExecutions.frequency.type,
        value: jobScheduler.rangeExecutions.frequency.value
      };
    }

    this.removeInvalidKeys(jobSchedulerInternal, ['weekly', 'monthly', 'daily']);

    return jobSchedulerInternal;
  }

  private convertToPeriodicity(value: {
    periodicity: string;
    dayOfMonth?: string;
    daysOfWeek?: number;
    hour?: string;
  }) {
    const newValue = {};
    const valuePeriodicity = value.periodicity;

    if (valuePeriodicity) {
      newValue[valuePeriodicity] = {};

      if (valuePeriodicity === 'monthly') {
        newValue[valuePeriodicity].day = value.dayOfMonth ? parseInt(value.dayOfMonth, 10) : 0;
      } else if (valuePeriodicity === 'weekly') {
        newValue[valuePeriodicity].daysOfWeek = value.daysOfWeek;
      }

      newValue[valuePeriodicity].hour = value.hour ? parseInt(value.hour.split(':')[0], 10) : 0;
      newValue[valuePeriodicity].minute = value.hour ? parseInt(value.hour.split(':')[1], 10) : 0;
    }

    return newValue;
  }

  private convertToPeriodicityInternal(value = <any>{}) {
    if (value.monthly) {
      return {
        periodicity: 'monthly',
        hour: `${addZero(value.monthly.hour)}:${addZero(value.monthly.minute)}`,
        dayOfMonth: value.monthly.day
      };
    } else if (value.daily) {
      return {
        periodicity: 'daily',
        hour: `${addZero(value.daily.hour)}:${addZero(value.daily.minute)}`
      };
    } else if (value.weekly) {
      return {
        periodicity: 'weekly',
        hour: `${addZero(value.weekly.hour)}:${addZero(value.weekly.minute)}`,
        daysOfWeek: [...value.weekly.daysOfWeek]
      };
    } else {
      return {
        periodicity: 'single'
      };
    }
  }

  private getCurrentHour(date: Date): string {
    const hours = addZero(date.getHours());
    const minutes = addZero(date.getMinutes());

    return `${hours}:${minutes}`;
  }

  private getHourFirstExecution(firstExecutionDate: string): string {
    return this.getCurrentHour(new Date(firstExecutionDate));
  }

  private removeInvalidKeys(value: object, keys?: Array<string>) {
    const invalidKeys = keys || [
      'periodicity',
      'hour',
      'minute',
      'day',
      'daysOfWeek',
      'dayOfMonth',
      'firstExecutionHour',
      'frequency',
      'rangeLimitHour',
      'rangeLimitDay'
    ];

    Object.keys(value).forEach(key => {
      if (invalidKeys.includes(key)) {
        delete value[key];
      } else if (key === 'rangeExecutions' && value['periodicity'] === 'single') {
        delete value[key];
      }
    });
  }

  private replaceHourFirstExecution(date: string, time: string): string {
    const firstExecutionDate = new Date(date);

    const timeSplited = time.split(':');

    const hours = parseInt(timeSplited[0], 10);
    const minutes = parseInt(timeSplited[1], 10);

    firstExecutionDate.setHours(hours, minutes);

    return convertDateToISOExtended(firstExecutionDate);
  }

  private returnValidExecutionParameter(parameter: object) {
    const newParameter = { ...parameter };

    for (const key in newParameter) {
      if (newParameter.hasOwnProperty(key) && newParameter[key] === undefined) {
        delete newParameter[key];
      }
    }

    return newParameter;
  }
}
