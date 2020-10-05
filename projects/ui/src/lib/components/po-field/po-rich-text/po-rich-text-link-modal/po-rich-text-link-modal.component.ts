import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, NgForm } from '@angular/forms';

import { isExternalLink, isIE } from '../../../../utils/util';
import { PoLanguageService } from './../../../../services/po-language/po-language.service';

import { PoModalAction, PoModalComponent } from '../../../po-modal';
import { poRichTextLiteralsDefault } from '../po-rich-text-literals';

@Component({
  selector: 'po-rich-text-link-modal',
  templateUrl: './po-rich-text-link-modal.component.html'
})
export class PoRichTextLinkModalComponent {
  savedCursorPosition;
  selection = document.getSelection();
  urlLink: string;
  urlLinkText: string;

  private isLinkEditing: boolean;
  private isSelectedLink: boolean;
  private linkElement: any;
  private savedSelection: Range | null;

  readonly literals = {
    ...poRichTextLiteralsDefault[this.languageService.getShortLanguage()]
  };

  modalCancelAction: PoModalAction = {
    label: this.literals.cancel,
    action: () => {
      this.modal.close();
      this.command.emit();
      this.retrieveCursorPosition();
      this.cleanUpFields();
    }
  };

  modalConfirmAction = {
    label: this.linkConfirmAction(),
    disabled: true,
    action: () => (this.isLinkEditing ? this.toEditLink() : this.toInsertLink(this.urlLink, this.urlLinkText))
  };

  @ViewChild('modal', { static: true }) modal: PoModalComponent;

  @ViewChild('modalLinkForm') modalLinkForm: NgForm;

  @Output('p-command') command = new EventEmitter<string | { command: string; value: string | any }>();

  @Output('p-link-editing') linkEditing = new EventEmitter<any>();

  constructor(private languageService: PoLanguageService) {}

  linkConfirmAction(): string {
    return this.isLinkEditing ? this.literals.editLink : this.literals.insertLink;
  }

  formModelValidate() {
    return (this.modalConfirmAction.disabled = this.modalLinkForm?.invalid);
  }

  openModal(selectedLinkElement: ElementRef) {
    this.saveCursorPosition();
    this.prepareModalForLink(selectedLinkElement);

    this.modalConfirmAction.label = this.linkConfirmAction();
    this.modal.open();
  }

  private selectedLink(linkElement: ElementRef) {
    this.isSelectedLink = !!linkElement;
    this.linkElement = linkElement;
  }

  private checkIfIsEmpty(urlLink: string, urlLinkText: string) {
    return urlLinkText === undefined || urlLinkText.trim() === '' ? urlLink : urlLinkText;
  }

  private cleanUpFields() {
    this.urlLink = undefined;
    this.urlLinkText = undefined;
    this.isLinkEditing = false;
    this.isSelectedLink = false;
    this.linkElement = undefined;
  }

  private formReset(control: AbstractControl) {
    control.markAsPristine();
    control.markAsUntouched();
    control.updateValueAndValidity();
  }

  private prepareModalForLink(selectedLinkElement: ElementRef) {
    this.saveSelectionText();
    if (this.modalLinkForm) {
      this.formReset(this.modalLinkForm.control);
    }

    setTimeout(() => {
      this.formModelValidate();
    });

    this.selectedLink(selectedLinkElement);

    if (this.isSelectedLink) {
      this.isLinkEditing = true;
      this.setLinkEditableForModal();
    }

    this.linkEditing.emit(this.isLinkEditing);
  }

  private restoreSelection() {
    if (this.savedSelection) {
      if (this.selection) {
        this.selection.removeAllRanges();
        this.selection.addRange(this.savedSelection);
      }
      return true;
    } else {
      return false;
    }
  }

  private retrieveCursorPosition() {
    this.selection.collapse(this.savedCursorPosition[0], this.savedCursorPosition[1]);
  }

  private saveCursorPosition() {
    this.savedCursorPosition = [this.selection.focusNode, this.selection.focusOffset];
  }

  private saveSelectionText() {
    if (this.selection.anchorNode !== null) {
      this.savedSelection = this.selection.getRangeAt(0);
      this.urlLinkText = this.selection.toString();
    } else {
      return null;
    }
  }

  private setLinkEditableForModal() {
    this.urlLinkText = this.linkElement.innerText;
    this.urlLink = this.linkElement.getAttribute('href');
  }

  private toEditLink() {
    if (isIE()) {
      this.linkElement.parentNode.removeChild(this.linkElement);
    } else {
      this.linkElement.remove();
    }

    this.toInsertLink(this.urlLink, this.urlLinkText);
  }

  private toInsertLink(urlLink, urlLinkText) {
    this.modal.close();
    this.restoreSelection();

    const urlLinkTextValue = this.checkIfIsEmpty(urlLink, urlLinkText);
    const urlAsExternalLink = isExternalLink(urlLink) ? urlLink : `http://${urlLink}`;

    const command: string = 'InsertHTML';

    const value = { urlLink: urlAsExternalLink, urlLinkText: urlLinkTextValue };

    this.command.emit({ command, value });

    this.cleanUpFields();
  }
}
