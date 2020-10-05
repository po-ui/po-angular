import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import * as UtilsFunction from '../../../../utils/util';
import { configureTestSuite } from '../../../../util-test/util-expect.spec';

import { PoButtonGroupModule } from '../../../po-button-group';
import { PoFieldModule } from '../../po-field.module';
import { PoModalModule } from '../../../po-modal/po-modal.module';
import { PoRichTextToolbarComponent } from './po-rich-text-toolbar.component';
import { PoTooltipModule } from './../../../../directives/po-tooltip/po-tooltip.module';

describe('PoRichTextToolbarComponent:', () => {
  let component: PoRichTextToolbarComponent;
  let fixture: ComponentFixture<PoRichTextToolbarComponent>;
  let nativeElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, PoButtonGroupModule, PoModalModule, PoTooltipModule, PoFieldModule],
      declarations: []
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoRichTextToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('readonly: should call toggleDisableButtons', () => {
      spyOn(component, <any>'toggleDisableButtons');

      component.readonly = true;

      expect(component['toggleDisableButtons']).toHaveBeenCalledWith(true);
    });

    it('isInternetExplorer: should call isIE', () => {
      const spyIsIE = spyOn(UtilsFunction, 'isIE');

      expect(component.isInternetExplorer).toBeFalsy();
      expect(spyIsIE).toHaveBeenCalled();
    });

    it('mediaButtons: should call richTextImageModal.openModal', () => {
      spyOn(component.richTextImageModal, <any>'openModal');

      component.mediaButtons[0].action();

      expect(component.richTextImageModal.openModal).toHaveBeenCalled();
    });

    it('linkButtons: should call richTextLinkModal.openModal', () => {
      component['selectedLinkElement'] = undefined;

      spyOn(component.richTextLinkModal, 'openModal');

      component.linkButtons[0].action();

      expect(component.richTextLinkModal.openModal).toHaveBeenCalledWith(component['selectedLinkElement']);
    });
  });

  describe('Methods:', () => {
    it('ngAfterViewInit: should call removeButtonFocus and setColorInColorPicker', () => {
      const spyOnRemoveButtonFocus = spyOn(component, <any>'removeButtonFocus');
      const spyOnSetColorInColorPicker = spyOn(component, <any>'setColorInColorPicker');

      component.ngAfterViewInit();

      expect(spyOnRemoveButtonFocus).toHaveBeenCalled();
      expect(spyOnSetColorInColorPicker).toHaveBeenCalled();
    });

    describe('setButtonsStates:', () => {
      const commands = ['bold', 'italic', 'justifycenter'];
      const hexColor = '#000000';

      it('should map alignButtons and apply `selected` true only for `justifycenter` option', () => {
        component.setButtonsStates({ commands, hexColor });

        expect(component.alignButtons[0].selected).toBeFalsy();
        expect(component.alignButtons[1].selected).toBeTruthy();
        expect(component.alignButtons[2].selected).toBeFalsy();
        expect(component.alignButtons[3].selected).toBeFalsy();
      });

      it('should map formatButtons and apply `selected` true only for `bold` and `italic` options', () => {
        component.setButtonsStates({ commands, hexColor });

        expect(component.formatButtons[0].selected).toBeTruthy();
        expect(component.formatButtons[1].selected).toBeTruthy();
        expect(component.formatButtons[2].selected).toBeFalsy();
      });

      it('should map listButtons and doesn`t apply `selected` true', () => {
        component.setButtonsStates({ commands, hexColor });

        expect(component.listButtons[0].selected).toBeFalsy();
      });

      it('should map linktButtons and doesn`t apply `selected` true', () => {
        component.setButtonsStates({ commands, hexColor });

        expect(component.linkButtons[0].selected).toBeFalsy();
      });

      it(`shouldn't map neither set a 'selected' value at alignButtons, formatButtons,
      linkButtons and listButtons arrays list if it's readonly`, () => {
        component.readonly = true;
        component.alignButtons[0].selected = undefined;

        component.setButtonsStates({ commands, hexColor });

        component.alignButtons.forEach(alignButton => {
          expect(alignButton.selected).toBeFalsy();
        });
        component.formatButtons.forEach(formatButton => {
          expect(formatButton.selected).toBeFalsy();
        });

        component.linkButtons.forEach(linkButton => {
          expect(linkButton.selected).toBeFalsy();
        });
      });

      it(`should call 'setColorInColorPicker' if 'readonly' is 'false'.`, () => {
        component.readonly = false;
        const spyOnSetColorInColorPicker = spyOn(component, <any>'setColorInColorPicker');

        component.setButtonsStates({ commands, hexColor });

        expect(spyOnSetColorInColorPicker).toHaveBeenCalled();
      });
    });

    it('emitLinkEditing: should emit linkEditing', () => {
      const isLinkEdit = false;

      spyOn(component.linkEditing, 'emit');

      component.emitLinkEditing(isLinkEdit);

      expect(component.linkEditing.emit).toHaveBeenCalledWith(isLinkEdit);
    });

    it('selectedLink: should apply value to selectedLink', () => {
      component.selectedLink(undefined);

      expect(component['selectedLinkElement']).toBe(undefined);
    });

    it('emitAlignCommand: should emit command', () => {
      spyOn(component.command, 'emit');

      component['emitAlignCommand']('justifyleft');

      expect(component.command.emit).toHaveBeenCalledWith('justifyleft');
    });

    it('emitAlignCommand: should apply false to alignButtons[index].selected if it`s set with true', () => {
      component.alignButtons[0].selected = true;

      component['emitAlignCommand']('justifyleft');

      expect(component.alignButtons[0].selected).toBeFalsy();
    });

    it('emitAlignCommand: shouldn`t apply false to alignButtons[index].selected if it`s already false', () => {
      component.alignButtons[0].selected = false;

      component['emitAlignCommand']('justifyleft');

      expect(component.alignButtons[0].selected).toBeFalsy();
    });

    it('emitCommand: should emit command', () => {
      spyOn(component.command, 'emit');

      component.emitCommand('justifyleft');

      expect(component.command.emit).toHaveBeenCalledWith('justifyleft');
    });

    it('removeButtonFocus: should apply attribute tabindex -1 for all buttons.', () => {
      component['removeButtonFocus']();
      fixture.detectChanges();

      const buttons = nativeElement.querySelectorAll('button');

      buttons.forEach(button => {
        expect(button.getAttribute('tabindex')).toEqual('-1');
      });
    });

    it('toggleDisableButtons: should apply the state `disabled` to alignButtons, formatButtons, linkButtons and lisButtons', () => {
      component['toggleDisableButtons'](true);

      component.alignButtons.forEach(alignButton => {
        expect(alignButton.disabled).toBeTruthy();
      });
      component.formatButtons.forEach(formatButton => {
        expect(formatButton.disabled).toBeTruthy();
      });
      expect(component.listButtons[0].disabled).toBeTruthy();
      expect(component.linkButtons[0].disabled).toBeTruthy();
      expect(component.mediaButtons[0].disabled).toBeTruthy();
    });

    it('toggleDisableButtons: shouldn`t apply the state `disabled` to alignButtons, formatButtons, linkButtons and lisButtons.', () => {
      component['toggleDisableButtons'](false);

      component.alignButtons.forEach(alignButton => {
        expect(alignButton.disabled).toBeFalsy();
      });
      component.formatButtons.forEach(formatButton => {
        expect(formatButton.disabled).toBeFalsy();
      });
      expect(component.listButtons[0].disabled).toBeFalsy();
      expect(component.linkButtons[0].disabled).toBeFalsy();
      expect(component.mediaButtons[0].disabled).toBeFalsy();
    });

    it(`changeTextColor: should call 'command.emit'.`, () => {
      const spyOnEmit = spyOn(component.command, 'emit');
      const command = 'foreColor';
      const value = '#000000';

      component['changeTextColor'](value);

      expect(spyOnEmit).toHaveBeenCalledWith({ command, value });
    });

    it(`setColorInColorPicker: should update the 'colorPickerInput' to new value.`, () => {
      component.colorPickerInput.nativeElement.value = undefined;
      const color: string = '#000000';

      component['setColorInColorPicker'](color);

      expect(component.colorPickerInput.nativeElement.value).toBe(color);
    });

    it('shortcutTrigger: should call `richTextLinkModal.openModal`', () => {
      component['selectedLinkElement'] = undefined;

      spyOn(component.richTextLinkModal, <any>'openModal');

      component.shortcutTrigger();

      expect(component.richTextLinkModal.openModal).toHaveBeenCalledWith(component['selectedLinkElement']);
    });
  });

  describe('Templates:', () => {
    it('should change color picker to disabled if readonly is true.', () => {
      component.readonly = true;

      fixture.detectChanges();

      const colorPickerButton = nativeElement.querySelector('.po-rich-text-toolbar-color-picker-button:disabled');
      const colorPickerInput = nativeElement.querySelector('.po-rich-text-toolbar-color-picker-input:disabled');

      expect(colorPickerButton).toBeTruthy();
      expect(colorPickerInput).toBeTruthy();
    });

    it('should find `.po-rich-text-toolbar-color-picker-input` if browser isn`t IE', () => {
      const colorPickerInput = nativeElement.querySelector('.po-rich-text-toolbar-color-picker-input');

      expect(colorPickerInput).toBeTruthy();
    });
  });
});
