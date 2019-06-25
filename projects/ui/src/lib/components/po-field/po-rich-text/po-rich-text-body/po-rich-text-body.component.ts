import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

const poRichTextBodyCommands = [
  'bold', 'italic', 'underline', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertUnorderedList'
];

@Component({
  selector: 'po-rich-text-body',
  templateUrl: './po-rich-text-body.component.html'
})
export class PoRichTextBodyComponent implements OnInit {

  @ViewChild('bodyElement', { static: true }) bodyElement: ElementRef;

  @Input('p-height') height?: string;

  @Input('p-model-value') modelValue?: string;

  @Input('p-placeholder') placeholder?: string;

  @Input('p-readonly') readonly?: string;

  @Output('p-commands') commands = new EventEmitter<any>();

  @Output('p-value') value = new EventEmitter<any>();

  ngOnInit() {
    this.bodyElement.nativeElement.designMode = 'on';

    // timeout necessário para setar o valor vindo do writeValue do componente principal.
    setTimeout(() => { this.updateValueWithModelValue(); });
  }

  executeCommand(command: string) {
    this.bodyElement.nativeElement.focus();
    document.execCommand(command, false, null);
    this.updateModel();
    this.value.emit(this.modelValue);
  }

  onClick() {
    this.emitSelectionCommands();
  }

  onKeyUp() {
    // Tratamento necessário para eliminar a tag <br> criada no firefox quando o body for limpo.
    if (!this.bodyElement.nativeElement.innerText.trim() && this.bodyElement.nativeElement.firstChild) {
      this.bodyElement.nativeElement.firstChild.remove();
    }
    this.updateModel();
    this.emitSelectionCommands();
  }

  update() {
    setTimeout(() => { this.updateModel(); });
    setTimeout(() => { this.onKeyUp(); });
  }

  private emitSelectionCommands() {
    const commands: Array<string> = poRichTextBodyCommands.filter(command => {
      return document.queryCommandState(command);
    });

    this.commands.emit(commands);
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
