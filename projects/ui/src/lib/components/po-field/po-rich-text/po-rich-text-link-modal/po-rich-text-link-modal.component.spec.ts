import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { configureTestSuite } from '../../../../util-test/util-expect.spec';

import * as UtilsFunction from '../../../../utils/util';
import { PoFieldModule } from '../../po-field.module';
import { PoButtonGroupModule } from '../../../po-button-group';
import { PoModalModule } from '../../../po-modal/po-modal.module';
import { PoRichTextLinkModalComponent } from './po-rich-text-link-modal.component';

describe('PoRichTextLinkModalComponent', () => {
  let component: PoRichTextLinkModalComponent;
  let fixture: ComponentFixture<PoRichTextLinkModalComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoButtonGroupModule, PoModalModule, PoFieldModule],
      declarations: []
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoRichTextLinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
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

    it('modalConfirmAction: should call `toInsertLink` if `isLinkEditing` is false', () => {
      spyOn(component, <any>'toInsertLink');
      spyOn(component, <any>'toEditLink');

      component['isLinkEditing'] = false;

      component.modalConfirmAction.action();

      expect(component['toEditLink']).not.toHaveBeenCalled();
      expect(component['toInsertLink']).toHaveBeenCalled();
    });

    it('modalConfirmAction: should call `toEditLink` if `isLinkEditing` is true', () => {
      spyOn(component, <any>'toInsertLink');
      spyOn(component, <any>'toEditLink');

      component['isLinkEditing'] = true;

      component.modalConfirmAction.action();

      expect(component['toInsertLink']).not.toHaveBeenCalled();
      expect(component['toEditLink']).toHaveBeenCalled();
    });
  });

  describe('Methods:', () => {
    it('linkConfirmAction: should return `insertLink` if `isLinkEditing` is `false`', () => {
      component['isLinkEditing'] = false;
      expect(component.linkConfirmAction()).toBe(component.literals.insertLink);
    });

    it('linkConfirmAction: should return `editLink` if `isLinkEditing` is `true`', () => {
      component['isLinkEditing'] = true;
      expect(component.linkConfirmAction()).toBe(component.literals.editLink);
    });

    it(`selectedLink: should set 'isSelectedLink' and 'linkElement'.`, () => {
      const elementRef = undefined;

      component['isSelectedLink'] = undefined;
      component['linkElement'] = undefined;

      const fakeEvent = {
        isSelectedLink: false,
        linkElement: undefined
      };

      component['selectedLink'](elementRef);

      expect(component['isSelectedLink']).toEqual(fakeEvent.isSelectedLink);
      expect(component['linkElement']).toEqual(fakeEvent.linkElement);
    });

    it(`openModal: should set modalLinkAction.label and call 'modal.open', prepareModalForLink and 'saveCursorPosition'`, () => {
      const literal = 'link confirm action';
      const selectedLinkElement = undefined;

      spyOn(component, 'linkConfirmAction').and.returnValue(literal);
      spyOn(component.modal, 'open');
      spyOn(component, <any>'saveCursorPosition');
      spyOn(component, <any>'prepareModalForLink');

      component.openModal(selectedLinkElement);

      expect(component.modalConfirmAction.label).toBe(literal);
      expect(component.modal.open).toHaveBeenCalled();
      expect(component['saveCursorPosition']).toHaveBeenCalled();
      expect(component['prepareModalForLink']).toHaveBeenCalledWith(selectedLinkElement);
    });

    it(`cleanUpFields: should apply values to 'urlImage', 'urlLinkText', 'isLinkEditing', 'isSelectedLink' and 'linkElement'`, () => {
      component['cleanUpFields']();

      expect(component.urlLink).toBe(undefined);
      expect(component.urlLinkText).toBe(undefined);
      expect(component['isLinkEditing']).toBe(false);
      expect(component['isSelectedLink']).toBe(false);
      expect(component['linkElement']).toBe(undefined);
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
        modalConfirmAction: {
          disabled: undefined
        },
        modalLinkForm: {
          invalid: true
        }
      };

      component.formModelValidate.call(fakeThis);

      expect(fakeThis.modalConfirmAction.disabled).toBeTruthy();
    });

    it('formModelValidate: should apply `false` to `modalLinkForm.disabled` if `modalLinkForm.invalid` is `false`', () => {
      const fakeThis = {
        urlLink: null,
        modalConfirmAction: {
          disabled: undefined
        },
        modalLinkForm: {
          invalid: false
        }
      };

      component.formModelValidate.call(fakeThis);

      expect(fakeThis.modalConfirmAction.disabled).toBeFalsy();
    });

    it('formModelValidate: should apply `false` to `modalLinkForm.disabled` if `modalLinkForm` is undefined', () => {
      const fakeThis = {
        urlLink: null,
        modalConfirmAction: {
          disabled: undefined
        },
        modalLinkForm: undefined
      };

      component.formModelValidate.call(fakeThis);

      expect(fakeThis.modalConfirmAction.disabled).toBeFalsy();
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
          addRange: arg => {}
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

    it('prepareModalForLink: should call `saveSelectionText`, `selectedLink`, `formModelValidate` and `formReset`', fakeAsync(() => {
      const selectedLinkElement = undefined;

      spyOn(component, <any>'saveSelectionText');
      spyOn(component, <any>'formReset');
      spyOn(component, <any>'formModelValidate');
      spyOn(component, <any>'selectedLink');

      component.savedCursorPosition = ['<a href="">link</a>'];

      component['prepareModalForLink'](selectedLinkElement);
      tick();

      expect(component['saveSelectionText']).toHaveBeenCalled();
      expect(component['selectedLink']).toHaveBeenCalled();
      expect(component['formModelValidate']).toHaveBeenCalled();
      expect(component['formReset']).toHaveBeenCalledWith(component.modalLinkForm.control);
    }));

    it('prepareModalForLink: should call `setLinkEditableForModal` and set `isLinkEditing` to true if `isSelectedLink` is `true`', () => {
      const selectedLinkElement = undefined;

      spyOn(component, <any>'saveSelectionText');
      spyOn(component, <any>'formReset');
      spyOn(component, <any>'formModelValidate');
      spyOn(component, <any>'selectedLink');

      spyOn(component, <any>'setLinkEditableForModal');

      component['isSelectedLink'] = true;

      component.savedCursorPosition = ['<a href="">link</a>'];

      component['prepareModalForLink'](selectedLinkElement);

      expect(component['setLinkEditableForModal']).toHaveBeenCalled();
      expect(component['isLinkEditing']).toBe(true);
    });

    it(`prepareModalForLink: shouldn't call 'setLinkEditableForModal' and set 'isLinkEditing' to true
      if 'isLinkElement' return false`, () => {
      const selectedLinkElement = undefined;

      spyOn(component, <any>'saveSelectionText');
      spyOn(component, <any>'formReset');
      spyOn(component, <any>'formModelValidate');

      spyOn(component, <any>'setLinkEditableForModal');

      component['isSelectedLink'] = false;

      component['isLinkEditing'] = false;
      component.savedCursorPosition = ['<a href="">link</a>'];

      component['prepareModalForLink'](selectedLinkElement);

      expect(component['setLinkEditableForModal']).not.toHaveBeenCalled();
      expect(component['isLinkEditing']).toBe(false);
    });

    it(`prepareModalForLink: shouldn't call 'formReset' if 'modalLinkForm' is falsy`, () => {
      const selectedLinkElement = undefined;

      spyOn(component, <any>'formReset');

      component.modalLinkForm = undefined;

      component['prepareModalForLink'](selectedLinkElement);

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
});
