import { TestBed } from '@angular/core/testing';

import { PoStyleService } from './po-style.service';

describe('PoStyleService', () => {
  let service: PoStyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoStyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
