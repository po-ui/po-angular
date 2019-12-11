import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

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
      const spyValidateFieldOnServer = spyOn(service, <any>'validateFieldOnServer');

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

      const spySendChanges = spyOn(service, 'sendChanges');

      service.sendFieldChange(field, value);

      expect(spySendChanges).toHaveBeenCalledWith(field.validate, field, value);

    });

    it('sendFormChange: should call `sendChanges` with `validate`, `field` and `value`', () => {
      const valuesList = [{ name: 'username' }, { age: '20'}];

      const spySendChanges = spyOn(service, 'sendChanges');

      service.sendFormChange(spyValidateFunction, field, valuesList);

      expect(spySendChanges).toHaveBeenCalledWith(spyValidateFunction, field, valuesList);
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
