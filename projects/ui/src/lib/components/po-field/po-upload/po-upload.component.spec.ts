import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoButtonModule } from '../../po-button';

import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoUploadComponent } from './po-upload.component';
import { PoUploadFile } from './po-upload-file';

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
      imports: [ PoButtonModule ],
      declarations: [
        PoUploadComponent,
        PoFieldContainerComponent,
        PoFieldContainerBottomComponent
      ],
      providers: [ HttpClient, HttpHandler]
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

  it('status should be equal file status', () => {
    file.status = PoUploadStatus.None;
    const isStatusEquals = component['isStatusFile']('None', file);

    expect(isStatusEquals).toBeTruthy();
  });

  it('should be execute uploading handler', () => {
    const fakeThis = {
      setProgressStatus: function(uid, percent, isShow) {},
      setUploadStatus: function(fileParam, className, percent) {}
    };

    component['uploadingHandler'].call(fakeThis, file, 0);

    expect(file.status).toEqual(PoUploadStatus.Uploading);
  });

  it('should be execute success handler', () => {
    const fakeThis = {
      setProgressStatus: function(uid, percent, isShow) {},
      setUploadStatus: function(fileParam, className, percent) {}
    };

    component['successHandler'].call(fakeThis, file, 0);

    expect(file.status).toEqual(PoUploadStatus.Uploaded);
  });

  it('should be execute error handler', () => {
    const fakeThis = {
      setProgressStatus: function(uid, percent, isShow) {},
      setUploadStatus: function(fileParam, className, percent) {}
    };

    component['errorHandler'].call(fakeThis, file, 0);

    expect(file.status).toEqual(PoUploadStatus.Error);
  });

  it('should be execute updateModel with onModelChange', () => {
    const fakeThis = {
      onModelChange: function(param) {}
    };
    spyOn(fakeThis, 'onModelChange');

    component['updateModel'].call(fakeThis, [file]);
    expect(fakeThis.onModelChange).toHaveBeenCalled();

    component['updateModel'].call(fakeThis, []);
    expect(fakeThis.onModelChange).toHaveBeenCalled();
  });

  it('should be execute updateModel with ngModelChange', () => {
    const fakeThis = {
      ngModelChange: new EventEmitter<any>()
    };

    spyOn(fakeThis.ngModelChange, 'emit');

    component['updateModel'].call(fakeThis, [file]);
    expect(fakeThis.ngModelChange.emit).toHaveBeenCalled();

    component['updateModel'].call(fakeThis, []);
    expect(fakeThis.ngModelChange.emit).toHaveBeenCalled();
  });

  it('should set the upload status', () => {
    file.status = PoUploadStatus.Uploaded;

    fixture.componentInstance.currentFiles = [file];
    fixture.detectChanges();

    component['setUploadStatus'](file, 'po-upload-progress-success', 2);

    const divUploadProgress = fixture.debugElement.query(By.css(`div[id='${file.uid}'].po-upload-progress`));
    expect(divUploadProgress.nativeElement.classList.contains('po-upload-progress-success')).toBeTruthy();

    component['setUploadStatus'](file, 'po-upload-progress-success', 10);

    expect(divUploadProgress.nativeElement.classList.contains('po-upload-progress-success')).toBeTruthy();
  });

  it('onFileChange: should execute file change without auto upload and not call `event.preventDefault`', () => {
    const files = [file.rawFile];

    // Mock da função que é criada ao utilizar ngmodel para atualizar o mesmo.
    component.onModelChange = param => { };

    const event = {
      target: {
        files
      },
      preventDefault: () => {}
    };

    spyOn(event, 'preventDefault');
    spyOn(component, <any> 'cleanInputValue');

    component.onFileChange(event);

    expect(component.currentFiles.length).toBeTruthy();
    expect(component['cleanInputValue']).toHaveBeenCalled();
    expect(component['calledByCleanInputValue']).toBeFalsy();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should update current files with the value param', () => {
    component.writeValue([file]);
    expect(component.currentFiles.length).toBe(1);

    component.currentFiles = [];
    component.writeValue(null);
    expect(component.currentFiles).toBe(undefined);
  });

  describe('Properties:', () => {

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
  });

  describe('Methods:', () => {

    it('clear: should be clear all current files.', () => {
      component.currentFiles = fileMock;
      spyOn(component, <any> 'updateModel');
      spyOn(component, <any> 'cleanInputValue');

      component.clear();

      expect(component.currentFiles).toBe(undefined);
      expect(component['updateModel']).toHaveBeenCalled();
      expect(component['cleanInputValue']).toHaveBeenCalled();
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

      component[calledByCleanInputValue] = true;
      component.selectFiles();

      expect(component.selectFiles).toBeTruthy();
      expect(component[calledByCleanInputValue]).toBeFalsy();
    });

    it('sendFiles: should call `uploadFiles` if currentFile is true.', () => {
      component.currentFiles = [fileMock];
      const uploadFiles = spyOn(component, <any> 'uploadFiles');

      component.sendFiles();

      expect(uploadFiles).toHaveBeenCalled();
    });

    it('sendFiles: shouldn`t call `uploadFiles` if currentFile is false.', () => {
      component.currentFiles = undefined;
      const uploadFiles = spyOn(component, <any> 'uploadFiles');

      component.sendFiles();

      expect(component.currentFiles).toBe(undefined);
      expect(uploadFiles).not.toHaveBeenCalled();
    });

    it('sendFiles: shouldn`t call `uploadFiles` if currentFile is null.', () => {
      component.currentFiles = [];
      const uploadFiles = spyOn(component, <any> 'uploadFiles');

      component.sendFiles();

      expect(component.currentFiles).toEqual([]);
      expect(uploadFiles).not.toHaveBeenCalled();
    });

    it('getFileSize: should be get the text of size in KBytes', () => {
      let kbSize = component['getFileSize'](3000);

      expect(kbSize).toEqual('3 KB');

      kbSize = component['getFileSize'](0);

      expect(kbSize).toEqual('0 KB');
    });

    it('getPoIcon: should get po icon by file status', () => {
      let poIcon = component['getPoIcon'](file);
      expect(poIcon).toEqual('po-icon-info');

      file.status = PoUploadStatus.Error;
      poIcon = component['getPoIcon'](file);
      expect(poIcon).toEqual('po-icon-close');

      file.status = PoUploadStatus.Uploaded;
      poIcon = component['getPoIcon'](file);
      expect(poIcon).toEqual('po-icon-ok');

      file.status = PoUploadStatus.Uploading;
      poIcon = component['getPoIcon'](file);
      expect(poIcon).toEqual('');
    });

    it('hasAnyFileUploading: should be check has any file uploading', () => {
      file.status = PoUploadStatus.Uploading;

      const hasFileUploading = component['hasAnyFileUploading']([file]);
      expect(hasFileUploading).toBeTruthy();
    });

    it('stopUpload: should be call `removeFile` when `autoUpload` is true', () => {
      const fakeThis = {
        autoUpload: true,
        uploadService: {
          stopRequestByFile: function(fileParam, callBack) {
            callBack();
          }
        },
        removeFile: function() {},
        stopUploadHandler: function() {}
      };

      spyOn(fakeThis, 'removeFile');

      component['stopUpload'].call(fakeThis, file, 0);

      expect(fakeThis.removeFile).toHaveBeenCalled();
    });

    it('stopUpload: should be call `stopUploadHandler` when `autoUpload` is false', () => {
      const fakeThis = {
        autoUpload: false,
        uploadService: {
          stopRequestByFile: function(fileParam, callBack) {
            callBack();
          }
        },
        removeFile: function() {},
        stopUploadHandler: function() {}
      };

      spyOn(fakeThis, 'stopUploadHandler');

      component['stopUpload'].call(fakeThis, file, 0);

      expect(fakeThis.stopUploadHandler).toHaveBeenCalled();
    });

    it('stopUploadHandler: should set `file.status` to equal `PoUploadStatus.None`.', () => {
      const fakeThis = {
        removeFileNameClass: function(uid) {},
        setProgressStatus: function(uid, percent, isShow) {},
        setUploadStatus: function(fileParam, className, percent) {}
      };
      component['stopUploadHandler'].call(fakeThis, file, 0);
      expect(file.status).toEqual(PoUploadStatus.None);
    });

    describe('uploadFiles:', () => {

      it('should execute file change with auto upload', () => {
        const files = [file.rawFile];

        // Mock da função que é criada ao utilizar ngmodel para atualizar o mesmo.
        component.onModelChange = param => { };
        component['uploadFiles'] = param => { };
        component.autoUpload = true;

        const event = {
          target: {
            files
          }
        };
        spyOn(component, <any> 'cleanInputValue');

        component.onFileChange(event);

        expect(component.currentFiles.length).toBeTruthy();
        expect(component['cleanInputValue']).toHaveBeenCalled();
      });

      it('should call uploadingHandler function when upload files', () => {

        const fakeThis = {
          uploadService: {
            upload: function(url, filez, tUpload, uploadCallback, successCallback, errorCallback) {
              return uploadCallback(file, 100);
            }
          },
          uploadingHandler: function() { }
        };
        spyOn(fakeThis, 'uploadingHandler');

        component['uploadFiles'].call(fakeThis, [file]);

        expect(fakeThis.uploadingHandler).toHaveBeenCalled();
      });

      it('should call successHandler function when upload files', () => {

        const fakeThis = {
          uploadService: {
            upload: function(url, filez, tUpload, uploadCallback, successCallback, errorCallback) {
              return successCallback(file, 100);
            }
          },
          successHandler: function() { },
          onSuccess: new EventEmitter<any>()
        };
        spyOn(fakeThis, 'successHandler');

        component['uploadFiles'].call(fakeThis, [file]);

        expect(fakeThis.successHandler).toHaveBeenCalled();
      });

      it('should call errorCallback function when upload files', () => {
        const fakeThis = {
          uploadService: {
            upload: function(url, filez, tUpload, uploadCallback, successCallback, errorCallback) {
              return errorCallback(file, 100);
            }
          },
          errorHandler: function() { },
          onError: new EventEmitter<any>()
        };
        spyOn(fakeThis, 'errorHandler');

        component['uploadFiles'].call(fakeThis, [file]);

        expect(fakeThis.errorHandler).toHaveBeenCalled();
      });

    });

    it('addFileNameClass: should be add file name loading class', () => {
      fixture.componentInstance.currentFiles = [file];
      fixture.detectChanges();

      // ADD File Name Loading class
      component['addFileNameClass'](file.uid);

      const divFileName = fixture.debugElement.query(By.css(`div[id='${file.uid}'].po-upload-progress .po-upload-filename`));
      expect(divFileName.nativeElement.classList.contains('po-upload-filename-loading')).toBeTruthy();
    });

    it('removeFileNameClass: should be remove file name loading class', () => {
      fixture.componentInstance.currentFiles = [file];
      fixture.detectChanges();

      // ADD File Name Loading class
      component['addFileNameClass'](file.uid);

      // Remove File Name Loading class
      component['removeFileNameClass'](file.uid);
      const divFileName = fixture.debugElement.query(By.css(`div[id='${file.uid}'].po-upload-progress .po-upload-filename`));

      expect(divFileName.nativeElement.classList.contains('po-upload-filename-loading')).toBeFalsy();
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
      spyOn(component, <any> 'cleanInputValue');

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

    it('setProgressStatus: should set progress status', () => {
      let divUploadProgress;

      file.status = PoUploadStatus.Uploading;

      fixture.componentInstance.currentFiles = [file];
      fixture.detectChanges();

      component['setProgressStatus'](file.uid, 50, true);

      divUploadProgress = fixture.debugElement.query(By.css(`div[id='${file.uid}'].po-upload-progress > .po-upload-progress-status`));
      expect(divUploadProgress.nativeElement.style['width']).toEqual('50%');

      component['setProgressStatus'](file.uid, 50, false);

      divUploadProgress = fixture.debugElement.query(By.css(`div[id='${file.uid}'].po-upload-progress > .po-upload-progress-status`));
      expect(divUploadProgress.nativeElement.style['width']).toEqual('50%');
    });

  });

  describe('Templates:', () => {

    it('should show remove button and retry button when file status `Error`', () => {
      component.literals = {'deleteFile' : 'Excluir', 'tryAgain' : 'Tentar Novamente'};
      file.status = PoUploadStatus.Error; // error status
      component.currentFiles = <any> [file];
      fixture.detectChanges();

      const divUploadActions = fixture.debugElement.nativeElement.querySelectorAll('.po-upload-action');

      expect(divUploadActions[0].innerHTML.trim()).toBe('Excluir');
      expect(divUploadActions[1].innerHTML.trim()).toBe('Tentar Novamente');
    });

    it('should show remove button when file status `None`', () => {
      component.literals = {'deleteFile' : 'Excluir'};
      file.status = PoUploadStatus.None; // error status
      component.currentFiles = <any> [file];
      fixture.detectChanges();

      const divUploadAction = fixture.debugElement.nativeElement.querySelector('.po-upload-action');

      expect(divUploadAction.innerHTML.trim()).toBe('Excluir');
    });

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
  });

});
