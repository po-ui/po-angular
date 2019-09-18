import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { convertImageToBase64 } from '../../../../utils/util';
import { PoLanguageService } from './../../../../services/po-language/po-language.service';

import { PoModalAction, PoModalComponent } from '../../../po-modal';
import { poRichTextLiteralsDefault } from '../po-rich-text-literals';
import { PoRichTextModalType } from '../enums/po-rich-text-modal-type.enum';
import { PoUploadComponent } from '../../po-upload/po-upload.component';
import { PoUploadFileRestrictions } from '../../po-upload/interfaces/po-upload-file-restriction.interface';

const uploadRestrictions = ['.apng', '.bmp', '.gif', '.ico', '.jpeg', '.jpg', '.png', '.svg'];

@Component({
  selector: 'po-rich-text-modal',
  templateUrl: './po-rich-text-modal.component.html'
})
export class PoRichTextModalComponent {

  modalType: PoRichTextModalType;
  savedCursorPosition;
  selection = document.getSelection();
  uploadModel: Array<any>;
  uploadRestrictions: PoUploadFileRestrictions = {
    allowedExtensions: uploadRestrictions
  };
  urlImage: string;

  readonly literals = {
    ...poRichTextLiteralsDefault[this.languageService.getShortLanguage()]
  };

  modalCancelAction: PoModalAction = {
    label: this.literals.cancel,
    action: () => {
      this.modal.close();
      this.cleanUpFields();
    }
  };

  modalConfirmAction: PoModalAction = {
    label: this.literals.insert,
    disabled: false,
    action: () => this.insertElementRef()
  };

  get isUploadValid(): boolean {
    return !!(this.uploadModel && this.uploadModel.length);
  }

  get isUrlValid(): boolean {
    return !!this.urlImage && this.modalImageForm && this.modalImageForm.valid;
  }

  @ViewChild('modal', { static: true }) modal: PoModalComponent;

  @ViewChild('modalImageForm', { static: false }) modalImageForm: NgForm;

  @ViewChild('upload', { static: true }) upload: PoUploadComponent;

  @ViewChild('modalImage', { static: true }) modalImage: ElementRef;

  @Output('p-command') command = new EventEmitter<string | { command: string, value: string }>();

  constructor(private languageService: PoLanguageService) {}

  async convertToBase64() {
    if (this.isUploadValid) {
      const uploadImage = this.uploadModel[0].rawFile;
      return await convertImageToBase64(uploadImage);
    }
  }

  emitCommand(value) {
    let command: string;
    if (value && this.modalType === PoRichTextModalType.Image) {
      command = 'insertImage';
      this.command.emit(({ command, value }));
    }
  }

  async insertElementRef() {

    let uploadImage: string;

    if (this.modalType === PoRichTextModalType.Image && !this.urlImage) {
      uploadImage = await this.convertToBase64();
    }

    this.retrieveCursorPosition();
    this.modal.close();

    if (this.isUrlValid || this.isUploadValid) {
      this.emitCommand(this.urlImage || uploadImage);
    }
    this.cleanUpFields();
  }

  openModal(type: PoRichTextModalType) {
    this.modalType = type;
    this.saveCursorPosition();
    this.modal.open();
  }

  private cleanUpFields() {
    this.urlImage = undefined;
    this.uploadModel = undefined;
  }

  private retrieveCursorPosition() {
    this.selection.collapse(this.savedCursorPosition[0], this.savedCursorPosition[1]);
  }

  private saveCursorPosition() {
    this.savedCursorPosition = [ this.selection.focusNode, this.selection.focusOffset ];
  }

}
