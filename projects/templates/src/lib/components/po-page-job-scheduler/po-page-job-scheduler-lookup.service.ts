import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PoLookupFilter } from '@po-ui/ng-components';

import { PoPageJobSchedulerService } from './po-page-job-scheduler.service';

@Injectable()
export class PoPageJobSchedulerLookupService implements PoLookupFilter {
  constructor(private poPageJobSchedulerService: PoPageJobSchedulerService) {}

  getFilteredItems({ filter, page, pageSize }): Observable<any> {
    const params = { page, pageSize, search: filter };

    return this.poPageJobSchedulerService.getProcesses(params);
  }

  getObjectByValue(processId: string): Observable<any> {
    return this.poPageJobSchedulerService.getProcess(processId);
  }
}
