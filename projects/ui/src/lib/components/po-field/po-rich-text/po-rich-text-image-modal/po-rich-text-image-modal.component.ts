import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PoUtils } from '../../../../utils/util';
import { PoLanguageService } from './../../../../services/po-language/po-language.service';

import { PoModalAction, PoModalComponent } from '../../../po-modal';
import { PoUploadFileRestrictions } from '../../po-upload/interfaces/po-upload-file-restriction.interface';
import { PoUploadComponent } from '../../po-upload/po-upload.component';
import { poRichTextLiteralsDefault } from '../po-rich-text-literals';

const uploadRestrictions = ['.apng', '.bmp', '.gif', '.ico', '.jpeg', '.jpg', '.png', '.svg'];

@Component({
  selector: 'po-rich-text-image-modal',
  templateUrl: './po-rich-text-image-modal.component.html',
  standalone: false
})
export class PoRichTextImageModalComponent {
  private languageService = inject(PoLanguageService);

  @ViewChild('modal', { static: true }) modal: PoModalComponent;

  @ViewChild('modalImageForm') modalImageForm: NgForm;

  @ViewChild('upload', { static: true }) upload: PoUploadComponent;

  @Input('p-size') size: string;

  @Output('p-command') command = new EventEmitter<string | { command: string; value: string | any }>();

  savedCursorPosition;
  selection = document.getSelection();
  uploadModel: Array<any>;
  uploadRestrictions: PoUploadFileRestrictions = {
    allowedExtensions: uploadRestrictions
  };
  urlImage: string;

  readonly literals: any;

  modalCancelAction: PoModalAction;

  modalConfirmAction: PoModalAction;

  get isUploadValid(): boolean {
    return !!(this.uploadModel && this.uploadModel.length);
  }

  get isUrlValid(): boolean {
    return !!this.urlImage && this.modalImageForm && this.modalImageForm.valid;
  }

  constructor() {
    this.literals = {
      ...poRichTextLiteralsDefault[this.languageService.getShortLanguage()]
    };

    this.modalCancelAction = {
      label: this.literals.cancel,
      action: () => {
        this.modal.close();
        this.command.emit();
        this.retrieveCursorPosition();
        this.cleanUpFields();
      }
    };

    this.modalConfirmAction = {
      label: this.literals.insert,
      disabled: false,
      action: () => this.insertElementRef()
    };
  }

  openModal() {
    this.saveCursorPosition();
    this.modal.open();
  }

  private cleanUpFields() {
    this.urlImage = undefined;
    this.uploadModel = undefined;
  }

  private async convertToBase64() {
    if (this.isUploadValid) {
      const uploadImage = this.uploadModel[0].rawFile;
      return await PoUtils.convertImageToBase64(uploadImage);
    }
  }

  private emitCommand(value) {
    let command: string;
    if (value) {
      command = 'insertImage';
      this.command.emit({ command, value });
    }
  }

  private async insertElementRef() {
    let uploadImage: string;

    if (!this.urlImage) {
      uploadImage = await this.convertToBase64();
    }

    this.retrieveCursorPosition();
    this.modal.close();

    if (this.isUrlValid || this.isUploadValid) {
      this.emitCommand(this.urlImage || uploadImage);
    }
    this.cleanUpFields();
  }

  private retrieveCursorPosition() {
    this.selection.collapse(this.savedCursorPosition[0], this.savedCursorPosition[1]);
  }

  private saveCursorPosition() {
    this.savedCursorPosition = [this.selection.focusNode, this.selection.focusOffset];
  }
}
