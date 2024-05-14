/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PoIconService } from './po-icon-provider.service';

describe('Service: PoIconProvider', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoIconService]
    });
  });

  it('should ...', inject([PoIconService], (service: PoIconService) => {
    expect(service).toBeTruthy();
  }));
});
