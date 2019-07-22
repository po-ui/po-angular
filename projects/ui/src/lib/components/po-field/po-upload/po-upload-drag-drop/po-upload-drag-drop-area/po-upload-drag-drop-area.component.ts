import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { PoUploadLiterals } from '../../interfaces/po-upload-literals.interface';

@Component({
  selector: 'po-upload-drag-drop-area',
  templateUrl: './po-upload-drag-drop-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoUploadDragDropAreaComponent {

  @Input('p-disabled') disabled: boolean;

  @Input('p-height') height: number;

  @Input('p-literals') literals: PoUploadLiterals;

  @Input('p-overlay') overlay: boolean;

  @Output('p-select-files') selectFiles: EventEmitter<any> = new EventEmitter<any>();

}
