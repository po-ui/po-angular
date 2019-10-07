import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { AbstractControl, NgForm } from '@angular/forms';

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
  urlLink: string;
  urlLinkText: string;

  private savedSelection: Range | null;

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

  modalLinkConfirmAction = {
    label: this.literals.insertLink,
    disabled: true,
    action: () => this.toInsertLink(this.urlLink, this.urlLinkText)
  };

  get modalTitle(): string {
    return this.modalType === 'image' ? this.literals.insertImage : this.literals.insertLink;
  }

  get isUploadValid(): boolean {
    return !!(this.uploadModel && this.uploadModel.length);
  }

  get isUrlValid(): boolean {
    return !!this.urlImage && this.modalImageForm && this.modalImageForm.valid;
  }

  get modalPrimaryAction() {
    return this.modalType === 'image' ? this.modalConfirmAction : this.modalLinkConfirmAction;
  }

  @ViewChild('modal', { static: true }) modal: PoModalComponent;

  @ViewChild('modalImageForm', { static: false }) modalImageForm: NgForm;

  @ViewChild('upload', { static: true }) upload: PoUploadComponent;

  @ViewChild('modalImage', { static: true }) modalImage: ElementRef;

  @ViewChild('modalLink', { static: true }) modalLink: PoModalComponent;

  @ViewChild('modalLinkForm', { static: false }) modalLinkForm: NgForm;

  @Output('p-command') command = new EventEmitter<string | { command: string, value: string | any }>();

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

  formModelValidate() {
    return this.modalLinkConfirmAction.disabled = this.modalLinkForm && this.modalLinkForm.invalid;
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

    if (this.modalType === PoRichTextModalType.Image) {
      this.saveCursorPosition();
    } else {
      this.saveSelectionTextRange();
      this.formReset(this.modalLinkForm.control);
      this.formModelValidate();
    }

    this.modal.open();
  }

  private checkIfIsEmpty(urlLink: string, urlLinkText: string) {
    return urlLinkText === undefined || urlLinkText.trim() === '' ? urlLink : urlLinkText;
  }

  private cleanUpFields() {
    this.urlImage = undefined;
    this.urlLink = undefined;
    this.urlLinkText = undefined;
    this.uploadModel = undefined;
  }

  private formReset(control: AbstractControl) {
    control.markAsPristine();
    control.markAsUntouched();
    control.updateValueAndValidity();
  }

  private restoreSelection() {
    if (this.savedSelection) {
      if (this.selection) {
        this.selection.removeAllRanges();
        this.selection.addRange(this.savedSelection);
      }
      return true;
    }  else {
      return false;
    }
  }

  private retrieveCursorPosition() {
    this.selection.collapse(this.savedCursorPosition[0], this.savedCursorPosition[1]);
  }

  private saveCursorPosition() {
    this.savedCursorPosition = [ this.selection.focusNode, this.selection.focusOffset ];
  }

  private saveSelectionTextRange() {
    if (this.selection.anchorNode !== null) {
      this.savedSelection = this.selection.getRangeAt(0);
      this.urlLinkText = this.selection.toString();
    } else {
      return null;
    }
  }

  private toInsertLink(urlLink, urlLinkText) {
    this.modal.close();
    this.restoreSelection();

    const urlLinkTextValue = this.checkIfIsEmpty(urlLink, urlLinkText);
    const command: string = 'InsertHTML';
    const value = { urlLink: urlLink, urlLinkText: urlLinkTextValue };

    this.command.emit({ command, value });

    this.cleanUpFields();
  }

}
