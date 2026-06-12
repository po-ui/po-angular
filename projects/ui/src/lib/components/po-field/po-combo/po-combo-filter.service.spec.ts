import { TestBed } from '@angular/core/testing';
import { HttpRequest, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PoComboFilterService } from './po-combo-filter.service';
import { PoComboOption } from './interfaces/po-combo-option.interface';

describe('PoComboFilterService ', () => {
  let comboService: PoComboFilterService;
  let httpMock: HttpTestingController;

  const mockURL = 'rest/tecnologies';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [PoComboFilterService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });

    comboService = TestBed.inject(PoComboFilterService);
    httpMock = TestBed.inject(HttpTestingController);

    comboService.configProperties(mockURL, 'name', 'id');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return only filtered data', async () => {
    const items: any = 'items';

    comboService.getFilteredData({}).subscribe(response => {
      expect(response.length).toBe(1);
      expect(response[items]).toBeUndefined();
    });

    httpMock
      .expectOne((req: HttpRequest<any>) => req.url === mockURL && req.method === 'GET')
      .flush({ items: [{ name: 'Angular', id: 'angular' }] });
  });

  it('should not return any filtered data', async () => {
    const items: any = 'items';

    comboService.getFilteredData({}).subscribe(response => {
      expect(response.length).toBe(0);
      expect(response[items]).toBeUndefined();
    });

    httpMock.expectOne((req: HttpRequest<any>) => req.url === mockURL && req.method === 'GET').flush({ items: [] });
  });

  it('should return the object converted to PoComboOption', async () => {
    const param = 'angular';

    comboService.getObjectByValue(param).subscribe(object => {
      expect('label' in object).toBeTruthy();
      expect('value' in object).toBeTruthy();
    });

    httpMock.expectOne(`${mockURL}/${param}`).flush({ id: 'angular', name: 'Angular' });
  });

  it('should return empty object', async () => {
    const param = 'react';

    comboService.getObjectByValue(param).subscribe(object => {
      expect(object).toEqual({ value: '' });
    });

    httpMock.expectOne(`${mockURL}/${param}`).flush(null);
  });

  it('should parse option and change keys of object', () => {
    const valueExpected = { label: 'teste', value: 'valor' };

    comboService.fieldLabel = 'label';
    comboService.fieldValue = 'value';

    const result = comboService['parseToComboOption'](valueExpected);
    const resultStringfy = JSON.stringify(result);

    expect(resultStringfy).toBe(JSON.stringify(valueExpected));
  });

  it('should return { value: "" } when parseToComboOption get null', () => {
    expect(comboService['parseToComboOption'](null)).toEqual({ value: '' });
  });

  describe('Methods:', () => {
    it('getFilteredData: should contains X-PO-NO-MESSAGE in headers request', async () => {
      const urlWithParams = 'http://mockurl.com?filter=test';
      const parsedParams: Array<PoComboOption> = [{ label: 'value1', value: 'value1' }];

      vi.spyOn(comboService as any, 'parseToArrayComboOption').mockReturnValue(parsedParams);
      vi.spyOn(comboService, 'url', 'get').mockReturnValue('http://mockurl.com');

      comboService.getFilteredData({ value: 'test' }).subscribe(response => {
        expect(response).toEqual(parsedParams);
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => request.urlWithParams === urlWithParams);
      expect(req.request.headers.get('X-PO-No-Message')).toBe('true');

      req.flush({});
    });

    it('getFilteredData: should concatenate url with filter params', async () => {
      const urlWithParams = 'http://mockurl.com?param1=value1&param2=value2&filter=test';
      const parsedParams: Array<PoComboOption> = [{ label: 'value1', value: 'value1' }];

      vi.spyOn(comboService as any, 'parseToArrayComboOption').mockReturnValue(parsedParams);
      vi.spyOn(comboService, 'url', 'get').mockReturnValue('http://mockurl.com');

      comboService.getFilteredData({ value: 'test' }, { param1: 'value1', param2: 'value2' }).subscribe(response => {
        expect(response).toEqual(parsedParams);
      });

      httpMock.expectOne((req: HttpRequest<any>) => req.urlWithParams === urlWithParams).flush({});
    });

    it('getFilteredData: shouldn`t concatenate url with filter params if filter params is not an object', async () => {
      const urlWithParams = 'http://mockurl.com?filter=test';
      const parsedParams: Array<PoComboOption> = [{ label: 'value1', value: 'value1' }];

      vi.spyOn(comboService as any, 'parseToArrayComboOption').mockReturnValue(parsedParams);
      vi.spyOn(comboService, 'url', 'get').mockReturnValue('http://mockurl.com');

      comboService.getFilteredData({ value: 'test' }, [{ param1: 'value1', param2: 'value2' }]).subscribe(response => {
        expect(response).toEqual(parsedParams);
      });

      httpMock.expectOne((req: HttpRequest<any>) => req.urlWithParams === urlWithParams).flush({});
    });

    it(`getFilteredData: should return array of object[value=""] if
      fieldValue property not exists in items and display messages`, async () => {
      const items = [
        { email: 'john@email.com', name: 'john' },
        { email: 'jane@email.com', name: 'jane' }
      ];
      const filterParam = { value: '' };
      const expectItems = [{ value: '' }, { value: '' }];

      comboService.fieldValue = 'cpf';

      vi.spyOn(comboService as any, 'addMessage');
      vi.spyOn(console as any, 'error');
      vi.spyOn(comboService, 'url', 'get').mockReturnValue('http://mockurl.com');

      comboService.getFilteredData(filterParam).subscribe(response => {
        expect(response).toEqual(expectItems);
        expect(console.error).toHaveBeenCalledTimes(items.length);
        expect(comboService['addMessage']).toHaveBeenCalled();
        expect(comboService['messages']).toEqual([]);
      });

      httpMock.expectOne(`http://mockurl.com?filter=`).flush({ items });
    });

    it(`getFilteredData: shouldn't call console.error if returned items contains fieldValue property`, async () => {
      comboService.fieldValue = 'name';

      const items = [
        { email: 'john@email.com', name: 'john' },
        { email: 'jane@email.com', name: 'jane' }
      ];
      const filterParam = { value: '' };
      const expectItems = items.map(item => ({
        value: item[comboService.fieldValue],
        label: item[comboService.fieldValue]
      }));

      vi.spyOn(comboService as any, 'addMessage');
      vi.spyOn(console as any, 'error');
      vi.spyOn(comboService, 'url', 'get').mockReturnValue('http://mockurl.com');

      comboService.getFilteredData(filterParam).subscribe(response => {
        expect(response).toEqual(expectItems);
        expect(console.error).not.toHaveBeenCalled();
        expect(comboService['addMessage']).not.toHaveBeenCalled();
        expect(comboService['messages']).toEqual([]);
      });

      httpMock.expectOne(`http://mockurl.com?filter=`).flush({ items });
    });

    it('getObjectByValue: should contains X-PO-NO-MESSAGE in headers request', async () => {
      const filteredObject: PoComboOption = { label: 'value1', value: 'value1' };
      const param = 'angular';
      const urlWithParams = 'http://mockurl.com/angular';

      vi.spyOn(comboService as any, 'parseToComboOption').mockReturnValue(filteredObject);
      vi.spyOn(comboService, 'url', 'get').mockReturnValue('http://mockurl.com');

      comboService.getObjectByValue(param).subscribe(response => {
        expect(response).toEqual(filteredObject);
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => request.urlWithParams === urlWithParams);
      expect(req.request.headers.get('X-PO-No-Message')).toBe('true');

      req.flush({});
    });

    it('getObjectByValue: should add filter params', async () => {
      const filteredObject: PoComboOption = { label: 'value1', value: 'value1' };
      const param = 'angular';
      const urlWithParams = 'http://mockurl.com/angular?param1=value1&param2=value2';
      const filterParams = { param1: 'value1', param2: 'value2' };

      vi.spyOn(comboService as any, 'parseToComboOption').mockReturnValue(filteredObject);
      vi.spyOn(comboService, 'url', 'get').mockReturnValue('http://mockurl.com');

      comboService.getObjectByValue(param, filterParams).subscribe(response => {
        expect(response).toEqual(filteredObject);
      });

      httpMock.expectOne((req: HttpRequest<any>) => req.urlWithParams === urlWithParams).flush({});
    });

    it('getObjectByValue: shouldn`t add filter params if filter params is not an object', async () => {
      const filteredObject: PoComboOption = { label: 'value1', value: 'value1' };
      const param = 'angular';
      const urlWithParams = 'http://mockurl.com/angular';
      const filterParams = [{ param1: 'value1', param2: 'value2' }];

      vi.spyOn(comboService as any, 'parseToComboOption').mockReturnValue(filteredObject);
      vi.spyOn(comboService, 'url', 'get').mockReturnValue('http://mockurl.com');

      comboService.getObjectByValue(param, filterParams).subscribe(response => {
        expect(response).toEqual(filteredObject);
      });

      httpMock.expectOne((req: HttpRequest<any>) => req.urlWithParams === urlWithParams).flush({});
    });

    it('prepareData: should be called', () => {
      const param = { value: 'Peter' };
      const expectedParams = { filter: 'Peter' };

      const params = comboService['prepareParams'](param);
      expect(params).toEqual(expectedParams);
    });

    it('prepareData: should be called when infinite scroll is active', () => {
      const param = { value: 'Peter', page: 1, pageSize: 10 };
      const expectedParams = { filter: 'Peter', page: 1, pageSize: 10 };

      const params = comboService['prepareParams'](param);
      expect(params).toEqual(expectedParams);
    });

    it('scrollListener: should call scrollListener on scroll', () => {
      const dummyElement = document.createElement('div');

      comboService.scrollListener(dummyElement).subscribe(response => {
        expect(response).toBeDefined();
      });
    });
  });
});
