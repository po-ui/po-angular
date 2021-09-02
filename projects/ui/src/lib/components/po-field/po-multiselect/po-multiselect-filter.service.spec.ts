import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PoMultiselectFilterService } from './po-multiselect-filter.service';

describe('PoMultiSelectFilterService ', () => {
  let multiSelectService: PoMultiselectFilterService;
  let httpMock: HttpTestingController;

  const mockURL = 'rest/tecnologies';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoMultiselectFilterService]
    });

    multiSelectService = TestBed.inject(PoMultiselectFilterService);
    httpMock = TestBed.inject(HttpTestingController);

    multiSelectService.configProperties(mockURL, 'label', 'value');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return all items if param is empty', done => {
    multiSelectService.getFilteredData({}).subscribe(response => {
      expect(response.length).toBe(2);

      done();
    });

    httpMock
      .expectOne((req: HttpRequest<any>) => req.url === mockURL && req.method === 'GET')
      .flush({
        items: [
          { label: 'Angular', value: 'components' },
          { label: 'Service', value: 'Http' }
        ]
      });
  });

  it('should not return any filtered data', done => {
    multiSelectService.getFilteredData({ property: 'test' }).subscribe(response => {
      expect(response.length).toBe(0);
      expect(response['items']).toBeUndefined();

      done();
    });

    httpMock.expectOne((req: HttpRequest<any>) => req.url === mockURL && req.method === 'GET').flush({ items: [] });
  });

  it('should return only filtered data ', done => {
    const param = { property: 'label', value: 'angular' };
    multiSelectService.getFilteredData(param).subscribe(response => {
      expect(response.length).toBe(1);

      done();
    });

    httpMock
      .expectOne((req: HttpRequest<any>) => req.url === mockURL && req.method === 'GET')
      .flush({ items: [{ label: 'Angular', value: 'angular' }] });
  });

  it('should return the object converted to PoMultiSelectOption', done => {
    const value = ['angular'];

    multiSelectService.getObjectsByValues(value).subscribe(object => {
      expect('label' in object[0]).toBeTruthy();
      expect('value' in object[0]).toBeTruthy();

      done();
    });

    httpMock
      .expectOne(`${mockURL}?value=${value.toString()}`)
      .flush({ items: [{ label: 'Angular', value: 'components' }] });
  });

  it('should return [] when parseToArrayMultiselectOptions get null', () => {
    expect(multiSelectService['parseToArrayMultiselectOptions'](null)).toEqual([]);
  });

  it('Should add filter params and return value', done => {
    const filteredObject = { label: 'angular', value: 'angular' };
    const expectResponse = [{ label: 'angular', value: 'angular' }];
    const param = ['angular', 'components'];
    const urlWithParams = 'http://mockurl.com/?value=angular,components';

    spyOn(multiSelectService, <any>'parseToMultiselectOption').and.returnValue(filteredObject);
    spyOnProperty(multiSelectService, 'url', 'get').and.returnValue('http://mockurl.com/');

    multiSelectService.getObjectsByValues(param).subscribe(response => {
      expect(response).toEqual(expectResponse);
      done();
    });

    httpMock.expectOne((req: HttpRequest<any>) => req.urlWithParams === urlWithParams).flush({ items: [{}] });
  });
});
