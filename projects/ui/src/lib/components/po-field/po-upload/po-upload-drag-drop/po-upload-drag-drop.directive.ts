import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { PoI18nPipe } from '../../../../services/po-i18n/po-i18n.pipe';
import { PoNotificationService } from '../../../../services/po-notification/po-notification.service';
import { PoUploadLiterals } from '../interfaces/po-upload-literals.interface';

@Directive({
  selector: '[p-upload-drag-drop]',
  providers: [PoI18nPipe]
})
export class PoUploadDragDropDirective {
  timeout: any;

  private files: Array<File>;
  private invalidFileType: number;

  @Input('p-area-element') areaElement: HTMLElement;

  @Input('p-directory-compatible') directoryCompatible: boolean;

  @Input('p-disabled') disabled: boolean;

  @Input('p-literals') literals: PoUploadLiterals;

  @Output('p-drag-leave') dragLeave: EventEmitter<any> = new EventEmitter<any>();

  @Output('p-drag-over') dragOver: EventEmitter<any> = new EventEmitter<any>();

  @Output('p-file-change') fileChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private i18nPipe: PoI18nPipe, private notification: PoNotificationService) {}

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

    this.getFilesFromDataTransferItems(event);
    this.dragLeave.emit();
  }

  private getFilesFromDataTransferItems(event: DragEvent) {
    if (!this.disabled) {
      this.invalidFileType = 0;
      if (this.directoryCompatible) {
        this.getOnlyDirectories(event.dataTransfer.items).then(() => {
          this.sendFiles(event, this.files);
        });
      } else {
        const files = this.getOnlyFiles(event.dataTransfer);
        this.sendFiles(event, files);
      }
    }
  }

  // analisa as entradas recursivamente
  private async getFilesFromEntry(entry) {
    if (entry.isFile) {
      const file = await this.readFile(entry);
      return [file];
    } else if (entry.isDirectory) {
      return await this.readDirectory(entry);
    }
  }

  private async getOnlyDirectories(dataTransferItems) {
    const entries = [];

    // lista todas as entradas antes de analisá-las
    for (const item of dataTransferItems) {
      entries.push(item.webkitGetAsEntry());
    }

    this.files = [];
    for (const entry of entries) {
      if (entry.isFile) {
        this.invalidFileType++;
      } else {
        const newFiles = await this.getFilesFromEntry(entry);
        this.files = this.files.concat(newFiles);
      }
    }
  }

  // return only files. If it is a directory, invalidFileType counts.
  private getOnlyFiles(dataTransfer: DataTransfer): Array<File> {
    const fileList: Array<File> = Array.from(dataTransfer.files);
    const entriesFiles: Array<any> = Array.from(dataTransfer.items).map(item => item.webkitGetAsEntry());

    return fileList.reduce((newFiles, file) => {
      const entryFile = entriesFiles.find(entry => entry.name === file.name);

      if (entryFile.isFile) {
        return newFiles.concat(file);
      } else {
        this.invalidFileType++;
      }
      return newFiles;
    }, []);
  }

  private readFile(entry) {
    return new Promise(resolve => {
      entry.file(file => {
        resolve(file);
      });
    });
  }

  private async readDirectory(entry) {
    const dirReader = entry.createReader();
    let files = [];
    let newFiles;

    newFiles = await this.readDirectoryEntries(dirReader);
    files = files.concat(newFiles);
    return files;
  }

  private readDirectoryEntries(dirReader) {
    return new Promise(resolve => {
      dirReader.readEntries(async entries => {
        let files = [];
        for (const entry of entries) {
          const itemFiles = await this.getFilesFromEntry(entry);
          files = files.concat(itemFiles);
        }
        resolve(files);
      });
    });
  }

  private sendFeedback(invalidFiles: number) {
    if (invalidFiles) {
      this.setPipeArguments('invalidFileType', invalidFiles);
    }
  }

  private sendFiles(event, files) {
    if (this.areaElement.contains(event.target)) {
      if (files.length > 0) {
        this.fileChange.emit(files);
      }

      this.sendFeedback(this.invalidFileType);
    } else {
      const invalidDropAreaArg = this.directoryCompatible ? this.literals.folders : this.literals.files;
      this.setPipeArguments('invalidDropArea', invalidDropAreaArg);
    }
  }

  // método responsável por setar os argumentos do i18nPipe.
  private setPipeArguments(literalAttributes: string, args?) {
    const pipeArguments = this.i18nPipe.transform(this.literals[literalAttributes], args);
    this.notification.information(pipeArguments);
  }
}
