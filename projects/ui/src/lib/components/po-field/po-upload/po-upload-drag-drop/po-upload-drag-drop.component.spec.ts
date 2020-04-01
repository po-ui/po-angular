import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite, expectPropertiesValues } from '../../../../util-test/util-expect.spec';

import { PoUploadDragDropAreaComponent } from './po-upload-drag-drop-area/po-upload-drag-drop-area.component';
import { PoUploadDragDropAreaOverlayComponent } from './po-upload-drag-drop-area-overlay/po-upload-drag-drop-area-overlay.component';
import { PoUploadDragDropComponent } from './po-upload-drag-drop.component';
import { PoUploadDragDropDirective } from './po-upload-drag-drop.directive';

describe('PoUploadDragDropAreaComponent:', () => {
  let changeDetector: any;
  let component: PoUploadDragDropComponent;
  let fixture: ComponentFixture<PoUploadDragDropComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PoUploadDragDropAreaComponent,
        PoUploadDragDropAreaOverlayComponent,
        PoUploadDragDropComponent,
        PoUploadDragDropDirective
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoUploadDragDropComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
    changeDetector = fixture.componentRef.injector.get(ChangeDetectorRef);
  });

  it('should be created', () => {
    expect(component instanceof PoUploadDragDropComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it(`dragDropHeight: should set with 'PoUploadDragDropHeightMin' with value is less than 'PoUploadDragDropHeightMin'`, () => {
      component.dragDropHeight = 120;

      expect(component.dragDropHeight).toBe(160);
    });

    it('dragDropHeight: should set to PoUploadDragDropHeightDefault if invalid values', () => {
      const invalidValues = [null, undefined, NaN, false, [], {}, 'false', 'teste'];

      expectPropertiesValues(component, 'dragDropHeight', invalidValues, 320);
    });

    it('dragDropHeight: should set with valid values', () => {
      const validValues = [160, 161, 450, 650, 1000];

      expectPropertiesValues(component, 'dragDropHeight', validValues, validValues);
    });
  });

  describe('Methods:', () => {
    it('focus: should call `dragDropAreaComponent.focus`', () => {
      spyOn(component.dragDropAreaComponent, 'focus');

      component.focus();

      expect(component.dragDropAreaComponent.focus).toHaveBeenCalled();
    });

    it('onDragLeave: should set `isDragOver` to `false`', () => {
      component.isDragOver = true;

      component.onDragLeave();

      expect(component.isDragOver).toBe(false);
    });

    it('onDragOver: should set `isDragOver` to `false`', () => {
      component.isDragOver = false;

      component.onDragOver();

      expect(component.isDragOver).toBe(true);
    });

    it('onFileChange: should set `isDragOver` to `false` and call `fileChange.emit` with files', () => {
      const fakeFiles = 'fakeFile';
      component.isDragOver = true;

      spyOn(component.fileChange, 'emit');

      component.onFileChange(fakeFiles);

      expect(component.isDragOver).toBe(false);
      expect(component.fileChange.emit).toHaveBeenCalledWith(fakeFiles);
    });

    it('onAreaElement: should set `areaElement` with element and call `changeDetector.detectChanges`', () => {
      const fakeElement = 'fakeElement';
      const fakeThis = {
        areaElement: undefined,
        changeDetector: {
          detectChanges: () => {}
        }
      };

      spyOn(fakeThis.changeDetector, 'detectChanges');

      component.onAreaElement.call(fakeThis, fakeElement);

      expect(fakeThis.areaElement).toBe(fakeElement);
    });
  });

  describe('Templates:', () => {
    it(`should contain 'po-upload-drag-drop-area' element`, () => {
      expect(nativeElement.querySelector('po-upload-drag-drop-area')).toBeTruthy();
    });

    it(`should contain 'po-upload-drag-drop-area-overlay' element if 'isDragOver' is true`, () => {
      component.isDragOver = true;

      changeDetector.detectChanges();

      expect(nativeElement.querySelector('po-upload-drag-drop-area-overlay')).toBeTruthy();
    });

    it(`shouldn't contain 'po-upload-drag-drop-area-overlay' element if 'isDragOver' is false`, () => {
      component.isDragOver = false;

      changeDetector.detectChanges();

      expect(nativeElement.querySelector('po-upload-drag-drop-area-overlay')).toBeFalsy();
    });
  });
});
