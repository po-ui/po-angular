import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { of } from 'rxjs';

import { PoUtils as UtilsFunction } from '../../../../utils/util';

import { PoRichTextBodyComponent } from './po-rich-text-body.component';
import { PoRichTextService } from '../po-rich-text.service';

describe('PoRichTextBodyComponent:', () => {
  let component: PoRichTextBodyComponent;
  let fixture: ComponentFixture<PoRichTextBodyComponent>;
  let nativeElement: any;

  beforeEach(async () => {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    await TestBed.configureTestingModule({
      declarations: [PoRichTextBodyComponent],
      providers: [PoRichTextService]
    }).compileComponents();

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
      vi.spyOn(component['richTextService'] as any, 'getModel').mockReturnValue(of(response));
      vi.spyOn(component as any, 'updateValueWithModelValue');
      vi.spyOn(component as any, 'addClickListenerOnAnchorElements');

      component.ngOnInit();

      component['richTextService'].getModel().subscribe(() => {
        expect(component['updateValueWithModelValue']).toHaveBeenCalled();
        expect(component['addClickListenerOnAnchorElements']).toHaveBeenCalled();
      });

      tick();

      expect(component['modelSubscription']).toBeTruthy();
      expect(component.modelValue).toEqual(response);
    }));

    describe('ngOnChanges:', () => {
      it('should call `checkScrollState` when `loading` changes', fakeAsync(() => {
        vi.spyOn(component as any, 'checkScrollState');

        component.ngOnChanges({
          loading: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false }
        });
        tick();

        expect(component['checkScrollState']).toHaveBeenCalled();
      }));

      it('should not call `checkScrollState` when `loading` does not change', fakeAsync(() => {
        vi.spyOn(component as any, 'checkScrollState');

        component.ngOnChanges({});
        tick();

        expect(component['checkScrollState']).not.toHaveBeenCalled();
      }));
    });

    it('should unsubscribe modelSubscription', () => {
      component['modelSubscription'] = <any>{ unsubscribe: vi.fn() };
      component['resizeObserver'] = <any>{ disconnect: vi.fn() };

      component.ngOnDestroy();

      expect(component['modelSubscription'].unsubscribe).toHaveBeenCalled();
    });

    it('ngOnDestroy: should not unsubscribe if modelSubscription is falsy.', () => {
      component['modelSubscription'] = fakeSubscription;

      vi.spyOn(fakeSubscription as any, 'unsubscribe');

      component['modelSubscription'] = undefined;
      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
    });

    it('ngOnDestroy: should disconnect resizeObserver if it exists', () => {
      const disconnectSpy = vi.fn();
      component['resizeObserver'] = { disconnect: disconnectSpy } as any;

      component.ngOnDestroy();

      expect(disconnectSpy).toHaveBeenCalled();
    });

    it('ngOnDestroy: should not disconnect resizeObserver if it does not exist', () => {
      component['resizeObserver'] = undefined;

      expect(() => component.ngOnDestroy()).not.toThrow();
    });

    describe('executeCommand:', () => {
      it('should call `focus`', () => {
        const spyFocus = vi.spyOn(component.bodyElement.nativeElement, 'focus');
        const fakeValue = 'p';

        component.executeCommand(fakeValue);

        expect(spyFocus).toHaveBeenCalled();
      });

      it('should call `execCommand` with string as parameter.', () => {
        const spyExecCommand = vi.spyOn(document as any, 'execCommand');
        const fakeValue = 'p';

        component.executeCommand(fakeValue);

        expect(spyExecCommand).toHaveBeenCalledWith(fakeValue, false, null);
      });

      it('should call `execCommand` with object as parameter.', () => {
        const command = 'foreColor';
        const value = '#000000';
        const spyExecCommand = vi.spyOn(document as any, 'execCommand');
        const fakeValue = { command, value };

        vi.spyOn(component as any, 'handleCommandLink');

        component.executeCommand(fakeValue);

        expect(spyExecCommand).toHaveBeenCalledWith(fakeValue.command, false, fakeValue.value);
        expect(component['handleCommandLink']).not.toHaveBeenCalled();
      });

      it('should call `handleCommandLink` with an object as parameter if command value is `InsertHTML`.', () => {
        const command = 'InsertHTML';
        const value = { urlLink: 'link', urlLinkText: 'link text' };
        const spyExecCommand = vi.spyOn(document as any, 'execCommand');
        const fakeValue = { command, value };

        vi.spyOn(component as any, 'handleCommandLink');

        component.executeCommand(fakeValue);

        expect(component['handleCommandLink']).toHaveBeenCalledWith(command, value.urlLink, value.urlLinkText);
        expect(spyExecCommand).not.toHaveBeenCalled();
      });

      it('should call `updateModel`', () => {
        const fakeValue = 'p';
        vi.spyOn(component as any, 'updateModel');

        component.executeCommand(fakeValue);

        expect(component['updateModel']).toHaveBeenCalled();
      });

      it('should call `value.emit` with `modelValue`', () => {
        component.modelValue = 'teste';
        const fakeValue = 'p';

        vi.spyOn(component.value as any, 'emit');
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

      vi.spyOn(fakeThis.change as any, 'emit');
      vi.spyOn(fakeThis.blur as any, 'emit');
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

      vi.spyOn(fakeThis.blur as any, 'emit');
      vi.spyOn(fakeThis.change as any, 'emit');

      component.onBlur.call(fakeThis);
      tick(250);

      expect(fakeThis.blur.emit).toHaveBeenCalled();
      expect(fakeThis.change.emit).not.toHaveBeenCalled();
    }));

    it('focus: should call `focus` of rich-text', () => {
      vi.spyOn(component.bodyElement.nativeElement, 'focus');

      component.focus();

      expect(component.bodyElement.nativeElement.focus).toHaveBeenCalled();
    });

    it('onClick: should call `emitSelectionCommands`', () => {
      vi.spyOn(component as any, 'emitSelectionCommands');
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

      vi.spyOn(component.shortcutCommand as any, 'emit');
      vi.spyOn(fakeEvent as any, 'preventDefault');
      vi.spyOn(component as any, 'toggleCursorOnLink');

      component.onKeyDown(fakeEvent);

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(component.shortcutCommand.emit).toHaveBeenCalled();
    });

    it('onKeyDown: should call `toggleCursorOnLink` with `event` and `add`', () => {
      const fakeEvent = {
        ctrlKey: false
      };

      vi.spyOn(component as any, 'toggleCursorOnLink');

      component.onKeyDown(fakeEvent);

      expect(component['toggleCursorOnLink']).toHaveBeenCalledWith(fakeEvent, 'add');
    });

    it('onKeyDown: should call `event.preventDefault` and `shortcutCommand.emit` if keyCode is `75` and metaKey is `true`', () => {
      const fakeEvent = {
        keyCode: 75,
        metaKey: true,
        preventDefault: () => {}
      };

      vi.spyOn(component.shortcutCommand as any, 'emit');
      vi.spyOn(fakeEvent as any, 'preventDefault');
      vi.spyOn(component as any, 'toggleCursorOnLink');

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

      vi.spyOn(component.shortcutCommand as any, 'emit');
      vi.spyOn(fakeEvent as any, 'preventDefault');
      vi.spyOn(component as any, 'toggleCursorOnLink');

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

      vi.spyOn(component.shortcutCommand as any, 'emit');
      vi.spyOn(fakeEvent as any, 'preventDefault');
      vi.spyOn(component as any, 'toggleCursorOnLink');

      component.onKeyDown(fakeEvent);

      expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
      expect(component.shortcutCommand.emit).not.toHaveBeenCalled();
    });

    it('onKeyDown: should emit event when field is focused', () => {
      const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      component.bodyElement = {
        nativeElement: {
          focus: () => {}
        }
      };

      vi.spyOn(component.keydown as any, 'emit');
      vi.spyOn(document, 'activeElement', 'get').mockReturnValue(component.bodyElement.nativeElement);

      component.onKeyDown(fakeEvent);

      expect(component.keydown.emit).toHaveBeenCalledWith(fakeEvent);
    });

    it('onKeyDown: should not emit event when field is not focused', () => {
      const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      component.bodyElement = {
        nativeElement: {
          focus: () => {}
        }
      };

      vi.spyOn(component.keydown as any, 'emit');
      vi.spyOn(document, 'activeElement', 'get').mockReturnValue(document.createElement('div'));
      component.onKeyDown(fakeEvent);

      expect(component.keydown.emit).not.toHaveBeenCalled();
    });

    it('onKeyUp: should call `toggleCursorOnLink` with `event` and `remove` before `updateModel`', () => {
      vi.spyOn(component as any, 'toggleCursorOnLink');
      const updateModelSpy = vi.spyOn(component as any, 'updateModel');
      vi.spyOn(component as any, 'removeBrElement');
      vi.spyOn(component as any, 'emitSelectionCommands');

      const event = { metaKey: true };

      component.onKeyUp(event);

      expect(Math.min(...vi.mocked(component['toggleCursorOnLink']).mock.invocationCallOrder)).toBeLessThan(
        Math.min(...vi.mocked(updateModelSpy).mock.invocationCallOrder)
      );
    });

    it('onKeyUp: should call `removeBrElement` and `emitSelectionCommands`', () => {
      vi.spyOn(component as any, 'toggleCursorOnLink');
      vi.spyOn(component as any, 'updateModel');
      vi.spyOn(component as any, 'removeBrElement');
      vi.spyOn(component as any, 'emitSelectionCommands');

      const event = { metaKey: true };

      component.onKeyUp(event);

      expect(component['removeBrElement']).toHaveBeenCalled();
      expect(component['emitSelectionCommands']).toHaveBeenCalled();
    });

    it('onPaste: should call `addClickListenerOnAnchorElements` and `update`', fakeAsync(() => {
      vi.spyOn(component as any, 'addClickListenerOnAnchorElements');
      vi.spyOn(component as any, 'update');

      component.onPaste();
      tick(50);

      expect(component['addClickListenerOnAnchorElements']).toHaveBeenCalled();
      expect(Math.min(...vi.mocked(component['update']).mock.invocationCallOrder)).toBeLessThan(
        Math.min(...vi.mocked(component['addClickListenerOnAnchorElements']).mock.invocationCallOrder)
      );
    }));

    it('update: should call `updateModel`', fakeAsync(() => {
      vi.spyOn(component as any, 'updateModel');
      vi.spyOn(component as any, 'removeBrElement');
      vi.spyOn(component as any, 'emitSelectionCommands');

      component.update();
      tick(50);

      expect(component['updateModel']).toHaveBeenCalled();
    }));

    it('update: should call `removeBrElement` and `emitSelectionCommands`', fakeAsync(() => {
      vi.spyOn(component as any, 'updateModel');
      vi.spyOn(component as any, 'removeBrElement');
      vi.spyOn(component as any, 'emitSelectionCommands');

      component.update();
      tick(50);

      expect(component['removeBrElement']).toHaveBeenCalled();
      expect(component['emitSelectionCommands']).toHaveBeenCalled();
    }));

    it(`addClickListenerOnAnchorElements: should call 'addEventListener' with 'click' and 'onAnchorClick'
      based on the amount of anchor elements`, () => {
      const spyListener = vi.fn();

      const anchors = [
        { parentNode: `<a>link1</a>`, addEventListener: spyListener },
        { parentNode: `<a>link2</a>`, addEventListener: spyListener },
        { parentNode: `<a>link3</a>`, addEventListener: spyListener }
      ];

      vi.spyOn(component.bodyElement.nativeElement, 'querySelectorAll').mockReturnValue(<any>anchors);

      component['addClickListenerOnAnchorElements']();

      expect(spyListener).toHaveBeenCalledTimes(anchors.length);
      expect(spyListener).toHaveBeenCalledWith('click', component['onAnchorClick']);
    });

    it('emitSelectionCommands: should call `commands.emit`', () => {
      vi.spyOn(component.commands as any, 'emit');

      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalled();
    });

    it('emitSelectionCommands: should call `isCursorPositionedInALink`', () => {
      vi.spyOn(component as any, 'isCursorPositionedInALink');

      component['emitSelectionCommands']();

      expect(component['isCursorPositionedInALink']).toHaveBeenCalled();
    });

    it('emitSelectionCommands: should call `selectedLink.emit`', () => {
      vi.spyOn(component.selectedLink as any, 'emit');

      component['emitSelectionCommands']();

      expect(component.selectedLink.emit).toHaveBeenCalled();
    });

    it(`emitSelectionCommands: the object property 'commands'
    should contain 'Createlink' if 'isCursorPositionedInALink' returns 'true'`, () => {
      vi.spyOn(component as any, 'isCursorPositionedInALink').mockReturnValue(true);
      vi.spyOn(document as any, 'queryCommandState').mockReturnValue(false);
      vi.spyOn(document as any, 'queryCommandValue').mockReturnValue('rgb');
      vi.spyOn(component as any, 'rgbToHex').mockReturnValue('hex');
      vi.spyOn(component.commands as any, 'emit');

      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalledWith({ commands: ['Createlink'], hexColor: 'hex' });
    });

    it(`emitSelectionCommands: the object property 'commands'
    should contain 'Createlink' if 'isCursorPositionedInALink' returns 'true'`, () => {
      vi.spyOn(component as any, 'isCursorPositionedInALink').mockReturnValue(true);
      vi.spyOn(document as any, 'queryCommandState').mockReturnValue(false);
      vi.spyOn(document as any, 'queryCommandValue').mockReturnValue('rgb');
      vi.spyOn(component as any, 'rgbToHex').mockReturnValue('hex');
      vi.spyOn(UtilsFunction as any, 'isIE').mockReturnValue(false);
      vi.spyOn(component.commands as any, 'emit');

      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalledWith({ commands: ['Createlink'], hexColor: 'hex' });
    });

    it(`emitSelectionCommands: should call 'commands.emit' with 'hexColor' undefined if browser is IE`, () => {
      vi.spyOn(component as any, 'isCursorPositionedInALink').mockReturnValue(true);
      vi.spyOn(document as any, 'queryCommandState').mockReturnValue(false);
      vi.spyOn(document as any, 'queryCommandValue').mockReturnValue('rgb');
      vi.spyOn(UtilsFunction as any, 'isIE').mockReturnValue(true);
      vi.spyOn(component.commands as any, 'emit');

      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalledWith({ commands: ['Createlink'], hexColor: undefined });
    });

    it(`emitSelectionCommands: the object property 'commands'
    shouldn't contain 'Createlink' if 'isCursorPositionedInALink' returns 'false'`, () => {
      vi.spyOn(component as any, 'isCursorPositionedInALink').mockReturnValue(false);
      vi.spyOn(document as any, 'queryCommandState').mockReturnValue(false);
      vi.spyOn(document as any, 'queryCommandValue').mockReturnValue('rgb');
      vi.spyOn(component as any, 'rgbToHex').mockReturnValue('hex');
      vi.spyOn(component.commands as any, 'emit');

      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalledWith({ commands: [], hexColor: 'hex' });
    });

    it('handleCommandLink: should call `insertHtmlLinkElement` if isIE returns `true`', () => {
      const fakeValue = {
        command: 'InsertHTML',
        urlLink: 'urlLink',
        urlLinkText: 'url link text'
      };

      vi.spyOn(UtilsFunction as any, 'isIE').mockReturnValue(true);
      vi.spyOn(component as any, 'insertHtmlLinkElement');
      vi.spyOn(document as any, 'execCommand');

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

      vi.spyOn(UtilsFunction as any, 'isIE').mockReturnValue(false);
      vi.spyOn(component as any, 'insertHtmlLinkElement');
      vi.spyOn(document as any, 'execCommand');
      vi.spyOn(component as any, 'makeLinkTag');

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

      vi.spyOn(UtilsFunction as any, 'isIE').mockReturnValue(false);
      vi.spyOn(component as any, 'insertHtmlLinkElement');
      vi.spyOn(document as any, 'execCommand');

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

      vi.spyOn(UtilsFunction as any, 'isIE').mockReturnValue(false);
      vi.spyOn(document as any, 'execCommand');

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

      vi.spyOn(UtilsFunction as any, 'isIE').mockReturnValue(false);
      vi.spyOn(UtilsFunction as any, 'isFirefox').mockReturnValue(true);
      vi.spyOn(document as any, 'execCommand');

      component['handleCommandLink'](fakeValue.command, fakeValue.urlLink, fakeValue.urlLinkText);

      expect(document.execCommand).toHaveBeenCalledWith(fakeValue.command, false, expectedLinkValue);
    });

    it('handleCommandLink: should call `addClickListenerOnAnchorElements`', () => {
      vi.spyOn(component as any, 'addClickListenerOnAnchorElements');

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
      vi.spyOn(document as any, 'getSelection');

      component['getTextSelection']();

      expect(document['getSelection']).toHaveBeenCalled();
    });

    it('getTextSelection: should return `node` and `tagName`', () => {
      const fakeSelection = { anchorNode: { parentNode: { nodeName: 'A' } } };
      const expectedReturn = { node: { nodeName: 'A' }, tagName: 'A' };

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>fakeSelection);

      const expectedValue = component['getTextSelection']();

      expect(expectedValue).toEqual(<any>expectedReturn);
    });

    it('getTextSelection: should return `node` and `tagName`', () => {
      const fakeSelection = {};
      const expectedReturn = undefined;

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>fakeSelection);

      const expectedValue = component['getTextSelection']();

      expect(expectedValue).toEqual(expectedReturn);
    });

    it('isCursorPositionedInALink: should return true if `focusNode.parentElement` is a link', () => {
      const fakeSelection = { node: { nodeName: 'A' }, tagName: 'A' };

      vi.spyOn(component as any, 'getTextSelection').mockReturnValue(<any>fakeSelection);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(true);
    });

    it('isCursorPositionedInALink: should return true if `anchorNode.parentNode` is a link', () => {
      const fakeSelection = { anchorNode: { parentNode: { nodeName: 'A' } } };

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>fakeSelection);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(true);
    });

    it(`isCursorPositionedInALink: should return true if browser is firefox and 'verifyCursorPositionInFirefoxIEEdge' return true`, () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>fakeSelection);
      vi.spyOn(UtilsFunction as any, 'isFirefox').mockReturnValue(true);
      vi.spyOn(component as any, 'verifyCursorPositionInFirefoxIEEdge').mockReturnValue(true);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(true);
    });

    it(`isCursorPositionedInALink: should return true if browser is IE and 'verifyCursorPositionInFirefoxIEEdge' return true`, () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>fakeSelection);
      vi.spyOn(UtilsFunction as any, 'isIEOrEdge').mockReturnValue(true);
      vi.spyOn(component as any, 'verifyCursorPositionInFirefoxIEEdge').mockReturnValue(true);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(true);
    });

    it(`isCursorPositionedInALink: should return true if not tag A, firefox and IE, but 'isParentNodeAnchor' return true`, () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>fakeSelection);
      vi.spyOn(UtilsFunction as any, 'isIEOrEdge').mockReturnValue(false);
      vi.spyOn(UtilsFunction as any, 'isFirefox').mockReturnValue(false);
      vi.spyOn(component as any, 'isParentNodeAnchor').mockReturnValue(true);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(true);
    });

    it(`isCursorPositionedInALink: should return false if not tag A, firefox, IE  and 'isParentNodeAnchor' return false`, () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>fakeSelection);
      vi.spyOn(UtilsFunction as any, 'isIEOrEdge').mockReturnValue(false);
      vi.spyOn(UtilsFunction as any, 'isFirefox').mockReturnValue(false);
      vi.spyOn(component as any, 'isParentNodeAnchor').mockReturnValue(false);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(false);
    });

    it(`isCursorPositionedInALink: should return false if browser is firefox and 'verifyCursorPositionInFirefoxIEEdge'
      return false`, () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>fakeSelection);
      vi.spyOn(UtilsFunction as any, 'isFirefox').mockReturnValue(true);
      vi.spyOn(component as any, 'verifyCursorPositionInFirefoxIEEdge').mockReturnValue(false);

      const expectedValue = component['isCursorPositionedInALink']();

      expect(expectedValue).toBe(false);
    });

    it(`isCursorPositionedInALink: should return false if browser is IE and 'verifyCursorPositionInFirefoxIEEdge'
      return false`, () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>fakeSelection);
      vi.spyOn(UtilsFunction as any, 'isIEOrEdge').mockReturnValue(true);
      vi.spyOn(component as any, 'verifyCursorPositionInFirefoxIEEdge').mockReturnValue(false);

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

      vi.spyOn(UtilsFunction as any, 'openExternalLink');

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

      vi.spyOn(UtilsFunction as any, 'openExternalLink');
      vi.spyOn(event.target.classList, 'remove');

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

      vi.spyOn(UtilsFunction as any, 'openExternalLink');

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

      vi.spyOn(UtilsFunction as any, 'openExternalLink');

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

      vi.spyOn(UtilsFunction as any, 'openExternalLink');

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

      const removeSpy = vi.fn();

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>{
        focusNode: undefined
      });

      component['toggleCursorOnLink'](event, 'remove');

      expect(removeSpy).not.toHaveBeenCalled();
    });

    it('toggleCursorOnLink: should call remove of classList if `action` is remove, `element` is `anchor` and `key` is `Control`', () => {
      const event = { key: 'Control' };

      const removeSpy = vi.fn();
      const containsSpy = vi.fn().mockReturnValue(true);

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>{
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

      const addSpy = vi.fn();
      const isCursorPositionedInALinkSpy = vi
        .spyOn(component as any, 'isCursorPositionedInALink')
        .mockReturnValue(true);

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>{
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

      const addSpy = vi.fn();
      const isCursorPositionedInALinkSpy = vi
        .spyOn(component as any, 'isCursorPositionedInALink')
        .mockReturnValue(true);

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>{
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

      const addSpy = vi.fn();
      const isCursorPositionedInALinkSpy = vi
        .spyOn(component as any, 'isCursorPositionedInALink')
        .mockReturnValue(true);

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>{
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

      const addSpy = vi.fn();
      const isCursorPositionedInALinkSpy = vi
        .spyOn(component as any, 'isCursorPositionedInALink')
        .mockReturnValue(false);
      const removeSpy = vi.fn();
      const containsSpy = vi.fn().mockReturnValue(true);

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>{
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

      const addSpy = vi.fn();
      const isCursorPositionedInALinkSpy = vi
        .spyOn(component as any, 'isCursorPositionedInALink')
        .mockReturnValue(false);
      const removeSpy = vi.fn();
      const containsSpy = vi.fn().mockReturnValue(false);

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>{
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

      vi.spyOn(component.value as any, 'emit');
      component['updateModel']();

      expect(component.value.emit).toHaveBeenCalledWith(component.modelValue);
    });

    it('updateValueWithModelValue: should call `bodyElement.nativeElement.insertAdjacentHTML`', () => {
      component.modelValue = 'teste';

      vi.spyOn(component.bodyElement.nativeElement, 'insertAdjacentHTML');
      component['updateValueWithModelValue']();

      expect(component.bodyElement.nativeElement.insertAdjacentHTML).toHaveBeenCalledWith(
        'afterbegin',
        component.modelValue
      );
    });

    it('updateValueWithModelValue: shouldn`t call `bodyElement.nativeElement.insertAdjacentHTML`', () => {
      component.modelValue = undefined;

      vi.spyOn(component.bodyElement.nativeElement, 'insertAdjacentHTML');
      component['updateValueWithModelValue']();

      expect(component.bodyElement.nativeElement.insertAdjacentHTML).not.toHaveBeenCalled();
    });

    it('verifyCursorPositionInFirefoxIEEdge: should return true if nodeName is an A tag', () => {
      const element = { nodeName: 'A' };
      const textSelection = {
        focusNode: { nodeName: 'A' }
      };

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>textSelection);

      expect(component['verifyCursorPositionInFirefoxIEEdge']()).toBe(true);
      expect(component['linkElement']).toEqual(element);
    });

    it('verifyCursorPositionInFirefoxIEEdge: should return true if childNodes of fragmentDocument is an A tag', () => {
      const element = { element: 'test', nodeName: 'A' };
      const textSelection = {
        getRangeAt: () => ({
          cloneContents: () => ({ childNodes: [{ element: 'test', nodeName: 'A' }] })
        })
      };

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>textSelection);

      expect(component['verifyCursorPositionInFirefoxIEEdge']()).toBe(true);
      expect(component['linkElement']).toEqual(element);
    });

    it('verifyCursorPositionInFirefoxIEEdge: should return true if firstElementChild of fragmentDocument is an A tag', () => {
      const element = { element: 'test', nodeName: 'A' };
      const textSelection = {
        getRangeAt: () => ({
          cloneContents: () => ({
            firstElementChild: { element: 'test', nodeName: 'A' },
            childNodes: []
          })
        })
      };

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>textSelection);

      expect(component['verifyCursorPositionInFirefoxIEEdge']()).toBe(true);
      expect(component['linkElement']).toEqual(element);
    });

    it(`verifyCursorPositionInFirefoxIEEdge: should return false if focusNode and firstElementChild of fragmentDocument
      are not an A tag and childNodes is undefined `, () => {
      const textSelection = {
        getRangeAt: () => ({
          cloneContents: () => ({
            firstElementChild: { element: 'test', nodeName: 'DIV' },
            childNodes: []
          })
        })
      };

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>textSelection);

      expect(component['verifyCursorPositionInFirefoxIEEdge']()).toBe(false);
      expect(component['linkElement']).toBe(undefined);
    });

    it(`verifyCursorPositionInFirefoxIEEdge: should return false if focusNode and childNodes of fragmentDocument
      are not an A tag and firstElementChild is undefined`, () => {
      const textSelection = {
        getRangeAt: () => ({
          cloneContents: () => ({
            firstElementChild: undefined,
            childNodes: [{ element: 'test', nodeName: 'DIV' }]
          })
        })
      };

      vi.spyOn(document as any, 'getSelection').mockReturnValue(<any>textSelection);

      expect(component['verifyCursorPositionInFirefoxIEEdge']()).toBe(false);
      expect(component['linkElement']).toBe(undefined);
    });

    describe('checkScrollState:', () => {
      it('should set `hasScroll` to true when content overflows', () => {
        const el = component.bodyElement.nativeElement;
        Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
        Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });

        component['checkScrollState']();

        expect(component.hasScroll).toBe(true);
      });

      it('should set `hasScroll` to false when content does not overflow', () => {
        const el = component.bodyElement.nativeElement;
        Object.defineProperty(el, 'scrollHeight', { value: 100, configurable: true });
        Object.defineProperty(el, 'clientHeight', { value: 200, configurable: true });

        component['checkScrollState']();

        expect(component.hasScroll).toBe(false);
      });

      it('should call `cd.markForCheck`', () => {
        vi.spyOn(component['cd'] as any, 'markForCheck');

        component['checkScrollState']();

        expect(component['cd'].markForCheck).toHaveBeenCalled();
      });

      it('should not throw if bodyEl is undefined', () => {
        vi.spyOn(component as any, 'bodyEl', 'get').mockReturnValue(undefined);

        expect(() => component['checkScrollState']()).not.toThrow();
      });
    });

    describe('updateHasValue:', () => {
      it('should set `hasValue` to true when body has text', () => {
        component.bodyElement.nativeElement.innerText = 'algum texto';

        component['updateHasValue']();

        expect(component.hasValue).toBe(true);
      });

      it('should set `hasValue` to false when body is empty', () => {
        component.bodyElement.nativeElement.innerText = '';

        component['updateHasValue']();

        expect(component.hasValue).toBe(false);
      });
    });

    describe('onWindowResize:', () => {
      it('should call `checkScrollState`', () => {
        vi.spyOn(component as any, 'checkScrollState');

        component.onWindowResize();

        expect(component['checkScrollState']).toHaveBeenCalled();
      });
    });

    describe('initResizeObserver:', () => {
      it('should execute ResizeObserver callback and call `checkScrollState`', () => {
        vi.spyOn(component as any, 'checkScrollState');

        let observerCallback: any;

        const originalResizeObserver = (window as any).ResizeObserver;
        (window as any).ResizeObserver = class {
          constructor(cb: any) {
            observerCallback = cb;
          }
          observe() {}
          disconnect() {}
        };

        component['initResizeObserver']();

        if (observerCallback) {
          observerCallback();
        }

        expect(component['checkScrollState']).toHaveBeenCalled();

        (window as any).ResizeObserver = originalResizeObserver;
      });

      it('should return early if ResizeObserver is undefined', () => {
        const originalResizeObserver = (window as any).ResizeObserver;
        (window as any).ResizeObserver = undefined;

        component['resizeObserver'] = undefined;
        component['initResizeObserver']();

        expect(component['resizeObserver']).toBeUndefined();

        (window as any).ResizeObserver = originalResizeObserver;
      });

      it('should return early if bodyEl is undefined', () => {
        Object.defineProperty(component, 'bodyEl', { value: undefined, writable: true });

        component['resizeObserver'] = undefined;

        component['initResizeObserver']();

        expect(component['resizeObserver']).toBeUndefined();
      });
    });
  });

  describe('Templates:', () => {
    it('should contain `po-rich-text-body`', () => {
      expect(nativeElement.querySelector('.po-rich-text-body')).toBeTruthy();
    });

    it('should add `has-loading` class when `loading` is true', () => {
      component.loading = true;
      fixture.detectChanges();

      const bodyEl = nativeElement.querySelector('.po-rich-text-body');
      expect(bodyEl.classList.contains('has-loading')).toBe(true);
    });

    it('should not add `has-loading` class when `loading` is false', () => {
      component.loading = false;
      fixture.detectChanges();

      const bodyEl = nativeElement.querySelector('.po-rich-text-body');
      expect(bodyEl.classList.contains('has-loading')).toBe(false);
    });

    it('should add `po-rich-text-disabled` class when `disabled` is true', () => {
      component.disabled = true;
      fixture.detectChanges();

      const bodyEl = nativeElement.querySelector('.po-rich-text-body');
      expect(bodyEl.classList.contains('po-rich-text-disabled')).toBe(true);
    });

    it('should render loading icon when `loading` is true', () => {
      component.loading = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-rich-text-loading-container')).toBeTruthy();
    });

    it('should not render loading icon when `loading` is false', () => {
      component.loading = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-rich-text-loading-container')).toBeFalsy();
    });

    it('should set `tabindex` to -1 when `disabled` is true', () => {
      component.disabled = true;
      fixture.detectChanges();

      const bodyEl = nativeElement.querySelector('.po-rich-text-body');
      expect(bodyEl.getAttribute('tabindex')).toBe('-1');
    });

    it('should set `contenteditable` to false when `disabled` is true', () => {
      component.disabled = true;
      fixture.detectChanges();

      const bodyEl = nativeElement.querySelector('.po-rich-text-body');
      expect(bodyEl.getAttribute('contenteditable')).toBe('false');
    });
  });
});
