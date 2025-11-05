import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewChild,
  forwardRef,
  inject
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoI18nPipe } from '../../../services/po-i18n/po-i18n.pipe';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { PoNotificationService } from '../../../services/po-notification/po-notification.service';
import { formatBytes, isMobile, isTypeof, setHelperSettings, uuid } from '../../../utils/util';
import { PoProgressStatus } from '../../po-progress/enums/po-progress-status.enum';
import { PoButtonComponent } from './../../po-button/po-button.component';

import { PoModalAction, PoModalComponent } from '../../po-modal';
import { PoUploadBaseComponent } from './po-upload-base.component';
import { PoUploadDragDropComponent } from './po-upload-drag-drop/po-upload-drag-drop.component';
import { PoUploadFile } from './po-upload-file';
import { PoUploadStatus } from './po-upload-status.enum';
import { PoUploadService } from './po-upload.service';
import { PoHelperComponent } from '../../po-helper';

/**
 * @docsExtends PoUploadBaseComponent
 *
 * @example
 *
 * <example name="po-upload-basic" title="PO Upload Basic">
 *   <file name="sample-po-upload-basic/sample-po-upload-basic.component.html"> </file>
 *   <file name="sample-po-upload-basic/sample-po-upload-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-upload-labs" title="PO Upload Labs">
 *   <file name="sample-po-upload-labs/sample-po-upload-labs.component.html"> </file>
 *   <file name="sample-po-upload-labs/sample-po-upload-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-upload-resume" title="PO Upload - Resume">
 *   <file name="sample-po-upload-resume/sample-po-upload-resume.component.html"> </file>
 *   <file name="sample-po-upload-resume/sample-po-upload-resume.component.ts"> </file>
 * </example>
 *
 * <example name="po-upload-rs" title="PO Upload - Realize & Show">
 *   <file name="sample-po-upload-rs/sample-po-upload-rs.component.html"> </file>
 *   <file name="sample-po-upload-rs/sample-po-upload-rs.component.ts"> </file>
 * </example>
 *
 * <example name="po-upload-download" title="PO Upload - with Download Button">
 *   <file name="sample-po-upload-download/sample-po-upload-download.component.html"> </file>
 *   <file name="sample-po-upload-download/sample-po-upload-download.component.ts"> </file>
 * </example>
 *
 * <example name="po-upload-preview" title="PO Upload - with Preview">
 *   <file name="sample-po-upload-preview/sample-po-upload-preview.component.html"> </file>
 *   <file name="sample-po-upload-preview/sample-po-upload-preview.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-upload',
  templateUrl: './po-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PoI18nPipe,
    PoUploadService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoUploadComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoUploadComponent),
      multi: true
    }
  ],
  standalone: false
})
export class PoUploadComponent extends PoUploadBaseComponent implements AfterViewInit, OnChanges {
  renderer = inject(Renderer2);
  private i18nPipe = inject(PoI18nPipe);
  private notification = inject(PoNotificationService);

  @ViewChild('inputFile', { read: ElementRef, static: true }) private inputFile: ElementRef;
  @ViewChild(PoUploadDragDropComponent) private poUploadDragDropComponent: PoUploadDragDropComponent;
  @ViewChild('uploadButton') uploadButton: PoButtonComponent;
  @ViewChild('modal') modalComponent: PoModalComponent;
  @ViewChild('helperEl', { read: PoHelperComponent, static: false }) helperEl?: PoHelperComponent;

  id = `po-upload[${uuid()}]`;

  infoByUploadStatus: { [key: string]: { text: (percent?: number) => string; icon?: string } } = {
    [PoUploadStatus.Uploaded]: {
      text: () => this.literals.sentWithSuccess,
      icon: 'ICON_OK'
    },
    [PoUploadStatus.Error]: {
      text: () => this.literals.errorOccurred
    },
    [PoUploadStatus.Uploading]: {
      text: percent => percent + '%'
    }
  };

  progressStatusByFileStatus = {
    [PoUploadStatus.Uploaded]: PoProgressStatus.Success,
    [PoUploadStatus.Error]: PoProgressStatus.Error
  };

  private calledByCleanInputValue: boolean = false;

  protected modalPrimaryAction: PoModalAction;
  protected modalSecondaryAction: PoModalAction;
  protected errorMessage: string;
  protected tooltipTitle = '';
  protected modalImageUrl = '';
  protected errorModalImage: boolean = false;

  constructor() {
    const uploadService = inject(PoUploadService);
    const languageService = inject(PoLanguageService);
    const cd = inject(ChangeDetectorRef);

    super(uploadService, languageService, cd);
  }

  get displayDragDrop(): boolean {
    return this.dragDrop && !isMobile();
  }

  get displaySendButton(): boolean {
    const currentFiles = this.currentFiles || [];
    return (
      !this.hideSendButton && !this.autoUpload && currentFiles.length > 0 && this.hasFileNotUploaded && this.requiredUrl
    );
  }

  get selectFileButtonLabel() {
    if (this.canHandleDirectory) {
      return this.literals.selectFolder;
    } else if (this.isMultiple) {
      return this.literals.selectFiles;
    } else {
      return this.literals.selectFile;
    }
  }

  get hasMoreThanFourItems(): boolean {
    return this.currentFiles && this.currentFiles.length > 4;
  }

  get hasMultipleFiles(): boolean {
    return this.currentFiles && this.currentFiles.length > 1;
  }

  get hasFileNotUploaded(): boolean {
    if (Array.isArray(this.currentFiles)) {
      return this.currentFiles.some(
        file => file.status !== PoUploadStatus.Uploaded && file.status !== PoUploadStatus.Error
      );
    }

    return false;
  }

  get isDisabled(): boolean {
    const currentFiles = this.currentFiles || [];

    return this.requiredUrl
      ? !!(
          this.hasAnyFileUploading(currentFiles) ||
          !this.url ||
          this.disabled ||
          this.isExceededFileLimit(currentFiles.length)
        )
      : !!(
          this.hasAnyFileUploading(currentFiles) ||
          this.autoUpload ||
          this.disabled ||
          this.isExceededFileLimit(currentFiles.length)
        );
  }

  get maxFiles(): number {
    return this.isMultiple && this.fileRestrictions && this.fileRestrictions.maxFiles;
  }

  cancel(file: PoUploadFile, keydown?: KeyboardEvent) {
    if (this.disabledRemoveFile || (keydown && keydown.code !== 'Enter' && keydown.code !== 'Space')) return;

    if (file.status === PoUploadStatus.Uploading) {
      return this.stopUpload(file);
    }

    this.removeFile(file);
    if (file.status !== PoUploadStatus.Uploaded) {
      this.onCancel.emit(file);
    } else {
      this.onRemove.emit(file);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['label']) {
      this.displayAdditionalHelp = false;
    }
    if (changes['customModalActions']) {
      if (this.customModalActions?.length > 0) {
        this.modalPrimaryAction = this.customModalActions[0];
        this.modalSecondaryAction = this.customModalActions[1] || undefined;
      } else {
        this.setPrimaryActionModal();
      }
    }
  }

  ngAfterViewInit() {
    if (!this.customModalActions?.length) {
      this.setPrimaryActionModal();
    }

    if (this.autoFocus) {
      this.focus();
    }
  }

  /** Método responsável por **limpar** o(s) arquivo(s) selecionado(s). */
  clear() {
    this.currentFiles = undefined;
    this.updateModel([]);
    this.cleanInputValue();
  }

  emitAdditionalHelp() {
    if (this.label && this.isAdditionalHelpEventTriggered()) {
      this.additionalHelp.emit();
    }
  }

  /**
   * Função que atribui foco ao componente.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoUploadComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoUploadComponent, { static: true }) upload: PoUploadComponent;
   *
   * focusUpload() {
   *   this.upload.focus();
   * }
   * ```
   */
  focus() {
    if (!this.disabled) {
      if (this.uploadButton) {
        this.uploadButton.focus();
        return;
      }

      if (this.displayDragDrop) {
        this.poUploadDragDropComponent.focus();
      }
    }
  }

  getAdditionalHelpTooltip() {
    return this.isAdditionalHelpEventTriggered() ? null : this.additionalHelpTooltip;
  }

  // Verifica se existe algum arquivo sendo enviado ao serviço.
  hasAnyFileUploading(files: Array<PoUploadFile>) {
    if (files && files.length) {
      return files.some(file => file.status === PoUploadStatus.Uploading);
    }

    return false;
  }

  isAllowCancelEvent(status: PoUploadStatus) {
    return status !== PoUploadStatus.Uploaded;
  }

  onFileChange(event): void {
    // necessário este tratamento quando para IE, pois nele o change é disparado quando o campo é limpado também
    if (this.calledByCleanInputValue) {
      this.calledByCleanInputValue = false;
      return event.preventDefault();
    }

    const files = event.target.files;
    this.updateFiles(files);

    this.cleanInputValue();
  }

  onFileChangeDragDrop(files) {
    this.updateFiles(files);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.isUploadButtonFocused()) {
      this.keydown.emit(event);
    }
  }

  /**
   * Método responsável por fechar o modal.
   */
  closeModal() {
    this.errorModalImage = false;
    this.modalComponent.close();
    this.modalImageUrl = '';
  }

  openModal(file: PoUploadFile, keydown?: KeyboardEvent) {
    if (keydown && keydown.code !== 'Enter' && keydown.code !== 'Space') return;

    if (file?.thumbnailUrl && !file.errorMessage) {
      this.errorModalImage = false;
      this.modalComponent.open();
      this.modalImageUrl = file.thumbnailUrl;
      this.onOpenModalPreview.emit(file);
    }
  }

  // Remove o arquivo passado por parâmetro da lista dos arquivos correntes.
  removeFile(file): void {
    const index = this.currentFiles.findIndex(f => f.uid === file.uid);
    if (index !== -1) {
      this.currentFiles.splice(index, 1);
    }

    this.updateModel([...this.currentFiles]);
  }

  /** Método responsável por **abrir** a janela para seleção de arquivo(s). */
  selectFiles() {
    this.onModelTouched?.();
    this.calledByCleanInputValue = false;
    this.inputFile.nativeElement.click();
  }

  sendFeedback(file?): void {
    let sizeNotAllowed = this.sizeNotAllowed;
    let extensionNotAllowed = this.extensionNotAllowed;
    let quantityNotAllowed = this.quantityNotAllowed;
    if (file) {
      sizeNotAllowed = file.sizeNotAllowed ? 1 : undefined;
      extensionNotAllowed = file.extensionNotAllowed ? 1 : undefined;
      quantityNotAllowed = undefined;
    }

    if (sizeNotAllowed > 0) {
      const minFileSize = formatBytes(this.fileRestrictions.minFileSize);
      const maxFileSize = formatBytes(this.fileRestrictions.maxFileSize);
      const args = [this.sizeNotAllowed, minFileSize || '0', maxFileSize];
      this.setPipeArguments('invalidSize', args, file);
      this.sizeNotAllowed = 0;
    }

    if (extensionNotAllowed > 0) {
      const allowedExtensionsFormatted = this.fileRestrictions.allowedExtensions.join(', ').toUpperCase();
      const args = [this.extensionNotAllowed, allowedExtensionsFormatted];
      this.setPipeArguments('invalidFormat', args, file);
      this.extensionNotAllowed = 0;
    }

    if (quantityNotAllowed > 0) {
      const args = [this.quantityNotAllowed];
      this.setPipeArguments('invalidAmount', args);
      this.quantityNotAllowed = 0;
    }
  }

  /** Método responsável por **enviar** o(s) arquivo(s) selecionado(s). */
  sendFiles(): void {
    if (this.currentFiles && this.currentFiles.length) {
      this.uploadFiles(this.currentFiles);
    }
  }

  setDirectoryAttribute(canHandleDirectory: boolean) {
    if (canHandleDirectory) {
      this.renderer.setAttribute(this.inputFile.nativeElement, 'webkitdirectory', 'true');
    } else {
      this.renderer.removeAttribute(this.inputFile.nativeElement, 'webkitdirectory');
    }
  }

  /**
   * Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
   * Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.
   *
   * > Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.
   *
   * ```
   * //Exemplo com p-label e p-helper
   * <po-upload
   *  #upload
   *  ...
   *  p-label="Label do upload"
   *  [p-helper]="helperOptions"
   *  (p-keydown)="onKeyDown($event, upload)"
   * ></po-upload>
   * ```
   * ```
   * ...
   * onKeyDown(event: KeyboardEvent, inp: PoUploadComponent): void {
   *  if (event.code === 'F9') {
   *    inp.showAdditionalHelp();
   *  }
   * }
   * ```
   */
  showAdditionalHelp(): boolean {
    this.displayAdditionalHelp = !this.displayAdditionalHelp;
    const helper = this.poHelperComponent();
    const isHelpEvt = this.isAdditionalHelpEventTriggered();
    if (!this.label && (helper || this.additionalHelpTooltip || isHelpEvt)) {
      if (isHelpEvt) {
        this.additionalHelp.emit();
      }
      if (typeof helper !== 'string' && typeof helper?.eventOnClick === 'function') {
        helper.eventOnClick();
        return;
      }
      if (this.helperEl?.helperIsVisible()) {
        this.helperEl?.closeHelperPopover();
        return;
      }
      this.helperEl?.openHelperPopover();
      return;
    }
    return this.displayAdditionalHelp;
  }

  stopUpload(file: PoUploadFile) {
    this.uploadService.stopRequestByFile(file, () => {
      if (this.autoUpload) {
        this.removeFile(file);
      } else {
        this.stopUploadHandler(file);
      }
      this.cd.markForCheck();
    });
  }

  trackByFn(index, file: PoUploadFile) {
    return file.uid;
  }

  uploadFiles(files: Array<PoUploadFile>) {
    const filesFiltered = files.filter(
      file => file.status !== PoUploadStatus.Uploaded && !file.sizeNotAllowed && !file.extensionNotAllowed
    );
    if (files.length === 0) return;
    this.uploadService.upload(
      this.url,
      filesFiltered,
      this.headers,
      this.onUpload,
      (file, percent): any => {
        // UPLOADING
        this.uploadingHandler(file, percent);
      },
      (file, eventResponse): any => {
        // SUCCESS
        this.responseHandler(file, PoUploadStatus.Uploaded);
        this.onSuccess.emit(eventResponse);

        // esconde o status de sucesso após 500ms
        setTimeout(() => {
          const currentFile = this.currentFiles.find(f => f.uid === file.uid);
          if (currentFile) {
            currentFile.hideDoneContent = true;
            this.cd.detectChanges();
          }
        }, 500);
      },
      (file, eventError): any => {
        // Error
        this.responseHandler(file, PoUploadStatus.Error);
        this.onError.emit(eventError);
      }
    );
  }

  customClick(file: PoUploadFile) {
    if (this.customAction) {
      this.customActionClick.emit(file);
    }
  }

  setHelper(label?: string, additionalHelpTooltip?: string) {
    return setHelperSettings(
      label,
      additionalHelpTooltip,
      this.poHelperComponent(),
      this.size,
      this.isAdditionalHelpEventTriggered() ? this.additionalHelp : undefined
    );
  }

  protected actionIsDisabled(action: any) {
    return isTypeof(action.disabled, 'function') ? action.disabled(action) : action.disabled;
  }

  protected isActionVisible(action: any): boolean {
    if (!action || (!action.label && !action.icon)) {
      return false;
    }

    if (action.visible === undefined) {
      return true;
    }

    if (isTypeof(action.visible, 'function')) {
      return action.visible();
    }

    return !!action.visible;
  }

  protected onImageError(file: any): void {
    file.imageError = true;
  }

  protected showTooltipText(e: MouseEvent, text: string) {
    const element = e.target as HTMLElement;

    if (element.offsetWidth < element.scrollWidth) {
      this.tooltipTitle = text;
    } else {
      this.tooltipTitle = undefined;
    }
  }

  private cleanInputValue() {
    this.calledByCleanInputValue = true;
    this.inputFile.nativeElement.value = '';
    this.cd.detectChanges();
  }

  private isAdditionalHelpEventTriggered(): boolean {
    return (
      this.additionalHelpEventTrigger === 'event' ||
      (this.additionalHelpEventTrigger === undefined && this.additionalHelp.observed)
    );
  }

  private isUploadButtonFocused(): boolean {
    return document.activeElement === this.uploadButton.buttonElement.nativeElement;
  }

  private responseHandler(file: PoUploadFile, status: PoUploadStatus) {
    file.status = status;
    file.percent = 100;
    this.cd.markForCheck();
  }

  // método responsável por setar os argumentos do i18nPipe de acordo com a restrição.
  private setPipeArguments(literalAttributes: string, literalArguments?, file?) {
    const pipeArguments = this.i18nPipe.transform(this.literals[literalAttributes], literalArguments);
    this.errorMessage = pipeArguments;
    if (literalAttributes === 'invalidAmount') {
      this.notification.information(pipeArguments);
    }

    if (file) {
      file.errorMessage = pipeArguments;
    }
  }

  private setPrimaryActionModal() {
    this.modalPrimaryAction = {
      label: this.literals.continue,
      action: this.closeModal.bind(this)
    };
    this.modalSecondaryAction = undefined;
  }

  // Função disparada ao parar um envio de arquivo.
  private stopUploadHandler(file: PoUploadFile) {
    file.status = PoUploadStatus.None;
    file.percent = 0;
    this.cd.markForCheck();
  }

  private updateFiles(files) {
    this.currentFiles = this.parseFiles(files);

    this.updateModel([...this.currentFiles]);

    if (this.autoUpload) {
      this.uploadFiles(this.currentFiles);
    }
  }

  private updateModel(files: Array<PoUploadFile>) {
    const modelFiles: Array<PoUploadFile> = this.mapCleanUploadFiles(files);
    this.onModelChange ? this.onModelChange(modelFiles) : this.ngModelChange.emit(modelFiles);
  }

  private uploadingHandler(file: any, percent: number) {
    file.status = PoUploadStatus.Uploading;
    file.percent = percent;
    this.cd.markForCheck();
  }

  private mapCleanUploadFiles(files: Array<PoUploadFile>): Array<PoUploadFile> {
    const mapedByUploadFile = progressFile => {
      const { percent, displayName, ...uploadFile } = progressFile;
      delete uploadFile.thumbnailUrl;

      return uploadFile;
    };

    return files.map(mapedByUploadFile);
  }
}
