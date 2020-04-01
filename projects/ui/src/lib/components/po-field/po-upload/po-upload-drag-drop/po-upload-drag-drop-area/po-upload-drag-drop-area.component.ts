import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { PoUploadLiterals } from '../../interfaces/po-upload-literals.interface';

@Component({
  selector: 'po-upload-drag-drop-area',
  templateUrl: './po-upload-drag-drop-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoUploadDragDropAreaComponent {
  @Input('p-directory-compatible') directoryCompatible: boolean;

  @Input('p-disabled') disabled: boolean;

  @Input('p-height') height: number;

  @Input('p-literals') literals: PoUploadLiterals;

  @Input('p-overlay') overlay: boolean;

  @Output('p-select-files') selectFiles: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('selectFilesLink') selectFilesLinkElement: ElementRef;

  constructor(public elementRef: ElementRef) {}

  focus() {
    this.selectFilesLinkElement.nativeElement.focus();
  }
}
