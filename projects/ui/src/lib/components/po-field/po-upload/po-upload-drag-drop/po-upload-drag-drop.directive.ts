import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { PoNotificationService } from '../../../../services/po-notification/po-notification.service';
import { PoUploadLiterals } from '../interfaces/po-upload-literals.interface';

@Directive({
  selector: '[p-upload-drag-drop]'
})
export class PoUploadDragDropDirective {

  timeout: any;

  @Input('p-area-element') areaElement: HTMLElement;

  @Input('p-disabled') disabled: boolean;

  @Input('p-literals') literals: PoUploadLiterals;

  @Output('p-drag-leave') dragLeave: EventEmitter<any> = new EventEmitter<any>();

  @Output('p-drag-over') dragOver: EventEmitter<any> = new EventEmitter<any>();

  @Output('p-file-change') fileChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private notification: PoNotificationService) {}

  @HostListener('document:dragleave', ['$event']) onDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();

    this.timeout = setTimeout(() => this.dragLeave.emit(), 30);
  }

  @HostListener('document:dragover', ['$event']) onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();

    clearTimeout(this.timeout);

    if (!this.disabled) {
      this.dragOver.emit();
    }
  }

  @HostListener('document:drop', ['$event']) onDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.disabled) {
      const files = this.getOnlyFiles(event.dataTransfer.files);

      this.sendFiles(event, files);

      this.dragLeave.emit();
    }
  }

  // return only file, folder is ignored
  private getOnlyFiles(fileList: FileList): Array<File> {
    return Array.from(fileList).reduce((newFiles, file) =>
      file.type ? newFiles.concat(file) : newFiles,
    []);
  }

  private sendFiles(event, files) {
    if (this.areaElement.contains(event.target)) {
      if (files.length > 0) {
        this.fileChange.emit(files);
      }
    } else {
      this.notification.information(this.literals.invalidDropArea);
    }
  }

}
