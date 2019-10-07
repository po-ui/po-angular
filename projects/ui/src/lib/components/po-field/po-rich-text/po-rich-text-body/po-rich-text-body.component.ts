import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { isIE } from './../../../../utils/util';
import { PoKeyCodeEnum } from './../../../../enums/po-key-code.enum';

const poRichTextBodyCommands = [
  'bold', 'italic', 'underline', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertUnorderedList', 'Createlink'
];

@Component({
  selector: 'po-rich-text-body',
  templateUrl: './po-rich-text-body.component.html'
})
export class PoRichTextBodyComponent implements OnInit {

  private timeoutChange: any;
  private valueBeforeChange: any;

  @ViewChild('bodyElement', { static: true }) bodyElement: ElementRef;

  @Input('p-height') height?: string;

  @Input('p-model-value') modelValue?: string;

  @Input('p-placeholder') placeholder?: string;

  @Input('p-readonly') readonly?: string;

  @Output('p-change') change = new EventEmitter<any>();

  @Output('p-commands') commands = new EventEmitter<any>();

  @Output('p-shortcut-command') shortcutCommand = new EventEmitter<any>();

  @Output('p-value') value = new EventEmitter<any>();

  ngOnInit() {
    this.bodyElement.nativeElement.designMode = 'on';

    // timeout necessário para setar o valor vindo do writeValue do componente principal.
    setTimeout(() => this.updateValueWithModelValue());
  }

  executeCommand(command: (string | { command: any, value: string | any })) {
    this.bodyElement.nativeElement.focus();

    if (typeof (command) === 'object') {

      if (command.command === 'InsertHTML') {
        const { command: linkCommand, value : { urlLink }, value : { urlLinkText} } = command;

        this.handleCommandLink(linkCommand, urlLink, urlLinkText);
      } else {
        document.execCommand(command.command, false, command.value);
      }
    } else {
      document.execCommand(command, false, null);
    }

    this.updateModel();
    this.value.emit(this.modelValue);
  }

  onBlur() {
    if (this.modelValue !== this.valueBeforeChange) {
      clearTimeout(this.timeoutChange);
      this.timeoutChange = setTimeout(() => {
        this.change.emit(this.modelValue);
      }, 200);
    }
  }

  focus(): void {
    this.bodyElement.nativeElement.focus();
  }

  onClick() {
    this.emitSelectionCommands();
  }

  onFocus() {
    this.valueBeforeChange = this.modelValue;
  }

  onKeyDown(event) {
    const keyL = event.keyCode === PoKeyCodeEnum.keyL;

    if (keyL && event.ctrlKey || keyL && event.metaKey) {
      event.preventDefault();
      this.shortcutCommand.emit();
    }
  }

  onKeyUp() {
    // Tratamento necessário para eliminar a tag <br> criada no firefox quando o body for limpo.
    const bodyElement = this.bodyElement.nativeElement;

    if (!bodyElement.innerText.trim() && bodyElement.childNodes.length === 1 && bodyElement.querySelector('br')) {
      bodyElement.querySelector('br').remove();
    }

    this.updateModel();
    this.emitSelectionCommands();
  }

  update() {
    setTimeout(() => this.updateModel());
    setTimeout(() => this.onKeyUp());
  }

  private cursorPositionedInALink() {
    const link = document.getSelection();

    return link.focusNode.parentElement.tagName === 'A';
  }

  private emitSelectionCommands() {
    const commands = poRichTextBodyCommands.filter(command => document.queryCommandState(command));
    const rgbColor = document.queryCommandValue('ForeColor');
    const hexColor = this.rgbToHex(rgbColor);

    if (this.cursorPositionedInALink()) {
      commands.push('Createlink');
    }

    this.commands.emit({commands, hexColor});
  }

  private handleCommandLink(linkCommand: string, urlLink: string, urlLinkText: string) {
    if (isIE()) {
      this.insertHtmlLinkElement(urlLink, urlLinkText);
    } else {
      // necessário '&nbsp;' no fim pois o Firefox mantém o cursor dentro da tag;
      const linkValue = `<a class="po-rich-text-link" href="${urlLink}" target="_blank">${urlLinkText || urlLink}</a>`;

      document.execCommand(linkCommand, false, linkValue);
    }
  }

  // tratamento específico para IE pois não suporta o comando 'insertHTML'.
  private insertHtmlLinkElement(urlLink: string, urlLinkText: string) {
    const selection = document.getSelection();
    const selectionRange = selection.getRangeAt(0);
    const elementLink = document.createElement('a');
    const elementlinkText = document.createTextNode(urlLinkText);

    elementLink.appendChild(elementlinkText);
    elementLink.href = urlLink;
    elementLink.setAttribute('target', '_blank');
    elementLink.classList.add('po-rich-text-link');

    selectionRange.deleteContents();
    selectionRange.insertNode(elementLink);
  }

  private rgbToHex(rgb) {
    // Tratamento necessário para converter o código rgb para hexadecimal.
    const sep = rgb.indexOf(',') > -1 ? ',' : ' ';
    rgb = rgb.substr(4).split(')')[0].split(sep);

    let r = (+rgb[0]).toString(16);
    let g = (+rgb[1]).toString(16);
    let b = (+rgb[2]).toString(16);

    if (r.length === 1) {
      r = '0' + r;
    }
    if (g.length === 1) {
      g = '0' + g;
    }
    if (b.length === 1) {
      b = '0' + b;
    }

    return '#' + r + g + b;
  }

  private updateModel() {
    this.modelValue = this.bodyElement.nativeElement.innerHTML;

    this.value.emit(this.modelValue);
  }

  private updateValueWithModelValue() {
    if (this.modelValue) {
      this.bodyElement.nativeElement.insertAdjacentHTML('afterbegin', this.modelValue);
    }
  }

}
