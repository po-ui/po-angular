import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { configureTestSuite } from './../../../../util-test/util-expect.spec';

import { PoUploadDragDropDirective } from './po-upload-drag-drop.directive';

@Component({
  template:
    `<div p-upload-drag-drop></div>`
})

export class TestComponent { }

describe('PoUploadDragDropDirective:', () => {

  let directiveElement;
  let directive;

  let fixture: ComponentFixture<TestComponent>;

  let event;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoUploadDragDropDirective, TestComponent ]
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

    it(`onDrop: should call 'preventDefault' and 'stopPropagation'`, () => {
      directive.disabled = true;
      const fakeEvent = {
        preventDefault: () => {},
        stopPropagation: () => {},
        dataTransfer: {
          files: undefined
        }
      };

      spyOn(fakeEvent, 'preventDefault');
      spyOn(fakeEvent, 'stopPropagation');

      directive.onDrop(fakeEvent);

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
    });

    it(`onDrop: should call 'dragLeave.emit', 'getOnlyFiles' and 'sendFiles' with 'event' and 'files' if 'disabled' is false`, () => {
      const fakeFiles = 'fakeFiles';
      const fakeEvent = {
        preventDefault: () => {},
        stopPropagation: () => {},
        dataTransfer: {
          files: undefined
        }
      };

      spyOn(fakeEvent, 'preventDefault');
      spyOn(fakeEvent, 'stopPropagation');
      spyOn(directive.dragLeave, 'emit');
      spyOn(directive, <any>'sendFiles');
      spyOn(directive, <any>'getOnlyFiles').and.returnValue(fakeFiles);

      directive.onDrop(fakeEvent);

      expect(directive.dragLeave.emit).toHaveBeenCalled();
      expect(directive['getOnlyFiles']).toHaveBeenCalled();
      expect(directive['sendFiles']).toHaveBeenCalledWith(fakeEvent, fakeFiles);
    });

    it(`onDrop: shouldn't call 'dragLeave.emit', 'getOnlyFiles' and 'sendFiles' if 'disabled' is true`, () => {
      const fakeEvent = {
        preventDefault: () => {},
        stopPropagation: () => {}
      };

      directive.disabled = true;

      spyOn(directive.dragLeave, 'emit');
      spyOn(directive, <any>'sendFiles');
      spyOn(directive, <any>'getOnlyFiles');

      directive.onDrop(fakeEvent);

      expect(directive.dragLeave.emit).not.toHaveBeenCalled();
      expect(directive['getOnlyFiles']).not.toHaveBeenCalled();
      expect(directive['sendFiles']).not.toHaveBeenCalled();
    });

    it(`getOnlyFiles: should return an array of files that only contain type`, () => {
      const fileList = [
        { name: 'file1', type: '', size: 300 },
        { name: 'file2', type: '.pdf', size: 500 },
        { name: 'file3', type: '.txt', size: 100 },
        { name: 'file4', type: '', size: 700 }
      ];

      const result = [
        { name: 'file2', type: '.pdf', size: 500 },
        { name: 'file3', type: '.txt', size: 100 }
      ];

      expect(directive.getOnlyFiles(fileList)).toEqual(result);
    });

    it(`sendFiles: should call 'fileChange.emit' with 'files' if 'areaElement' contains 'event.target' and 'files.length'
    is greater than 0 and doesn't call 'notification.information'`, () => {
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
        notification: {
          information: () => {}
        }
      };

      const fakeFiles = [
        { name: 'file1', type: '.txt', size: 300 },
        { name: 'file2', type: '.pdf', size: 500 },
      ];

      const fakeEvent = {
        target: '<div></div>'
      };

      spyOn(fakeThis.fileChange, 'emit');
      spyOn(fakeThis.notification, 'information');

      directive['sendFiles'].call(fakeThis, fakeEvent, fakeFiles);

      expect(fakeThis.fileChange.emit).toHaveBeenCalledWith(fakeFiles);
      expect(fakeThis.notification.information).not.toHaveBeenCalled();
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
        notification: {
          information: () => {}
        }
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

    it(`sendFiles: shouldn't call 'fileChange.emit' if 'files.length is less than 1`, () => {
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
        notification: {
          information: () => {}
        }
      };

      const fakeFiles = [];

      const fakeEvent = {
        target: '<div></div>'
      };

      spyOn(fakeThis.fileChange, 'emit');

      directive['sendFiles'].call(fakeThis, fakeEvent, fakeFiles);

      expect(fakeThis.fileChange.emit).not.toHaveBeenCalled();
    });

    it(`sendFiles: shouldn't call 'notification.information' if 'areaElement' doesn't contains 'event.target'`, () => {
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
        notification: {
          information: () => {}
        }
      };

      const fakeFiles = [
        { name: 'file1', type: '.txt', size: 300 },
        { name: 'file2', type: '.pdf', size: 500 }
      ];

      const fakeEvent = {
        target: '<div></div>'
      };

      spyOn(fakeThis.notification, 'information');

      directive['sendFiles'].call(fakeThis, fakeEvent, fakeFiles);

      expect(fakeThis.notification.information).toHaveBeenCalled();
    });

  });

});
