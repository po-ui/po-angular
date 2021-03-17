import { TestBed } from '@angular/core/testing';

import { PoCustomAreaService } from './po-custom-area.service';

describe('PoCustomAreaService', () => {
  let service: PoCustomAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoCustomAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
