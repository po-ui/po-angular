import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { configureTestSuite } from './../../../../util-test/util-expect.spec';

import { PoUploadDragDropDirective } from './po-upload-drag-drop.directive';

@Component({
  template: ` <div p-upload-drag-drop></div> `
})
export class TestComponent {}

describe('PoUploadDragDropDirective:', () => {
  let directiveElement;
  let directive;

  let fixture: ComponentFixture<TestComponent>;

  let event;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoUploadDragDropDirective, TestComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);

    directiveElement = fixture.debugElement.query(By.directive(PoUploadDragDropDirective));

    directive = directiveElement.injector.get(PoUploadDragDropDirective);
    fixture.detectChanges();

    event = document.createEvent('MouseEvents');
    event.initEvent('scroll', false, true);
  });

  it('should be created TestComponent', () => {
    expect(TestComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('onDragLeave: should call preventDefault and stopPropagation and call dragLeave.emit after 200ms', fakeAsync(() => {
      const fakeEvent = {
        preventDefault: () => {},
        stopPropagation: () => {}
      };

      spyOn(fakeEvent, 'preventDefault');
      spyOn(fakeEvent, 'stopPropagation');
      spyOn(directive.dragLeave, 'emit');

      directive.onDragLeave(fakeEvent);

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(fakeEvent.stopPropagation).toHaveBeenCalled();

      tick(300);

      expect(directive.dragLeave.emit).toHaveBeenCalled();
    }));

    it('onDragOver: should call `preventDefault`, `stopPropagation` and call `dragOver.emit` if `disabled` is false', () => {
      const fakeEvent = {
        preventDefault: () => {},
        stopPropagation: () => {}
      };

      directive.disabled = false;

      spyOn(fakeEvent, 'preventDefault');
      spyOn(fakeEvent, 'stopPropagation');
      spyOn(directive.dragOver, 'emit');

      directive.onDragOver(fakeEvent);

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(fakeEvent.stopPropagation).toHaveBeenCalled();

      expect(directive.dragOver.emit).toHaveBeenCalled();
    });

    it('onDragOver: should call `preventDefault`, `stopPropagation` and doesn`t call `dragOver.emit` if `disabled` is true', () => {
      const fakeEvent = {
        preventDefault: () => {},
        stopPropagation: () => {}
      };

      directive.disabled = true;

      spyOn(fakeEvent, 'preventDefault');
      spyOn(fakeEvent, 'stopPropagation');
      spyOn(directive.dragOver, 'emit');

      directive.onDragOver(fakeEvent);

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(fakeEvent.stopPropagation).toHaveBeenCalled();

      expect(directive.dragOver.emit).not.toHaveBeenCalled();
    });

    it('onDragOver: should call `preventDefault`, `stopPropagation` and `dragLeave.emit`', () => {
      const fakeEvent = {
        preventDefault: () => {},
        stopPropagation: () => {}
      };

      spyOn(fakeEvent, 'preventDefault');
      spyOn(fakeEvent, 'stopPropagation');
      spyOn(directive.dragOver, 'emit');

      directive.onDragOver(fakeEvent);

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(fakeEvent.stopPropagation).toHaveBeenCalled();

      expect(directive.dragOver.emit).toHaveBeenCalled();
    });

    it(`should call 'preventDefault', 'stopPropagation', 'getFilesFromDataTransferItems' and 'dragLeave.emit'`, () => {
      const fakeEvent = {
        preventDefault: () => {},
        stopPropagation: () => {},
        dataTransfer: {
          files: undefined
        }
      };

      spyOn(fakeEvent, 'preventDefault');
      spyOn(fakeEvent, 'stopPropagation');
      spyOn(directive, <any>'getFilesFromDataTransferItems');
      spyOn(directive.dragLeave, 'emit');

      directive.onDrop(fakeEvent);

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      expect(directive.dragLeave.emit).toHaveBeenCalled();
      expect(directive['getFilesFromDataTransferItems']).toHaveBeenCalled();
    });

    it(`getFilesFromDataTransferItems: should call 'getOnlyFiles' and 'sendFiles' if 'directoryCompatible' is false`, () => {
      directive.disabled = false;
      directive['directoryCompatible'] = false;

      const fakeEvent = {
        dataTransfer: {
          files: undefined
        }
      };

      spyOn(directive, <any>'getOnlyFiles');
      spyOn(directive, <any>'sendFiles');
      spyOn(directive, <any>'getOnlyDirectories');

      directive['getFilesFromDataTransferItems'](fakeEvent);

      expect(directive['getOnlyFiles']).toHaveBeenCalled();
      expect(directive['sendFiles']).toHaveBeenCalled();
      expect(directive['getOnlyDirectories']).not.toHaveBeenCalled();
    });

    it(`getFilesFromDataTransferItems: should call 'getOnlyDirectories' and 'sendFiles'
    if 'directoryCompatible' is true`, () => {
      const fakeThis = {
        files: [],
        disabled: false,
        directoryCompatible: true,
        invalidFileType: 0,
        getOnlyDirectories: arg => {
          return { then: callback => callback() };
        },
        sendFiles: (arg1, arg2) => {},
        getOnlyFiles: () => {}
      };

      const fakeEvent = {
        dataTransfer: {
          items: { name: 'name' }
        }
      };

      spyOn(fakeThis, <any>'getOnlyDirectories').and.callThrough();
      spyOn(fakeThis, <any>'sendFiles').and.callFake(() => {});
      spyOn(fakeThis, <any>'getOnlyFiles');

      directive['getFilesFromDataTransferItems'].call(fakeThis, fakeEvent);

      expect(fakeThis['getOnlyFiles']).not.toHaveBeenCalled();
      expect(fakeThis['sendFiles']).toHaveBeenCalledWith(fakeEvent, fakeThis.files);
      expect(fakeThis['getOnlyDirectories']).toHaveBeenCalledWith(fakeEvent.dataTransfer.items);
    });

    it('getFilesFromDataTransferItems: shouldn`t call any method if `disabled` is true', () => {
      directive['disabled'] = true;
      const fakeEvent = {
        dataTransfer: {
          files: undefined
        }
      };

      spyOn(directive, <any>'getOnlyFiles');
      spyOn(directive, <any>'sendFiles');
      spyOn(directive, <any>'sendFeedback');
      spyOn(directive, <any>'getOnlyDirectories');

      directive['getFilesFromDataTransferItems'](fakeEvent);

      expect(directive['getOnlyFiles']).not.toHaveBeenCalled();
      expect(directive['sendFiles']).not.toHaveBeenCalled();
      expect(directive['sendFeedback']).not.toHaveBeenCalled();
      expect(directive['getOnlyDirectories']).not.toHaveBeenCalled();
    });

    describe('getFilesFromEntry:', () => {});

    it('should call `readFile` if `entry.isFile`', () => {
      const entry = {
        isFile: true,
        isDirectory: false,
        file: callback => {
          callback(callback);
        }
      };

      spyOn(directive, <any>'readFile');
      spyOn(directive, <any>'readDirectory');

      directive['getFilesFromEntry'](entry);

      expect(directive['readFile']).toHaveBeenCalledWith(entry);
      expect(directive['readDirectory']).not.toHaveBeenCalled();
    });

    it('should call `readDirectory` if entry.isDirectory', () => {
      const entry = {
        isFile: false,
        isDirectory: true,
        file: callback => {
          callback(callback);
        }
      };

      spyOn(directive, <any>'readDirectory');
      spyOn(directive, <any>'readFile');

      directive['getFilesFromEntry'](entry);

      expect(directive['readDirectory']).toHaveBeenCalledWith(entry);
      expect(directive['readFile']).not.toHaveBeenCalled();
    });

    it('should not call `readDirectory` if entry.isDirectory is false', () => {
      const entry = {
        isFile: false,
        isDirectory: false,
        file: callback => {
          callback(callback);
        }
      };

      spyOn(directive, <any>'readDirectory');
      spyOn(directive, <any>'readFile');

      directive['getFilesFromEntry'](entry);

      expect(directive['readDirectory']).not.toHaveBeenCalled();
      expect(directive['readFile']).not.toHaveBeenCalled();
    });

    it('should call `webkitGetAsEntry`, increment `invalidFileType` and not to call `getFilesFromEntry`', () => {
      const dataTransfer = [
        {
          webkitGetAsEntry: () => {
            return { isFile: true };
          }
        }
      ];
      directive['invalidFileType'] = 0;

      spyOn(dataTransfer[0], 'webkitGetAsEntry').and.returnValue({ isFile: true });
      spyOn(directive, <any>'getFilesFromEntry');

      directive['getOnlyDirectories'](dataTransfer);

      expect(dataTransfer[0].webkitGetAsEntry).toHaveBeenCalled();
      expect(directive['invalidFileType']).toBe(1);
      expect(directive['getFilesFromEntry']).not.toHaveBeenCalled();
    });

    it('getOnlyDirectories: should call `webkitGetAsEntry`, not increment `invalidFileType` and call `getFilesFromEntry`', () => {
      const dataTransfer = [
        {
          webkitGetAsEntry: () => {
            return { isFile: false };
          }
        }
      ];
      directive['invalidFileType'] = 0;

      spyOn(dataTransfer[0], 'webkitGetAsEntry').and.returnValue({ isFile: false });
      spyOn(directive, <any>'getFilesFromEntry');

      directive['getOnlyDirectories'](dataTransfer);

      expect(dataTransfer[0].webkitGetAsEntry).toHaveBeenCalled();
      expect(directive['invalidFileType']).toBe(0);
      expect(directive['getFilesFromEntry']).toHaveBeenCalledWith({ isFile: false });
    });

    it('readFile: should call `file` and return expected value', async () => {
      const file = { name: 'name.jpg', lastModified: 1527109493000 };
      const fakeEntry = { file: callback => callback(file) };

      spyOn(fakeEntry, 'file').and.callThrough();

      const result = await directive['readFile'](fakeEntry);

      expect(fakeEntry.file).toHaveBeenCalled();
      expect(result).toEqual(file);
    });

    it('readDirectory: should call `createRender`, `readDirectoryEntries` and return expected result', async () => {
      const file = [{ name: 'name.jpg', lastModified: 1527109493000 }];
      const fakeEntry = {
        createReader: () => {}
      };

      spyOn(fakeEntry, 'createReader');
      spyOn(directive, <any>'readDirectoryEntries').and.returnValue(Promise.resolve(file));

      const result = await directive['readDirectory'](fakeEntry);

      expect(fakeEntry.createReader).toHaveBeenCalled();
      expect(directive['readDirectoryEntries']).toHaveBeenCalled();
      expect(result).toEqual(file);
    });

    it('readDirectoryEntries: should call `readEntries`, `getFilesFromEntry` and return expected result', async () => {
      const file = [{ name: 'name.jpg', lastModified: 1527109493000 }];
      const directoryReader = {
        readEntries: callback => {
          callback([file]);
        }
      };

      spyOn(directoryReader, <any>'readEntries').and.callThrough();
      spyOn(directive, <any>'getFilesFromEntry').and.returnValue(Promise.resolve(file));

      const result = await directive['readDirectoryEntries'](directoryReader);

      expect(directoryReader.readEntries).toHaveBeenCalled();
      expect(directive['getFilesFromEntry']).toHaveBeenCalled();
      expect(result).toEqual(file);
    });

    it('sendFeedback: should call `setPipeArguments` if `invalidFileType` is higher than 0', () => {
      const invalidFiles = 1;

      spyOn(directive, <any>'setPipeArguments');

      directive['sendFeedback'](invalidFiles);

      expect(directive['setPipeArguments']).toHaveBeenCalledWith('invalidFileType', invalidFiles);
    });

    it('sendFeedback: shouldn`t call `setPipeArguments` if `invalidFileType` is equal to 0', () => {
      const invalidFiles = 0;

      spyOn(directive, <any>'setPipeArguments');

      directive['sendFeedback'](invalidFiles);

      expect(directive['setPipeArguments']).not.toHaveBeenCalled();
    });

    it('setPipeArguments: should call `i18nPipe.transform`', () => {
      directive.literals = {
        invalidFileType: 'fileType {0}'
      };

      spyOn(directive.i18nPipe, 'transform').and.returnValue('fileType 2');
      spyOn(directive.notification, 'information');

      directive['setPipeArguments']('invalidFileType', 2);

      expect(directive.i18nPipe.transform).toHaveBeenCalled();
      expect(directive.notification.information).toHaveBeenCalledWith('fileType 2');
    });

    it(`getOnlyFiles: should return an array of files and increment 'invalidFileType'`, () => {
      directive['invalidFileType'] = 0;

      function webkitGetAsEntry() {
        return {
          name: this.name,
          isFile: this.name !== 'folder'
        };
      }

      const dataTransfer = {
        files: [
          { name: 'file1.zpl', type: '', size: 300 },
          { name: 'file2.pdf', type: '.pdf', size: 500 },
          { name: 'file3.txt', type: '.txt', size: 100 },
          { name: 'folder', type: '', size: 100 }
        ],
        items: [
          { name: 'file1.zpl', webkitGetAsEntry },
          { name: 'file2.pdf', webkitGetAsEntry },
          { name: 'file3.txt', webkitGetAsEntry },
          { name: 'folder', webkitGetAsEntry }
        ]
      };

      const expectedValue = [
        { name: 'file1.zpl', type: '', size: 300 },
        { name: 'file2.pdf', type: '.pdf', size: 500 },
        { name: 'file3.txt', type: '.txt', size: 100 }
      ];

      expect(directive.getOnlyFiles(dataTransfer)).toEqual(expectedValue);
      expect(directive['invalidFileType']).toBe(1);
    });

    it(`sendFiles: should call 'fileChange.emit' with 'files' if 'areaElement' contains 'event.target' and 'files.length'
    is greater than 0, 'sendFeedback' and doesn't call 'setPipeArguments'`, () => {
      const fakeThis = {
        areaElement: {
          contains: () => true,
          event: {
            target: '<div></div>'
          }
        },
        fileChange: {
          emit: arg => {}
        },
        literals: {
          invalidDropArea: 'invalid area'
        },
        setPipeArguments: () => {},
        sendFeedback: arg => {},
        invalidFileType: true
      };

      const fakeFiles = [
        { name: 'file1', type: '.txt', size: 300 },
        { name: 'file2', type: '.pdf', size: 500 }
      ];

      const fakeEvent = {
        target: '<div></div>'
      };

      spyOn(fakeThis.fileChange, 'emit');
      spyOn(fakeThis, 'setPipeArguments');
      spyOn(fakeThis, 'sendFeedback');

      directive['sendFiles'].call(fakeThis, fakeEvent, fakeFiles);

      expect(fakeThis.fileChange.emit).toHaveBeenCalledWith(fakeFiles);
      expect(fakeThis.sendFeedback).toHaveBeenCalledWith(fakeThis.invalidFileType);
      expect(fakeThis.setPipeArguments).not.toHaveBeenCalled();
    });

    it(`sendFiles: shouldn't call 'fileChange.emit' if 'areaElement' doesn't contains 'event.target'`, () => {
      const fakeThis = {
        areaElement: {
          contains: () => false,
          event: {
            target: undefined
          }
        },
        fileChange: {
          emit: () => {}
        },
        literals: {
          invalidDropArea: 'invalid area'
        },
        setPipeArguments: () => {}
      };

      const fakeFiles = [
        { name: 'file1', type: '.txt', size: 300 },
        { name: 'file2', type: '.pdf', size: 500 }
      ];

      const fakeEvent = {
        target: '<div></div>'
      };

      spyOn(fakeThis.fileChange, 'emit');

      directive['sendFiles'].call(fakeThis, fakeEvent, fakeFiles);

      expect(fakeThis.fileChange.emit).not.toHaveBeenCalled();
    });

    it(`sendFiles: shouldn't call 'fileChange.emit' if 'files.length is less than 1 and call 'sendFeedback'`, () => {
      const fakeThis = {
        areaElement: {
          contains: () => true,
          event: {
            target: '<div></div>'
          }
        },
        fileChange: {
          emit: () => {}
        },
        literals: {
          invalidDropArea: 'invalid area'
        },
        setPipeArguments: () => {},
        sendFeedback: () => {}
      };

      const fakeFiles = [];

      const fakeEvent = {
        target: '<div></div>'
      };

      spyOn(fakeThis.fileChange, 'emit');
      spyOn(fakeThis, 'sendFeedback');

      directive['sendFiles'].call(fakeThis, fakeEvent, fakeFiles);

      expect(fakeThis.fileChange.emit).not.toHaveBeenCalled();
      expect(fakeThis.sendFeedback).toHaveBeenCalled();
    });

    it(`sendFiles: should call 'setPipeArguments' if 'areaElement' doesn't contains 'event.target'`, () => {
      const fakeThis = {
        areaElement: {
          contains: () => false,
          event: {
            target: undefined
          }
        },
        fileChange: {
          emit: () => {}
        },
        literals: {
          invalidDropArea: 'invalid area'
        },
        setPipeArguments: () => {}
      };

      const fakeFiles = [
        { name: 'file1', type: '.txt', size: 300 },
        { name: 'file2', type: '.pdf', size: 500 }
      ];

      const fakeEvent = {
        target: '<div></div>'
      };

      spyOn(fakeThis, 'setPipeArguments');

      directive['sendFiles'].call(fakeThis, fakeEvent, fakeFiles);

      expect(fakeThis.setPipeArguments).toHaveBeenCalled();
    });

    it(`sendFiles: should pass 'invalidDropArea' and 'literals.folders' as params to 'setPipeArguments'
    if 'directoryCompatible' is true`, () => {
      const fakeThis = {
        directoryCompatible: true,
        areaElement: {
          contains: () => false,
          event: {
            target: undefined
          }
        },
        fileChange: {
          emit: () => {}
        },
        literals: {
          invalidDropArea: 'invalid area',
          folders: 'folder',
          files: 'files'
        },
        setPipeArguments: (arg1, arg2) => {}
      };

      const fakeFiles = [
        { name: 'file1', type: '.txt', size: 300 },
        { name: 'file2', type: '.pdf', size: 500 }
      ];

      const fakeEvent = {
        target: '<div></div>'
      };

      spyOn(fakeThis, 'setPipeArguments');

      directive['sendFiles'].call(fakeThis, fakeEvent, fakeFiles);

      expect(fakeThis.setPipeArguments).toHaveBeenCalledWith('invalidDropArea', fakeThis.literals.folders);
    });

    it(`sendFiles: should pass 'invalidDropArea' and 'literals.files' as params to 'setPipeArguments'
    if 'directoryCompatible' is false`, () => {
      const fakeThis = {
        directoryCompatible: false,
        areaElement: {
          contains: () => false,
          event: {
            target: undefined
          }
        },
        fileChange: {
          emit: () => {}
        },
        literals: {
          invalidDropArea: 'invalid area',
          folders: 'folder',
          files: 'files'
        },
        setPipeArguments: (arg1, arg2) => {}
      };

      const fakeFiles = [
        { name: 'file1', type: '.txt', size: 300 },
        { name: 'file2', type: '.pdf', size: 500 }
      ];

      const fakeEvent = {
        target: '<div></div>'
      };

      spyOn(fakeThis, 'setPipeArguments');

      directive['sendFiles'].call(fakeThis, fakeEvent, fakeFiles);

      expect(fakeThis.setPipeArguments).toHaveBeenCalledWith('invalidDropArea', fakeThis.literals.files);
    });
  });
});
