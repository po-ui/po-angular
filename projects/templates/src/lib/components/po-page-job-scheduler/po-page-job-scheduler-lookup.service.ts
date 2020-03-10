import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PoLookupFilter } from '@portinari/portinari-ui';

import { PoPageJobSchedulerService } from './po-page-job-scheduler.service';

@Injectable()
export class PoPageJobSchedulerLookupService implements PoLookupFilter {
  constructor(private poPageJobSchedulerService: PoPageJobSchedulerService) {}

  getFilteredData(search: string, page: number, pageSize: number): Observable<any> {
    const params = { page, pageSize, search };

    return this.poPageJobSchedulerService.getProcesses(params);
  }

  getObjectByValue(processId: string): Observable<any> {
    return this.poPageJobSchedulerService.getProcess(processId);
  }
}
