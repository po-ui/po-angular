import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

const poRichTextBodyCommands = [
  'bold', 'italic', 'underline', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertUnorderedList'
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

  @Output('p-value') value = new EventEmitter<any>();

  ngOnInit() {
    this.bodyElement.nativeElement.designMode = 'on';

    // timeout necessário para setar o valor vindo do writeValue do componente principal.
    setTimeout(() => this.updateValueWithModelValue());
  }

  executeCommand(command: (string | { command: any, value: string })) {
    this.bodyElement.nativeElement.focus();

    if (typeof (command) === 'object') {
      document.execCommand(command.command, false, command.value);
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

  private emitSelectionCommands() {
    const commands = poRichTextBodyCommands.filter(command => document.queryCommandState(command));
    const rgbColor = document.queryCommandValue('ForeColor');
    const hexColor = this.rgbToHex(rgbColor);
    this.commands.emit({commands, hexColor});
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
