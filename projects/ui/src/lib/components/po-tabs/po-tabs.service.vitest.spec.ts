import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PoTabsService } from './po-tabs.service';

describe('PoTabsService', () => {
  let service: PoTabsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoTabsService]
    });
    service = TestBed.inject(PoTabsService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should trigger onChanges', () => {
    let triggered = false;

    service.onChangesTriggered$.subscribe(() => {
      triggered = true;
    });

    service.triggerOnChanges();

    expect(triggered).toBe(true);
  });
});
