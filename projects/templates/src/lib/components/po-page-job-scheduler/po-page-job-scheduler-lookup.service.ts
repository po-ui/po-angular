import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { PoLookupFilter } from '@po-ui/ng-components';

import { PoPageJobSchedulerService } from './po-page-job-scheduler.service';

@Injectable({
  providedIn: 'root'
})
export class PoPageJobSchedulerLookupService implements PoLookupFilter {
  private poPageJobSchedulerService = inject(PoPageJobSchedulerService);

  getFilteredItems({ filter, page, pageSize }): Observable<any> {
    const params = { page, pageSize, search: filter };

    return this.poPageJobSchedulerService.getProcesses(params);
  }

  getObjectByValue(processId: string): Observable<any> {
    return this.poPageJobSchedulerService.getProcess(processId);
  }
}
