import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { expectPropertiesValues, configureTestSuite } from '../../../util-test/util-expect.spec';

import * as utilsFunctions from '../../../utils/util';
import * as ValidatorsFunctions from '../validators';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { poLocaleDefault } from '../../../services/po-language/po-language.constant';

import { PoUploadBaseComponent, poUploadLiteralsDefault } from './po-upload-base.component';
import { PoUploadFile } from './po-upload-file';
import { PoUploadService } from './po-upload.service';

@Component({
  selector: 'po-upload',
  template: ` <input type="file" class="po-upload" name="upload" /> `
})
class PoUploadComponent extends PoUploadBaseComponent {
  constructor(uploadService: PoUploadService) {
    super(uploadService, new PoLanguageService());
  }

  sendFeedback() {}
  setDirectoryAttribute(arg) {}
}

describe('PoUploadBaseComponent:', () => {
  let component: PoUploadComponent;
  let fixture: ComponentFixture<PoUploadComponent>;

  const fileMock: any = {
    lastModified: 1504558774471,
    lastModifiedDate: new Date(),
    name: 'Teste.png',
    size: 16,
    type: 'image/png',
    webkitRelativePath: ''
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoUploadComponent],
      providers: [HttpClient, HttpHandler, PoUploadService, PoLanguageService],
      imports: [FormsModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoUploadComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call setAllowedExtensions in fileRestrictions', () => {
    const restrictions = { allowedExtensions: ['.png', '.jpg'] };
    spyOn(component, <any>'setAllowedExtensions');
    component.fileRestrictions = restrictions;

    expect(component['setAllowedExtensions']).toHaveBeenCalledWith(restrictions);
  });

  it('should set allowedExtensions with "" when restrictions.allowedExtensions is falsy', () => {
    const restrictions = { allowedExtensions: undefined };
    component['setAllowedExtensions'](restrictions);

    expect(component.allowedExtensions).toBe('');
  });

  it('should set allowedExtensions with ".png,.jpg"', () => {
    const restrictions = { allowedExtensions: ['.png', '.jpg'] };
    component['setAllowedExtensions'](restrictions);

    expect(component.allowedExtensions).toBe('.png,.jpg');
  });

  it('should set allowedExtensions with "" when restrictions is undefined', () => {
    const restrictions = undefined;
    component['setAllowedExtensions'](restrictions);

    expect(component.allowedExtensions).toBe('');
  });

  describe('Methods:', () => {
    let file: PoUploadFile;

    beforeEach(() => {
      file = new PoUploadFile(fileMock);
    });

    it('registerOnChange: should register function onModelChange function', () => {
      const registerOnChangeFn = () => {};

      component.registerOnChange(registerOnChangeFn);
      expect(component.onModelChange).toBe(registerOnChangeFn);
    });

    it('registerOnTouched: should register onModelTouched function', () => {
      const registerOnTouchedFn = () => {};

      component.registerOnTouched(registerOnTouchedFn);
      expect(component['onModelTouched']).toBe(registerOnTouchedFn);
    });

    it('registerOnValidatorChange: should register validatorChange function', () => {
      const registerOnValidatorChangeFn = () => {};

      component.registerOnValidatorChange(registerOnValidatorChangeFn);
      expect(component['validatorChange']).toBe(registerOnValidatorChangeFn);
    });

    it('validate: should return required obj when `requiredFailed` is true', () => {
      const validObj = {
        required: {
          valid: false
        }
      };

      spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(true);

      expect(component.validate(new FormControl([]))).toEqual(validObj);
      expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
    });

    it('validate: should return undefined when `requiredFailed` is false', () => {
      spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(false);

      expect(component.validate(new FormControl(null))).toBeUndefined();
      expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
    });

    it('validateModel: should call `validatorChange` to validateModel when `validatorChange` is a function', () => {
      component['validatorChange'] = () => {};

      spyOn(component, <any>'validatorChange');

      component['validateModel']([]);

      expect(component['validatorChange']).toHaveBeenCalledWith([]);
    });

    it('validateModel: shouldn`t call `validatorChange` when it is falsy', () => {
      component['validateModel']([]);

      expect(component['validatorChange']).toBeUndefined();
    });

    it('getUploadService: should return uploadService', () => {
      expect(component['getUploadService']() instanceof PoUploadService).toBeTruthy();
    });

    it('writeValue: shouldn`t update `currentFiles` when files param is the same `currentFiles`', () => {
      const files: any = [{ name: 'file' }];
      component.currentFiles = [...files];

      const parseFiles = spyOn(component, <any>'parseFiles');

      component.writeValue(files);

      expect(parseFiles).not.toHaveBeenCalled();
    });

    it('writeValue: should update `currentFiles` when files param is different than `currentFiles`', () => {
      const files: any = [{ name: 'file' }];
      component.currentFiles = [];

      const parseFiles = spyOn(component, <any>'parseFiles');

      component.writeValue(files);

      expect(parseFiles).toHaveBeenCalled();
    });

    describe('isExceededFileLimit:', () => {
      beforeEach(() => {
        component.isMultiple = true;
      });

      it('setDisabledState: should set `component.disabled` with boolean parameter', () => {
        const expectedValue = true;
        component.setDisabledState(expectedValue);
        expect(component.disabled).toBe(expectedValue);
      });

      it(`should return false if 'fileRestrictions' is undefined.`, () => {
        component.fileRestrictions = undefined;

        expect(component['isExceededFileLimit'](0)).toBe(undefined);
      });

      it(`should return false if 'fileRestrictions' is defined and 'maxFiles' is greater than 'currentFilesLength'.`, () => {
        component.fileRestrictions = { maxFiles: 4 };

        expect(component['isExceededFileLimit'](3)).toBe(false);
      });

      it(`should return false if 'fileRestrictions' is defined and 'maxFiles' is zero.`, () => {
        component.fileRestrictions = { maxFiles: 0 };

        expect(component['isExceededFileLimit'](3)).toBe(false);
      });

      it(`should return false if 'fileRestrictions' is defined and 'maxFiles' is less than zero.`, () => {
        component.fileRestrictions = { maxFiles: -1 };

        expect(component['isExceededFileLimit'](3)).toBe(false);
      });

      it(`should return true if 'fileRestrictions' is defined and 'maxFiles' is less than 'currentFilesLength'.`, () => {
        component.fileRestrictions = { maxFiles: 4 };

        expect(component['isExceededFileLimit'](5)).toBe(true);
      });
    });

    describe('parseFiles:', () => {
      it('should call `insertFileInFiles` and return array of PoUploadFile', () => {
        const files = [new PoUploadFile({})];

        const checkRestritions = spyOn(component, <any>'checkRestrictions').and.returnValue(true);
        spyOn(component, <any>'insertFileInFiles').and.returnValue(files);

        expect(component['parseFiles']([fileMock])).toEqual(files);

        expect(checkRestritions).toHaveBeenCalled();
        expect(component['insertFileInFiles']).toHaveBeenCalled();
      });

      it('should not call `insertFileInFiles`', () => {
        const checkRestritions = spyOn(component, <any>'checkRestrictions').and.returnValue(false);
        spyOn(component, <any>'insertFileInFiles');

        expect(component['parseFiles']([fileMock])).toBeTruthy();
        expect(checkRestritions).toHaveBeenCalled();
        expect(component['insertFileInFiles']).not.toHaveBeenCalled();
      });

      it('should return three files if upload limit is three', () => {
        const files = [
          { name: 'file1', lastModified: '2019-02-12' },
          { name: 'file2', lastModified: '2019-02-12' },
          { name: 'file3', lastModified: '2019-02-12' },
          { name: 'file4', lastModified: '2019-02-12' }
        ];

        const expectedFiles = [
          { name: 'file1', lastModified: '2019-02-12' },
          { name: 'file2', lastModified: '2019-02-12' },
          { name: 'file3', lastModified: '2019-02-12' }
        ];

        component.isMultiple = true;
        component.fileRestrictions = { maxFiles: 3 };
        component.currentFiles = undefined;

        spyOn(component, <any>'checkRestrictions').and.returnValue(true);
        spyOn(component, <any>'insertFileInFiles').and.returnValues(expectedFiles, expectedFiles, expectedFiles, files);

        expect(component['parseFiles'](<any>files)).toEqual(<any>expectedFiles);
      });

      it('should return all files if upload limit is undefined', () => {
        const files = [{ name: 'file1' }, { name: 'file2' }, { name: 'file3' }, { name: 'file4' }];

        const incompletedFiles = [{ name: 'file1' }, { name: 'file2' }, { name: 'file3' }];

        component.fileRestrictions = { maxFiles: undefined };
        component.currentFiles = undefined;

        spyOn(component, <any>'checkRestrictions').and.returnValue(true);
        spyOn(component, <any>'insertFileInFiles').and.returnValues(
          incompletedFiles,
          incompletedFiles,
          incompletedFiles,
          files
        );

        expect(component['parseFiles'](<any>files)).toEqual(<any>files);
      });

      it('should set `quantityNotAllowed` with `filesLength - fileRestrictions.maxFiles` if `isExceededFileLimit` returns `true`', () => {
        const files = [{ name: 'file1' }, { name: 'file2' }, { name: 'file3' }];

        component.fileRestrictions = { maxFiles: 2 };

        spyOn(component, <any>'isExceededFileLimit').and.returnValue(true);

        component['parseFiles'](<any>files);

        expect(component['quantityNotAllowed']).toBe(1);
      });

      it('should call `sendFeedback`', () => {
        spyOn(component, 'sendFeedback');

        component['parseFiles'](<any>[{ name: 'file1' }]);

        expect(component.sendFeedback).toHaveBeenCalled();
      });
    });

    it('checkRestrictions: should be check restrictions', () => {
      let fakeThis;
      let isTruthy;

      fakeThis = {
        fileRestrictions: { minFileSize: 10, maxFileSize: 100, allowedExtensions: ['.png'] }
      };

      Object.assign(component, fakeThis);

      isTruthy = component['checkRestrictions'](file);
      expect(isTruthy).toBeTruthy();

      fakeThis['fileRestrictions'] = { minFileSize: null, maxFileSize: null, allowedExtensions: null };
      Object.assign(component, fakeThis);

      isTruthy = component['checkRestrictions'](file);
      expect(isTruthy).toBeTruthy();
    });

    it('checkRestrictions: should be no restrictions file', () => {
      const fakeThis = {
        fileRestrictions: null
      };

      const restrictionsOk = component['checkRestrictions'].call(fakeThis, file);

      expect(restrictionsOk).toBeTruthy();
    });

    it('checkRestrictions: should sum `sizeNotAllowed` if `file.size` is less than `minFileSize`', () => {
      const mockFile = {
        size: 2
      };

      component['sizeNotAllowed'] = 2;
      component['fileRestrictions'] = { minFileSize: 3 };

      component['checkRestrictions'](<any>mockFile);

      expect(component['sizeNotAllowed']).toBe(3);
    });

    it('checkRestrictions: should sum `sizeNotAllowed` if `file.size` is greater than `maxFileSize`', () => {
      const mockFile = {
        size: 3
      };

      component['sizeNotAllowed'] = 2;
      component['fileRestrictions'] = { maxFileSize: 2 };

      component['checkRestrictions'](<any>mockFile);

      expect(component['sizeNotAllowed']).toBe(3);
    });

    it('checkRestrictions: shouldn`t sum `sizeNotAllowed` if `isAcceptSize` is `true`', () => {
      const mockFile = {
        size: 2
      };

      component['sizeNotAllowed'] = 2;
      component['fileRestrictions'] = { maxFileSize: 2 };

      component['checkRestrictions'](<any>mockFile);

      expect(component['sizeNotAllowed']).toBe(2);
    });

    it('existsFileSameName: ', () => {
      expect(component['existsFileSameName'](file, [file])).toBeTruthy();
    });

    it('existsFileSameName: ', () => {
      const newFile = Object.assign({}, file, { name: 'po.png' });

      expect(component['existsFileSameName'](newFile, [file])).toBeFalsy();
    });

    it('insertFileInFiles: should call `files.splice` with newFile at position 0 when `isMultiple` is false', () => {
      const files = [];
      component.isMultiple = false;

      spyOn(files, 'splice');
      spyOn(component, <any>'existsFileSameName');

      component['insertFileInFiles'](file, files);

      expect(files.splice).toHaveBeenCalledWith(0, files.length, file);
      expect(component['existsFileSameName']).toHaveBeenCalled();
    });

    it('insertFileInFiles: should call `files.push` with newFile when `isMultiple` is true and `existsFileSameName` is false', () => {
      const files = [];
      component.isMultiple = true;

      spyOn(files, 'push');
      spyOn(component, <any>'existsFileSameName').and.returnValue(false);
      spyOn(component, <any>'updateExistsFileInFiles');

      component['insertFileInFiles'](file, files);

      expect(files.push).toHaveBeenCalledWith(file);
      expect(component['existsFileSameName']).toHaveBeenCalled();
      expect(component['updateExistsFileInFiles']).not.toHaveBeenCalled();
    });

    it('insertFileInFiles: should call `files.push` with newFile if `directory` is true and `existsFileSameName` is false', () => {
      const files = [];
      component.directory = true;
      component.isMultiple = true;

      spyOn(files, 'push');
      spyOn(component, <any>'existsFileSameName').and.returnValue(false);
      spyOn(component, <any>'updateExistsFileInFiles');

      component['insertFileInFiles'](file, files);

      expect(files.push).toHaveBeenCalledWith(file);
      expect(component['existsFileSameName']).toHaveBeenCalled();
      expect(component['updateExistsFileInFiles']).not.toHaveBeenCalled();
    });

    it('insertFileInFiles: should call `updateExistsFileInFiles` when `existsFileSameName` is true', () => {
      const files = [];

      spyOn(component, <any>'updateExistsFileInFiles');
      spyOn(component, <any>'existsFileSameName').and.returnValue(true);
      spyOn(files, 'push');
      spyOn(files, 'splice');

      component['insertFileInFiles'](file, files);

      expect(component['updateExistsFileInFiles']).toHaveBeenCalledWith(file, files);
      expect(component['existsFileSameName']).toHaveBeenCalled();
      expect(files.push).not.toHaveBeenCalledWith(file);
      expect(files.splice).not.toHaveBeenCalled();
    });

    describe('initRestrictions:', () => {
      it('should return falsy if restrictions is undefined', () => {
        const restrictions = undefined;

        expect(component['initRestrictions'](restrictions)).toBeFalsy();
      });

      it('should return default `minFileSize`', () => {
        const restrictions = { maxFileSize: 1 };
        const expectedResult = { maxFileSize: 1, minFileSize: 0 };

        expect(component['initRestrictions'](restrictions)).toEqual(expectedResult);
      });

      it('should return default `maxFileSize`', () => {
        const restrictions = { minFileSize: 2 };
        const expectedResult = { minFileSize: 2, maxFileSize: 31457280 };

        expect(component['initRestrictions'](restrictions)).toEqual(expectedResult);
      });

      it('should concat default values with file restrictions', () => {
        const restrictions = { allowedExtensions: ['pdf'], maxFiles: 2 };
        const expectedResult = { ...restrictions, minFileSize: 0, maxFileSize: 31457280 };

        expect(component['initRestrictions'](restrictions)).toEqual(expectedResult);
      });
    });

    it('isAllowedExtension: should allowed extensions', () => {
      const isAllowed = component['isAllowedExtension']('.pdf', ['.txt', '.PDF']);
      expect(isAllowed).toBeTruthy();
    });

    it('isAllowedExtension: should return false when allowedExtensions is undefined', () => {
      const isAllowed = component['isAllowedExtension']('.pdf');
      expect(isAllowed).toBeFalsy();
    });

    it('updateExistsFileInFiles: should call `files.splice` when exists file with same name and status uploaded in files', () => {
      const files = [file];

      spyOn(files, 'splice');

      component['updateExistsFileInFiles'](file, files);

      expect(files.splice).toHaveBeenCalledWith(0, 1, file);
    });

    it('updateExistsFileInFiles: shouldn`t call `files.splice` when not exists file with same name and status uploaded in files', () => {
      const newFile = Object.assign({}, file, { name: 'po.png' });
      const files = [file];

      spyOn(files, 'splice');

      component['updateExistsFileInFiles'](newFile, files);

      expect(files.splice).not.toHaveBeenCalled();
    });
  });

  describe('Properties:', () => {
    it('p-drag-drop: should set `dragDrop` with valid values', () => {
      const validValues = ['', true, 1, [], {}, 'true'];

      expectPropertiesValues(component, 'dragDrop', validValues, true);
    });

    it('p-drag-drop: should set `dragDrop` to false with invalid values', () => {
      const invalidValues = [null, undefined, NaN, false, 0, 'false', 'teste'];

      expectPropertiesValues(component, 'dragDrop', invalidValues, false);
    });

    it('formField: should set `formField` with valid values', () => {
      const validValues = ['upload', 'files', 'portfolio'];

      expectPropertiesValues(component, 'formField', validValues, validValues);
    });

    it('formField: should set `formField` with `files` when try set with invalid values', () => {
      const invalidValues = [1, null, undefined, {}, [], NaN, ''];

      expectPropertiesValues(component, 'formField', invalidValues, 'files');
    });

    it('disabled: should set `disabled` with valid values', () => {
      const validValues = ['', true, 1, [], {}, 'true'];

      expectPropertiesValues(component, 'disabled', validValues, true);
    });

    it('disabled: should set `disabled` to false with invalid values', () => {
      const invalidValues = [null, undefined, NaN, false, 0, 'false', 'teste'];

      expectPropertiesValues(component, 'disabled', invalidValues, false);
    });

    it('fileRestrictions: should set `fileRestrictions` calling `initRestrictions` and call `setAllowedExtensions`', () => {
      const restrictions = { minFileSize: 2 };
      const expectedResult = { minFileSize: 2, maxFileSize: 31457280 };

      spyOn(component, <any>'initRestrictions').and.callThrough();
      spyOn(component, <any>'setAllowedExtensions');

      component.fileRestrictions = restrictions;

      expect(component.fileRestrictions).toEqual(expectedResult);
      expect(component['initRestrictions']).toHaveBeenCalled();
      expect(component['setAllowedExtensions']).toHaveBeenCalled();
    });

    it('hideRestrictionsInfo: should set `hideRestrictionsInfo` with valid values', () => {
      const validValues = ['', true, 1, [], {}, 'true'];

      expectPropertiesValues(component, 'hideRestrictionsInfo', validValues, true);
    });

    it('hideRestrictionsInfo: should set `hideRestrictionsInfo` to false with invalid values', () => {
      const invalidValues = [null, undefined, NaN, false, 0, 'false', 'teste'];

      expectPropertiesValues(component, 'hideRestrictionsInfo', invalidValues, false);
    });

    it('p-literals: should be in portuguese if browser is setted with an unsupported language', () => {
      component['language'] = 'zw';

      component.literals = {};

      expect(component.literals).toEqual(poUploadLiteralsDefault[poLocaleDefault]);
    });

    it('p-literals: should be in portuguese if browser is setted with `pt`', () => {
      component['language'] = 'pt';

      component.literals = {};

      expect(component.literals).toEqual(poUploadLiteralsDefault.pt);
    });

    it('p-literals: should be in english if browser is setted with `en`', () => {
      component['language'] = 'en';

      component.literals = {};

      expect(component.literals).toEqual(poUploadLiteralsDefault.en);
    });

    it('p-literals: should be in spanish if browser is setted with `es`', () => {
      component['language'] = 'es';

      component.literals = {};

      expect(component.literals).toEqual(poUploadLiteralsDefault.es);
    });

    it('p-literals: should be in russian if browser is setted with `ru`', () => {
      component['language'] = 'ru';

      component.literals = {};

      expect(component.literals).toEqual(poUploadLiteralsDefault.ru);
    });

    it('p-literals: should accept custom literals', () => {
      component['language'] = poLocaleDefault;

      const customLiterals = Object.assign({}, poUploadLiteralsDefault[poLocaleDefault]);

      // Custom some literals
      customLiterals.invalidDropArea = 'Área inválida';

      component.literals = customLiterals;

      expect(component.literals).toEqual(customLiterals);
    });

    it('p-literals: should update property with default literals if is setted with invalid values', () => {
      const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

      component['language'] = poLocaleDefault;

      expectPropertiesValues(component, 'literals', invalidValues, poUploadLiteralsDefault[poLocaleDefault]);
    });

    it('required: should set `required` with valid values', () => {
      const validValues = ['', true, 1, [], {}, 'true'];

      spyOn(component, <any>'validateModel');

      expectPropertiesValues(component, 'required', validValues, true);
      expect(component['validateModel']).toHaveBeenCalled();
    });

    it('required: should set `required` to false with invalid values', () => {
      const invalidValues = [null, undefined, NaN, false, 0, 'false', 'teste'];

      spyOn(component, <any>'validateModel');

      expectPropertiesValues(component, 'required', invalidValues, false);
      expect(component['validateModel']).toHaveBeenCalled();
    });

    it('hideSelectButton: should set `hideSelectButton` with valid values', () => {
      const validValues = ['', true, 1, [], {}, 'true'];

      expectPropertiesValues(component, 'hideSelectButton', validValues, true);
    });

    it('hideSelectButton: should set `hideSelectButton` to false with invalid values', () => {
      const invalidValues = [null, undefined, NaN, false, 0, 'false', 'teste'];

      expectPropertiesValues(component, 'hideSelectButton', invalidValues, false);
    });

    it('hideSendButton: should set `hideSendButton` with valid values', () => {
      const validValues = ['', true, 1, [], {}, 'true'];

      expectPropertiesValues(component, 'hideSendButton', validValues, true);
    });

    it('hideSendButton: should set `hideSendButton` to false with invalid values', () => {
      const invalidValues = [null, undefined, NaN, false, 0, 'false', 'teste'];

      expectPropertiesValues(component, 'hideSendButton', invalidValues, false);
    });

    it('directory: should set `directory` with valid values', () => {
      const validValues = ['', true, 1, [], {}, 'true'];

      expectPropertiesValues(component, 'directory', validValues, true);
    });

    it('directory: should set `directory` to false with invalid values', () => {
      const invalidValues = [null, undefined, NaN, false, 0, 'false', 'teste'];

      expectPropertiesValues(component, 'directory', invalidValues, false);
    });

    it('directory: should apply true to `canHandleDirectory` if directory is true and `isIE` plus `isMobile` return false', () => {
      component.canHandleDirectory = undefined;

      spyOn(utilsFunctions, <any>'isIE').and.returnValue(false);
      spyOn(utilsFunctions, <any>'isMobile').and.returnValue(false);

      component.directory = true;

      expect(component.canHandleDirectory).toBeTruthy();
    });

    it('directory: should apply false to `canHandleDirectory` if directory is true but `isIE` returns true', () => {
      spyOn(utilsFunctions, <any>'isIE').and.returnValue(true);
      spyOn(utilsFunctions, <any>'isMobile').and.returnValue(false);

      component.directory = true;

      expect(component.canHandleDirectory).toBeFalsy();
    });

    it('directory: should apply false to `canHandleDirectory` if directory is true but `isMobile` returns true', () => {
      spyOn(utilsFunctions, <any>'isIE').and.returnValue(false);
      spyOn(utilsFunctions, <any>'isMobile').and.returnValue(true);

      component.directory = true;

      expect(component.canHandleDirectory).toBeFalsy();
    });

    it('directory: should apply false to `canHandleDirectory` if directory is false', () => {
      spyOn(utilsFunctions, <any>'isIE').and.returnValue(false);
      spyOn(utilsFunctions, <any>'isMobile').and.returnValue(false);

      component.directory = false;

      expect(component.canHandleDirectory).toBeFalsy();
    });

    it(`directory: call 'setDirectoryAttribute' passing true as parameter`, () => {
      spyOn(utilsFunctions, <any>'isIE').and.returnValue(false);
      spyOn(utilsFunctions, <any>'isMobile').and.returnValue(false);
      spyOn(component, 'setDirectoryAttribute');

      component.directory = true;

      expect(component['canHandleDirectory']).toBe(true);
      expect(component.setDirectoryAttribute).toHaveBeenCalledWith(true);
    });

    it(`directory: should call 'setDirectoryAttribute' passing false as parameter`, () => {
      spyOn(utilsFunctions, <any>'isIE').and.returnValue(false);
      spyOn(utilsFunctions, <any>'isMobile').and.returnValue(true);
      spyOn(component, 'setDirectoryAttribute');

      component.directory = false;

      expect(component['canHandleDirectory']).toBe(false);
      expect(component.setDirectoryAttribute).toHaveBeenCalledWith(false);
    });

    it('isMultiple: should set `isMultiple` with `true` if valid values', () => {
      const validValues = ['', true, 1, [], {}, 'true'];

      expectPropertiesValues(component, 'isMultiple', validValues, true);
    });

    it('isMultiple: should set `isMultiple` with `false` if invalid values', () => {
      const invalidValues = [null, undefined, NaN, false, 0, 'false', 'teste'];

      expectPropertiesValues(component, 'isMultiple', invalidValues, false);
    });

    it('isMultiple: should return true if `diretory` is true', () => {
      component.directory = true;

      expect(component.isMultiple).toBe(true);
    });
  });
});
