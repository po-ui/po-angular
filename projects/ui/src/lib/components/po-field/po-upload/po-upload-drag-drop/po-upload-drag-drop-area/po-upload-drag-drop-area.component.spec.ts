import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from '../../../../../util-test/util-expect.spec';

import { PoUploadDragDropAreaComponent } from './po-upload-drag-drop-area.component';

describe('PoUploadDragDropAreaComponent:', () => {
  let changeDetector: any;
  let component: PoUploadDragDropAreaComponent;
  let fixture: ComponentFixture<PoUploadDragDropAreaComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ PoUploadDragDropAreaComponent ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoUploadDragDropAreaComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
    changeDetector = fixture.componentRef.injector.get(ChangeDetectorRef);
  });

  it('should be created', () => {
    expect(component instanceof PoUploadDragDropAreaComponent).toBeTruthy();
  });

  describe('Templates:', () => {

    it(`should contain 'po-upload-drag-drop-area' and 'po-upload-drag-drop-area-container' classes.`, () => {
      expect(nativeElement.querySelector('.po-upload-drag-drop-area')).toBeTruthy();
      expect(nativeElement.querySelector('.po-upload-drag-drop-area-container')).toBeTruthy();
    });

    it(`should contain 'po-upload-drag-drop-area-disabled' if disabled is true`, () => {
      component.disabled = true;

      changeDetector.detectChanges();

      expect(nativeElement.querySelector('.po-upload-drag-drop-area-disabled')).toBeTruthy();
    });

    it(`should contain 'po-upload-drag-drop-area-overlay-icon' and 'po-upload-drag-drop-area-overlay-label' if disabled is false
      and overlay is true`, () => {

      component.disabled = false;
      component.overlay = true;

      changeDetector.detectChanges();

      expect(nativeElement.querySelector('.po-upload-drag-drop-area-overlay-icon')).toBeTruthy();
      expect(nativeElement.querySelector('.po-upload-drag-drop-area-overlay-label')).toBeTruthy();
    });

    it(`shouldn't contain 'po-upload-drag-drop-area-overlay-icon' and 'po-upload-drag-drop-area-overlay-label' if disabled and overlay
      are true`, () => {

      component.disabled = true;
      component.overlay = true;

      changeDetector.detectChanges();

      expect(nativeElement.querySelector('.po-upload-drag-drop-area-overlay-icon')).toBeFalsy();
      expect(nativeElement.querySelector('.po-upload-drag-drop-area-overlay-label')).toBeFalsy();
    });

    it(`shouldn't contain 'po-upload-drag-drop-area-overlay-icon' and 'po-upload-drag-drop-area-overlay-label' if disabled and overlay
      are false`, () => {

      component.disabled = false;
      component.overlay = false;

      changeDetector.detectChanges();

      expect(nativeElement.querySelector('.po-upload-drag-drop-area-overlay-icon')).toBeFalsy();
      expect(nativeElement.querySelector('.po-upload-drag-drop-area-overlay-label')).toBeFalsy();
    });

    it(`should contain 'po-clickable' in 'po-upload-drag-drop-area-select-files' if disabled is false`, () => {
      component.disabled = false;

      changeDetector.detectChanges();

      const areaContainer = nativeElement.querySelector('.po-upload-drag-drop-area-select-files');

      expect(areaContainer.classList).toContain('po-clickable');
    });

    it(`shouldn't contain 'po-clickable' in 'po-upload-drag-drop-area-select-files' if disabled is true`, () => {
      component.disabled = true;

      changeDetector.detectChanges();

      const areaContainer = nativeElement.querySelector('.po-upload-drag-drop-area-select-files');

      expect(areaContainer.classList).not.toContain('po-clickable');
    });

  });

});
