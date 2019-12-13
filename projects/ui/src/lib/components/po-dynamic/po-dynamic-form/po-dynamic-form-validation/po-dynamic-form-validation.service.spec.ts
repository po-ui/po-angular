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
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        PoDynamicFormValidationService
      ]
    });

    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(PoDynamicFormValidationService);

    field = { property: 'test1', required: true, visible: true },
    mockURL = 'http://po.portinari.com.br/api';
    value = { name: 'username' };
  });

  describe('Methods:', () => {
    const spyValidateFunction = jasmine.createSpy('validateFunction');

    it('sendChanges: should call `validateFieldOnServer` if `validate` param is a string', () => {
      const spyValidateFieldOnServer = spyOn(service, <any>'validateFieldOnServer').and.returnValue(of());

      service.sendChanges(mockURL, field, value);

      expect(spyValidateFieldOnServer).toHaveBeenCalledWith(mockURL, { property: field.property, value });
    });

    it('sendChanges: should call the function passed as param if `validate` isn`t a string', () => {
      const spyValidateFieldOnServer = spyOn(service, <any>'validateFieldOnServer');

      service.sendChanges(spyValidateFunction, field, value);

      expect(spyValidateFunction).toHaveBeenCalledWith({ property: field.property, value });
      expect(spyValidateFieldOnServer).not.toHaveBeenCalledWith();
    });

    it('sendFieldChange: should call `sendChanges` with `field.validate`, `field` and `value`', () => {
      field.validate = mockURL;

      const spySendChanges = spyOn(service, 'sendChanges').and.returnValue(of());

      service.sendFieldChange(field, value);

      expect(spySendChanges).toHaveBeenCalledWith(field.validate, field, value);

    });

    it('sendFieldChange: should return value if return of server is not null', done => {
      const validatedField = { field: { disabled: false }};

      spyOn(service, <any>'sendChanges').and.returnValue(of(validatedField));

      service.sendFieldChange(field, value).subscribe(validateField => {
        expect(validateField).toEqual(validatedField);
        done();
      });
    });

    it('sendFieldChange: should return default field if return of server is null', done => {
      const defaultField = {
        field: {}
      };

      spyOn(service, <any>'sendChanges').and.returnValue(of(null));

      service.sendFieldChange(field, value).subscribe(validateField => {
        expect(validateField).toEqual(defaultField);
        done();
      });
    });

    it('sendFormChange: should call `sendChanges` with `validate`, `field` and `value`', () => {
      const valuesList = [{ name: 'username' }, { age: '20'}];

      const spySendChanges = spyOn(service, 'sendChanges').and.returnValue(of());

      service.sendFormChange(spyValidateFunction, field, valuesList);

      expect(spySendChanges).toHaveBeenCalledWith(spyValidateFunction, field, valuesList);
    });

    it('sendFormChange: should return default form if return of server is null', done => {
      const defaultForm = {
        value: {},
        fields: [],
        focus: undefined
      };

      spyOn(service, <any>'sendChanges').and.returnValue(of(null));

      service.sendFormChange('validate', field, value).subscribe(validateField => {
        expect(validateField).toEqual(defaultForm);
        done();
      });
    });

    it('sendFormChange: should return value if return of server is not null', done => {
      const validatedField = { field: { disabled: false }};

      spyOn(service, <any>'sendChanges').and.returnValue(of(validatedField));

      service.sendFormChange('validate', field, value).subscribe(validateField => {
        expect(validateField).toEqual(validatedField);
        done();
      });
    });

    it('updateFieldsForm: should return merged fields between `fields` and `validatFields`', () => {
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

    it('setFormDefaultIfEmpty: should return value if its is defined', () => {
      const validatedField = { value: 'new value' };

      expect(service['setFormDefaultIfEmpty'](validatedField)).toEqual(validatedField);
    });

    it('setFormDefaultIfEmpty: should return default form if its is undefined', () => {
      const defaultForm = {
        value: {},
        fields: [],
        focus: undefined
      };

      expect(service['setFormDefaultIfEmpty'](undefined)).toEqual(defaultForm);
    });

    it('validateFieldOnServer: should call `POST` method', () => {
      const changedValue = { property: field.property, value: value };

      service['validateFieldOnServer'](mockURL, changedValue).subscribe(response => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(`${mockURL}`);
      expect(req.request.method).toBe('POST');
    });
  });

});
