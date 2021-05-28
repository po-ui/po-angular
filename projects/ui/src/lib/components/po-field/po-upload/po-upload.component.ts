import { Component, ElementRef, forwardRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { formatBytes, isMobile } from '../../../utils/util';
import { PoButtonComponent } from './../../po-button/po-button.component';
import { PoI18nPipe } from '../../../services/po-i18n/po-i18n.pipe';
import { PoNotificationService } from '../../../services/po-notification/po-notification.service';
import { PoProgressStatus } from '../../po-progress/enums/po-progress-status.enum';
import { PoLanguageService } from '../../../services/po-language/po-language.service';

import { PoUploadBaseComponent } from './po-upload-base.component';
import { PoUploadDragDropComponent } from './po-upload-drag-drop/po-upload-drag-drop.component';
import { PoUploadFile } from './po-upload-file';
import { PoUploadService } from './po-upload.service';
import { PoUploadStatus } from './po-upload-status.enum';

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
 */
@Component({
  selector: 'po-upload',
  templateUrl: './po-upload.component.html',
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
  ]
})
export class PoUploadComponent extends PoUploadBaseComponent implements AfterViewInit {
  infoByUploadStatus: { [key: string]: { text: (percent?: number) => string; icon?: string } } = {
    [PoUploadStatus.Uploaded]: {
      text: () => this.literals.sentWithSuccess,
      icon: 'po-icon-ok'
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

  @ViewChild('inputFile', { read: ElementRef, static: true }) private inputFile: ElementRef;
  @ViewChild(PoUploadDragDropComponent) private poUploadDragDropComponent: PoUploadDragDropComponent;
  @ViewChild('uploadButton') private uploadButton: PoButtonComponent;

  constructor(
    uploadService: PoUploadService,
    public renderer: Renderer2,
    private i18nPipe: PoI18nPipe,
    private notification: PoNotificationService,
    languageService: PoLanguageService
  ) {
    super(uploadService, languageService);
  }

  get displayDragDrop(): boolean {
    return this.dragDrop && !isMobile();
  }

  get displaySendButton(): boolean {
    const currentFiles = this.currentFiles || [];
    return !this.hideSendButton && !this.autoUpload && currentFiles.length > 0 && this.hasFileNotUploaded;
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
      return this.currentFiles.some(file => file.status !== PoUploadStatus.Uploaded);
    }

    return false;
  }

  get isDisabled(): boolean {
    const currentFiles = this.currentFiles || [];

    return !!(
      this.hasAnyFileUploading(currentFiles) ||
      !this.url ||
      this.disabled ||
      this.isExceededFileLimit(currentFiles.length)
    );
  }

  get maxFiles(): number {
    return this.isMultiple && this.fileRestrictions && this.fileRestrictions.maxFiles;
  }

  cancel(file: PoUploadFile) {
    if (file.status === PoUploadStatus.Uploading) {
      return this.stopUpload(file);
    }

    this.removeFile(file);
  }

  ngAfterViewInit() {
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

  // Verifica se existe algum arquivo sendo enviado ao serviço.
  hasAnyFileUploading(files: Array<PoUploadFile>) {
    if (files && files.length) {
      return files.some(file => file.status === PoUploadStatus.Uploading);
    }

    return false;
  }

  // retorna se o status do arquivo é diferente de enviado
  isAllowCancelEvent(status: PoUploadStatus) {
    return status !== PoUploadStatus.Uploaded;
  }

  // Função disparada ao selecionar algum arquivo.
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

  // Remove o arquivo passado por parâmetro da lista dos arquivos correntes.
  removeFile(file): void {
    const index = this.currentFiles.indexOf(file);
    this.currentFiles.splice(index, 1);

    this.updateModel([...this.currentFiles]);
  }

  /** Método responsável por **abrir** a janela para seleção de arquivo(s). */
  selectFiles() {
    this.onModelTouched?.();
    this.calledByCleanInputValue = false;
    this.inputFile.nativeElement.click();
  }

  sendFeedback(): void {
    if (this.sizeNotAllowed > 0) {
      const minFileSize = formatBytes(this.fileRestrictions.minFileSize);
      const maxFileSize = formatBytes(this.fileRestrictions.maxFileSize);
      const args = [this.sizeNotAllowed, minFileSize || '0', maxFileSize];
      this.setPipeArguments('invalidSize', args);
      this.sizeNotAllowed = 0;
    }

    if (this.extensionNotAllowed > 0) {
      const allowedExtensionsFormatted = this.fileRestrictions.allowedExtensions.join(', ').toUpperCase();
      const args = [this.extensionNotAllowed, allowedExtensionsFormatted];
      this.setPipeArguments('invalidFormat', args);
      this.extensionNotAllowed = 0;
    }

    if (this.quantityNotAllowed > 0) {
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

  // Caso o componente estiver no modo AutoUpload, o arquivo também será removido da lista.
  stopUpload(file: PoUploadFile) {
    this.uploadService.stopRequestByFile(file, () => {
      if (this.autoUpload) {
        this.removeFile(file);
      } else {
        this.stopUploadHandler(file);
      }
    });
  }

  trackByFn(index, file: PoUploadFile) {
    return file.uid;
  }

  // Envia os arquivos passados por parâmetro, exceto os que já foram enviados ao serviço.
  uploadFiles(files: Array<PoUploadFile>) {
    const filesFiltered = files.filter(file => file.status !== PoUploadStatus.Uploaded);
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
      },
      (file, eventError): any => {
        // Error
        this.responseHandler(file, PoUploadStatus.Error);
        this.onError.emit(eventError);
      }
    );
  }

  private cleanInputValue() {
    this.calledByCleanInputValue = true;
    this.inputFile.nativeElement.value = '';
  }

  // função disparada na resposta do sucesso ou error
  private responseHandler(file: PoUploadFile, status: PoUploadStatus) {
    file.status = status;
    file.percent = 100;
  }

  // método responsável por setar os argumentos do i18nPipe de acordo com a restrição.
  private setPipeArguments(literalAttributes: string, literalArguments?) {
    const pipeArguments = this.i18nPipe.transform(this.literals[literalAttributes], literalArguments);
    this.notification.information(pipeArguments);
  }

  // Função disparada ao parar um envio de arquivo.
  private stopUploadHandler(file: PoUploadFile) {
    file.status = PoUploadStatus.None;
    file.percent = 0;
  }

  private updateFiles(files) {
    this.currentFiles = this.parseFiles(files);

    this.updateModel([...this.currentFiles]);

    if (this.autoUpload) {
      this.uploadFiles(this.currentFiles);
    }
  }

  // Atualiza o ngModel para os arquivos passados por parâmetro.
  private updateModel(files: Array<PoUploadFile>) {
    const modelFiles: Array<PoUploadFile> = this.mapCleanUploadFiles(files);
    this.onModelChange ? this.onModelChange(modelFiles) : this.ngModelChange.emit(modelFiles);
  }

  // Função disparada enquanto o arquivo está sendo enviado ao serviço.
  private uploadingHandler(file: any, percent: number) {
    file.status = PoUploadStatus.Uploading;
    file.percent = percent;
  }

  // retorna os objetos do array sem as propriedades: percent e displayName
  private mapCleanUploadFiles(files: Array<PoUploadFile>): Array<PoUploadFile> {
    const mapedByUploadFile = progressFile => {
      const { percent, displayName, ...uploadFile } = progressFile;

      return uploadFile;
    };

    return files.map(mapedByUploadFile);
  }
}
