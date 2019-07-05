import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { PoLanguageService } from '../../../../services/po-language/po-language.service';

import { poRichTextLiteralsDefault } from '../po-rich-text-literals';
import { PoRichTextToolbarButtonGroupItem } from '../interfaces/po-rich-text-toolbar-button-group-item.interface';

@Component({
  selector: 'po-rich-text-toolbar',
  templateUrl: './po-rich-text-toolbar.component.html'
})
export class PoRichTextToolbarComponent implements AfterViewInit {

  private _readonly: boolean;

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

  @ViewChild('toolbarElement', { static: true }) toolbarElement: ElementRef;

  @Input('p-readonly') set readonly(value: boolean) {
    this._readonly = value;
    this.toggleDisableButtons(this._readonly);
  }

  get readonly() {
    return this._readonly;
  }

  @Output('p-command') command = new EventEmitter<string>();

  constructor(private languageService: PoLanguageService) { }

  ngAfterViewInit() {
    this.removeButtonFocus();
  }

  setButtonsStates(commands: Array<string>) {
    if (!this.readonly) {
      this.alignButtons.forEach(button => button.selected = commands.includes(button.command));
      this.formatButtons.forEach(button => button.selected = commands.includes(button.command));
      this.listButtons[0].selected = commands.includes(this.listButtons[0].command);
    }
  }

  private emitAlignCommand(command: string) {
    const index = this.alignButtons.findIndex(btn => btn.command === command);

    if (this.alignButtons[index].selected) {
      this.alignButtons[index].selected = false;
    }

    this.command.emit(command);
  }

  private emitCommand(command: string) {
    this.command.emit(command);
  }

  private removeButtonFocus() {
    const buttons = this.toolbarElement.nativeElement.querySelectorAll('button');

    buttons.forEach(button => button.setAttribute('tabindex', '-1'));
  }

  private toggleDisableButtons(state: boolean) {
    this.alignButtons.forEach(button => button.disabled = state);
    this.formatButtons.forEach(button => button.disabled = state);

    this.listButtons[0].disabled = state;
  }

}
