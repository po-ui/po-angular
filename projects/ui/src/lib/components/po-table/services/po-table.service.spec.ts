import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';

import { PoTableService } from './po-table.service';

describe('PoTableService', () => {
  let service: PoTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PoTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setUrl: should be called and set api url', () => {
    const url = 'https://po-sample-api.herokuapp.com/v1/heroes';

    service.setUrl(url);

    expect(service['url']).toBe(url);
  });

  it('validateParams: should be called with string and return undefined', () => {
    const params = 'po-ui';

    const response = service['validateParams'](params);

    expect(response).toBe(undefined);
  });

  it('validateParams: should be called with object and return the object', () => {
    const params = {
      order: '-name',
      page: 1,
      pageSize: 10
    };

    const response = service['validateParams'](params);

    expect(response).toBe(params);
  });

  it('getFilteredItems: to have been called and call backend', () => {
    service['url'] = 'https://po-sample-api.herokuapp.com/v1/heroes';

    const filteredParams = {
      order: '-name',
      page: 1,
      pageSize: 10
    };

    service.getFilteredItems(filteredParams).subscribe(response => {
      expect(response).toBeDefined();
    });
  });
});
