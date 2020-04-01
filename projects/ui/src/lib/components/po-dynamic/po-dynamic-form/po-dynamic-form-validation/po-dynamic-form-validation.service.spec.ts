import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { PoDynamicFormField } from '../po-dynamic-form-field.interface';
import { PoDynamicFormValidationService } from './po-dynamic-form-validation.service';

describe('PoDynamicFormValidationService:', () => {
  let httpMock: HttpTestingController;
  let service: PoDynamicFormValidationService;

  let field: PoDynamicFormField;
  let mockURL: string;
  let value: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoDynamicFormValidationService]
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PoDynamicFormValidationService);

    (field = { property: 'test1', required: true, visible: true }), (mockURL = 'http://po.com.br/api');
    value = { name: 'username' };
  });

  describe('Methods:', () => {
    const spyValidateFunction = jasmine.createSpy('validateFunction');

    it('sendFieldChange: should call `execute` with `field.validate`, `field` and `value`', () => {
      const changedValue = { property: field.property, value };

      field.validate = mockURL;

      const spyExecute = spyOn(service, <any>'execute').and.returnValue(of());

      service.sendFieldChange(field, value);

      expect(spyExecute).toHaveBeenCalledWith(field.validate, changedValue);
    });

    it('sendFieldChange: should return value if return of server is not null', done => {
      const validatedField = { field: { disabled: false } };

      spyOn(service, <any>'execute').and.returnValue(of(validatedField));

      service.sendFieldChange(field, value).subscribe(validateField => {
        expect(validateField).toEqual(validatedField);
        done();
      });
    });

    it('sendFieldChange: should return default field if return of server is null', done => {
      const defaultField = {
        field: {}
      };

      spyOn(service, <any>'execute').and.returnValue(of(null));

      service.sendFieldChange(field, value).subscribe(validateField => {
        expect(validateField).toEqual(defaultField);
        done();
      });
    });

    it('sendFormChange: should call `execute` with `validate` and `changedValue`', () => {
      const changedValue = { property: field.property, value };

      const spyExecute = spyOn(service, <any>'execute').and.returnValue(of());

      service.sendFormChange(spyValidateFunction, field, value);

      expect(spyExecute).toHaveBeenCalledWith(spyValidateFunction, changedValue);
    });

    it('sendFormChange: should return default form if return of server is null', done => {
      const defaultForm = {
        value: {},
        fields: [],
        focus: undefined
      };

      spyOn(service, <any>'execute').and.returnValue(of(null));

      service.sendFormChange('validate', field, value).subscribe(validateField => {
        expect(validateField).toEqual(defaultForm);
        done();
      });
    });

    it('sendFormChange: should return value if return of server is not null', done => {
      const validatedField = { fields: [{ ...field }] };

      spyOn(service, <any>'execute').and.returnValue(of(validatedField));

      service.sendFormChange('validate', field, value).subscribe(validateField => {
        expect(validateField).toEqual(validatedField);
        done();
      });
    });

    it('updateFieldsForm: should return merged fields between `fields` and `validatFields`, ignoring new fields', () => {
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
        { property: 'test4', required: false, visible: false }
      ];

      const result = service.updateFieldsForm(validatedFields, fields);

      expect(result).toEqual(expectedField);
    });

    it('updateFieldsForm: should return [] if `fields` and `validatFields` are undefined', () => {
      const fields = undefined;

      const validatedFields = undefined;

      const expectedField = [];

      const result = service.updateFieldsForm(validatedFields, fields);

      expect(result).toEqual(expectedField);
    });

    it('setFieldDefaultIfEmpty: should return value if its is defined', () => {
      const validatedField = { value: 'new value' };

      expect(service['setFieldDefaultIfEmpty'](validatedField)).toEqual(validatedField);
    });

    it('setFieldDefaultIfEmpty: should return default field if its is undefined', () => {
      const defaultField = {
        field: {}
      };

      expect(service['setFieldDefaultIfEmpty'](undefined)).toEqual(defaultField);
    });
  });
});
