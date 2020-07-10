import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PoPageJobSchedulerLookupService } from './po-page-job-scheduler-lookup.service';
import { PoPageJobSchedulerService } from './po-page-job-scheduler.service';

describe('PoPageJobSchedulerLookupService:', () => {
  let poPageJobSchedulerLookupService: PoPageJobSchedulerLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoPageJobSchedulerLookupService, PoPageJobSchedulerService]
    });

    poPageJobSchedulerLookupService = TestBed.inject(PoPageJobSchedulerLookupService);
  });

  it('should be created', () => {
    expect(poPageJobSchedulerLookupService).toBeTruthy();
    expect(poPageJobSchedulerLookupService instanceof PoPageJobSchedulerLookupService).toBeTruthy();
  });

  describe('Methods:', () => {
    it('getFilteredItems: should call `getProcesses()` with object `{ page, pageSize, search }`.', () => {
      const filter = 'brasil';
      const page = 2;
      const pageSize = 5;

      spyOn(poPageJobSchedulerLookupService['poPageJobSchedulerService'], 'getProcesses');

      poPageJobSchedulerLookupService.getFilteredItems({ filter, page, pageSize });

      expect(poPageJobSchedulerLookupService['poPageJobSchedulerService'].getProcesses).toHaveBeenCalledWith({
        page,
        pageSize,
        search: filter
      });
    });

    it('getObjectByValue: should call `getProcess()` with `processId`.', () => {
      const processId = '12';

      spyOn(poPageJobSchedulerLookupService['poPageJobSchedulerService'], 'getProcess');

      poPageJobSchedulerLookupService.getObjectByValue(processId);

      expect(poPageJobSchedulerLookupService['poPageJobSchedulerService'].getProcess).toHaveBeenCalledWith(processId);
    });
  });
});
