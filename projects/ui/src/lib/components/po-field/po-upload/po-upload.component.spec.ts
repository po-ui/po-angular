import type { Mock } from 'vitest';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { PoUtils as utilsFunctions } from '../../../utils/util';
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
import { PoProgressAction } from '../../po-progress';
import { PoButtonComponent } from '../../po-button';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
      providers: [HttpClient, HttpHandler, PoNotificationService, PoUploadService, PoLanguageService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    file = new PoUploadFile(fileMock);

    fixture = TestBed.createComponent(PoUploadComponent);
    component = fixture.componentInstance;
    vi.spyOn(utilsFunctions as any, 'convertImageToBase64').mockImplementation(() =>
      Promise.resolve('data:image/png;base64,TEST')
    );
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
      vi.spyOn(utilsFunctions as any, 'isMobile').mockReturnValue(false);
      component.dragDrop = true;

      expect(component.displayDragDrop).toBe(true);
    });

    it('displayDragDrop: should return false if `dragDrop` is `true` and `isMobile` is `true`', () => {
      vi.spyOn(utilsFunctions as any, 'isMobile').mockReturnValue(true);
      component.dragDrop = true;

      expect(component.displayDragDrop).toBe(false);
    });

    it('displayDragDrop: should return false if `dragDrop` is `false` and `isMobile` is `true`', () => {
      vi.spyOn(utilsFunctions as any, 'isMobile').mockReturnValue(true);
      component.dragDrop = false;

      expect(component.displayDragDrop).toBe(false);
    });

    it('displayDragDrop: should return false if `dragDrop` is `false` and `isMobile` is `false`', () => {
      vi.spyOn(utilsFunctions as any, 'isMobile').mockReturnValue(false);
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
      vi.spyOn(component as any, 'hasAnyFileUploading').mockReturnValue(false);
      vi.spyOn(component as any, 'isExceededFileLimit').mockReturnValue(false);

      component.disabled = false;
      component['url'] = 'url.com';

      expect(component.isDisabled).toBeFalsy();
    });

    it(`isDisabled: should return true if 'hasAnyFileUploading' is true`, () => {
      vi.spyOn(component as any, 'hasAnyFileUploading').mockReturnValue(true);
      vi.spyOn(component as any, 'isExceededFileLimit').mockReturnValue(false);

      component.disabled = false;
      component['url'] = 'url.com';

      expect(component.isDisabled).toBeTruthy();
    });

    it(`isDisabled: should return true if 'isExceededFileLimit' is true`, () => {
      vi.spyOn(component as any, 'hasAnyFileUploading').mockReturnValue(false);
      vi.spyOn(component as any, 'isExceededFileLimit').mockReturnValue(true);

      component.disabled = false;
      component['url'] = 'url.com';

      expect(component.isDisabled).toBeTruthy();
    });

    it(`isDisabled: should return true if 'disabled' is true`, () => {
      vi.spyOn(component as any, 'hasAnyFileUploading').mockReturnValue(false);
      vi.spyOn(component as any, 'isExceededFileLimit').mockReturnValue(false);

      component.disabled = true;
      component['url'] = 'url.com';

      expect(component.isDisabled).toBeTruthy();
    });

    it(`isDisabled: should return true if 'url' is undefined`, () => {
      vi.spyOn(component as any, 'hasAnyFileUploading').mockReturnValue(false);
      vi.spyOn(component as any, 'isExceededFileLimit').mockReturnValue(false);

      component.disabled = true;
      component['url'] = undefined;

      expect(component.isDisabled).toBeTruthy();
    });

    it(`isDisabled: should return true if 'url' is undefined and autoUpload is true`, () => {
      component.autoUpload = true;
      component['url'] = undefined;
      expect(component.isDisabled).toBe(true);
    });

    it(`isDisabled: should return true if 'requiredUrl' is true and 'url' is undefined`, () => {
      vi.spyOn(component as any, 'hasAnyFileUploading').mockReturnValue(false);
      vi.spyOn(component as any, 'isExceededFileLimit').mockReturnValue(false);

      component.disabled = false;
      component.requiredUrl = true;
      component['url'] = undefined;

      expect(component.isDisabled).toBeTruthy();
    });

    it(`isDisabled: should return false if 'requiredUrl' is true and 'url' is defined`, () => {
      vi.spyOn(component as any, 'hasAnyFileUploading').mockReturnValue(false);
      vi.spyOn(component as any, 'isExceededFileLimit').mockReturnValue(false);

      component.disabled = false;
      component.requiredUrl = true;
      component['url'] = 'url.com';

      expect(component.isDisabled).toBeFalsy();
    });

    it(`isDisabled: should return true if 'requiredUrl' is false and 'autoUpload' is true`, () => {
      vi.spyOn(component as any, 'hasAnyFileUploading').mockReturnValue(false);
      vi.spyOn(component as any, 'isExceededFileLimit').mockReturnValue(false);

      component.disabled = false;
      component.requiredUrl = false;
      component.autoUpload = true;
      component['url'] = undefined;

      expect(component.isDisabled).toBeTruthy();
    });

    it(`isDisabled: should return true if 'disabled' is true`, () => {
      vi.spyOn(component as any, 'hasAnyFileUploading').mockReturnValue(false);
      vi.spyOn(component as any, 'isExceededFileLimit').mockReturnValue(false);

      component.disabled = true;
      component['url'] = 'url.com';
      component.requiredUrl = false;

      expect(component.isDisabled).toBeTruthy();
    });

    it(`isDisabled: should return true if 'isExceededFileLimit' is true`, () => {
      vi.spyOn(component as any, 'hasAnyFileUploading').mockReturnValue(false);
      vi.spyOn(component as any, 'isExceededFileLimit').mockReturnValue(true);

      component.disabled = false;
      component['url'] = 'url.com';
      component.requiredUrl = false;

      expect(component.isDisabled).toBeTruthy();
    });

    it('isSelectButtonDisabled: should enable select button when loading and disabled are false', () => {
      component.loading = false;
      component.disabled = false;
      vi.spyOn(component as any, 'isDisabled').mockReturnValue(false);

      expect(component.isSelectButtonDisabled).toBe(false);
    });

    it('isSelectButtonDisabled: should disable select button when loading is true', () => {
      component.loading = true;
      component.disabled = false;
      vi.spyOn(component as any, 'isDisabled').mockReturnValue(false);

      expect(component.isSelectButtonDisabled).toBe(true);
    });

    it('isSelectButtonDisabled: should disable select button when disabled is true', () => {
      component.loading = false;
      component.disabled = true;
      vi.spyOn(component as any, 'isDisabled').mockReturnValue(true);

      expect(component.isSelectButtonDisabled).toBe(true);
    });

    it('isSelectButtonDisabled: should disable select button when both loading and disabled are true', () => {
      component.loading = true;
      component.disabled = true;
      vi.spyOn(component as any, 'isDisabled').mockReturnValue(true);

      expect(component.isSelectButtonDisabled).toBe(true);
    });

    it('isFieldDisabled: should return false when loading and disabled are false', () => {
      component.loading = false;
      component.disabled = false;

      expect(component.isFieldDisabled).toBe(false);
    });

    it('isFieldDisabled: should return true when loading is true', () => {
      component.loading = true;
      component.disabled = false;

      expect(component.isFieldDisabled).toBe(true);
    });

    it('isFieldDisabled: should return true when disabled is true', () => {
      component.loading = false;
      component.disabled = true;

      expect(component.isFieldDisabled).toBe(true);
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

      vi.spyOn(component as any, 'hasFileNotUploaded').mockReturnValue(true);

      expect(component.displaySendButton).toBeTruthy();
    });

    it(`displaySendButton: should return false if 'hideSendButton' is true`, () => {
      component.hideSendButton = true;
      component.autoUpload = false;
      component.currentFiles = [file];

      vi.spyOn(component as any, 'hasFileNotUploaded').mockReturnValue(true);

      expect(component.displaySendButton).toBeFalsy();
    });

    it(`displaySendButton: should return false if 'autoUpload' is true`, () => {
      component.hideSendButton = false;
      component.autoUpload = true;
      component.currentFiles = [file];

      vi.spyOn(component as any, 'hasFileNotUploaded').mockReturnValue(true);

      expect(component.displaySendButton).toBeFalsy();
    });

    it(`displaySendButton: should return false if 'currentFiles.length' is 0`, () => {
      component.hideSendButton = false;
      component.autoUpload = true;
      component.currentFiles = [];

      vi.spyOn(component as any, 'hasFileNotUploaded').mockReturnValue(true);

      expect(component.displaySendButton).toBeFalsy();
    });

    it(`displaySendButton: should return false if 'hasFileNotUploaded' is false`, () => {
      component.hideSendButton = false;
      component.autoUpload = true;
      component.currentFiles = [file];

      vi.spyOn(component as any, 'hasFileNotUploaded').mockReturnValue(false);

      expect(component.displaySendButton).toBeFalsy();
    });

    it(`displaySendButton: should display the button when 'displaySendButton' is true and 'url' is truthy`, () => {
      vi.spyOn(component as any, 'displaySendButton').mockReturnValue(true);
      component.url = 'http://example.com';
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector('.po-upload-send-button');
      expect(buttonElement).toBeTruthy();
    });

    it('infoByUploadStatus: should return info by uploaded status', () => {
      const fileStatus = PoUploadStatus.Uploaded;
      const expectedValue = {
        text: () => component.literals.sentWithSuccess,
        icon: 'ICON_OK'
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
    it(`ngOnChanges: should set displayAdditionalHelp false when label changes`, () => {
      const changes: any = {
        label: 'new label'
      };

      component.ngOnChanges(changes);

      expect(component.displayAdditionalHelp).toBe(false);
    });

    it('ngOnChanges: should set modalPrimaryAction and modalSecondaryAction when customModalActions has items', () => {
      const action1 = { label: 'Action 1', action: () => {} };
      const action2 = { label: 'Action 2', action: () => {} };
      component.customModalActions = [action1, action2];

      const changes = {
        customModalActions: {
          currentValue: component.customModalActions,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      };

      component.ngOnChanges(changes);

      expect(component['modalPrimaryAction']).toEqual(action1);
      expect(component['modalSecondaryAction']).toEqual(action2);
    });

    it('ngOnChanges: should set modalPrimaryAction and modalSecondaryAction set undefined when customModalActions has items', () => {
      const action1 = { label: 'Action 1', action: () => {} };
      component.customModalActions = [action1];

      const changes = {
        customModalActions: {
          currentValue: component.customModalActions,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      };

      component.ngOnChanges(changes);

      expect(component['modalPrimaryAction']).toEqual(action1);
      expect(component['modalSecondaryAction']).toEqual(undefined);
    });

    it('ngOnChanges: should call setPrimaryActionModal when customModalActions is empty', () => {
      component.customModalActions = [];

      const spySetPrimary = vi.spyOn(component as any, 'setPrimaryActionModal');

      const changes = {
        customModalActions: {
          currentValue: [],
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      };

      component.ngOnChanges(changes);

      expect(spySetPrimary).toHaveBeenCalled();
    });

    describe('ngAfterViewInit:', () => {
      let inputFocus: any;

      beforeEach(() => {
        inputFocus = vi.spyOn(component as any, 'focus');
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
      vi.spyOn(component as any, 'updateModel');
      vi.spyOn(component as any, 'cleanInputValue');
      vi.spyOn(component['cd'] as any, 'detectChanges');

      component.clear();

      expect(component.currentFiles).toBe(undefined);
      expect(component['updateModel']).toHaveBeenCalled();
      expect(component['cleanInputValue']).toHaveBeenCalled();
    });

    describe('emitAdditionalHelp:', () => {
      it('should emit additionalHelp when isAdditionalHelpEventTriggered returns true', () => {
        (component as any).label = 'this.label';
        vi.spyOn(component.additionalHelp as any, 'emit');
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).toHaveBeenCalled();
      });

      it('should not emit additionalHelp when isAdditionalHelpEventTriggered returns false', () => {
        vi.spyOn(component.additionalHelp as any, 'emit');
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
      });
    });

    describe('focus:', () => {
      it('should call `uploadButton.focus` if `uploadButton` is defined', () => {
        component.hideSelectButton = false;
        vi.spyOn(component as any, 'displayDragDrop').mockReturnValue(false);

        fixture.detectChanges();

        vi.spyOn(component['uploadButton'] as any, 'focus');

        component.focus();

        expect(component['uploadButton'].focus).toHaveBeenCalled();
      });

      it('should`t call `uploadButton.focus` if `disabled`', () => {
        component.hideSelectButton = false;
        component.disabled = true;
        vi.spyOn(component as any, 'displayDragDrop').mockReturnValue(false);

        fixture.detectChanges();

        vi.spyOn(component['uploadButton'] as any, 'focus');

        component.focus();

        expect(component['uploadButton'].focus).not.toHaveBeenCalled();
      });

      it('should call `poUploadDragDropComponent.focus` if `displayDragDrop` is defined', () => {
        vi.spyOn(component as any, 'displayDragDrop').mockReturnValue(true);

        fixture.detectChanges();

        vi.spyOn(component['poUploadDragDropComponent'] as any, 'focus');

        component.focus();

        expect(component['poUploadDragDropComponent'].focus).toHaveBeenCalled();
      });

      it('should`t call `poUploadDragDropComponent.focus` if `disabled`', () => {
        component.disabled = true;
        vi.spyOn(component as any, 'displayDragDrop').mockReturnValue(true);

        fixture.detectChanges();
        const spy = vi.spyOn(component['poUploadDragDropComponent'] as any, 'focus');

        component.focus();

        expect(spy).not.toHaveBeenCalled();
      });

      it('should`t call `poUploadDragDropComponent.focus` if `displayDragDrop` is false ', () => {
        component.disabled = false;
        component['uploadButton'] = undefined;
        Object.defineProperty(component, 'poUploadDragDropComponent', {
          value: <any>{
            focus: () => {}
          },
          configurable: true
        });
        vi.spyOn(component as any, 'displayDragDrop').mockReturnValue(false);

        const spy = vi.spyOn(component['poUploadDragDropComponent'] as any, 'focus');

        component.focus();

        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('getAdditionalHelpTooltip:', () => {
      it('should return null when isAdditionalHelpEventTriggered returns true', () => {
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBeNull();
      });

      it('should return additionalHelpTooltip when isAdditionalHelpEventTriggered returns false', () => {
        const tooltip = 'Test Tooltip';
        component.additionalHelpTooltip = tooltip;
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBe(tooltip);
      });

      it('should return undefined when additionalHelpTooltip is undefined and isAdditionalHelpEventTriggered returns false', () => {
        component.additionalHelpTooltip = undefined;
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBeUndefined();
      });
    });

    it('onFileChangeDragDrop: should call `updateFiles` with files.', () => {
      const files = 'teste';

      vi.spyOn(component as any, 'updateFiles');

      component.onFileChangeDragDrop(files);

      expect(component['updateFiles']).toHaveBeenCalledWith(files);
    });

    describe('onKeyDown:', () => {
      beforeEach(() => {
        component.uploadButton = {
          buttonElement: {
            nativeElement: document.createElement('button')
          }
        } as PoButtonComponent;
      });

      it('should emit event when field is focused', () => {
        const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        vi.spyOn(component.keydown as any, 'emit');
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(component.uploadButton.buttonElement.nativeElement);

        component.onKeyDown(fakeEvent);

        expect(component.keydown.emit).toHaveBeenCalledWith(fakeEvent);
      });

      it('should not emit event when field is not focused', () => {
        const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        vi.spyOn(component.keydown as any, 'emit');
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(document.createElement('div'));
        component.onKeyDown(fakeEvent);

        expect(component.keydown.emit).not.toHaveBeenCalled();
      });
    });

    describe('open and close modal:', () => {
      beforeEach(() => {
        component.modalComponent = {
          open: () => {},
          close: () => {}
        } as any;
      });

      it('closeModal: should call modalComponent.close and reset modalImageUrl', () => {
        const spyClose = vi.spyOn(component.modalComponent as any, 'close');
        component['modalImageUrl'] = 'some-url';

        component.closeModal();

        expect(spyClose).toHaveBeenCalled();
        expect(component['modalImageUrl']).toBe('');
      });

      it('openModal: should not open modal if keydown code is not Enter or Space', () => {
        const file = { thumbnailUrl: 'url.jpg' } as any;
        const spyOpen = vi.spyOn(component.modalComponent as any, 'open');
        const spyEmit = vi.spyOn(component.onOpenModalPreview as any, 'emit');

        const event = new KeyboardEvent('keydown', { code: 'Escape' });
        component.openModal(file, event);

        expect(spyOpen).not.toHaveBeenCalled();
        expect(spyEmit).not.toHaveBeenCalled();
      });

      it('openModal: should not open modal if file is undefined', () => {
        const spyOpen = vi.spyOn(component.modalComponent as any, 'open');
        component.openModal(undefined);
        expect(spyOpen).not.toHaveBeenCalled();
      });

      it('openModal: should not open modal if file has no thumbnailUrl', () => {
        const file = {} as any;
        const spyOpen = vi.spyOn(component.modalComponent as any, 'open');
        component.openModal(file);
        expect(spyOpen).not.toHaveBeenCalled();
      });

      it('openModal: should not open modal if file has errorMessage', () => {
        const file = { thumbnailUrl: 'url.jpg', errorMessage: 'error' } as any;
        const spyOpen = vi.spyOn(component.modalComponent as any, 'open');
        component.openModal(file);
        expect(spyOpen).not.toHaveBeenCalled();
      });

      it('openModal: should open modal, set modalImageUrl and emit event when valid file', () => {
        const file = { thumbnailUrl: 'url.jpg' } as any;
        const spyOpen = vi.spyOn(component.modalComponent as any, 'open');
        const spyEmit = vi.spyOn(component.onOpenModalPreview as any, 'emit');

        component.openModal(file);

        expect(spyOpen).toHaveBeenCalled();
        expect(component['modalImageUrl']).toBe('url.jpg');
        expect(spyEmit).toHaveBeenCalledWith(file);
      });
    });

    it('removeFile: should be remove file from currentFiles', () => {
      const fakeThis = {
        currentFiles: [file],
        updateModel: files => {}
      };

      vi.spyOn(fakeThis as any, 'updateModel');

      component.removeFile.call(fakeThis, file);

      expect(fakeThis.currentFiles.length).toBeFalsy();
      expect(fakeThis.updateModel).toHaveBeenCalledWith([]);
    });

    it('selectFiles: should click on input and set `calledByCleanInputValue` to false', () => {
      const calledByCleanInputValue = 'calledByCleanInputValue';
      component['onModelTouched'] = () => {};
      vi.spyOn(component as any, 'onModelTouched');

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
      const uploadFiles = vi.spyOn(component as any, 'uploadFiles');

      component.sendFiles();

      expect(uploadFiles).toHaveBeenCalled();
    });

    it('sendFiles: shouldn`t call `uploadFiles` if currentFile is false.', () => {
      component.currentFiles = undefined;
      const uploadFiles = vi.spyOn(component as any, 'uploadFiles');

      component.sendFiles();

      expect(component.currentFiles).toBe(undefined);
      expect(uploadFiles).not.toHaveBeenCalled();
    });

    it('sendFiles: shouldn`t call `uploadFiles` if currentFile is null.', () => {
      component.currentFiles = [];
      const uploadFiles = vi.spyOn(component as any, 'uploadFiles');

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
        cd: {
          markForCheck: () => {}
        },
        removeFile: function () {},
        stopUploadHandler: function () {}
      };

      vi.spyOn(fakeThis as any, 'removeFile');

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
        cd: {
          markForCheck: () => {}
        },
        removeFile: function () {},
        stopUploadHandler: function () {}
      };

      vi.spyOn(fakeThis as any, 'stopUploadHandler');

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
        vi.spyOn(component as any, 'cleanInputValue');

        component.onFileChange(event);

        expect(component.currentFiles.length).toBeTruthy();
        expect(component['cleanInputValue']).toHaveBeenCalled();
      });

      describe('uploadFiles', () => {
        it('uploadFiles: should return if files lenght is 0', () => {
          component['uploadService'] = { upload: () => {} } as any;
          const detectChangesSpy = vi.spyOn(component['cd'] as any, 'detectChanges');

          component['uploadFiles']([]);

          expect(detectChangesSpy).not.toHaveBeenCalled();
        });

        it('uploadFiles: should call uploadingHandler when progress callback is triggered', () => {
          const mockFile: any = { uid: 1, status: PoUploadStatus.None };
          const mockFiles = [mockFile];

          const spyUpload = vi
            .spyOn(component['uploadService'], 'upload')
            .mockImplementation((url, files, headers, onUpload, onProgress, onSuccess, onError) => {
              onProgress(mockFile, 75);
            });

          const spyUploadingHandler = vi.spyOn(component as any, 'uploadingHandler');

          component['uploadFiles'](mockFiles);

          expect(spyUpload).toHaveBeenCalled();
          expect(spyUploadingHandler).toHaveBeenCalledWith(mockFile, 75);
        });

        it('should call responseHandler, emit onSuccess, and hide done content after 500ms on success', fakeAsync(() => {
          const mockFile = {
            uid: '1',
            status: PoUploadStatus.Uploading,
            name: '',
            rawFile: {} as any,
            extension: '',
            size: 1000,
            hideDoneContent: false
          };
          const eventResponse = { success: true };

          component.url = 'fake-url';
          component.headers = {};
          component.currentFiles = [{ uid: '1', hideDoneContent: false } as any];

          const responseHandlerSpy = vi.spyOn(component as any, 'responseHandler');
          const detectChangesSpy = vi.spyOn(component['cd'] as any, 'detectChanges');
          const emitSuccessSpy = vi.spyOn(component.onSuccess as any, 'emit');

          const uploadSpy = vi
            .spyOn(component['uploadService'], 'upload')
            .mockImplementation((url, files, headers, onUpload, onProgress, onSuccess, onError) => {
              onSuccess(mockFile as any, eventResponse);
            });

          component.uploadFiles([mockFile as any]);

          expect(uploadSpy).toHaveBeenCalled();
          expect(responseHandlerSpy).toHaveBeenCalledWith(mockFile, PoUploadStatus.Uploaded);
          expect(emitSuccessSpy).toHaveBeenCalledWith(eventResponse);

          tick(500);

          expect(detectChangesSpy).toHaveBeenCalled();
        }));
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
        vi.spyOn(fakeThis as any, 'responseHandler');

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

      vi.spyOn(event as any, 'preventDefault');
      vi.spyOn(component as any, 'cleanInputValue');
      vi.spyOn(component as any, 'updateFiles');

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

      vi.spyOn(event as any, 'preventDefault');
      vi.spyOn(component as any, 'cleanInputValue');

      component.onFileChange(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component['cleanInputValue']).not.toHaveBeenCalled();
      expect(component['calledByCleanInputValue']).toBeFalsy();
    });

    it('cleanInputValue: should set input value to whitespace and set `calledByCleanInputValue` to true', () => {
      vi.spyOn(component['cd'] as any, 'detectChanges');
      const calledByCleanInputValue = 'calledByCleanInputValue';

      component[calledByCleanInputValue] = false;
      component['cleanInputValue']();

      expect(component['inputFile'].nativeElement.value).toBe('');
      expect(component[calledByCleanInputValue]).toBeTruthy();
      expect(component['cd'].detectChanges).toHaveBeenCalled();
    });

    it('updateFiles: should call `parseFiles` with `files` and `updateModel` with `currentFiles`', () => {
      const files = ['fileMock'];

      vi.spyOn(component as any, 'parseFiles').mockReturnValue(files);
      vi.spyOn(component as any, 'updateModel');

      component['updateFiles'](files);

      expect(component['parseFiles']).toHaveBeenCalledWith(<any>files);
      expect(component['updateModel']).toHaveBeenCalledWith(<any>files);
    });

    it('updateFiles: should call `uploadFiles` with files if `autoUpload` is `true`', () => {
      const files = ['fileMock'];
      component.autoUpload = true;

      vi.spyOn(component as any, 'parseFiles').mockReturnValue(files);
      vi.spyOn(component as any, 'uploadFiles');
      vi.spyOn(component as any, 'updateModel');

      component['updateFiles'](files);

      expect(component['uploadFiles']).toHaveBeenCalledWith(<any>files);
      expect(component['updateModel']).toHaveBeenCalled();
    });

    it('updateFiles: shouldn`t call `uploadFiles` with files if `autoUpload` is `false`', () => {
      const files = ['fileMock'];
      component.autoUpload = false;

      vi.spyOn(component as any, 'parseFiles').mockReturnValue(files);
      vi.spyOn(component as any, 'uploadFiles');
      vi.spyOn(component as any, 'updateModel');

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

      vi.spyOn(component as any, 'setPipeArguments');

      component['sendFeedback']();

      expect(component['setPipeArguments']).toHaveBeenCalledWith(
        literalAttr,
        [expectedValueSizeNotAllowed, expectedValueMinFileSize, expectedValueMaxFileSize],
        undefined
      );
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

      vi.spyOn(component as any, 'setPipeArguments');

      component['sendFeedback']();

      expect(component['setPipeArguments']).toHaveBeenCalledWith(
        literalAttr,
        [expectedValueExtensionNotAllowed, expectedValueAllowedExtensionsFormatted],
        undefined
      );
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

      vi.spyOn(component as any, 'setPipeArguments');

      component['sendFeedback']();
      expect(component['setPipeArguments']).toHaveBeenCalledWith(literalAttr, [expectedValueQuantityNotAllowed]);
    });

    it('sendFeedback: should call `setPipeArguments` if `quantityNotAllowed`, `extensionNotAllowed ` and `sizeNotAllowed `', () => {
      component['quantityNotAllowed'] = 1;
      component.fileRestrictions = {
        minFileSize: 1,
        maxFiles: 2,
        maxFileSize: 31457,
        allowedExtensions: ['.png', '.zip']
      };

      vi.spyOn(component as any, 'setPipeArguments');

      component['sendFeedback']({ sizeNotAllowed: 1, extensionNotAllowed: 1, quantityNotAllowed: 1 });
      expect(component['setPipeArguments']).toHaveBeenCalled();
    });

    it('setPipeArguments: should call `notification.information`', () => {
      const arg = 'invalidAmount';
      const literalAttr = 'invalidAmount';

      Object.defineProperty(component, 'notification', {
        value: {
          information: () => {}
        } as any
      });

      vi.spyOn(component['notification'] as any, 'information');
      const file = { uui: 1234, errorMessage: '' };
      component['setPipeArguments'](literalAttr, arg, file);

      expect(component['notification'].information).toHaveBeenCalled();
    });

    it('setPipeArguments: should call `i18nPipe.transform`', () => {
      const arg = '';
      const literalAttr = '';

      vi.spyOn(component['i18nPipe'] as any, 'transform');

      component['setPipeArguments'](literalAttr, arg);

      expect(component['i18nPipe'].transform).toHaveBeenCalled();
    });

    describe('actionIsDisabled', () => {
      it('should call action.disabled function and return its result when it is a function', () => {
        const disabledFn = vi.fn().mockReturnValue(true);
        const action = { disabled: disabledFn };

        const result = component['actionIsDisabled'](action);

        expect(disabledFn).toHaveBeenCalledWith(action);
        expect(result).toBe(true);
      });

      it('should return action.disabled when it is not a function', () => {
        const action = { disabled: false };

        const result = component['actionIsDisabled'](action);

        expect(result).toBe(false);
      });
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

    it('showTooltipText: should show tooltip only when content overflows', () => {
      const event: any = {
        target: document.createElement('div')
      };

      const element = event.target as HTMLElement;

      // Simula overflow
      Object.defineProperty(element, 'scrollWidth', { value: 150, configurable: true });
      Object.defineProperty(element, 'offsetWidth', { value: 100, configurable: true });

      component['showTooltipText'](event, 'Long Title');
      expect(component['tooltipTitle']).toBe('Long Title');

      // Simula conteúdo sem overflow
      Object.defineProperty(element, 'scrollWidth', { value: 80, configurable: true });
      Object.defineProperty(element, 'offsetWidth', { value: 100, configurable: true });

      component['showTooltipText'](event, '');
      expect(component['tooltipTitle']).toBeUndefined();
    });

    describe('isActionVisible', () => {
      it('should return false if action is undefined', () => {
        expect(component['isActionVisible'](undefined)).toBe(false);
      });

      it('should return false if action has no label and no icon', () => {
        const action = {};
        expect(component['isActionVisible'](action)).toBe(false);
      });

      it('should return true if visible is undefined', () => {
        const action = { label: 'Action' };
        expect(component['isActionVisible'](action)).toBe(true);
      });

      it('should return result of visible() if visible is a function', () => {
        const visibleFn = vi.fn().mockReturnValue(true);
        const action = { label: 'Action', visible: visibleFn };
        expect(component['isActionVisible'](action)).toBe(true);
        expect(visibleFn).toHaveBeenCalled();
      });

      it('should return boolean value of visible if it is not a function', () => {
        const action = { label: 'Action', visible: 0 };
        expect(component['isActionVisible'](action)).toBe(false);
      });
    });

    describe('onImageError', () => {
      it('should set file.imageError to true', () => {
        const file: any = { imageError: false };
        component['onImageError'](file);
        expect(file.imageError).toBe(true);
      });
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

      const spyOnModelChange = vi.spyOn(component as any, 'onModelChange');

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

      const spyNgModelChange = vi.spyOn(component.ngModelChange as any, 'emit');

      component['updateModel'](currentFiles);

      expect(spyNgModelChange).toHaveBeenCalledWith([cleanFile]);
    });

    it('cancel: should call stopUpload with file if file.status is Uploading', () => {
      const localFile: any = { name: 'filename.jpg', status: PoUploadStatus.Uploading };

      const spyRemoveFile = vi.spyOn(component as any, 'removeFile');
      const spyStopUpload = vi.spyOn(component as any, 'stopUpload');

      component.cancel(localFile);

      expect(spyStopUpload).toHaveBeenCalledWith(localFile);
      expect(spyRemoveFile).not.toHaveBeenCalled();
    });

    it('cancel: should call removeFile with file if file.status isn´t Uploading', () => {
      const localFile: any = { name: 'filename.jpg' };

      const spyStopUpload = vi.spyOn(component as any, 'stopUpload');
      const spyRemoveFile = vi.spyOn(component as any, 'removeFile');

      component.cancel(localFile);

      expect(spyRemoveFile).toHaveBeenCalledWith(localFile);
      expect(spyStopUpload).not.toHaveBeenCalled();
    });

    it('cancel: should not call removeFile or stopUpload if disabledRemoveFile is true', () => {
      const localFile: any = { name: 'filename.jpg', status: PoUploadStatus.Uploaded };
      component.disabledRemoveFile = true;

      const spyStopUpload = vi.spyOn(component as any, 'stopUpload');
      const spyRemoveFile = vi.spyOn(component as any, 'removeFile');

      component.cancel(localFile);

      expect(spyStopUpload).not.toHaveBeenCalled();
      expect(spyRemoveFile).not.toHaveBeenCalled();
    });

    it('cancel: should not call removeFile or stopUpload if keydown is not Enter or Space', () => {
      const localFile: any = { name: 'filename.jpg', status: PoUploadStatus.Uploaded };
      const event = new KeyboardEvent('keydown', { code: 'Escape' });

      const spyStopUpload = vi.spyOn(component as any, 'stopUpload');
      const spyRemoveFile = vi.spyOn(component as any, 'removeFile');

      component.cancel(localFile, event);

      expect(spyStopUpload).not.toHaveBeenCalled();
      expect(spyRemoveFile).not.toHaveBeenCalled();
    });

    it('cancel: should emit onCancel if file.status is not Uploaded', () => {
      const localFile: any = { name: 'filename.jpg', status: PoUploadStatus.Error };
      const spyEmitCancel = vi.spyOn(component.onCancel as any, 'emit');
      const spyEmitRemove = vi.spyOn(component.onRemove as any, 'emit');
      const spyRemoveFile = vi.spyOn(component as any, 'removeFile');

      component.cancel(localFile);

      expect(spyRemoveFile).toHaveBeenCalledWith(localFile);
      expect(spyEmitCancel).toHaveBeenCalledWith(localFile);
      expect(spyEmitRemove).not.toHaveBeenCalled();
    });

    it('cancel: should emit onRemove if file.status is Uploaded', () => {
      const localFile: any = { name: 'filename.jpg', status: PoUploadStatus.Uploaded };
      const spyEmitCancel = vi.spyOn(component.onCancel as any, 'emit');
      const spyEmitRemove = vi.spyOn(component.onRemove as any, 'emit');
      const spyRemoveFile = vi.spyOn(component as any, 'removeFile');

      component.cancel(localFile);

      expect(spyRemoveFile).toHaveBeenCalledWith(localFile);
      expect(spyEmitRemove).toHaveBeenCalledWith(localFile);
      expect(spyEmitCancel).not.toHaveBeenCalled();
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

      vi.spyOn(component.renderer as any, 'setAttribute');

      component.setDirectoryAttribute(canHandleDirectory);

      expect(component.renderer.setAttribute).toHaveBeenCalledTimes(1);
    });

    it(`setDirectoryAttribute: should call 'removeAttribute' if 'canHandleDirectory' is false`, () => {
      component.canHandleDirectory = false;

      vi.spyOn(component.renderer as any, 'removeAttribute');

      component.setDirectoryAttribute(component.canHandleDirectory);

      expect(component.renderer.removeAttribute).toHaveBeenCalledWith(
        component['inputFile'].nativeElement,
        'webkitdirectory'
      );
      expect(component.renderer.removeAttribute).toHaveBeenCalledTimes(1);
    });

    describe('showAdditionalHelp:', () => {
      let helperEl: any;
      beforeEach(() => {
        helperEl = {
          openHelperPopover: vi.fn(),
          closeHelperPopover: vi.fn(),
          helperIsVisible: vi.fn().mockReturnValue(false)
        };
      });

      it('setHelper should access this.additionalHelp when isAdditionalHelpEventTriggered returns true', () => {
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue({});
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);

        const original = (component as any).additionalHelp;
        let accessed = false;
        Object.defineProperty(component as any, 'additionalHelp', {
          get: () => {
            accessed = true;
            return original;
          },
          configurable: true
        });

        (component as any).setHelper('label', 'tooltip');

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(accessed).toBe(true);

        Object.defineProperty(component as any, 'additionalHelp', {
          value: original,
          writable: true,
          configurable: true
        });
      });

      it('setHelper should not access this.additionalHelp when isAdditionalHelpEventTriggered returns false', () => {
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue({});
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

        const original = (component as any).additionalHelp;
        let accessed = false;

        Object.defineProperty(component as any, 'additionalHelp', {
          get: () => {
            accessed = true;
            return original;
          },
          configurable: true
        });

        (component as any).setHelper('label', 'tooltip');

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(accessed).toBe(false);

        Object.defineProperty(component as any, 'additionalHelp', {
          value: original,
          writable: true,
          configurable: true
        });
      });

      it('should call closeHelperPopover and return early when helperIsVisible is true', () => {
        (component as any).label = '';
        component.additionalHelpTooltip = undefined;
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.mockReturnValue(true);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue({});
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should emit additionalHelp and return early when isAdditionalHelpEventTriggered is true', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue({});
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should call helper.eventOnClick and return early when helper has eventOnClick function', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;
        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        const helperMock = { eventOnClick: vi.fn() };
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(helperMock);
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(helperMock.eventOnClick).toHaveBeenCalledTimes(1);
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).not.toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(component.helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should enter the block via additionalHelpTooltip when helper is falsy and isHelpEvt is false, then open popover', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(undefined);
        component.additionalHelpTooltip = 'any text';
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).toHaveBeenCalled();
        expect(component.helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should enter the block via isHelpEvt when helper and tooltip are falsy, emit and then open popover', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(undefined);
        component.additionalHelpTooltip = undefined;
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should toggle `displayAdditionalHelp` from false to true', () => {
        component.displayAdditionalHelp = false;

        const result = component.showAdditionalHelp();

        expect(result).toBe(true);
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should toggle `displayAdditionalHelp` from true to false', () => {
        component.displayAdditionalHelp = true;

        const result = component.showAdditionalHelp();

        expect(result).toBe(false);
        expect(component.displayAdditionalHelp).toBe(false);
      });
    });

    it('customClick: should emit customActionClick with the provided file if customAction is defined', () => {
      const mockFile = { name: 'mock-file.txt' } as PoUploadFile;
      component.customAction = { label: 'Download', icon: 'an-download' };

      vi.spyOn(component.customActionClick as any, 'emit');

      component.customClick(mockFile);

      expect(component.customActionClick.emit).toHaveBeenCalledWith(mockFile);
    });

    it('customClick: should not emit customActionClick if customAction is undefined', () => {
      const mockFile = { name: 'mock-file.txt' } as PoUploadFile;
      component.customAction = undefined;

      vi.spyOn(component.customActionClick as any, 'emit');

      component.customClick(mockFile);

      expect(component.customActionClick.emit).not.toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
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

    it('shouldn´t show send files button if `displaySendButton` returns false', () => {
      vi.spyOn(component as any, 'displaySendButton').mockReturnValue(false);

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-button-primary')).toBeFalsy();
    });

    it('should show `po-upload-drag-drop` and doesn`t show upload button if `displayDragDrop` return true', () => {
      vi.spyOn(component as any, 'displayDragDrop').mockReturnValue(true);

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('po-upload-drag-drop')).toBeTruthy();
      expect(fixture.debugElement.nativeElement.querySelector('.po-upload-button')).toBeNull();
    });

    it('shouldn`t show `po-upload-drag-drop` and show upload button if `displayDragDrop` return false', () => {
      vi.spyOn(component as any, 'displayDragDrop').mockReturnValue(false);

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

    it('shouldn`t add `po-upload-progress-container-area` class if `hasMoreThanFourItems` is false', () => {
      component.currentFiles = [file];
      vi.spyOn(component as any, 'hasMoreThanFourItems').mockReturnValue(false);

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-upload-progress-container-area')).toBeFalsy();
    });

    it('should fix the height of `po-container` to `auto` if `hasMoreThanFourItems` is false', () => {
      component.currentFiles = [file];
      vi.spyOn(component as any, 'hasMoreThanFourItems').mockReturnValue(false);

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-container-content').style.height).toBe('auto');
    });
  });
});
