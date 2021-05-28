import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';

import * as utilsFunctions from '../../../utils/util';
import { configureTestSuite } from './../../../util-test/util-expect.spec';
import { PoButtonModule } from '../../po-button/po-button.module';
import { PoContainerModule } from '../../po-container/po-container.module';
import { PoProgressModule } from '../../po-progress/po-progress.module';
import { PoLanguageService } from '../../../services/po-language/po-language.service';

import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoNotificationService, PoServicesModule } from '../../../services';
import { PoUploadComponent } from './po-upload.component';
import { PoUploadDragDropAreaComponent } from './po-upload-drag-drop/po-upload-drag-drop-area/po-upload-drag-drop-area.component';
import { PoUploadDragDropAreaOverlayComponent } from './po-upload-drag-drop/po-upload-drag-drop-area-overlay/po-upload-drag-drop-area-overlay.component';
import { PoUploadDragDropComponent } from './po-upload-drag-drop/po-upload-drag-drop.component';
import { PoUploadDragDropDirective } from './po-upload-drag-drop/po-upload-drag-drop.directive';
import { PoUploadFile } from './po-upload-file';
import { PoUploadFileRestrictionsComponent } from './po-upload-file-restrictions/po-upload-file-restrictions.component';
import { PoUploadService } from './po-upload.service';
import { PoUploadStatus } from './po-upload-status.enum';

describe('PoUploadComponent:', () => {
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
  let file: PoUploadFile;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoButtonModule, PoContainerModule, PoProgressModule, PoServicesModule],
      declarations: [
        PoUploadComponent,
        PoFieldContainerComponent,
        PoFieldContainerBottomComponent,
        PoUploadDragDropAreaOverlayComponent,
        PoUploadDragDropAreaComponent,
        PoUploadDragDropComponent,
        PoUploadDragDropDirective,
        PoUploadFileRestrictionsComponent
      ],
      providers: [HttpClient, HttpHandler, PoNotificationService, PoUploadService, PoLanguageService]
    });
  });

  beforeEach(() => {
    file = new PoUploadFile(fileMock);

    fixture = TestBed.createComponent(PoUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should update current files with the value param', () => {
    component.writeValue([file]);
    expect(component.currentFiles.length).toBe(1);

    component.currentFiles = [];
    component.writeValue(null);
    expect(component.currentFiles).toBe(undefined);
  });

  describe('Properties:', () => {
    it('displayDragDrop: should return true if `dragDrop` is `true` and `isMobile` is `false`', () => {
      spyOn(utilsFunctions, <any>'isMobile').and.returnValue(false);
      component.dragDrop = true;

      expect(component.displayDragDrop).toBe(true);
    });

    it('displayDragDrop: should return false if `dragDrop` is `true` and `isMobile` is `true`', () => {
      spyOn(utilsFunctions, <any>'isMobile').and.returnValue(true);
      component.dragDrop = true;

      expect(component.displayDragDrop).toBe(false);
    });

    it('displayDragDrop: should return false if `dragDrop` is `false` and `isMobile` is `true`', () => {
      spyOn(utilsFunctions, <any>'isMobile').and.returnValue(true);
      component.dragDrop = false;

      expect(component.displayDragDrop).toBe(false);
    });

    it('displayDragDrop: should return false if `dragDrop` is `false` and `isMobile` is `false`', () => {
      spyOn(utilsFunctions, <any>'isMobile').and.returnValue(false);
      component.dragDrop = false;

      expect(component.displayDragDrop).toBe(false);
    });

    it('hasFileNotUploaded: should return false when `currentFiles` is undefined', () => {
      component.currentFiles = undefined;

      expect(component.hasFileNotUploaded).toBeFalsy();
    });

    it('hasFileNotUploaded: should return true when files is not uploaded', () => {
      component.currentFiles = [file];

      expect(component.hasFileNotUploaded).toBeTruthy();
    });

    it('hasFileNotUploaded: should return false when `currentFiles` is uploaded ', () => {
      const newFile = Object.assign({}, file, { status: PoUploadStatus.Uploaded });
      component.currentFiles = [newFile];

      expect(component.hasFileNotUploaded).toBeFalsy();
    });

    it(`isDisabled: should return false if 'hasAnyFileUploading', 'disabled', 'isExceededFileLimit' are false and 'url'
      is defined`, () => {
      spyOn(component, <any>'hasAnyFileUploading').and.returnValue(false);
      spyOn(component, <any>'isExceededFileLimit').and.returnValue(false);

      component.disabled = false;
      component['url'] = 'url.com';

      expect(component.isDisabled).toBeFalsy();
    });

    it(`isDisabled: should return true if 'hasAnyFileUploading' is true`, () => {
      spyOn(component, <any>'hasAnyFileUploading').and.returnValue(true);
      spyOn(component, <any>'isExceededFileLimit').and.returnValue(false);

      component.disabled = false;
      component['url'] = 'url.com';

      expect(component.isDisabled).toBeTruthy();
    });

    it(`isDisabled: should return true if 'isExceededFileLimit' is true`, () => {
      spyOn(component, <any>'hasAnyFileUploading').and.returnValue(false);
      spyOn(component, <any>'isExceededFileLimit').and.returnValue(true);

      component.disabled = false;
      component['url'] = 'url.com';

      expect(component.isDisabled).toBeTruthy();
    });

    it(`isDisabled: should return true if 'disabled' is true`, () => {
      spyOn(component, <any>'hasAnyFileUploading').and.returnValue(false);
      spyOn(component, <any>'isExceededFileLimit').and.returnValue(false);

      component.disabled = true;
      component['url'] = 'url.com';

      expect(component.isDisabled).toBeTruthy();
    });

    it(`isDisabled: should return true if 'url' is undefined`, () => {
      spyOn(component, <any>'hasAnyFileUploading').and.returnValue(false);
      spyOn(component, <any>'isExceededFileLimit').and.returnValue(false);

      component.disabled = true;
      component['url'] = undefined;

      expect(component.isDisabled).toBeTruthy();
    });

    it('maxFiles: should return false if `isMultiple` is false', () => {
      component.isMultiple = false;

      expect(component.maxFiles).toBeFalsy();
    });

    it('maxFiles: should return false if `fileRestrictions` is undefined', () => {
      component.fileRestrictions = undefined;

      expect(component.maxFiles).toBeFalsy();
    });

    it('maxFiles: should return false if `fileRestrictions.maxFiles` is undefined', () => {
      component.fileRestrictions = { maxFiles: undefined };

      expect(component.maxFiles).toBeFalsy();
    });

    it('maxFiles: should return 2 if `fileRestrictions.maxFiles` is 2 and `isMultiple` is true', () => {
      component.fileRestrictions = { maxFiles: 2 };
      component.isMultiple = true;

      expect(component.maxFiles).toBe(2);
    });

    it(`displaySendButton: should return true if 'showSendButton' is false, 'autoUpload' false and contain
    selected files which have not already been uploaded`, () => {
      component.hideSendButton = false;
      component.autoUpload = false;
      component.currentFiles = [file];

      spyOn(component, <any>'hasFileNotUploaded').and.returnValue(true);

      expect(component.displaySendButton).toBeTruthy();
    });

    it(`displaySendButton: should return false if 'hideSendButton' is true`, () => {
      component.hideSendButton = true;
      component.autoUpload = false;
      component.currentFiles = [file];

      spyOn(component, <any>'hasFileNotUploaded').and.returnValue(true);

      expect(component.displaySendButton).toBeFalsy();
    });

    it(`displaySendButton: should return false if 'autoUpload' is true`, () => {
      component.hideSendButton = false;
      component.autoUpload = true;
      component.currentFiles = [file];

      spyOn(component, <any>'hasFileNotUploaded').and.returnValue(true);

      expect(component.displaySendButton).toBeFalsy();
    });

    it(`displaySendButton: should return false if 'currentFiles.length' is 0`, () => {
      component.hideSendButton = false;
      component.autoUpload = true;
      component.currentFiles = [];

      spyOn(component, <any>'hasFileNotUploaded').and.returnValue(true);

      expect(component.displaySendButton).toBeFalsy();
    });

    it(`displaySendButton: should return false if 'hasFileNotUploaded' is false`, () => {
      component.hideSendButton = false;
      component.autoUpload = true;
      component.currentFiles = [file];

      spyOn(component, <any>'hasFileNotUploaded').and.returnValue(false);

      expect(component.displaySendButton).toBeFalsy();
    });

    it('infoByUploadStatus: should return info by uploaded status', () => {
      const fileStatus = PoUploadStatus.Uploaded;
      const expectedValue = {
        text: () => component.literals.sentWithSuccess,
        icon: 'po-icon-ok'
      };

      const infoByUploadStatus = component.infoByUploadStatus[fileStatus];

      expect(infoByUploadStatus.text()).toBe(expectedValue.text());
      expect(infoByUploadStatus.icon).toBe(expectedValue.icon);
    });

    it('infoByUploadStatus: should return info by error status', () => {
      const fileStatus = PoUploadStatus.Error;
      const expectedValue = {
        text: () => component.literals.errorOccurred
      };

      const infoByUploadStatus = component.infoByUploadStatus[fileStatus];

      expect(infoByUploadStatus.text()).toBe(expectedValue.text());
    });

    it('infoByUploadStatus: should return info by uploading status', () => {
      const fileStatus = PoUploadStatus.Uploading;
      const percent = 10;
      const expectedValue = percent + '%';

      const infoByUploadStatus = component.infoByUploadStatus[fileStatus];

      expect(infoByUploadStatus.text(percent)).toBe(expectedValue);
      expect(infoByUploadStatus.icon).toBeUndefined();
    });

    it('selectFileButtonLabel: should return `literals.selectFolder` if canHandleDirectory is true', () => {
      component.canHandleDirectory = true;

      expect(component.selectFileButtonLabel).toBe(component.literals.selectFolder);
    });

    it('selectFileButtonLabel: should return `literals.selectFiles` if canHandleDirectory is false and isMultiple is true', () => {
      component.canHandleDirectory = false;
      component.isMultiple = true;

      expect(component.selectFileButtonLabel).toBe(component.literals.selectFiles);
    });

    it('selectFileButtonLabel: should return `literals.selectFile` if canHandleDirectory and isMultiple are false', () => {
      component.canHandleDirectory = false;
      component.isMultiple = false;

      expect(component.selectFileButtonLabel).toBe(component.literals.selectFile);
    });

    it('hasMoreThanFourItems: should return true if currentFiles.length is greater than 4', () => {
      component.currentFiles = [fileMock, fileMock, fileMock, fileMock, fileMock];

      expect(component.hasMoreThanFourItems).toBe(true);
    });

    it('hasMoreThanFourItems: should return false if currentFiles.length is lower than 4', () => {
      component.currentFiles = [fileMock];

      expect(component.hasMoreThanFourItems).toBe(false);
    });

    it('hasMultipleFiles: should return true if currentFiles.length is greater than 1', () => {
      component.currentFiles = [fileMock, fileMock];

      expect(component.hasMultipleFiles).toBe(true);
    });

    it('hasMultipleFiles: should return false if currentFiles.length lower than 1', () => {
      component.currentFiles = [fileMock];

      expect(component.hasMultipleFiles).toBe(false);
    });
  });

  describe('Methods:', () => {
    describe('ngAfterViewInit:', () => {
      let inputFocus: jasmine.Spy;

      beforeEach(() => {
        inputFocus = spyOn(component, 'focus');
      });

      it('should call `focus` if autoFocus is true.', () => {
        component.autoFocus = true;
        component.ngAfterViewInit();
        expect(inputFocus).toHaveBeenCalled();
      });

      it('should not call `focus` if autoFocus is false.', () => {
        component.autoFocus = false;
        component.ngAfterViewInit();
        expect(inputFocus).not.toHaveBeenCalled();
      });
    });

    it('clear: should be clear all current files.', () => {
      component.currentFiles = fileMock;
      spyOn(component, <any>'updateModel');
      spyOn(component, <any>'cleanInputValue');

      component.clear();

      expect(component.currentFiles).toBe(undefined);
      expect(component['updateModel']).toHaveBeenCalled();
      expect(component['cleanInputValue']).toHaveBeenCalled();
    });

    describe('focus:', () => {
      it('should call `uploadButton.focus` if `uploadButton` is defined', () => {
        component.hideSelectButton = false;
        spyOnProperty(component, 'displayDragDrop').and.returnValue(false);

        fixture.detectChanges();

        spyOn(component['uploadButton'], 'focus');

        component.focus();

        expect(component['uploadButton'].focus).toHaveBeenCalled();
      });

      it('should`t call `uploadButton.focus` if `disabled`', () => {
        component.hideSelectButton = false;
        component.disabled = true;
        spyOnProperty(component, 'displayDragDrop').and.returnValue(false);

        fixture.detectChanges();

        spyOn(component['uploadButton'], 'focus');

        component.focus();

        expect(component['uploadButton'].focus).not.toHaveBeenCalled();
      });

      it('should call `poUploadDragDropComponent.focus` if `displayDragDrop` is defined', () => {
        spyOnProperty(component, 'displayDragDrop').and.returnValue(true);

        fixture.detectChanges();

        spyOn(component['poUploadDragDropComponent'], 'focus');

        component.focus();

        expect(component['poUploadDragDropComponent'].focus).toHaveBeenCalled();
      });

      it('should`t call `poUploadDragDropComponent.focus` if `disabled`', () => {
        component.disabled = true;
        spyOnProperty(component, 'displayDragDrop').and.returnValue(true);

        fixture.detectChanges();
        const spy = spyOn(component['poUploadDragDropComponent'], 'focus');

        component.focus();

        expect(spy).not.toHaveBeenCalled();
      });

      it('should`t call `poUploadDragDropComponent.focus` if `displayDragDrop` is false ', () => {
        component.disabled = false;
        component['uploadButton'] = undefined;
        component['poUploadDragDropComponent'] = <any>{
          focus: () => {}
        };
        spyOnProperty(component, 'displayDragDrop').and.returnValue(false);

        fixture.detectChanges();
        const spy = spyOn(component['poUploadDragDropComponent'], 'focus');

        component.focus();

        expect(spy).not.toHaveBeenCalled();
      });
    });

    it('onFileChangeDragDrop: should call `updateFiles` with files.', () => {
      const files = 'teste';

      spyOn(component, <any>'updateFiles');

      component.onFileChangeDragDrop(files);

      expect(component['updateFiles']).toHaveBeenCalledWith(files);
    });

    it('removeFile: should be remove file from currentFiles', () => {
      const fakeThis = {
        currentFiles: [file],
        updateModel: files => {}
      };

      spyOn(fakeThis, 'updateModel');

      component.removeFile.call(fakeThis, file);

      expect(fakeThis.currentFiles.length).toBeFalsy();
      expect(fakeThis.updateModel).toHaveBeenCalledWith([]);
    });

    it('selectFiles: should click on input and set `calledByCleanInputValue` to false', () => {
      const calledByCleanInputValue = 'calledByCleanInputValue';
      component['onModelTouched'] = () => {};
      spyOn(component, <any>'onModelTouched');

      component[calledByCleanInputValue] = true;
      component.selectFiles();

      expect(component['onModelTouched']).toHaveBeenCalled();
      expect(component.selectFiles).toBeTruthy();
      expect(component[calledByCleanInputValue]).toBeFalsy();
    });

    it('selectFiles: shouldn´t throw error if onModelTouched is falsy', () => {
      component['onModelTouched'] = null;

      const fnError = () => component.selectFiles();

      expect(fnError).not.toThrow();
    });

    it('sendFiles: should call `uploadFiles` if currentFile is true.', () => {
      component.currentFiles = [fileMock];
      const uploadFiles = spyOn(component, <any>'uploadFiles');

      component.sendFiles();

      expect(uploadFiles).toHaveBeenCalled();
    });

    it('sendFiles: shouldn`t call `uploadFiles` if currentFile is false.', () => {
      component.currentFiles = undefined;
      const uploadFiles = spyOn(component, <any>'uploadFiles');

      component.sendFiles();

      expect(component.currentFiles).toBe(undefined);
      expect(uploadFiles).not.toHaveBeenCalled();
    });

    it('sendFiles: shouldn`t call `uploadFiles` if currentFile is null.', () => {
      component.currentFiles = [];
      const uploadFiles = spyOn(component, <any>'uploadFiles');

      component.sendFiles();

      expect(component.currentFiles).toEqual([]);
      expect(uploadFiles).not.toHaveBeenCalled();
    });

    it('hasAnyFileUploading: should be check has any file uploading', () => {
      file.status = PoUploadStatus.Uploading;

      const hasFileUploading = component.hasAnyFileUploading([file]);
      expect(hasFileUploading).toBeTruthy();
    });

    it('stopUpload: should be call `removeFile` when `autoUpload` is true', () => {
      const fakeThis = {
        autoUpload: true,
        uploadService: {
          stopRequestByFile: function (fileParam, callBack) {
            callBack();
          }
        },
        removeFile: function () {},
        stopUploadHandler: function () {}
      };

      spyOn(fakeThis, 'removeFile');

      component.stopUpload.call(fakeThis, file, 0);

      expect(fakeThis.removeFile).toHaveBeenCalled();
    });

    it('stopUpload: should be call `stopUploadHandler` when `autoUpload` is false', () => {
      const fakeThis = {
        autoUpload: false,
        uploadService: {
          stopRequestByFile: function (fileParam, callBack) {
            callBack();
          }
        },
        removeFile: function () {},
        stopUploadHandler: function () {}
      };

      spyOn(fakeThis, 'stopUploadHandler');

      component.stopUpload.call(fakeThis, file, 0);

      expect(fakeThis.stopUploadHandler).toHaveBeenCalled();
    });

    it('stopUploadHandler: should set `file.status` to equal `PoUploadStatus.None`.', () => {
      const localFile: any = { name: 'filename.jpg' };

      component['stopUploadHandler'](localFile);

      expect(localFile.status).toBe(PoUploadStatus.None);
      expect(localFile.percent).toBe(0);
    });

    it('trackByFn: should return uid', () => {
      const uid = '12';

      const localFile: any = { name: 'filename.jpg', uid };

      expect(component.trackByFn(undefined, localFile)).toBe(uid);
    });

    describe('uploadFiles:', () => {
      it('should execute file change with auto upload', () => {
        const files = [file.rawFile];

        // Mock da função que é criada ao utilizar ngmodel para atualizar o mesmo.
        component.onModelChange = param => {};
        component.uploadFiles = param => {};
        component.autoUpload = true;

        const event = {
          target: {
            files
          }
        };
        spyOn(component, <any>'cleanInputValue');

        component.onFileChange(event);

        expect(component.currentFiles.length).toBeTruthy();
        expect(component['cleanInputValue']).toHaveBeenCalled();
      });

      it('should call uploadingHandler function when upload files', () => {
        const fakeThis = {
          uploadService: {
            upload: function (url, filez, headers, tUpload, uploadCallback, successCallback, errorCallback) {
              return uploadCallback(file, 100);
            }
          },
          uploadingHandler: function () {}
        };
        spyOn(fakeThis, 'uploadingHandler');

        component.uploadFiles.call(fakeThis, [file]);

        expect(fakeThis.uploadingHandler).toHaveBeenCalled();
      });

      it('should call responseHandler function when upload files', () => {
        const fakeThis = {
          uploadService: {
            upload: function (url, filez, headers, tUpload, uploadCallback, successCallback, errorCallback) {
              return successCallback(file, 100);
            }
          },
          responseHandler: function () {},
          onSuccess: new EventEmitter<any>()
        };

        spyOn(fakeThis, 'responseHandler');

        component.uploadFiles.call(fakeThis, [file]);

        expect(fakeThis.responseHandler).toHaveBeenCalled();
      });

      it('should call responseHandler function when upload files', () => {
        const fakeThis = {
          uploadService: {
            upload: function (url, filez, headers, tUpload, uploadCallback, successCallback, errorCallback) {
              return errorCallback(file, 100);
            }
          },
          responseHandler: function () {},
          onError: new EventEmitter<any>()
        };
        spyOn(fakeThis, 'responseHandler');

        component.uploadFiles.call(fakeThis, [file]);

        expect(fakeThis.responseHandler).toHaveBeenCalled();
      });
    });

    it(`onFileChange: should execute file change without auto upload and not call 'event.preventDefault' and
    call 'updateFiles'`, () => {
      const files = [file.rawFile];

      // Mock da função que é criada ao utilizar ngmodel para atualizar o mesmo.
      component.onModelChange = param => {};

      const event = {
        target: {
          files
        },
        preventDefault: () => {}
      };

      spyOn(event, 'preventDefault');
      spyOn(component, <any>'cleanInputValue');
      spyOn(component, <any>'updateFiles').and.callThrough();

      component.onFileChange(event);

      expect(component.currentFiles.length).toBeTruthy();
      expect(component['cleanInputValue']).toHaveBeenCalled();
      expect(component['calledByCleanInputValue']).toBeFalsy();
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(component['updateFiles']).toHaveBeenCalled();
    });

    it('onFileChange: shoud call `event.preventDefault` when `calledByCleanInputValue` is true', () => {
      component['calledByCleanInputValue'] = true;
      const event = {
        target: {
          files: []
        },
        preventDefault: () => {}
      };

      spyOn(event, 'preventDefault');
      spyOn(component, <any>'cleanInputValue');

      component.onFileChange(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component['cleanInputValue']).not.toHaveBeenCalled();
      expect(component['calledByCleanInputValue']).toBeFalsy();
    });

    it('cleanInputValue: should set input value to whitespace and set `calledByCleanInputValue` to true', () => {
      const calledByCleanInputValue = 'calledByCleanInputValue';

      component[calledByCleanInputValue] = false;
      component['cleanInputValue']();

      expect(component['inputFile'].nativeElement.value).toBe('');
      expect(component[calledByCleanInputValue]).toBeTruthy();
    });

    it('updateFiles: should call `parseFiles` with `files` and `updateModel` with `currentFiles`', () => {
      const files = ['fileMock'];

      spyOn(component, <any>'parseFiles').and.returnValue(files);
      spyOn(component, <any>'updateModel');

      component['updateFiles'](files);

      expect(component['parseFiles']).toHaveBeenCalledWith(<any>files);
      expect(component['updateModel']).toHaveBeenCalledWith(<any>files);
    });

    it('updateFiles: should call `uploadFiles` with files if `autoUpload` is `true`', () => {
      const files = ['fileMock'];
      component.autoUpload = true;

      spyOn(component, <any>'parseFiles').and.returnValue(files);
      spyOn(component, <any>'uploadFiles');
      spyOn(component, <any>'updateModel');

      component['updateFiles'](files);

      expect(component['uploadFiles']).toHaveBeenCalledWith(<any>files);
      expect(component['updateModel']).toHaveBeenCalled();
    });

    it('updateFiles: shouldn`t call `uploadFiles` with files if `autoUpload` is `false`', () => {
      const files = ['fileMock'];
      component.autoUpload = false;

      spyOn(component, <any>'parseFiles').and.returnValue(files);
      spyOn(component, <any>'uploadFiles');
      spyOn(component, <any>'updateModel');

      component['updateFiles'](files);

      expect(component['uploadFiles']).not.toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalled();
    });

    it('sendFeedback: should call `setPipeArguments` if `sizeNotAllowed`', () => {
      component['sizeNotAllowed'] = 1;
      component.fileRestrictions = {
        minFileSize: 0,
        maxFiles: 2,
        maxFileSize: 31457,
        allowedExtensions: ['.png', '.zip']
      };
      const expectedValueSizeNotAllowed = 1;
      const expectedValueMinFileSize = '0';
      const expectedValueMaxFileSize = '30.72 KB';
      const literalAttr = 'invalidSize';

      spyOn(component, <any>'setPipeArguments');

      component['sendFeedback']();

      expect(component['setPipeArguments']).toHaveBeenCalledWith(literalAttr, [
        expectedValueSizeNotAllowed,
        expectedValueMinFileSize,
        expectedValueMaxFileSize
      ]);
    });

    it('sendFeedback: should call `setPipeArguments` if `extensionNotAllowed`', () => {
      component['extensionNotAllowed'] = 1;
      component.fileRestrictions = {
        minFileSize: 1,
        maxFiles: 2,
        maxFileSize: 31457,
        allowedExtensions: ['.png', '.zip']
      };
      const expectedValueExtensionNotAllowed = 1;
      const expectedValueAllowedExtensionsFormatted = '.PNG, .ZIP';
      const literalAttr = 'invalidFormat';

      spyOn(component, <any>'setPipeArguments');

      component['sendFeedback']();

      expect(component['setPipeArguments']).toHaveBeenCalledWith(literalAttr, [
        expectedValueExtensionNotAllowed,
        expectedValueAllowedExtensionsFormatted
      ]);
    });

    it('sendFeedback: should call `setPipeArguments` if `quantityNotAllowed`', () => {
      component['quantityNotAllowed'] = 1;
      component.fileRestrictions = {
        minFileSize: 1,
        maxFiles: 2,
        maxFileSize: 31457,
        allowedExtensions: ['.png', '.zip']
      };
      const literalAttr = 'invalidAmount';
      const expectedValueQuantityNotAllowed = 1;

      spyOn(component, <any>'setPipeArguments');

      component['sendFeedback']();
      expect(component['setPipeArguments']).toHaveBeenCalledWith(literalAttr, [expectedValueQuantityNotAllowed]);
    });

    it('setPipeArguments: should call `i18nPipe.transform`', () => {
      const arg = '';
      const literalAttr = '';

      spyOn(component['i18nPipe'], 'transform').and.callThrough();

      component['setPipeArguments'](literalAttr, arg);

      expect(component['i18nPipe'].transform).toHaveBeenCalled();
    });

    it('uploadingHandler: should set file.status and file.percent with respectives params', () => {
      const localFile: any = { name: 'filename.jpg', size: 1234 };
      const percent = 30;

      component['uploadingHandler'](localFile, percent);

      expect(localFile.status).toEqual(PoUploadStatus.Uploading);
      expect(localFile.percent).toBe(percent);
    });

    it('responseHandler: should set file.percent with 100 and assign status param to file.status', () => {
      const testFile: any = { name: 'filename.jpg' };

      component['responseHandler'](testFile, PoUploadStatus.Error);

      expect(testFile.status).toEqual(PoUploadStatus.Error);
      expect(testFile.percent).toBe(100);
    });

    it('updateModel: should call onModelChange with cleanFiles', () => {
      component['onModelChange'] = files => {};

      const cleanFile = {
        name: 'filename.jpg',
        size: 123,
        extension: '.jpg'
      };

      const dirtyFile = {
        ...cleanFile,
        percent: 50,
        displayName: 'filename.jpg - 1kb'
      };

      const currentFiles: any = [dirtyFile];

      const spyOnModelChange = spyOn(component, 'onModelChange');

      component['updateModel'](currentFiles);

      expect(spyOnModelChange).toHaveBeenCalledWith([cleanFile]);
    });

    it('updateModel: should call ngModelChange.emit with cleanFiles if onModelChange is undefined', () => {
      const fn: any = { emit: () => {} };

      component['onModelChange'] = undefined;
      component['ngModelChange'] = fn;

      const cleanFile = {
        name: 'filename.jpg',
        size: 123,
        extension: '.jpg'
      };

      const dirtyFile = {
        ...cleanFile,
        percent: 50,
        displayName: 'filename.jpg - 1kb'
      };

      const currentFiles: any = [dirtyFile];

      const spyNgModelChange = spyOn(component.ngModelChange, 'emit');

      component['updateModel'](currentFiles);

      expect(spyNgModelChange).toHaveBeenCalledWith([cleanFile]);
    });

    it('cancel: should call stopUpload with file if file.status is Uploading', () => {
      const localFile: any = { name: 'filename.jpg', status: PoUploadStatus.Uploading };

      const spyRemoveFile = spyOn(component, 'removeFile');
      const spyStopUpload = spyOn(component, 'stopUpload');

      component.cancel(localFile);

      expect(spyStopUpload).toHaveBeenCalledWith(localFile);
      expect(spyRemoveFile).not.toHaveBeenCalled();
    });

    it('cancel: should call removeFile with file if file.status isn´t Uploading', () => {
      const localFile: any = { name: 'filename.jpg' };

      const spyStopUpload = spyOn(component, 'stopUpload');
      const spyRemoveFile = spyOn(component, 'removeFile');

      component.cancel(localFile);

      expect(spyRemoveFile).toHaveBeenCalledWith(localFile);
      expect(spyStopUpload).not.toHaveBeenCalled();
    });

    it('isAllowCancelEvent: should return true if `status` is different than Uploaded', () => {
      const fileStatus = PoUploadStatus.Error;

      expect(component.isAllowCancelEvent(fileStatus)).toBe(true);
    });

    it('isAllowCancelEvent: should return false if `status` is Uploaded', () => {
      const fileStatus = PoUploadStatus.Uploaded;

      expect(component.isAllowCancelEvent(fileStatus)).toBe(false);
    });

    it(`setDirectoryAttribute: should call 'setAttribute' if canHandleDirectory is true`, () => {
      const canHandleDirectory = true;

      spyOn(component.renderer, <any>'setAttribute');

      component.setDirectoryAttribute(canHandleDirectory);

      expect(component.renderer.setAttribute).toHaveBeenCalledTimes(1);
    });

    it(`setDirectoryAttribute: should call 'removeAttribute' if 'canHandleDirectory' is false`, () => {
      component.canHandleDirectory = false;

      spyOn(component.renderer, <any>'removeAttribute');

      component.setDirectoryAttribute(component.canHandleDirectory);

      expect(component.renderer.removeAttribute).toHaveBeenCalledWith(
        component['inputFile'].nativeElement,
        'webkitdirectory'
      );
      expect(component.renderer.removeAttribute).toHaveBeenCalledTimes(1);
    });
  });

  describe('Templates:', () => {
    it(`should show optional if the field isn't 'required', has 'label' and 'p-optional' is true.`, () => {
      component.required = false;
      component.optional = true;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeTruthy();
    });

    it(`shouldn't show optional if the field is 'required', has 'label' and 'p-optional' is true.`, () => {
      component.required = true;
      component.optional = true;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
    });

    it(`shouldn't show optional if the field isn't 'required', has 'label' but 'p-optional' is false.`, () => {
      component.required = true;
      component.optional = false;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
    });

    it('should show select files button if `p-hide-select-button` is false', () => {
      component.hideSelectButton = false;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-upload-button')).toBeTruthy();
    });

    it('should hide select files button if `p-hide-select-button` is true', () => {
      component.hideSelectButton = true;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-upload-button')).toBeFalsy();
    });

    it('should show send files button if displaySendButton` returns true', () => {
      spyOnProperty(component, 'displaySendButton').and.returnValue(true);

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-button-primary')).toBeTruthy();
    });

    it('shouldn´t show send files button if `displaySendButton` returns false', () => {
      spyOnProperty(component, 'displaySendButton').and.returnValue(false);

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-button-primary')).toBeFalsy();
    });

    it('should show `po-upload-drag-drop` and doesn`t show upload button if `displayDragDrop` return true', () => {
      spyOnProperty(component, 'displayDragDrop').and.returnValue(true);

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('po-upload-drag-drop')).toBeTruthy();
      expect(fixture.debugElement.nativeElement.querySelector('.po-upload-button')).toBeNull();
    });

    it('shouldn`t show `po-upload-drag-drop` and show upload button if `displayDragDrop` return false', () => {
      spyOnProperty(component, 'displayDragDrop').and.returnValue(false);

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('po-upload-drag-drop')).toBeNull();
      expect(fixture.debugElement.nativeElement.querySelector('.po-upload-button')).toBeTruthy();
    });

    it('should find `po-upload-progress-container` if currentFiles is greater than 0', () => {
      component.currentFiles = [file];

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-upload-progress-container')).toBeTruthy();
    });

    it('shouldn`t find `po-upload-progress-container` if currentFiles is 0', () => {
      component.currentFiles = [];

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-upload-progress-container')).toBeNull();
    });

    it('should add `po-upload-progress-container-area` class if `hasMoreThanFourItems` is true', () => {
      component.currentFiles = [file];
      spyOnProperty(component, 'hasMoreThanFourItems').and.returnValue(true);

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-upload-progress-container-area')).toBeTruthy();
    });

    it('shouldn`t add `po-upload-progress-container-area` class if `hasMoreThanFourItems` is false', () => {
      component.currentFiles = [file];
      spyOnProperty(component, 'hasMoreThanFourItems').and.returnValue(false);

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-upload-progress-container-area')).toBeFalsy();
    });

    it('should fix the height of `po-container` to `280px` if `hasMoreThanFourItems` is true', () => {
      component.currentFiles = [file];
      spyOnProperty(component, 'hasMoreThanFourItems').and.returnValue(true);

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-container').style.height).toBe('280px');
    });

    it('should fix the height of `po-container` to `auto` if `hasMoreThanFourItems` is false', () => {
      component.currentFiles = [file];
      spyOnProperty(component, 'hasMoreThanFourItems').and.returnValue(false);

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-container').style.height).toBe('auto');
    });
  });
});
