import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { PoDynamicFormLoadService } from './po-dynamic-form-load.service';

describe('PoDynamicFormLoadService:', () => {
  let service: PoDynamicFormLoadService;

  const mockURL: string = 'http://po.com.br/api';
  const value = { name: 'username' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoDynamicFormLoadService]
    });

    service = TestBed.inject(PoDynamicFormLoadService);
  });

  describe('Methods:', () => {
    const spyLoadFunction = jasmine.createSpy('validateFunction');

    it('executeLoad: should call `execute` with `load` and `value`', () => {
      const spyExecute = spyOn(service, <any>'execute').and.returnValue(of());

      service.executeLoad(spyLoadFunction, value);

      expect(spyExecute).toHaveBeenCalledWith(spyLoadFunction, value);
    });

    it('executeLoad: should return default form if return of server is null', done => {
      const defaultForm = {
        value: {},
        fields: [],
        focus: undefined
      };

      spyOn(service, <any>'execute').and.returnValue(of(null));

      service.executeLoad(mockURL, value).subscribe(loadedFormData => {
        expect(loadedFormData).toEqual(defaultForm);
        done();
      });
    });

    it('executeLoad: should return value if return of server is not null', done => {
      const loadedFormData = { fields: [{ property: 'name', label: 'Nome' }] };

      spyOn(service, <any>'execute').and.returnValue(of(loadedFormData));

      service.executeLoad(mockURL, value).subscribe(validateField => {
        expect(validateField).toEqual(loadedFormData);
        done();
      });
    });

    it('createAndUpdateFieldsForm: should return merged fields between `fields` and `loadedFields` and create new loaded fields', () => {
      const fields = [
        { property: 'test1', required: true, visible: true },
        { property: 'test2', required: false, visible: true },
        { property: 'test3', required: true },
        { property: 'test4', required: false, visible: false }
      ];

      const validatedFields = [
        { property: 'test2', required: false, help: 'test help' },
        { property: 'test3', required: true, visible: false },
        { property: 'test5', required: true }
      ];

      const expectedField = [
        { property: 'test1', required: true, visible: true },
        { property: 'test2', required: false, visible: true, help: 'test help' },
        { property: 'test3', required: true, visible: false },
        { property: 'test4', required: false, visible: false },
        { property: 'test5', required: true }
      ];

      const result = service.createAndUpdateFieldsForm(validatedFields, fields);

      expect(result).toEqual(expectedField);
    });

    it('createAndUpdateFieldsForm: should return [] if `fields` and `loadedFields` are undefined', () => {
      const expectedField = [];

      const result = service.createAndUpdateFieldsForm();

      expect(result).toEqual(expectedField);
    });
  });
});
