import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject
} from '@angular/core';

import { PoUploadLiterals } from '../../interfaces/po-upload-literals.interface';

@Component({
  selector: 'po-upload-drag-drop-area',
  templateUrl: './po-upload-drag-drop-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoUploadDragDropAreaComponent {
  elementRef = inject(ElementRef);

  @Input('p-directory-compatible') directoryCompatible: boolean;

  @Input('p-disabled') disabled: boolean;

  @Input('p-height') height: number;

  @Input('p-literals') literals: PoUploadLiterals;

  @Input('p-overlay') overlay: boolean;

  @Output('p-select-files') selectFiles: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('selectFilesLink') selectFilesLinkElement: ElementRef;

  focus() {
    this.selectFilesLinkElement.nativeElement.focus();
  }
}
