import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PoDynamicFormOperation } from './po-dynamic-form-operation';

describe('PoDynamicFormOperation:', () => {
  let dynamicFormOperation;

  let httpMock: HttpTestingController;

  const mockURL: string = 'http://po.com.br/api';
  const value = { name: 'username' };

  const spyLoadFunction = jasmine.createSpy('loadFunction');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpMock = TestBed.inject(HttpTestingController);

    const http = TestBed.inject(HttpClient);

    dynamicFormOperation = new PoDynamicFormOperation(http);
  });

  describe('Methods:', () => {
    it('execute: should call `post` if `load` param is a string', () => {
      const spyPost = spyOn(dynamicFormOperation, 'post');

      dynamicFormOperation['execute'](mockURL, value);

      expect(spyPost).toHaveBeenCalledWith(mockURL, value);
    });

    it('execute: should call the function passed as param if `load` isn`t a string', () => {
      const spyPost = spyOn(dynamicFormOperation, <any>'post');

      dynamicFormOperation['execute'](spyLoadFunction, value);

      expect(spyLoadFunction).toHaveBeenCalledWith(value);
      expect(spyPost).not.toHaveBeenCalledWith();
    });

    it('post: should call `POST` method', () => {
      const param = { property: 'name', value };

      dynamicFormOperation['post'](mockURL, param).subscribe(response => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(`${mockURL}`);
      expect(req.request.method).toBe('POST');
    });

    it('setFormDefaultIfEmpty: should return value if its is defined', () => {
      const validatedField = { value: 'new value' };

      expect(dynamicFormOperation['setFormDefaultIfEmpty'](validatedField)).toEqual(validatedField);
    });

    it('setFormDefaultIfEmpty: should return default form if its is undefined', () => {
      const defaultForm = {
        value: {},
        fields: [],
        focus: undefined
      };

      expect(dynamicFormOperation['setFormDefaultIfEmpty'](undefined)).toEqual(defaultForm);
    });
  });
});
