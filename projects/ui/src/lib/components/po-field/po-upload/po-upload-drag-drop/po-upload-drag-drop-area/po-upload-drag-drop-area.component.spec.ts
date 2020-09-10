import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from '../../../../../util-test/util-expect.spec';
import { poLocaleDefault } from '../../../../../services/po-language/po-language.constant';

import { PoUploadDragDropAreaComponent } from './po-upload-drag-drop-area.component';
import { poUploadLiteralsDefault } from '../../po-upload-base.component';

describe('PoUploadDragDropAreaComponent:', () => {
  let changeDetector: any;
  let component: PoUploadDragDropAreaComponent;
  let fixture: ComponentFixture<PoUploadDragDropAreaComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoUploadDragDropAreaComponent]
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

  describe('Methods:', () => {
    it('focus: should call `focus` of `selectFilesLinkElement`', () => {
      component.selectFilesLinkElement = {
        nativeElement: {
          focus: () => {}
        }
      };

      spyOn(component.selectFilesLinkElement.nativeElement, 'focus');

      component.focus();

      expect(component.selectFilesLinkElement.nativeElement.focus).toHaveBeenCalled();
    });
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

    it(`should contain 'disabled' property in button if disabled is true`, () => {
      component.disabled = true;

      changeDetector.detectChanges();

      expect(nativeElement.querySelector('button').hasAttribute('disabled')).toBe(true);
    });

    it(`shouldn't contain 'disabled' property in button if disabled is false`, () => {
      component.disabled = false;

      changeDetector.detectChanges();

      expect(nativeElement.querySelector('button').hasAttribute('disabled')).toBe(false);
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

    it('should apply literals `dropFoldersHere`, if directoryCompatible is true ', () => {
      component.disabled = false;
      component.overlay = true;
      component.directoryCompatible = true;
      component.literals = { ...poUploadLiteralsDefault[poLocaleDefault] };

      changeDetector.detectChanges();

      const overlayLabel = nativeElement.querySelector('.po-upload-drag-drop-area-overlay-label');

      expect(overlayLabel.innerText).toBe(poUploadLiteralsDefault[poLocaleDefault].dropFoldersHere);
    });

    it('should apply literals `dropFilesHere`, if directoryCompatible is true ', () => {
      component.disabled = false;
      component.overlay = true;
      component.directoryCompatible = false;
      component.literals = { ...poUploadLiteralsDefault[poLocaleDefault] };

      changeDetector.detectChanges();

      const overlayLabel = nativeElement.querySelector('.po-upload-drag-drop-area-overlay-label');

      expect(overlayLabel.innerText).toBe(poUploadLiteralsDefault[poLocaleDefault].dropFilesHere);
    });

    it('should apply literals `dragFoldersHere` and `selectFolderOnComputer`, if directoryCompatible is true ', () => {
      component.disabled = false;
      component.directoryCompatible = true;
      component.literals = { ...poUploadLiteralsDefault[poLocaleDefault] };

      changeDetector.detectChanges();

      const dragAreaLabel = nativeElement.querySelector('.po-upload-drag-drop-area-label');
      const dragAreaButton = nativeElement.querySelector('.po-upload-drag-drop-area-select-files');

      expect(dragAreaLabel.innerText).toBe(poUploadLiteralsDefault[poLocaleDefault].dragFoldersHere);
      expect(dragAreaButton.innerText).toBe(poUploadLiteralsDefault[poLocaleDefault].selectFolderOnComputer);
    });

    it('should apply literals `dragFilesHere` and `selectFilesOnComputer`, if directoryCompatible is true ', () => {
      component.disabled = false;
      component.directoryCompatible = false;
      component.literals = { ...poUploadLiteralsDefault[poLocaleDefault] };

      changeDetector.detectChanges();

      const dragAreaLabel = nativeElement.querySelector('.po-upload-drag-drop-area-label');
      const dragAreaButton = nativeElement.querySelector('.po-upload-drag-drop-area-select-files');

      expect(dragAreaLabel.innerText).toBe(poUploadLiteralsDefault[poLocaleDefault].dragFilesHere);
      expect(dragAreaButton.innerText).toBe(poUploadLiteralsDefault[poLocaleDefault].selectFilesOnComputer);
    });
  });
});
