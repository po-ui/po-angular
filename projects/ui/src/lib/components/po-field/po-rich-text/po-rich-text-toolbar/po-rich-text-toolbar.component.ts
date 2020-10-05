import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { isIE } from '../../../../utils/util';
import { PoLanguageService } from '../../../../services/po-language/po-language.service';

import { PoButtonGroupItem } from '../../../po-button-group';
import { poRichTextLiteralsDefault } from '../po-rich-text-literals';
import { PoRichTextToolbarButtonGroupItem } from '../interfaces/po-rich-text-toolbar-button-group-item.interface';
import { PoRichTextImageModalComponent } from '../po-rich-text-image-modal/po-rich-text-image-modal.component';
import { PoRichTextLinkModalComponent } from '../po-rich-text-link-modal/po-rich-text-link-modal.component';

const poRichTextDefaultColor = '#000000';

@Component({
  selector: 'po-rich-text-toolbar',
  templateUrl: './po-rich-text-toolbar.component.html'
})
export class PoRichTextToolbarComponent implements AfterViewInit {
  private _readonly: boolean;
  private selectedLinkElement;

  readonly literals = {
    ...poRichTextLiteralsDefault[this.languageService.getShortLanguage()]
  };

  alignButtons: Array<PoRichTextToolbarButtonGroupItem> = [
    {
      command: 'justifyleft',
      icon: 'po-icon-align-left',
      tooltip: this.literals.left,
      action: this.emitAlignCommand.bind(this, 'justifyleft'),
      selected: true
    },
    {
      command: 'justifycenter',
      icon: 'po-icon-align-center',
      tooltip: this.literals.center,
      action: this.emitAlignCommand.bind(this, 'justifycenter')
    },
    {
      command: 'justifyright',
      icon: 'po-icon-align-right',
      tooltip: this.literals.right,
      action: this.emitAlignCommand.bind(this, 'justifyright')
    },
    {
      command: 'justifyfull',
      icon: 'po-icon-align-justify',
      tooltip: this.literals.justify,
      action: this.emitAlignCommand.bind(this, 'justifyfull')
    }
  ];

  formatButtons: Array<PoRichTextToolbarButtonGroupItem> = [
    {
      command: 'bold',
      icon: 'po-icon-text-bold',
      tooltip: this.literals.bold,
      action: this.emitCommand.bind(this, 'bold')
    },
    {
      command: 'italic',
      icon: 'po-icon-text-italic',
      tooltip: this.literals.italic,
      action: this.emitCommand.bind(this, 'italic')
    },
    {
      command: 'underline',
      icon: 'po-icon-text-underline',
      tooltip: this.literals.underline,
      action: this.emitCommand.bind(this, 'underline')
    }
  ];

  listButtons: Array<PoRichTextToolbarButtonGroupItem> = [
    {
      command: 'insertUnorderedList',
      icon: 'po-icon-list',
      tooltip: this.literals.unorderedList,
      action: this.emitCommand.bind(this, 'insertUnorderedList')
    }
  ];

  linkButtons: Array<PoRichTextToolbarButtonGroupItem> = [
    {
      command: 'Createlink',
      icon: 'po-icon-link',
      tooltip: `${this.literals.insertLink} (Ctrl + K)`,
      action: () => this.richTextLinkModal.openModal(this.selectedLinkElement)
    }
  ];

  mediaButtons: Array<PoButtonGroupItem> = [
    {
      tooltip: this.literals.insertImage,
      icon: 'po-icon-picture',
      action: () => this.richTextImageModal.openModal()
    }
  ];

  @ViewChild('colorPickerInput', { read: ElementRef }) colorPickerInput: ElementRef;

  @ViewChild('toolbarElement', { static: true }) toolbarElement: ElementRef;

  @ViewChild(PoRichTextImageModalComponent, { static: true }) richTextImageModal: PoRichTextImageModalComponent;

  @ViewChild(PoRichTextLinkModalComponent, { static: true }) richTextLinkModal: PoRichTextLinkModalComponent;

  @Input('p-readonly') set readonly(value: boolean) {
    this._readonly = value;
    this.toggleDisableButtons(this._readonly);
  }

  get readonly() {
    return this._readonly;
  }

  @Output('p-command') command = new EventEmitter<string | { command: string; value: string }>();

  @Output('p-modal') modal = new EventEmitter<any>();

  @Output('p-link-editing') linkEditing = new EventEmitter<any>();

  get isInternetExplorer() {
    return isIE();
  }

  constructor(private languageService: PoLanguageService) {}

  ngAfterViewInit() {
    this.removeButtonFocus();
    this.setColorInColorPicker(poRichTextDefaultColor);
  }

  changeTextColor(value) {
    const command = 'foreColor';

    this.command.emit({ command, value });
  }

  emitLinkEditing(isLinkEdit: boolean) {
    this.linkEditing.emit(isLinkEdit);
  }

  selectedLink(selectedLinkElement) {
    this.selectedLinkElement = selectedLinkElement;
  }

  setButtonsStates(obj: { commands: Array<string>; hexColor: string }) {
    if (!this.readonly) {
      this.alignButtons.forEach(button => (button.selected = obj.commands.includes(button.command)));
      this.formatButtons.forEach(button => (button.selected = obj.commands.includes(button.command)));
      this.listButtons[0].selected = obj.commands.includes(this.listButtons[0].command);
      this.linkButtons[0].selected = obj.commands.includes(this.linkButtons[0].command);
      this.setColorInColorPicker(obj.hexColor);
    }
  }

  shortcutTrigger() {
    this.richTextLinkModal.openModal(this.selectedLinkElement);
  }

  private emitAlignCommand(command: string) {
    const index = this.alignButtons.findIndex(btn => btn.command === command);

    if (this.alignButtons[index].selected) {
      this.alignButtons[index].selected = false;
    }

    this.command.emit(command);
  }

  emitCommand(command: string) {
    this.command.emit(command);
  }

  private removeButtonFocus() {
    const buttons = this.toolbarElement.nativeElement.querySelectorAll('button');

    buttons.forEach(button => button.setAttribute('tabindex', '-1'));
  }

  private setColorInColorPicker(color: string): void {
    this.colorPickerInput.nativeElement.value = color;
  }

  private toggleDisableButtons(state: boolean) {
    this.alignButtons.forEach(button => (button.disabled = state));
    this.formatButtons.forEach(button => (button.disabled = state));
    this.listButtons[0].disabled = state;
    this.linkButtons[0].disabled = state;
    this.mediaButtons[0].disabled = state;
  }
}
