import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PoComboFilterService } from './po-combo-filter.service';
import { PoComboOption } from './interfaces/po-combo-option.interface';

describe('PoComboFilterService ', () => {
  let comboService: PoComboFilterService;
  let httpMock: HttpTestingController;

  const mockURL = 'rest/tecnologies';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoComboFilterService]
    });

    comboService = TestBed.inject(PoComboFilterService);
    httpMock = TestBed.inject(HttpTestingController);

    comboService.configProperties(mockURL, 'name', 'id');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return only filtered data', done => {
    const items: any = 'items';

    comboService.getFilteredData({}).subscribe(response => {
      expect(response.length).toBe(1);
      expect(response[items]).toBeUndefined();

      done();
    });

    httpMock
      .expectOne((req: HttpRequest<any>) => req.url === mockURL && req.method === 'GET')
      .flush({ items: [{ name: 'Angular', id: 'angular' }] });
  });

  it('should not return any filtered data', done => {
    const items: any = 'items';

    comboService.getFilteredData({}).subscribe(response => {
      expect(response.length).toBe(0);
      expect(response[items]).toBeUndefined();

      done();
    });

    httpMock.expectOne((req: HttpRequest<any>) => req.url === mockURL && req.method === 'GET').flush({ items: [] });
  });

  it('should return the object converted to PoComboOption', done => {
    const param = 'angular';

    comboService.getObjectByValue(param).subscribe(object => {
      expect('label' in object).toBeTruthy();
      expect('value' in object).toBeTruthy();

      done();
    });

    httpMock.expectOne(`${mockURL}/${param}`).flush({ id: 'angular', name: 'Angular' });
  });

  it('should return empty object', done => {
    const param = 'react';

    comboService.getObjectByValue(param).subscribe(object => {
      expect(object).toEqual({ value: '' });

      done();
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
    it('getFilteredData: should contains X-PO-NO-MESSAGE in headers request', done => {
      const urlWithParams = 'http://mockurl.com?filter=test';
      const parsedParams: Array<PoComboOption> = [{ label: 'value1', value: 'value1' }];

      spyOn(comboService, <any>'parseToArrayComboOption').and.returnValue(parsedParams);
      spyOnProperty(comboService, 'url', 'get').and.returnValue('http://mockurl.com');

      comboService.getFilteredData({ value: 'test' }).subscribe(response => {
        expect(response).toEqual(parsedParams);
        done();
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => request.urlWithParams === urlWithParams);
      expect(req.request.headers.get('X-PO-No-Message')).toBe('true');

      req.flush({});
    });

    it('getFilteredData: should concatenate url with filter params', done => {
      const urlWithParams = 'http://mockurl.com?param1=value1&param2=value2&filter=test';
      const parsedParams: Array<PoComboOption> = [{ label: 'value1', value: 'value1' }];

      spyOn(comboService, <any>'parseToArrayComboOption').and.returnValue(parsedParams);
      spyOnProperty(comboService, 'url', 'get').and.returnValue('http://mockurl.com');

      comboService.getFilteredData({ value: 'test' }, { param1: 'value1', param2: 'value2' }).subscribe(response => {
        expect(response).toEqual(parsedParams);
        done();
      });

      httpMock.expectOne((req: HttpRequest<any>) => req.urlWithParams === urlWithParams).flush({});
    });

    it('getFilteredData: shouldn`t concatenate url with filter params if filter params is not an object', done => {
      const urlWithParams = 'http://mockurl.com?filter=test';
      const parsedParams: Array<PoComboOption> = [{ label: 'value1', value: 'value1' }];

      spyOn(comboService, <any>'parseToArrayComboOption').and.returnValue(parsedParams);
      spyOnProperty(comboService, 'url', 'get').and.returnValue('http://mockurl.com');

      comboService.getFilteredData({ value: 'test' }, [{ param1: 'value1', param2: 'value2' }]).subscribe(response => {
        expect(response).toEqual(parsedParams);
        done();
      });

      httpMock.expectOne((req: HttpRequest<any>) => req.urlWithParams === urlWithParams).flush({});
    });

    it(`getFilteredData: should return array of object[value=""] if
      fieldValue property not exists in items and display messages`, done => {
      const items = [
        { email: 'john@email.com', name: 'john' },
        { email: 'jane@email.com', name: 'jane' }
      ];
      const filterParam = { value: '' };
      const expectItems = [{ value: '' }, { value: '' }];

      comboService.fieldValue = 'cpf';

      spyOn(comboService, <any>'addMessage').and.callThrough();
      spyOn(console, 'error').and.callThrough();
      spyOnProperty(comboService, 'url', 'get').and.returnValue('http://mockurl.com');

      comboService.getFilteredData(filterParam).subscribe(response => {
        expect(response).toEqual(expectItems);
        expect(console.error).toHaveBeenCalledTimes(items.length);
        expect(comboService['addMessage']).toHaveBeenCalled();
        expect(comboService['messages']).toEqual([]);

        done();
      });

      httpMock.expectOne(`http://mockurl.com?filter=`).flush({ items });
    });

    it(`getFilteredData: shouldn't call console.error if returned items contains fieldValue property`, done => {
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

      spyOn(comboService, <any>'addMessage').and.callThrough();
      spyOn(console, 'error').and.callThrough();
      spyOnProperty(comboService, 'url', 'get').and.returnValue('http://mockurl.com');

      comboService.getFilteredData(filterParam).subscribe(response => {
        expect(response).toEqual(expectItems);
        expect(console.error).not.toHaveBeenCalled();
        expect(comboService['addMessage']).not.toHaveBeenCalled();
        expect(comboService['messages']).toEqual([]);

        done();
      });

      httpMock.expectOne(`http://mockurl.com?filter=`).flush({ items });
    });

    it('getObjectByValue: should contains X-PO-NO-MESSAGE in headers request', done => {
      const filteredObject: PoComboOption = { label: 'value1', value: 'value1' };
      const param = 'angular';
      const urlWithParams = 'http://mockurl.com/angular';

      spyOn(comboService, <any>'parseToComboOption').and.returnValue(filteredObject);
      spyOnProperty(comboService, 'url', 'get').and.returnValue('http://mockurl.com');

      comboService.getObjectByValue(param).subscribe(response => {
        expect(response).toEqual(filteredObject);
        done();
      });

      const req = httpMock.expectOne((request: HttpRequest<any>) => request.urlWithParams === urlWithParams);
      expect(req.request.headers.get('X-PO-No-Message')).toBe('true');

      req.flush({});
    });

    it('getObjectByValue: should add filter params', done => {
      const filteredObject: PoComboOption = { label: 'value1', value: 'value1' };
      const param = 'angular';
      const urlWithParams = 'http://mockurl.com/angular?param1=value1&param2=value2';
      const filterParams = { param1: 'value1', param2: 'value2' };

      spyOn(comboService, <any>'parseToComboOption').and.returnValue(filteredObject);
      spyOnProperty(comboService, 'url', 'get').and.returnValue('http://mockurl.com');

      comboService.getObjectByValue(param, filterParams).subscribe(response => {
        expect(response).toEqual(filteredObject);
        done();
      });

      httpMock.expectOne((req: HttpRequest<any>) => req.urlWithParams === urlWithParams).flush({});
    });

    it('getObjectByValue: shouldn`t add filter params if filter params is not an object', done => {
      const filteredObject: PoComboOption = { label: 'value1', value: 'value1' };
      const param = 'angular';
      const urlWithParams = 'http://mockurl.com/angular';
      const filterParams = [{ param1: 'value1', param2: 'value2' }];

      spyOn(comboService, <any>'parseToComboOption').and.returnValue(filteredObject);
      spyOnProperty(comboService, 'url', 'get').and.returnValue('http://mockurl.com');

      comboService.getObjectByValue(param, filterParams).subscribe(response => {
        expect(response).toEqual(filteredObject);
        done();
      });

      httpMock.expectOne((req: HttpRequest<any>) => req.urlWithParams === urlWithParams).flush({});
    });
  });
});
