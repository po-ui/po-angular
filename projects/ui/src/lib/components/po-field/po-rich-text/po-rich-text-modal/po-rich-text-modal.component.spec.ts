import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import * as UtilsFunction from '../../../../utils/util';
import { configureTestSuite } from '../../../../util-test/util-expect.spec';

import { PoButtonGroupModule } from '../../../po-button-group';
import { PoFieldModule } from '../../po-field.module';
import { PoModalModule } from '../../../po-modal/po-modal.module';
import { PoRichTextModalComponent } from './po-rich-text-modal.component';
import { PoRichTextModalType } from '../enums/po-rich-text-modal-type.enum';

describe('PoRichTextModalComponent:', () => {
  let component: PoRichTextModalComponent;
  let fixture: ComponentFixture<PoRichTextModalComponent>;
  let nativeElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoButtonGroupModule, PoModalModule, PoFieldModule],
      declarations: []
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoRichTextModalComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it(`isUploadValid: should return true if uploadModel is not empty`, () => {
      component.uploadModel = ['fileMock'];

      expect(component['isUploadValid']).toBeTruthy();
    });

    it(`isUploadValid: should return false if uploadModel is undefined`, () => {
      component.uploadModel = undefined;

      expect(component['isUploadValid']).toBeFalsy();
    });

    it(`isUploadValid: should return false if uploadModel is an empty array`, () => {
      component.uploadModel = [];

      expect(component['isUploadValid']).toBeFalsy();
    });

    it(`isUrlValid: should return true if url is valid`, () => {
      component.modalImageForm = <any>{
        valid: true
      };
      component.urlImage = 'http://test.com';

      expect(component['isUrlValid']).toBeTruthy();
    });

    it(`isUrlValid: should return false if url is empty`, () => {
      component.modalImageForm = <any>{
        valid: false
      };
      component.urlImage = '';

      expect(component['isUrlValid']).toBeFalsy();
    });

    it(`isUrlValid: should return false if url is invalid`, () => {
      component.modalImageForm = <any>{
        invalid: false
      };
      component.urlImage = 'test';

      expect(component['isUrlValid']).toBeFalsy();
    });

    it('modalPrimaryAction: should return `modalConfirmAction` if modalType is `image`', () => {
      component.modalType = PoRichTextModalType.Image;

      expect(component['modalPrimaryAction']).toBe(component['modalConfirmAction']);
    });

    it('modalPrimaryAction: should return `modalLinkConfirmAction` if modalType is `link`', () => {
      component.modalType = PoRichTextModalType.Link;

      expect(component['modalPrimaryAction']).toBe(component['modalLinkConfirmAction']);
    });

    it('modalTitle: should return  `literals.insertImage` if modalType is `image`', () => {
      component.modalType = PoRichTextModalType.Image;

      expect(component['modalTitle']).toBe(component.literals.insertImage);
    });

    it('modalTitle: should return  `literals.insertLink` if modalType is `link`', () => {
      component.modalType = PoRichTextModalType.Link;

      expect(component['modalTitle']).toBe(component.literals.insertLink);
    });

    it('modalCancelAction: should call modal.close and cleanUpFields', () => {
      spyOn(component.modal, <any>'close');
      spyOn(component.command, 'emit');
      spyOn(component, <any>'retrieveCursorPosition');
      spyOn(component, <any>'cleanUpFields');

      component.modalCancelAction.action();

      expect(component.modal.close).toHaveBeenCalled();
      expect(component.command.emit).toHaveBeenCalled();
      expect(component['retrieveCursorPosition']).toHaveBeenCalled();
      expect(component['cleanUpFields']).toHaveBeenCalled();
    });

    it('modalConfirmAction: should call insertElementRef', () => {
      spyOn(component, 'insertElementRef');

      component.modalConfirmAction.action();

      expect(component.insertElementRef).toHaveBeenCalled();
    });

    it('modalLinkConfirmAction: should call `toInsertLink` if `isLinkEditing` is false', () => {
      spyOn(component, <any>'toInsertLink');
      spyOn(component, <any>'toEditLink');

      component['isLinkEditing'] = false;

      component.modalLinkConfirmAction.action();

      expect(component['toEditLink']).not.toHaveBeenCalled();
      expect(component['toInsertLink']).toHaveBeenCalled();
    });

    it('modalLinkConfirmAction: should call `toEditLink` if `isLinkEditing` is true', () => {
      spyOn(component, <any>'toInsertLink');
      spyOn(component, <any>'toEditLink');

      component['isLinkEditing'] = true;

      component.modalLinkConfirmAction.action();

      expect(component['toInsertLink']).not.toHaveBeenCalled();
      expect(component['toEditLink']).toHaveBeenCalled();
    });

    it('linkConfirmAction: should return `insertLink` if `isLinkEditing` is `false`', () => {
      component['isLinkEditing'] = false;
      expect(component.linkConfirmAction()).toBe(component.literals.insertLink);
    });

    it('linkConfirmAction: should return `editLink` if `isLinkEditing` is `true`', () => {
      component['isLinkEditing'] = true;
      expect(component.linkConfirmAction()).toBe(component.literals.editLink);
    });
  });

  describe('Methods:', () => {
    it(`selectedLink: should set 'isSelectedLink' and 'linkElement'.`, () => {
      component['isSelectedLink'] = undefined;
      component['linkElement'] = undefined;
      const fakeEvent = {
        isSelectedLink: true,
        linkElement: 'portinari'
      };

      component.selectedLink(fakeEvent);

      expect(component['isSelectedLink']).toBe(fakeEvent.isSelectedLink);
      expect(component['linkElement']).toBe(fakeEvent);
    });

    it(`openModal: should call 'modal.open' and 'saveCursorPosition'`, () => {
      const fakeType = PoRichTextModalType.Image;

      spyOn(component.modal, 'open');
      spyOn(component, <any>'saveCursorPosition');

      component.openModal(fakeType);

      expect(component.modal.open).toHaveBeenCalled();
      expect(component['saveCursorPosition']).toHaveBeenCalled();
    });

    it('openModal: should call `prepareModalForLink` if modalType is `Link`', () => {
      const fakeType = PoRichTextModalType.Link;

      spyOn(component, <any>'prepareModalForLink');

      component.openModal(fakeType);

      expect(component['prepareModalForLink']).toHaveBeenCalled();
    });

    it('openModal: shouldn`t call `prepareModalForLink` if modalType not is `Link`', () => {
      const fakeType = PoRichTextModalType.Image;

      const spyOnPrepareModalForLink = spyOn(component, <any>'prepareModalForLink');
      const spyOnOpen = spyOn(component.modal, <any>'open');

      component.openModal(fakeType);

      expect(spyOnPrepareModalForLink).not.toHaveBeenCalled();
      expect(spyOnOpen).toHaveBeenCalled();
    });

    it('openModal: should call `prepareModalForLink` and set `modalLinkConfirmAction.label` with `linkConfirmAction` value', () => {
      const literal = 'link confirm action';
      spyOn(component, 'linkConfirmAction').and.returnValue(literal);
      const spyOnPrepareModalForLink = spyOn(component, <any>'prepareModalForLink');

      component.openModal(PoRichTextModalType.Link);

      expect(component.modalLinkConfirmAction.label).toBe(literal);
      expect(spyOnPrepareModalForLink).toHaveBeenCalled();
    });

    it(`convertToBase64: should call 'convertImageToBase64'.`, async () => {
      component.uploadModel = <any>[{ rawFile: <any>'new file' }];
      spyOn(UtilsFunction, 'convertImageToBase64');

      await component['convertToBase64']();

      expect(UtilsFunction.convertImageToBase64).toHaveBeenCalled();
    });

    it(`convertToBase64: shouldn't call 'convertImageToBase64'.`, async () => {
      spyOn(UtilsFunction, 'convertImageToBase64');

      await component['convertToBase64']();

      expect(UtilsFunction.convertImageToBase64).not.toHaveBeenCalled();
    });

    it(`emitCommand: should call 'command' and 'emit'.`, () => {
      const value = 'fakeUrl';
      const command = 'insertImage';
      component.modalType = PoRichTextModalType.Image;
      spyOn(component.command, 'emit');

      component.emitCommand(value);

      expect(component.command.emit).toHaveBeenCalledWith({ command, value });
    });

    it(`emitCommand: shouldn't call 'command' and 'emit'.`, () => {
      const value = undefined;
      const command = 'insertImage';
      component.modalType = PoRichTextModalType.Image;
      spyOn(component.command, 'emit');

      component.emitCommand(value);

      expect(component.command.emit).not.toHaveBeenCalledWith({ command, value });
    });

    it(`emitCommand: shouldn't call 'command' and 'emit'.`, () => {
      const value = 'fakeUrl';
      const command = 'insertImage';
      spyOn(component.command, 'emit');

      component.emitCommand(value);

      expect(component.command.emit).not.toHaveBeenCalledWith({ command, value });
    });

    it(`insertElementRef: should call 'retrieveCursorPosition' and 'modal.close' before 'emitCommand'`, async () => {
      component.modalType = PoRichTextModalType.Image;

      spyOn(component.modal, <any>'close');
      spyOn(component, <any>'retrieveCursorPosition');
      const spyEmitCommand = spyOn(component, 'emitCommand');
      spyOnProperty(component, 'isUrlValid').and.returnValue(true);

      await component.insertElementRef();

      expect(component['retrieveCursorPosition']).toHaveBeenCalledBefore(spyEmitCommand);
      expect(component.modal.close).toHaveBeenCalledBefore(spyEmitCommand);
    });

    it(`insertElementRef: should call 'convertToBase64' if 'urlImage' is undefined and 'modalType' is 'image'.`, async () => {
      component.modalType = PoRichTextModalType.Image;
      component.urlImage = undefined;

      spyOn(component, <any>'convertToBase64');
      spyOn(component.modal, <any>'close');
      spyOn(component, <any>'retrieveCursorPosition');

      await component.insertElementRef();

      expect(component['convertToBase64']).toHaveBeenCalled();
      expect(component['retrieveCursorPosition']).toHaveBeenCalled();
      expect(component.modal.close).toHaveBeenCalled();
    });

    it(`insertElementRef: shouldn't call 'convertToBase64' if 'urlImage' is defined and 'modalType' is 'image'.`, async () => {
      const fakeUrlImage = 'test';
      component.urlImage = fakeUrlImage;

      spyOn(component, <any>'convertToBase64');
      spyOn(component.modal, <any>'close');
      spyOn(component, <any>'retrieveCursorPosition');
      spyOn(component, <any>'cleanUpFields');

      await component.insertElementRef();

      expect(component['convertToBase64']).not.toHaveBeenCalled();
      expect(component['retrieveCursorPosition']).toHaveBeenCalled();
      expect(component.modal.close).toHaveBeenCalled();
      expect(component['cleanUpFields']).toHaveBeenCalled();
    });

    it(`insertElementRef: should call 'emitCommand' with 'urlImage' if 'isUrlValid' returns 'true'.`, async () => {
      spyOn(component, <any>'retrieveCursorPosition');
      const fakeUrlImage = 'test';
      component.urlImage = fakeUrlImage;

      spyOn(component, 'emitCommand');
      spyOnProperty(component, 'isUrlValid').and.returnValue(true);

      await component.insertElementRef();

      expect(component.emitCommand).toHaveBeenCalledWith(fakeUrlImage);
    });

    it(`insertElementRef: should call 'emitCommand' with 'base64Image' if 'isUploadValid' returns 'true'.`, async () => {
      component.modalType = PoRichTextModalType.Image;
      const fakeBase64Image = 'imageBase64';

      spyOn(component, 'emitCommand');
      spyOn(component, <any>'retrieveCursorPosition');
      spyOn(component, 'convertToBase64').and.returnValue(Promise.resolve(fakeBase64Image));
      spyOnProperty(component, 'isUploadValid').and.returnValue(true);

      await component.insertElementRef();

      expect(component.emitCommand).toHaveBeenCalledWith(fakeBase64Image);
    });

    it(`insertElementRef: shouldn't call 'emitCommand' if 'isUploadValid' and 'isUrlValid' returns 'false'.`, async () => {
      spyOn(component, <any>'retrieveCursorPosition');

      spyOn(component, 'emitCommand');
      spyOnProperty(component, 'isUrlValid').and.returnValue(false);
      spyOnProperty(component, 'isUploadValid').and.returnValue(false);

      await component.insertElementRef();

      expect(component.emitCommand).not.toHaveBeenCalled();
    });

    it(`cleanUpFields: should set values to 'urlImage' and 'uploadModel'.`, () => {
      component.upload = <any>{};

      component['cleanUpFields']();

      expect(component.urlImage).toBe(undefined);
      expect(component.uploadModel).toBe(undefined);
      expect(component.urlLink).toBe(undefined);
      expect(component.urlLinkText).toBe(undefined);
    });

    it(`retrieveCursorPosition: should call 'selection.collapse'.`, () => {
      component.savedCursorPosition = [null, 1];

      spyOn(component.selection, 'collapse');

      component['retrieveCursorPosition']();

      expect(component.selection.collapse).toHaveBeenCalled();
    });

    it(`saveCursorPosition: should set value to 'savedCursorPosition'.`, () => {
      const fakeSelection = document.getSelection();
      const expectedValueSaved = [fakeSelection.focusNode, fakeSelection.focusOffset];

      component['saveCursorPosition']();

      expect(component.savedCursorPosition).toEqual(expectedValueSaved);
    });

    it('toInsertLink: should call `restoreSelection`, `cleanUpFields` and `modal.close`', () => {
      const urlLink = 'urlLink';
      const urlLinkText = 'url link text';

      spyOn(component, <any>'restoreSelection');
      spyOn(component, <any>'cleanUpFields');
      spyOn(component.modal, 'close');

      component['toInsertLink'](urlLink, urlLinkText);

      expect(component['restoreSelection']).toHaveBeenCalled();
      expect(component['cleanUpFields']).toHaveBeenCalled();
      expect(component.modal.close).toHaveBeenCalled();
    });

    it('toInsertLink: should call `checkIfIsEmpty` and `command.emit`', () => {
      const urlLink = 'urlLink';
      const urlAsExternalLink = 'http://urlLink';
      const urlLinkText = 'url link text';

      spyOn(component, <any>'checkIfIsEmpty').and.callThrough();
      spyOn(component.command, 'emit');

      component['toInsertLink'](urlLink, urlLinkText);

      expect(component['checkIfIsEmpty']).toHaveBeenCalled();
      expect(component.command.emit).toHaveBeenCalledWith({
        command: 'InsertHTML',
        value: { urlLink: urlAsExternalLink, urlLinkText: urlLinkText }
      });
    });

    it('toInsertLink: should call `command.emit` with `urlAsExternalLink` if `urlLink` not contains `http://`', () => {
      const urlLink = 'urlLink';
      const urlAsExternalLink = 'http://urlLink';
      const urlLinkText = 'url link text';

      spyOn(component, <any>'checkIfIsEmpty').and.returnValue(urlLinkText);
      spyOn(component.command, 'emit');

      component['toInsertLink'](urlLink, urlLinkText);

      expect(component.command.emit).toHaveBeenCalledWith({
        command: 'InsertHTML',
        value: { urlLink: urlAsExternalLink, urlLinkText: urlLinkText }
      });
    });

    it('toInsertLink: should call `command.emit` with `urlLink` if `urlLink` contains `http://`', () => {
      const urlLink = 'http://urlLink';
      const urlLinkText = 'url link text';

      spyOn(component, <any>'checkIfIsEmpty').and.returnValue(urlLinkText);
      spyOn(component.command, 'emit');

      component['toInsertLink'](urlLink, urlLinkText);

      expect(component.command.emit).toHaveBeenCalledWith({
        command: 'InsertHTML',
        value: { urlLink: urlLink, urlLinkText: urlLinkText }
      });
    });

    it('formModelValidate: should apply `true` to `modalLinkForm.disabled` if `modalLinkForm.invalid` is `true`', () => {
      const fakeThis = {
        urlLink: null,
        modalLinkConfirmAction: {
          disabled: undefined
        },
        modalLinkForm: {
          invalid: true
        }
      };

      component.formModelValidate.call(fakeThis);

      expect(fakeThis.modalLinkConfirmAction.disabled).toBeTruthy();
    });

    it('formModelValidate: should apply `false` to `modalLinkForm.disabled` if `modalLinkForm.invalid` is `false`', () => {
      const fakeThis = {
        urlLink: null,
        modalLinkConfirmAction: {
          disabled: undefined
        },
        modalLinkForm: {
          invalid: false
        }
      };

      component.formModelValidate.call(fakeThis);

      expect(fakeThis.modalLinkConfirmAction.disabled).toBeFalsy();
    });

    it('restoreSelection: should return `false` if `savedSelection is `false`', () => {
      component['savedSelection'] = null;

      const expectedResult = component['restoreSelection']();

      expect(expectedResult).toBe(false);
    });

    it('restoreSelection: should return `true` if `savedSelection is `true`', () => {
      const fakeThis = {
        savedSelection: true
      };

      const expectedResult = component['restoreSelection'].call(fakeThis);

      expect(expectedResult).toBe(true);
    });

    it('restoreSelection: should call `removeAllRanges`, `addRange` and return `true` if `savedSelection is `true`', () => {
      const fakeThis = {
        savedSelection: true,
        selection: {
          removeAllRanges: () => {},
          addRange: () => {}
        }
      };

      spyOn(fakeThis.selection, 'removeAllRanges');
      spyOn(fakeThis.selection, 'addRange');

      const expectedResult = component['restoreSelection'].call(fakeThis);

      expect(expectedResult).toBe(true);
      expect(fakeThis.selection.removeAllRanges).toHaveBeenCalled();
      expect(fakeThis.selection.addRange).toHaveBeenCalledWith(fakeThis.savedSelection);
    });

    it('saveSelectionText: should return null if selection.anchorNode is null', () => {
      const fakeThis = {
        selection: {
          anchorNode: null
        }
      };

      const expectedResult = component['saveSelectionText'].call(fakeThis);

      expect(expectedResult).toBe(null);
    });

    it(`saveSelectionText: should call 'getRangeAt', 'toString' and apply values to 'savedSelection' and 'urlLinkText'
    if 'selection.anchorNode' is different from 'null'`, () => {
      const fakeThis = {
        savedSelection: {},
        urlLinkText: '',
        selection: {
          anchorNode: 'div',
          getRangeAt: () => {
            return { endOffset: 0 };
          },
          toString: () => 'value'
        }
      };

      spyOn(fakeThis.selection, 'getRangeAt').and.callThrough();
      spyOn(fakeThis.selection, 'toString').and.callThrough();

      component['saveSelectionText'].call(fakeThis);

      expect(fakeThis.selection.getRangeAt).toHaveBeenCalled();
      expect(fakeThis.selection.toString).toHaveBeenCalled();
      expect(fakeThis.urlLinkText).toBe('value');
      expect(fakeThis.savedSelection).toEqual({ endOffset: 0 });
    });

    it('checkIfIsEmpty: should return `urlLinkText`value if it contains a value', () => {
      const urlLink = 'link';
      const urlLinkText = 'linkText';

      const expectedValue = component['checkIfIsEmpty'](urlLink, urlLinkText);

      expect(expectedValue).toBe(urlLinkText);
    });

    it('checkIfIsEmpty: should return `urlLink` value if `urlLinkText` is empty', () => {
      const urlLink = 'link';
      const urlLinkText = '';

      const expectedValue = component['checkIfIsEmpty'](urlLink, urlLinkText);

      expect(expectedValue).toBe(urlLink);
    });

    it('checkIfIsEmpty: should return `urlLink` value if `urlLinkText` is undefined', () => {
      const urlLink = 'link';
      const urlLinkText = undefined;

      const expectedValue = component['checkIfIsEmpty'](urlLink, urlLinkText);

      expect(expectedValue).toBe(urlLink);
    });

    it('formReset: should call markAsPristine, markAsUntouched and updateValueAndValidity', () => {
      const fakeControl = {
        markAsPristine: () => {},
        markAsUntouched: () => {},
        updateValueAndValidity: () => {}
      };

      spyOn(fakeControl, 'markAsPristine');
      spyOn(fakeControl, 'markAsUntouched');
      spyOn(fakeControl, 'updateValueAndValidity');

      // component.recoveryModalElement.open();
      component['formReset'](<any>fakeControl);

      expect(fakeControl.markAsPristine).toHaveBeenCalled();
      expect(fakeControl.markAsUntouched).toHaveBeenCalled();
      expect(fakeControl.updateValueAndValidity).toHaveBeenCalled();
    });

    it('prepareModalForLink: should call `saveSelectionText`, `formModelValidate` and `formReset`', fakeAsync(() => {
      spyOn(component, <any>'saveSelectionText');
      spyOn(component, <any>'formReset');
      spyOn(component, <any>'formModelValidate');

      component.savedCursorPosition = ['<a href="">link</a>'];

      component['prepareModalForLink']();
      tick();

      expect(component['saveSelectionText']).toHaveBeenCalled();
      expect(component['formModelValidate']).toHaveBeenCalled();
      expect(component['formReset']).toHaveBeenCalledWith(component.modalLinkForm.control);
    }));

    it('prepareModalForLink: should call `setLinkEditableForModal` and set `isLinkEditing` to true if `isSelectedLink` is `true`', () => {
      spyOn(component, <any>'saveSelectionText');
      spyOn(component, <any>'formReset');
      spyOn(component, <any>'formModelValidate');

      spyOn(component, <any>'setLinkEditableForModal');

      component['isSelectedLink'] = true;

      component.savedCursorPosition = ['<a href="">link</a>'];

      component['prepareModalForLink']();

      expect(component['setLinkEditableForModal']).toHaveBeenCalled();
      expect(component['isLinkEditing']).toBe(true);
    });

    it(`prepareModalForLink: shouldn't call 'setLinkEditableForModal' and set 'isLinkEditing' to true
      if 'isLinkElement' return false`, () => {
      spyOn(component, <any>'saveSelectionText');
      spyOn(component, <any>'formReset');
      spyOn(component, <any>'formModelValidate');

      spyOn(component, <any>'setLinkEditableForModal');

      component['isSelectedLink'] = false;

      component['isLinkEditing'] = false;
      component.savedCursorPosition = ['<a href="">link</a>'];

      component['prepareModalForLink']();

      expect(component['setLinkEditableForModal']).not.toHaveBeenCalled();
      expect(component['isLinkEditing']).toBe(false);
    });

    it(`prepareModalForLink: shouldn't call 'formReset' if 'modalLinkForm' is falsy`, () => {
      spyOn(component, <any>'formReset');

      component.modalLinkForm = undefined;

      component['prepareModalForLink']();

      expect(component['formReset']).not.toHaveBeenCalled();
    });

    it('setLinkEditableForModal: should set `urlLinkText` with text inner element seleted and `url` with href', () => {
      component['linkElement'] = {
        innerText: 'link text',
        getAttribute: () => {}
      };

      spyOn(component['linkElement'], 'getAttribute').and.returnValue('test.com');

      component['setLinkEditableForModal']();

      expect(component.urlLinkText).toBe('link text');
      expect(component.urlLink).toBe('test.com');
    });

    it('toEditLink: should call `parentElement.removeChild`, `toInsertLink` with `urlLink` and `urlLinkText` if `isIE` returns `true`', () => {
      component['linkElement'] = {
        parentNode: { removeChild: () => {} }
      };

      spyOn(UtilsFunction, 'isIE').and.returnValue(true);
      spyOn(component, <any>'toInsertLink');
      spyOn(component['linkElement'].parentNode, 'removeChild');

      const linkText = 'link text';
      const link = 'link.com';

      component.urlLinkText = linkText;
      component.urlLink = link;

      component['toEditLink']();

      expect(component['toInsertLink']).toHaveBeenCalledWith(link, linkText);
      expect(component['linkElement'].parentNode.removeChild).toHaveBeenCalledWith(component['linkElement']);
    });

    it('toEditLink: should call `remove`, `toInsertLink` with `urlLink` and `urlLinkText`', () => {
      component['linkElement'] = {
        remove: () => {}
      };

      spyOn(component['linkElement'], 'remove');
      spyOn(component, <any>'toInsertLink');

      const linkText = 'link text';
      const link = 'link.com';

      component.urlLinkText = linkText;
      component.urlLink = link;

      component['toEditLink']();

      expect(component['toInsertLink']).toHaveBeenCalledWith(link, linkText);
      expect(component['linkElement'].remove).toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    it(`should contain 'po-upload-input' if modalType === 'image'`, () => {
      component.modalType = PoRichTextModalType.Image;

      component.modal.open();
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-upload-input')).toBeTruthy();
    });

    it(`shouldn't contain 'po-upload-input' if modalType !== 'image'`, () => {
      component.modalType = <any>'teste';

      component.modal.open();
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-upload-input')).toBeFalsy();
    });

    it(`should contain 'po-upload-drag-drop' if 'modal.isHidden' is 'false'`, () => {
      component.modalType = PoRichTextModalType.Image;

      component.modal.isHidden = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('po-upload-drag-drop')).toBeTruthy();
    });

    it(`shouldn't contain 'po-upload-drag-drop' if 'modal.isHidden' is 'true'`, () => {
      component.modalType = PoRichTextModalType.Image;

      component.modal.isHidden = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('po-upload-drag-drop')).toBeFalsy();
    });

    it('should include link fields into modal if modalType is `Link`', () => {
      component.modalType = PoRichTextModalType.Link;

      component.modal.open();
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-input')).toBeTruthy();
      expect(nativeElement.querySelector('.po-modal-title').innerHTML).toBe(` ${component.literals.insertLink} `);
    });
  });
});
