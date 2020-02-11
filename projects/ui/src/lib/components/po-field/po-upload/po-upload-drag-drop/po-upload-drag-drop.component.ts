import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { convertToInt } from '../../../../utils/util';

import { PoUploadLiterals } from '../interfaces/po-upload-literals.interface';

const PoUploadDragDropHeightDefault = 320;
const PoUploadDragDropHeightMin = 160;

@Component({
  selector: 'po-upload-drag-drop',
  templateUrl: './po-upload-drag-drop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoUploadDragDropComponent {

  private _dragDropHeight?: number = PoUploadDragDropHeightDefault;

  areaElement: HTMLElement;
  isDragOver: boolean = false;

  @ViewChild('dragDropOverlay', { read: ElementRef, static: false }) dragDropOverlayElement: ElementRef;

  @ViewChild('DragDropArea', { read: ElementRef, static: true }) DragDropAreaElement: ElementRef;

  @Input('p-disabled') disabled: boolean;

  @Input('p-drag-drop-height') set dragDropHeight(value: number) {
    const dragDropHeight = convertToInt(value, PoUploadDragDropHeightDefault);

    this._dragDropHeight = (dragDropHeight < PoUploadDragDropHeightMin) ? PoUploadDragDropHeightMin : dragDropHeight;
  }

  get dragDropHeight() {
    return this._dragDropHeight;
  }

  @Input('p-literals') literals: PoUploadLiterals;

  @Output('p-file-change') fileChange: EventEmitter<any> = new EventEmitter<any>();

  @Output('p-select-files') selectFiles: EventEmitter<any> = new EventEmitter<any>();

  constructor(private changeDetector: ChangeDetectorRef) { }

  onAreaElement(element: HTMLElement) {
    this.areaElement = element;

    // necessário para não ocorrer o erro HasBeenChecked
    this.changeDetector.detectChanges();
  }

  onDragLeave() {
    this.isDragOver = false;
  }

  onDragOver() {
    this.isDragOver = true;
  }

  onFileChange(files) {
    this.isDragOver = false;

    this.fileChange.emit(files);
  }

}
