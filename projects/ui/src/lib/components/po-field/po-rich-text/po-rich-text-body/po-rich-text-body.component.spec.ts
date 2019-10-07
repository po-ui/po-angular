import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import * as UtilsFunction from '../../../../utils/util';
import { configureTestSuite } from './../../../../util-test/util-expect.spec';

import { PoRichTextBodyComponent } from './po-rich-text-body.component';

describe('PoRichTextBodyComponent:', () => {
  let component: PoRichTextBodyComponent;
  let fixture: ComponentFixture<PoRichTextBodyComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PoRichTextBodyComponent
      ]
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

    it('onInit: should update `bodyElement`', () => {
      const expectedValue = 'on';
      component.ngOnInit();

      expect(component.bodyElement.nativeElement.designMode).toEqual(expectedValue);
    });

    it('onInit: should call `updateValueWithModelValue`', fakeAsync(() => {
      spyOn(component, <any>'updateValueWithModelValue');

      component.ngOnInit();
      tick(50);

      expect(component['updateValueWithModelValue']).toHaveBeenCalled();
    }));

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

    it('onKeyUp: should remove tag `br`', () => {
      const element = document.createElement('br');
      element.classList.add('teste');
      component.bodyElement.nativeElement.appendChild(element);
      component.onKeyUp();
      expect(nativeElement.querySelector('.teste')).toBeFalsy();
    });

    it('onKeyUp: should`t remove tag `br`', () => {
      const div = document.createElement('div');
      const br = document.createElement('br');

      br.classList.add('teste-br');
      div.classList.add('teste-div');

      component.bodyElement.nativeElement.appendChild(div);
      component.bodyElement.nativeElement.appendChild(br);

      component.onKeyUp();

      expect(nativeElement.querySelector('.teste-br')).toBeTruthy();
      expect(nativeElement.querySelector('.teste-div')).toBeTruthy();
    });

    it('onKeyUp: should call `updateModel`', () => {
      spyOn(component, <any>'updateModel');
      component.onKeyUp();

      expect(component['updateModel']).toHaveBeenCalled();
    });

    it('onKeyUp: should call `emitSelectionCommands`', () => {
      spyOn(component, <any>'emitSelectionCommands');
      component.onKeyUp();

      expect(component['emitSelectionCommands']).toHaveBeenCalled();
    });

    it('onKeyDown: should call `event.preventDefault` and `shortcutCommand.emit` if keyCode is `76` and ctrlKey is `true`', () => {
      const fakeEvent = {
        keyCode: 76,
        ctrlKey: true,
        preventDefault: () => {},
      };

      spyOn(component.shortcutCommand, 'emit');
      spyOn(fakeEvent, 'preventDefault');

      component.onKeyDown(fakeEvent);

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(component.shortcutCommand.emit).toHaveBeenCalled();
    });

    it('onKeyDown: should call `event.preventDefault` and `shortcutCommand.emit` if keyCode is `76` and metaKey is `true`', () => {
      const fakeEvent = {
        keyCode: 76,
        metaKey: true,
        preventDefault: () => {},
      };

      spyOn(component.shortcutCommand, 'emit');
      spyOn(fakeEvent, 'preventDefault');

      component.onKeyDown(fakeEvent);

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(component.shortcutCommand.emit).toHaveBeenCalled();
    });

    it('onKeyDown: shouldn`t call `event.preventDefault` and `shortcutCommand.emit` if keyCode isn`t `76`', () => {
      const fakeEvent = {
        keyCode: 18,
        cmdKey: true,
        preventDefault: () => {},
      };

      spyOn(component.shortcutCommand, 'emit');
      spyOn(fakeEvent, 'preventDefault');

      component.onKeyDown(fakeEvent);

      expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
      expect(component.shortcutCommand.emit).not.toHaveBeenCalled();
    });

    it('onKeyDown: shouldn`t call `event.preventDefault` and `shortcutCommand.emit` if ctrlKey isn`t true', () => {
      const fakeEvent = {
        keyCode: 76,
        ctrlKey: false,
        preventDefault: () => {},
      };

      spyOn(component.shortcutCommand, 'emit');
      spyOn(fakeEvent, 'preventDefault');

      component.onKeyDown(fakeEvent);

      expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
      expect(component.shortcutCommand.emit).not.toHaveBeenCalled();
    });

    it('cursorPositionedInALink: should return true if tag element is a link', () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'A' } } };

      spyOn(document, 'getSelection').and.returnValue(<any>fakeSelection);

      const expectedValue = component['cursorPositionedInALink']();

      expect(expectedValue).toBe(true);
    });

    it('cursorPositionedInALink: should return false if tag element isn`t a link', () => {
      const fakeSelection = { focusNode: { parentElement: { tagName: 'B' } } };

      spyOn(document, 'getSelection').and.returnValue(<any>fakeSelection);

      const expectedValue = component['cursorPositionedInALink']();

      expect(expectedValue).toBe(false);
    });

    it('update: should call `updateModel`', fakeAsync(() => {
      spyOn(component, <any>'updateModel');

      component.update();
      tick(50);

      expect(component['updateModel']).toHaveBeenCalled();
    }));

    it('update: should call `onKeyUp`', fakeAsync(() => {
      spyOn(component, <any>'onKeyUp');

      component.update();
      tick(50);

      expect(component['onKeyUp']).toHaveBeenCalled();
    }));

    it('emitSelectionCommands: should call `commands.emit`', () => {
      spyOn(component.commands, 'emit');
      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalled();
    });

    it(`emitSelectionCommands: the object property 'commands'
    should contain 'Createlink' if 'cursorPositionedInALink' returns 'true'`, () => {

      spyOn(component, <any>'cursorPositionedInALink').and.returnValue(true);
      spyOn(document, 'queryCommandState').and.returnValue(false);
      spyOn(document, 'queryCommandValue').and.returnValue('rgb');
      spyOn(component, <any>'rgbToHex').and.returnValue('hex');
      spyOn(component.commands, 'emit');

      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalledWith({commands: ['Createlink'], hexColor: 'hex'});
    });

    it(`emitSelectionCommands: the object property 'commands'
    shouldn't contain 'Createlink' if 'cursorPositionedInALink' returns 'false'`, () => {

      spyOn(component, <any>'cursorPositionedInALink').and.returnValue(false);
      spyOn(document, 'queryCommandState').and.returnValue(false);
      spyOn(document, 'queryCommandValue').and.returnValue('rgb');
      spyOn(component, <any>'rgbToHex').and.returnValue('hex');
      spyOn(component.commands, 'emit');

      component['emitSelectionCommands']();

      expect(component.commands.emit).toHaveBeenCalledWith({commands: [], hexColor: 'hex'});
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

      expect(component.bodyElement.nativeElement.insertAdjacentHTML).toHaveBeenCalledWith('afterbegin', component.modelValue);
    });

    it('onFocus: should set a value to `valueBeforeChange`', () => {
      component.modelValue = 'value';

      component.onFocus();

      expect(component['valueBeforeChange']).toBe('value');
    });

    it('rgbToHex: should return the hexadecimal value`', () => {
      const rbg = 'rgb(0, 128, 255)';
      const hex = '#0080ff';
      const result = component['rgbToHex'](rbg);

      expect(result).toBe(hex);
    });

    it('onBlur: should emit modelValue change', fakeAsync((): void => {
      const fakeThis = {
        modelValue: 'value',
        valueBeforeChange: '1',
        change: component.change,
        bodyElement: {
          nativeElement: {
            innerHTML: 'value'
          }
        }
      };

      spyOn(fakeThis.change, 'emit');
      component.onBlur.call(fakeThis);
      tick(250);

      expect(fakeThis.change.emit).toHaveBeenCalledWith(fakeThis.modelValue);
    }));

    it('onBlur: shouldn`t emit change value doesn`t changed', fakeAsync((): void => {
      const fakeThis = {
        modelValue: 'value',
        valueBeforeChange: 'value',
        change: {
          emit: () => {}
        },
        bodyElement: {
          nativeElement: {
            innerHTML: 'value'
          }
        }
      };

      spyOn(fakeThis.change, 'emit');
      component.onBlur.call(fakeThis);
      tick(250);

      expect(fakeThis.change.emit).not.toHaveBeenCalled();
    }));

    it('insertHtmlLinkElement: should contain `po-rich-text-link`', () => {
      const urlLink = 'urlLink';
      const urlLinkText = 'url link text';

      component.focus();

      component['insertHtmlLinkElement'](urlLink, urlLinkText);

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-rich-text-link')).toBeTruthy();
    });

  });

  describe('Templates:', () => {

    it('should contain `po-rich-text-body`', () => {

      expect(nativeElement.querySelector('.po-rich-text-body')).toBeTruthy();
    });

  });

});
