import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { of } from 'rxjs';

import * as UtilsFunction from '../../../../utils/util';
import { configureTestSuite } from './../../../../util-test/util-expect.spec';

import { PoRichTextBodyComponent } from './po-rich-text-body.component';
import { PoRichTextService } from '../po-rich-text.service';

describe('PoRichTextBodyComponent:', () => {
  let component: PoRichTextBodyComponent;
  let fixture: ComponentFixture<PoRichTextBodyComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoRichTextBodyComponent],
      providers: [PoRichTextService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoRichTextBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    const fakeSubscription = <any>{ unsubscribe: () => {} };

    it('onInit: should update `bodyElement`', () => {
      const expectedValue = 'on';
      component.ngOnInit();

      expect(component.bodyElement.nativeElement.designMode).toEqual(expectedValue);
    });

    it('onInit: should call `richTextService.getModel.subscribe`, update the model and add listeners to the anchor elements', fakeAsync(() => {
      const response = 'valor inicial';
      spyOn(component['richTextService'], 'getModel').and.returnValue(of(response));
      spyOn(component, <any>'updateValueWithModelValue');
      spyOn(component, <any>'addClickListenerOnAnchorElements');

      component.ngOnInit();

      component['richTextService'].getModel().subscribe(() => {
        expect(component['updateValueWithModelValue']).toHaveBeenCalled();
        expect(component['addClickListenerOnAnchorElements']).toHaveBeenCalled();
      });

      tick();

      expect(component['modelSubscription']).toBeTruthy();
      expect(component.modelValue).toEqual(response);
    }));

    it('ngOnDestroy: should unsubscribe modelSubscription.', () => {
      component['modelSubscription'] = fakeSubscription;

      spyOn(fakeSubscription, <any>'unsubscribe');

      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('ngOnDestroy: should not unsubscribe if modelSubscription is falsy.', () => {
      component['modelSubscription'] = fakeSubscription;

      spyOn(fakeSubscription, <any>'unsubscribe');

      component['modelSubscription'] = undefined;
      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
    });

    describe('executeCommand:', () => {
      it('should call `focus`', () => {
        const spyFocus = spyOn(component.bodyElement.nativeElement, <any>'focus');
        const fakeValue = 'p';

        component.executeCommand(fakeValue);

        expect(spyFocus).toHaveBeenCalled();
      });

      it('should call `execCommand` with string as parameter.', () => {
        const spyExecCommand = spyOn(document, <any>'execCommand');
        const fakeValue = 'p';

        component.executeCommand(fakeValue);

        expect(spyExecCommand).toHaveBeenCalledWith(fakeValue, false, null);
      });

      it('should call `execCommand` with object as parameter.', () => {
        const command = 'foreColor';
        const value = '#000000';
        const spyExecCommand = spyOn(document, <any>'execCommand');
        const fakeValue = { command, value };

        spyOn(component, <any>'handleCommandLink');

        component.executeCommand(fakeValue);

        expect(spyExecCommand).toHaveBeenCalledWith(fakeValue.command, false, fakeValue.value);
        expect(component['handleCommandLink']).not.toHaveBeenCalled();
      });

      it('should call `handleCommandLink` with an object as parameter if command value is `InsertHTML`.', () => {
        const command = 'InsertHTML';
        const value = { urlLink: 'link', urlLinkText: 'link text' };
        const spyExecCommand = spyOn(document, <any>'execCommand');
        const fakeValue = { command, value };

        spyOn(component, <any>'handleCommandLink');

        component.executeCommand(fakeValue);

        expect(component['handleCommandLink']).toHaveBeenCalledWith(command, value.urlLink, value.urlLinkText);
        expect(spyExecCommand).not.toHaveBeenCalled();
      });

      it('should call `updateModel`', () => {
        const fakeValue = 'p';
        spyOn(component, <any>'updateModel');

        component.executeCommand(fakeValue);

        expect(component['updateModel']).toHaveBeenCalled();
      });

      it('should call `value.emit` with `modelValue`', () => {
        component.modelValue = 'teste';
        const fakeValue = 'p';

        spyOn(component.value, 'emit');
        component.executeCommand(fakeValue);

        expect(component.value.emit).toHaveBeenCalledWith(component.modelValue);
      });
    });

    it('linkEditing: should set value to `isLinkEditing`', () => {
      const fakeEvent = true;

      component.linkEditing(fakeEvent);

      expect(component['isLinkEditing']).toEqual(fakeEvent);
    });

    it('onBlur: should emit modelValue change', fakeAsync((): void => {
      const fakeThis = {
        modelValue: 'value',
        valueBeforeChange: '1',
        change: component.change,
        blur: component.blur,
        bodyElement: {
          nativeElement: {
            innerHTML: 'value'
          }
        }
      };

      spyOn(fakeThis.change, 'emit');
      spyOn(fakeThis.blur, 'emit');
      component.onBlur.call(fakeThis);
      tick(250);

      expect(fakeThis.blur.emit).toHaveBeenCalled();
      expect(fakeThis.change.emit).toHaveBeenCalledWith(fakeThis.modelValue);
    }));

    it('onBlur: shouldn`t emit change value doesn`t changed', fakeAsync((): void => {
      const fakeThis = {
        modelValue: 'value',
        valueBeforeChange: 'value',
        change: {
          emit: () => {}
        },
        blur: {
          emit: () => {}
        },
        bodyElement: {
          nativeElement: {
            innerHTML: 'value'
          }
        }
      };

      spyOn(fakeThis.blur, 'emit');
      spyOn(fakeThis.change, 'emit');

      component.onBlur.call(fakeThis);
      tick(250);

      expect(fakeThis.blur.emit).toHaveBeenCalled();
      expect(fakeThis.change.emit).not.toHaveBeenCalled();
    }));

    it('focus: should call `focus` of rich-text', () => {
      spyOn(component.bodyElement.nativeElement, 'focus');

      component.focus();

      expect(component.bodyElement.nativeElement.focus).toHaveBeenCalled();
    });

    it('onClick: should call `emitSelectionCommands`', () => {
      spyOn(component, <any>'emitSelectionCommands');
      component.onClick();

      expect(component['emitSelectionCommands']).toHaveBeenCalled();
    });

    it('onFocus: should set a value to `valueBeforeChange`', () => {
      component.modelValue = 'value';

      component.onFocus();

      expect(component['valueBeforeChange']).toBe('value');
    });

    it('onKeyDown: should call `event.preventDefault` and `shortcutCommand.emit` if keyCode is `75` and ctrlKey is `true`', () => {
      const fakeEvent = {
        keyCode: 75,
        ctrlKey: true,
        preventDefault: () => {}
      };

      spyOn(component.shortcutCommand, 'emit');
      spyOn(fakeEvent, 'preventDefault');
      spyOn(component, <any>'toggleCursorOnLink');

      component.onKeyDown(fakeEvent);

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(component.shortcutCommand.emit).toHaveBeenCalled();
    });

    it('onKeyDown: should call `toggleCursorOnLink` with `event` and `add`', () => {
      const fakeEvent = {
        ctrlKey: false
      };

      spyOn(component, <any>'toggleCursorOnLink');

      component.onKeyDown(fakeEvent);

      expect(component['toggleCursorOnLink']).toHaveBeenCalledWith(fakeEvent, 'add');
    });

    it('onKeyDown: should call `event.preventDefault` and `shortcutCommand.emit` if keyCode is `75` and metaKey is `true`', () => {
      const fakeEvent = {
        keyCode: 75,
        metaKey: true,
        preventDefault: () => {}
      };

      spyOn(component.shortcutCommand, 'emit');
      spyOn(fakeEvent, 'preventDefault');
      spyOn(component, <any>'toggleCursorOnLink');

      component.onKeyDown(fakeEvent);

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(component.shortcutCommand.emit).toHaveBeenCalled();
    });

    it('onKeyDown: shouldn`t call `event.preventDefault` and `shortcutCommand.emit` if keyCode isn`t `75`', () => {
      const fakeEvent = {
        keyCode: 18,
        cmdKey: true,
        preventDefault: () => {}
      };

      spyOn(component.shortcutCommand, 'emit');
      spyOn(fakeEvent, 'preventDefault');
      spyOn(component, <any>'toggleCursorOnLink');

      component.onKeyDown(fakeEvent);

      expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
      expect(component.shortcutCommand.emit).not.toHaveBeenCalled();
    });

    it('onKeyDown: shouldn`t call `event.preventDefault` and `shortcutCommand.emit` if ctrlKey isn`t true', () => {
      const fakeEvent = {
        keyCode: 76,
        ctrlKey: false,
        preventDefault: () => {}
      };

      spyOn(component.shortcutCommand, 'emit');
      spyOn(fakeEvent, 'preventDefault');
      spyOn(component, <any>'toggleCursorOnLink');

      component.onKeyDown(fakeEvent);

      expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
      expect(component.shortcutCommand.emit).not.toHaveBeenCalled();
    });

    it('onKeyUp: should call `toggleCursorOnLink` with `event` and `remove` before `updateModel`', () => {
      spyOn(component, <any>'toggleCursorOnLink');
      const updateModelSpy = spyOn(component, <any>'updateModel');
      spyOn(component, <any>'removeBrElement');
      spyOn(component, <any>'emitSelectionCommands');

      const event = { metaKey: true };

      component.onKeyUp(event);

      expect(component['toggleCursorOnLink']).toHaveBeenCalledBefore(updateModelSpy);
    });

    it('onKeyUp: should call `removeBrElement` and `emitSelectionCommands`', () => {
      spyOn(component, <any>'toggleCursorOnLink');
      spyOn(component, <any>'updateModel');
      spyOn(component, <any>'removeBrElement');
      spyOn(component, <any>'emitSelectionCommands');

      const event = { metaKey: true };

      component.onKeyUp(event);

      expect(component['removeBrElement']).toHaveBeenCalled();
      expect(component['emitSelectionCommands']).toHaveBeenCalled();
    });

    it('onPaste: should call `addClickListenerOnAnchorElements` and `update`', fakeAsync(() => {
      spyOn(component, <any>'addClickListenerOnAnchorElements');
      spyOn(component, <any>'update');

      component.onPaste();
      tick(50);

      expect(component['addClickListenerOnAnchorElements']).toHaveBeenCalled();
      expect(component['update']).toHaveBeenCalledBefore(component['addClickListenerOnAnchorElements']);
    }));

    it('update: should call `updateModel`', fakeAsync(() => {
      spyOn(component, <any>'updateModel');
      spyOn(component, <any>'removeBrElement');
      spyOn(component, <any>'emitSelectionCommands');

      component.update();
      tick(50);

      expect(component['updateModel']).toHaveBeenCalled();
    }));

    it('update: should call `removeBrElement` and `emitSelectionCommands`', fakeAsync(() => {
      spyOn(component, <any>'updateModel');
      spyOn(component, <any>'removeBrElement');
      spyOn(component, <any>'emitSelectionCommands');

      component.update();
      tick(50);

      expect(component['removeBrElement']).toHaveBeenCalled();
      expect(component['emitSelectionCommands']).toHaveBeenCalled();
    }));

    it(`addClickListenerOnAnchorElements: should call 'addEventListener' with 'click' and 'onAnchorClick'
      based on the amount of anchor elements`, () => {
      const spyListener = jasmine.createSpy('addEventListener');

      const anchors = [
        { parentNode: `<a>link1</a>`, addEventListener: spyListener },
        { parentNode: `<a>link2</a>`, addEventListener: spyListener },
        { parentNode: `<a>link3</a>`, addEventListener: spyListener }
      ];

      spyOn(component.bodyElement.nativeElement, 'querySelectorAll').and.returnValue(<any>anchors);

      component['addClickListenerOnAnchorElements']();

      expect(spyListener).toHaveBeenCalledTimes(anchors.length);
      expect(spyListener).toHaveBeenCalledWith('click', component['onAnchorClick']);
    });

    it('emitSelectionCommands: should call `commands.emit`', () => {
      spyOn(component.commands, 'emit');

      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalled();
    });

    it('emitSelectionCommands: should call `isCursorPositionedInALink`', () => {
      spyOn(component, <any>'isCursorPositionedInALink');

      component['emitSelectionCommands']();

      expect(component['isCursorPositionedInALink']).toHaveBeenCalled();
    });

    it('emitSelectionCommands: should call `selectedLink.emit`', () => {
      spyOn(component.selectedLink, 'emit');

      component['emitSelectionCommands']();

      expect(component.selectedLink.emit).toHaveBeenCalled();
    });

    it(`emitSelectionCommands: the object property 'commands'
    should contain 'Createlink' if 'isCursorPositionedInALink' returns 'true'`, () => {
      spyOn(component, <any>'isCursorPositionedInALink').and.returnValue(true);
      spyOn(document, 'queryCommandState').and.returnValue(false);
      spyOn(document, 'queryCommandValue').and.returnValue('rgb');
      spyOn(component, <any>'rgbToHex').and.returnValue('hex');
      spyOn(component.commands, 'emit');

      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalledWith({ commands: ['Createlink'], hexColor: 'hex' });
    });

    it(`emitSelectionCommands: the object property 'commands'
    should contain 'Createlink' if 'isCursorPositionedInALink' returns 'true'`, () => {
      spyOn(component, <any>'isCursorPositionedInALink').and.returnValue(true);
      spyOn(document, 'queryCommandState').and.returnValue(false);
      spyOn(document, 'queryCommandValue').and.returnValue('rgb');
      spyOn(component, <any>'rgbToHex').and.returnValue('hex');
      spyOn(UtilsFunction, 'isIE').and.returnValue(false);
      spyOn(component.commands, 'emit');

      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalledWith({ commands: ['Createlink'], hexColor: 'hex' });
    });

    it(`emitSelectionCommands: should call 'commands.emit' with 'hexColor' undefined if browser is IE`, () => {
      spyOn(component, <any>'isCursorPositionedInALink').and.returnValue(true);
      spyOn(document, 'queryCommandState').and.returnValue(false);
      spyOn(document, 'queryCommandValue').and.returnValue('rgb');
      spyOn(UtilsFunction, 'isIE').and.returnValue(true);
      spyOn(component.commands, 'emit');

      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalledWith({ commands: ['Createlink'], hexColor: undefined });
    });

    it(`emitSelectionCommands: the object property 'commands'
    shouldn't contain 'Createlink' if 'isCursorPositionedInALink' returns 'false'`, () => {
      spyOn(component, <any>'isCursorPositionedInALink').and.returnValue(false);
      spyOn(document, 'queryCommandState').and.returnValue(false);
      spyOn(document, 'queryCommandValue').and.returnValue('rgb');
      spyOn(component, <any>'rgbToHex').and.returnValue('hex');
      spyOn(component.commands, 'emit');

      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalledWith({ commands: [], hexColor: 'hex' });
    });

    it('handleCommandLink: should call `insertHtmlLinkElement` if isIE returns `true`', () => {
      const fakeValue = {
        command: 'InsertHTML',
        urlLink: 'urlLink',
        urlLinkText: 'url link text'
      };

      spyOn(UtilsFunction, 'isIE').and.returnValue(true);
      spyOn(component, <any>'insertHtmlLinkElement');
      spyOn(document, <any>'execCommand');

      component['handleCommandLink'](fakeValue.command, fakeValue.urlLink, fakeValue.urlLinkText);

      expect(document.execCommand).not.toHaveBeenCalled();
      expect(UtilsFunction.isIE).toHaveBeenCalled();
      expect(component['insertHtmlLinkElement']).toHaveBeenCalledWith(fakeValue.urlLink, fakeValue.urlLinkText);
    });

    it('handleCommandLink: should call `makeLinkTag` if isIE returns `false`', () => {
      const fakeValue = {
        command: 'InsertHTML',
        urlLink: 'urlLink',
        urlLinkText: 'url link text'
      };

      spyOn(UtilsFunction, 'isIE').and.returnValue(false);
      spyOn(component, <any>'insertHtmlLinkElement');
      spyOn(document, <any>'execCommand');
      spyOn(component, <any>'makeLinkTag');

      component['handleCommandLink'](fakeValue.command, fakeValue.urlLink, fakeValue.urlLinkText);

      expect(document.execCommand).toHaveBeenCalled();
      expect(UtilsFunction.isIE).toHaveBeenCalled();
      expect(component['insertHtmlLinkElement']).not.toHaveBeenCalledWith(fakeValue.urlLink, fakeValue.urlLinkText);
      expect(component['makeLinkTag']).toHaveBeenCalledWith(fakeValue.urlLink, fakeValue.urlLinkText);
    });

    it('handleCommandLink: should call `document.execCommand` with `command`, `false` and linkValue as params if isIE is `false`', () => {
      const linkValue = `<a class="po-rich-text-link" href="urlLink" target="_blank">url link text</a>`;
      const fakeValue = {
        command: 'InsertHTML',
        urlLink: 'urlLink',
        urlLinkText: 'url link text'
      };

      spyOn(UtilsFunction, 'isIE').and.returnValue(false);
      spyOn(component, <any>'insertHtmlLinkElement');
      spyOn(document, <any>'execCommand');

      component['handleCommandLink'](fakeValue.command, fakeValue.urlLink, fakeValue.urlLinkText);

      expect(document.execCommand).toHaveBeenCalledWith(fakeValue.command, false, linkValue);
      expect(component['insertHtmlLinkElement']).not.toHaveBeenCalled();
    });

    it(`handleCommandLink: the parameter 'linkvalue' should be concatenated with 'urlLink' if 'urlLinkText' is undefined`, () => {
      const linkValue = `<a class="po-rich-text-link" href="urlLink" target="_blank">urlLink</a>`;
      const fakeValue = {
        command: 'InsertHTML',
        urlLink: 'urlLink',
        urlLinkText: undefined
      };

      spyOn(UtilsFunction, 'isIE').and.returnValue(false);
      spyOn(document, <any>'execCommand');

      component['handleCommandLink'](fakeValue.command, fakeValue.urlLink, fakeValue.urlLinkText);

      expect(document.execCommand).toHaveBeenCalledWith(fakeValue.command, false, linkValue);
    });

    it(`handleCommandLink: should add '&nbsp;' at beginning and end of 'linkValue' if 'isFirefox'`, () => {
      const expectedLinkValue = `&nbsp;<a class="po-rich-text-link" href="urlLink" target="_blank">urlLink</a>&nbsp;`;
      const fakeValue = {
        command: 'InsertHTML',
        urlLink: 'urlLink',
        urlLinkText: undefined
      };

      spyOn(UtilsFunction, 'isIE').and.returnValue(false);
      spyOn(UtilsFunction, 'isFirefox').and.returnValue(true);
      spyOn(document, <any>'execCommand');

      component['handleCommandLink'](fakeValue.command, fakeValue.urlLink, fakeValue.urlLinkText);

      expect(document.execCommand).toHaveBeenCalledWith(fakeValue.command, false, expectedLinkValue);
    });

    it('handleCommandLink: should call `addClickListenerOnAnchorElements`', () => {
      spyOn(component, <any>'addClickListenerOnAnchorElements');

      component['handleCommandLink']('CreateLink', 'link text', 'link url');

      expect(component['addClickListenerOnAnchorElements']).toHaveBeenCalled();
    });

    it('insertHtmlLinkElement: should contain `po-rich-text-link`', () => {
      const urlLink = 'urlLink';
      const urlLinkText = 'url link text';

      component.focus();

      component['insertHtmlLinkElement'](urlLink, urlLinkText);

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-rich-text-link')).toBeTruthy();
    });

    it('getTextSelection: should call `document.getSelection`', () => {
      spyOn(document, <any>'getSelection');

      component['getTextSelection']();

      expect(document['getSelection']).toHaveBeenCalled();
    });

    it('getTextSelection: should return `node` and `tagName`', () => {
      const fakeSelection = { anchorNode: { parentNode: { nodeName: 'A' } } };
      const expectedReturn = { node: { nodeName: 'A' }, tagName: 'A' };

      spyOn(document, <any>'getSelection').and.returnValue(<any>fakeSelection);

      const expectedValue = component['getTextSelection']();

      expect(expectedValue).toEqual(<any>expectedReturn);
    });

    it('getTextSelection: should return `node` and `tagName`', () => {
      const fakeSelection = {};
      const expectedReturn = undefined;

      spyOn(document, <any>'getSelection').and.returnValue(<any>fakeSelection);

      const expectedValue = component['getTextSelection']();

      expect(expectedValue).toEqual(expectedReturn);
    });

    it('isCursorPositionedInALink: should return true if `focusNode.parentElement` is a link', () => {
      const fakeSelection = { node: { nodeName: 'A' }, tagName: 'A' };

      spyOn(component, <any>'getTextSelection').and.returnValue(<any>fakeSelection);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(true);
    });

    it('isCursorPositionedInALink: should return true if `anchorNode.parentNode` is a link', () => {
      const fakeSelection = { anchorNode: { parentNode: { nodeName: 'A' } } };

      spyOn(document, 'getSelection').and.returnValue(<any>fakeSelection);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(true);
    });

    it(`isCursorPositionedInALink: should return true if browser is firefox and 'verifyCursorPositionInFirefoxIEEdge' return true`, () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      spyOn(document, 'getSelection').and.returnValue(<any>fakeSelection);
      spyOn(UtilsFunction, 'isFirefox').and.returnValue(true);
      spyOn(component, <any>'verifyCursorPositionInFirefoxIEEdge').and.returnValue(true);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(true);
    });

    it(`isCursorPositionedInALink: should return true if browser is IE and 'verifyCursorPositionInFirefoxIEEdge' return true`, () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      spyOn(document, 'getSelection').and.returnValue(<any>fakeSelection);
      spyOn(UtilsFunction, 'isIEOrEdge').and.returnValue(true);
      spyOn(component, <any>'verifyCursorPositionInFirefoxIEEdge').and.returnValue(true);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(true);
    });

    it(`isCursorPositionedInALink: should return true if not tag A, firefox and IE, but 'isParentNodeAnchor' return true`, () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      spyOn(document, 'getSelection').and.returnValue(<any>fakeSelection);
      spyOn(UtilsFunction, 'isIEOrEdge').and.returnValue(false);
      spyOn(UtilsFunction, 'isFirefox').and.returnValue(false);
      spyOn(component, <any>'isParentNodeAnchor').and.returnValue(true);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(true);
    });

    it(`isCursorPositionedInALink: should return false if not tag A, firefox, IE  and 'isParentNodeAnchor' return false`, () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      spyOn(document, 'getSelection').and.returnValue(<any>fakeSelection);
      spyOn(UtilsFunction, 'isIEOrEdge').and.returnValue(false);
      spyOn(UtilsFunction, 'isFirefox').and.returnValue(false);
      spyOn(component, <any>'isParentNodeAnchor').and.returnValue(false);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(false);
    });

    it(`isCursorPositionedInALink: should return false if browser is firefox and 'verifyCursorPositionInFirefoxIEEdge'
      return false`, () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      spyOn(document, 'getSelection').and.returnValue(<any>fakeSelection);
      spyOn(UtilsFunction, 'isFirefox').and.returnValue(true);
      spyOn(component, <any>'verifyCursorPositionInFirefoxIEEdge').and.returnValue(false);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(false);
    });

    it(`isCursorPositionedInALink: should return false if browser is IE and 'verifyCursorPositionInFirefoxIEEdge'
      return false`, () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      spyOn(document, 'getSelection').and.returnValue(<any>fakeSelection);
      spyOn(UtilsFunction, 'isIEOrEdge').and.returnValue(true);
      spyOn(component, <any>'verifyCursorPositionInFirefoxIEEdge').and.returnValue(false);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(false);
    });

    it('isParentNodeAnchor: should return true if focusNode.parentElement if anchor element', () => {
      const textSelection = { node: { nodeName: 'A' }, tagName: 'A' };

      const isParentNodeAnchor = component['isParentNodeAnchor'](<any>textSelection);

      expect(isParentNodeAnchor).toBe(true);
      expect(component['linkElement']).toEqual(textSelection.node);
    });

    it('isParentNodeAnchor: should return true if parentElement of focusNode.parentElement if anchor element', () => {
      const parentElement = {
        tagName: 'A'
      };

      const textSelection = { node: { parentElement: { nodeName: 'DIV', parentElement } }, tagName: 'DIV' };

      const isParentNodeAnchor = component['isParentNodeAnchor'](<any>textSelection);

      expect(isParentNodeAnchor).toBe(true);
      expect(component['linkElement']).toEqual(textSelection.node.parentElement.parentElement);
    });

    it('isParentNodeAnchor: should return false and set linkElement with undefined', () => {
      const textSelection = { node: { parentElement: { nodeName: '' } }, tagName: 'DIV' };

      const isParentNodeAnchor = component['isParentNodeAnchor'](<any>textSelection);

      expect(isParentNodeAnchor).toBe(false);
      expect(component['linkElement']).toBeUndefined();
    });

    it('isParentNodeAnchor: should return falsy if textSelection is undefined', () => {
      const textSelection = {};

      const isParentNodeAnchor = component['isParentNodeAnchor'](textSelection);

      expect(isParentNodeAnchor).toBeFalsy();
    });

    it('isParentNodeAnchor: should return false and set linkElement with undefined', () => {
      const textSelection = {
        node: {
          nodeName: 'DIV',
          parentNode: { nodeName: 'DIV' },
          tagName: null
        },
        tagName: 'DIV'
      };

      const isParentNodeAnchor = component['isParentNodeAnchor'](<any>textSelection);

      expect(isParentNodeAnchor).toBe(false);
      expect(component['linkElement']).toBeUndefined();
    });

    it('onAnchorClick: should `openExternalLink` with url if key is `ctrlKey`', () => {
      const url = 'http://fakeUrlPo.com';

      const event = {
        ctrlKey: 'true',
        target: {
          attributes: { href: { value: url } },
          classList: { remove: () => {} }
        }
      };

      spyOn(UtilsFunction, 'openExternalLink');

      component['onAnchorClick'](event);

      expect(UtilsFunction.openExternalLink).toHaveBeenCalledWith(url);
    });

    it('onAnchorClick: should remove `po-clickable` if key is `ctrlKey`', () => {
      const url = 'http://fakeUrlPo.com';

      const event = {
        ctrlKey: 'true',
        target: {
          attributes: { href: { value: url } },
          classList: { remove: arg => {} }
        }
      };

      spyOn(UtilsFunction, 'openExternalLink');
      spyOn(event.target.classList, 'remove');

      component['onAnchorClick'](event);

      expect(event.target.classList.remove).toHaveBeenCalledWith('po-clickable');
    });

    it('onAnchorClick: should `openExternalLink` with url if key is `metaKey`', () => {
      const url = 'http://fakeUrlPo.com';

      const event = {
        metaKey: 'true',
        target: {
          attributes: { href: { value: url } },
          classList: { remove: () => {} }
        }
      };

      spyOn(UtilsFunction, 'openExternalLink');

      component['onAnchorClick'](event);

      expect(UtilsFunction.openExternalLink).toHaveBeenCalledWith(url);
    });

    it('onAnchorClick: shouldn`t `openExternalLink` if key not is ctrlKey or metaKey', () => {
      const url = 'http://fakeUrlPo.com';

      const event = {
        enter: 'true',
        target: {
          attributes: { href: { value: url } }
        }
      };

      spyOn(UtilsFunction, 'openExternalLink');

      component['onAnchorClick'](event);

      expect(UtilsFunction.openExternalLink).not.toHaveBeenCalled();
    });

    it('onAnchorClick: should get `href` of `event.path`', () => {
      const url = 'http://test2.com';
      const espectedValue = 'http://fakeUrlPo.com';

      const event = {
        ctrlKey: 'true',
        path: [{ nodeName: 'A', href: espectedValue, classList: { remove: () => {} } }, { nodeName: 'DIV' }],
        target: {
          attributes: { href: { value: url } },
          classList: { remove: () => {} }
        }
      };

      spyOn(UtilsFunction, 'openExternalLink');

      component['onAnchorClick'](event);

      expect(UtilsFunction.openExternalLink).toHaveBeenCalledWith(espectedValue);
    });

    it('removeBrElement: should remove tag `br`', () => {
      const element = document.createElement('br');
      element.classList.add('teste');

      component.bodyElement.nativeElement.appendChild(element);

      component['removeBrElement']();

      expect(nativeElement.querySelector('.teste')).toBeFalsy();
    });

    it('removeBrElement: should`t remove tag `br`', () => {
      const div = document.createElement('div');
      const br = document.createElement('br');

      br.classList.add('teste-br');
      div.classList.add('teste-div');

      component.bodyElement.nativeElement.appendChild(div);
      component.bodyElement.nativeElement.appendChild(br);

      component['removeBrElement']();

      expect(nativeElement.querySelector('.teste-br')).toBeTruthy();
      expect(nativeElement.querySelector('.teste-div')).toBeTruthy();
    });

    describe('rgbToHex:', () => {
      it('should return the hexadecimal value`', () => {
        const rbg = 'rgb(0, 128, 255)';
        const hex = '#0080ff';
        const result = component['rgbToHex'](rbg);

        expect(result).toBe(hex);
      });

      it('should return the hexadecimal value if not separeted by comma`', () => {
        const rbg = 'rgb(110 1 2)';
        const hex = '#6e0102';
        const result = component['rgbToHex'](rbg);

        expect(result).toBe(hex);
      });
    });

    it('toggleCursorOnLink: shouldn`t call remove if focusNode is undefined', () => {
      const event = { key: 'Control' };

      const removeSpy = jasmine.createSpy('remove');

      spyOn(document, 'getSelection').and.returnValue(<any>{
        focusNode: undefined
      });

      component['toggleCursorOnLink'](event, 'remove');

      expect(removeSpy).not.toHaveBeenCalled();
    });

    it('toggleCursorOnLink: should call remove of classList if `action` is remove, `element` is `anchor` and `key` is `Control`', () => {
      const event = { key: 'Control' };

      const removeSpy = jasmine.createSpy('remove');
      const containsSpy = jasmine.createSpy('contains').and.returnValue(true);

      spyOn(document, 'getSelection').and.returnValue(<any>{
        focusNode: {
          parentNode: {
            nodeName: 'A',
            classList: {
              remove: removeSpy,
              contains: containsSpy
            }
          }
        }
      });

      component['toggleCursorOnLink'](event, 'remove');

      expect(removeSpy).toHaveBeenCalledWith('po-clickable');
    });

    it('toggleCursorOnLink: should call add of classList if `action` is add, `element` is `anchor` and `key` is `Control`', () => {
      const event = { key: 'Control' };

      const addSpy = jasmine.createSpy('add');
      const isCursorPositionedInALinkSpy = spyOn(component, <any>'isCursorPositionedInALink').and.returnValue(true);

      spyOn(document, 'getSelection').and.returnValue(<any>{
        focusNode: {
          parentNode: {
            nodeName: 'A',
            classList: {
              add: addSpy
            }
          }
        }
      });

      component['toggleCursorOnLink'](event, 'add');

      expect(addSpy).toHaveBeenCalledWith('po-clickable');
      expect(isCursorPositionedInALinkSpy).toHaveBeenCalled();
    });

    it('toggleCursorOnLink: should call add of classList if `action` is add, `element` is `anchor` and `key` is `Meta`', () => {
      const event = { key: 'Meta' };

      const addSpy = jasmine.createSpy('add');
      const isCursorPositionedInALinkSpy = spyOn(component, <any>'isCursorPositionedInALink').and.returnValue(true);

      spyOn(document, 'getSelection').and.returnValue(<any>{
        focusNode: {
          parentNode: {
            nodeName: 'A',
            classList: {
              add: addSpy
            }
          }
        }
      });

      component['toggleCursorOnLink'](event, 'add');

      expect(addSpy).toHaveBeenCalledWith('po-clickable');
      expect(isCursorPositionedInALinkSpy).toHaveBeenCalled();
    });

    it('toggleCursorOnLink: should call add of classList if `action` is add, `element` is `anchor` and `key` is `Control`', () => {
      const event = { key: 'Control' };

      const addSpy = jasmine.createSpy('add');
      const isCursorPositionedInALinkSpy = spyOn(component, <any>'isCursorPositionedInALink').and.returnValue(true);

      spyOn(document, 'getSelection').and.returnValue(<any>{
        focusNode: {
          parentNode: {
            nodeName: 'A',
            classList: {
              add: addSpy
            }
          }
        }
      });

      component['toggleCursorOnLink'](event, 'add');

      expect(addSpy).toHaveBeenCalledWith('po-clickable');
      expect(isCursorPositionedInALinkSpy).toHaveBeenCalled();
    });

    it(`toggleCursorOnLink: shouldn't call add and call remove of classList if 'element' not is 'anchor'`, () => {
      const event = { key: 'Control' };

      const addSpy = jasmine.createSpy('add');
      const isCursorPositionedInALinkSpy = spyOn(component, <any>'isCursorPositionedInALink').and.returnValue(false);
      const removeSpy = jasmine.createSpy('remove');
      const containsSpy = jasmine.createSpy('contains').and.returnValue(true);

      spyOn(document, 'getSelection').and.returnValue(<any>{
        focusNode: {
          parentNode: {
            nodeName: 'DIV',
            classList: {
              add: addSpy,
              remove: removeSpy,
              contains: containsSpy
            }
          }
        }
      });

      component['toggleCursorOnLink'](event, 'add');

      expect(removeSpy).toHaveBeenCalled();
      expect(isCursorPositionedInALinkSpy).toHaveBeenCalled();
      expect(addSpy).not.toHaveBeenCalled();
    });

    it(`toggleCursorOnLink: shouldn't call add and call remove of classList if 'isClickable'`, () => {
      const event = { key: 'Control' };

      const addSpy = jasmine.createSpy('add');
      const isCursorPositionedInALinkSpy = spyOn(component, <any>'isCursorPositionedInALink').and.returnValue(false);
      const removeSpy = jasmine.createSpy('remove');
      const containsSpy = jasmine.createSpy('contains').and.returnValue(false);

      spyOn(document, 'getSelection').and.returnValue(<any>{
        focusNode: {
          parentNode: {
            nodeName: 'DIV',
            classList: {
              add: addSpy,
              remove: removeSpy,
              contains: containsSpy
            }
          }
        }
      });

      component['toggleCursorOnLink'](event, 'add');

      expect(removeSpy).not.toHaveBeenCalled();
      expect(isCursorPositionedInALinkSpy).toHaveBeenCalled();
      expect(addSpy).not.toHaveBeenCalled();
    });

    it('updateModel: should update `modelValue`', () => {
      component.bodyElement.nativeElement.innerHTML = 'teste';
      component['updateModel']();
      fixture.detectChanges();
      expect(component.modelValue).toContain('teste');
    });

    it('updateModel: should call `value.emit` with `modelValue`', () => {
      component.modelValue = 'teste';

      spyOn(component.value, 'emit');
      component['updateModel']();

      expect(component.value.emit).toHaveBeenCalledWith(component.modelValue);
    });

    it('updateValueWithModelValue: should call `bodyElement.nativeElement.insertAdjacentHTML`', () => {
      component.modelValue = 'teste';

      spyOn(component.bodyElement.nativeElement, 'insertAdjacentHTML');
      component['updateValueWithModelValue']();

      expect(component.bodyElement.nativeElement.insertAdjacentHTML).toHaveBeenCalledWith(
        'afterbegin',
        component.modelValue
      );
    });

    it('updateValueWithModelValue: shouldn`t call `bodyElement.nativeElement.insertAdjacentHTML`', () => {
      component.modelValue = undefined;

      spyOn(component.bodyElement.nativeElement, 'insertAdjacentHTML');
      component['updateValueWithModelValue']();

      expect(component.bodyElement.nativeElement.insertAdjacentHTML).not.toHaveBeenCalled();
    });

    it('verifyCursorPositionInFirefoxIEEdge: should return true if nodeName is an A tag', () => {
      const element = { nodeName: 'A' };
      const textSelection = {
        focusNode: { nodeName: 'A' }
      };

      spyOn(document, 'getSelection').and.returnValue(<any>textSelection);

      expect(component['verifyCursorPositionInFirefoxIEEdge']()).toBe(true);
      expect(component['linkElement']).toEqual(element);
    });

    it('verifyCursorPositionInFirefoxIEEdge: should return true if childNodes of fragmentDocument is an A tag', () => {
      const element = { element: 'test', nodeName: 'A' };
      const textSelection = {
        getRangeAt: () => {
          return {
            cloneContents: () => {
              return { childNodes: [{ element: 'test', nodeName: 'A' }] };
            }
          };
        }
      };

      spyOn(document, 'getSelection').and.returnValue(<any>textSelection);

      expect(component['verifyCursorPositionInFirefoxIEEdge']()).toBe(true);
      expect(component['linkElement']).toEqual(element);
    });

    it('verifyCursorPositionInFirefoxIEEdge: should return true if firstElementChild of fragmentDocument is an A tag', () => {
      const element = { element: 'test', nodeName: 'A' };
      const textSelection = {
        getRangeAt: () => {
          return {
            cloneContents: () => {
              return {
                firstElementChild: { element: 'test', nodeName: 'A' },
                childNodes: []
              };
            }
          };
        }
      };

      spyOn(document, 'getSelection').and.returnValue(<any>textSelection);

      expect(component['verifyCursorPositionInFirefoxIEEdge']()).toBe(true);
      expect(component['linkElement']).toEqual(element);
    });

    it(`verifyCursorPositionInFirefoxIEEdge: should return false if focusNode and firstElementChild of fragmentDocument
      are not an A tag and childNodes is undefined `, () => {
      const textSelection = {
        getRangeAt: () => {
          return {
            cloneContents: () => {
              return {
                firstElementChild: { element: 'test', nodeName: 'DIV' },
                childNodes: []
              };
            }
          };
        }
      };

      spyOn(document, 'getSelection').and.returnValue(<any>textSelection);

      expect(component['verifyCursorPositionInFirefoxIEEdge']()).toBe(false);
      expect(component['linkElement']).toBe(undefined);
    });

    it(`verifyCursorPositionInFirefoxIEEdge: should return false if focusNode and childNodes of fragmentDocument
      are not an A tag and firstElementChild is undefined`, () => {
      const textSelection = {
        getRangeAt: () => {
          return {
            cloneContents: () => {
              return {
                firstElementChild: undefined,
                childNodes: [{ element: 'test', nodeName: 'DIV' }]
              };
            }
          };
        }
      };

      spyOn(document, 'getSelection').and.returnValue(<any>textSelection);

      expect(component['verifyCursorPositionInFirefoxIEEdge']()).toBe(false);
      expect(component['linkElement']).toBe(undefined);
    });
  });

  describe('Templates:', () => {
    it('should contain `po-rich-text-body`', () => {
      expect(nativeElement.querySelector('.po-rich-text-body')).toBeTruthy();
    });
  });
});
