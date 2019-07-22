import { Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { isMobile } from '../../../utils/util';

import { PoUploadBaseComponent } from './po-upload-base.component';
import { PoUploadFile } from './po-upload-file';
import { PoUploadService } from './po-upload.service';
import { PoUploadStatus } from './po-upload-status.enum';

/**
 * @docsExtends PoUploadBaseComponent
 *
 * @example
 *
 * <example name="po-upload-basic" title="Portinari Upload Basic">
 *   <file name="sample-po-upload-basic/sample-po-upload-basic.component.html"> </file>
 *   <file name="sample-po-upload-basic/sample-po-upload-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-upload-labs" title="Portinari Upload Labs">
 *   <file name="sample-po-upload-labs/sample-po-upload-labs.component.html"> </file>
 *   <file name="sample-po-upload-labs/sample-po-upload-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-upload-resume" title="Portinari Upload - Resume">
 *   <file name="sample-po-upload-resume/sample-po-upload-resume.component.html"> </file>
 *   <file name="sample-po-upload-resume/sample-po-upload-resume.component.ts"> </file>
 * </example>
 *
 * <example name="po-upload-resume-drag-drop" title="Portinari Upload - Resume Drag Drop">
 *   <file name="sample-po-upload-resume-drag-drop/sample-po-upload-resume-drag-drop.component.html"> </file>
 *   <file name="sample-po-upload-resume-drag-drop/sample-po-upload-resume-drag-drop.component.ts"> </file>
 * </example>
 *
 * <example name="po-upload-rs" title="Portinari Upload - Realize & Show">
 *   <file name="sample-po-upload-rs/sample-po-upload-rs.component.html"> </file>
 *   <file name="sample-po-upload-rs/sample-po-upload-rs.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-upload',
  templateUrl: './po-upload.component.html',
  providers: [
    PoUploadService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoUploadComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoUploadComponent),
      multi: true,
    }
  ]
})
export class PoUploadComponent extends PoUploadBaseComponent {

  private calledByCleanInputValue: boolean = false;

  @ViewChild('inputFile', {read: ElementRef, static: true }) private inputFile: ElementRef;

  constructor(private elementRef: ElementRef, uploadService: PoUploadService) {
    super(uploadService);
  }

  get displayDragDrop(): boolean {
    return this.dragDrop && !isMobile();
  }

  get displaySendButton(): boolean {
    const currentFiles = this.currentFiles || [];
    return !this.hideSendButton && !this.autoUpload && (currentFiles.length > 0 && this.hasFileNotUploaded);
  }

  get hasFileNotUploaded(): boolean {
    if (Array.isArray(this.currentFiles)) {
      return this.currentFiles.some(file => file.status !== PoUploadStatus.Uploaded);
    }

    return false;
  }

  get isDisabled(): boolean {
    const currentFiles = this.currentFiles || [];

    return this.hasAnyFileUploading(this.currentFiles) ||
    !this.url ||
    this.disabled ||
    this.isExceededFileLimit(currentFiles.length);
  }

  /** Método responsável por **limpar** o(s) arquivo(s) selecionado(s). */
  clear() {
    this.currentFiles = undefined;
    this.updateModel([]);
    this.cleanInputValue();
  }

  // Função disparada ao selecionar algum arquivo.
  onFileChange(event): void {

    // necessario este tratamento quando para IE, pois nele o change é disparado quando o campo é limpado também
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

  // Remove o arquivo passado por parametro da lista dos arquivos correntes.
  removeFile(file): void {
    const index = this.currentFiles.indexOf(file);
    this.currentFiles.splice(index, 1);

    this.updateModel([...this.currentFiles]);
  }

  /** Método responsável por **abrir** a janela para seleção de arquivo(s). */
  selectFiles(): void {
    this.calledByCleanInputValue = false;
    this.inputFile.nativeElement.click();
  }

  /** Método responsável por **enviar** o(s) arquivo(s) selecionado(s). */
  sendFiles(): void {
    if (this.currentFiles && this.currentFiles.length) {

      this.uploadFiles(this.currentFiles);
    }
  }

  // Retorna o tamanho do arquivo em KBytes.
  protected getFileSize(size: number): string {
    let kbSize = 0;

    if (size) {
        kbSize = Math.ceil(size / 1024);
    }

    return `${kbSize} KB`;
  }

  // Retorna o po-icon de acordo com o status do arquivo.
  protected getPoIcon(file: PoUploadFile): string {
    switch (file.status) {
      case PoUploadStatus.Uploaded:
        return 'po-icon-ok';

      case PoUploadStatus.Error:
        return 'po-icon-close';

      case PoUploadStatus.None:
        return 'po-icon-info';

      case PoUploadStatus.Uploading:
      default:
        return '';
    }
  }

  // Verifica se existe algum arquivo sendo enviado ao serviço.
  protected hasAnyFileUploading(files: Array<PoUploadFile>) {
    if (files && files.length) {
      return files.some(file => file.status === PoUploadStatus.Uploading);
    }

    return false;
  }

  // Valida se o status passado por parâmetro é igual ao status do arquivo.
  protected isStatusFile(status: string, file: PoUploadFile) {
    return file.status === PoUploadStatus[status];
  }

  // Caso o componente estiver no modo AutoUpload, o arquivo também será removido da lista.
  protected stopUpload(file: PoUploadFile) {
    this.uploadService.stopRequestByFile(file, () => {
      if (this.autoUpload) {
        this.removeFile(file);
      } else {
        this.stopUploadHandler(file);
      }
    });
  }

  // Envia os arquivos passados por parâmetro, exceto os que já foram enviados ao serviço.
  protected uploadFiles(files: Array<PoUploadFile>) {
    const filesFiltered = files.filter(file => {
      return file.status !== PoUploadStatus.Uploaded;
    });

    this.uploadService.upload(this.url, filesFiltered, this.onUpload,
      (file, percent): any => {
        // UPLOADING
        this.uploadingHandler(file, percent);

      }, (file, eventResponse): any => {
        // SUCCESS
        this.successHandler(file);
        this.onSuccess.emit(eventResponse);

      }, (file, eventError): any => {
        // Error
        this.errorHandler(file);
        this.onError.emit(eventError);
    });
  }

  // Atualiza a classe da div, que conter a classe 'po-upload-filename', para 'po-upload-filename-loading'.
  private addFileNameClass(uid: string) {
    const divStatus = this.elementRef.nativeElement.querySelector(`div[id='${uid}'].po-upload-progress`);
    const fileNameDiv = divStatus.querySelector('.po-upload-filename');
    fileNameDiv.classList.add('po-upload-filename-loading');
  }

  private cleanInputValue() {
    this.calledByCleanInputValue = true;
    this.inputFile.nativeElement.value = '';
  }

  // Função disparada quando é retornado um erro no envio do arquivo.
  private errorHandler(file: PoUploadFile) {
    file.status = PoUploadStatus.Error;
    this.setProgressStatus(file.uid, 0, false);
    this.setUploadStatus(file, 'po-upload-progress-error', 100);
  }

  // Remove a classe 'po-upload-filename-loading' da div que conter a classe 'po-upload-filename'.
  private removeFileNameClass(uid: string) {
    const divStatus = this.elementRef.nativeElement.querySelector(`div[id='${uid}'].po-upload-progress`);
    const fileNameDiv = divStatus.querySelector('.po-upload-filename');
    fileNameDiv.classList.remove('po-upload-filename-loading');
  }

  // Atualiza o status do progresso do envio do arquivo.
  private setProgressStatus(uid: string, percent: number, isShow: boolean) {
    const divStatus = this.elementRef.nativeElement.querySelector(`div[id='${uid}'].po-upload-progress`);
    const divProgress = divStatus.querySelector('.po-upload-progress-status');
    const isDisplay = isShow ? 'block' : 'none';

    divProgress.setAttribute('style', `display: ${isDisplay};`);
    divProgress.setAttribute('style', `width: ${percent}%;`);
  }

  // Atualiza o status do envio de arquivos.
  private setUploadStatus(file, className: string, percent: number) {
    const uid = file.uid;
    const divStatus = this.elementRef.nativeElement.querySelector(`div[id='${uid}'].po-upload-progress`);
    divStatus.classList.remove('po-upload-progress-error', 'po-upload-progress-success');
    divStatus.classList.add(className);

    if (percent > 5 && file.status !== PoUploadStatus.None) {
      this.addFileNameClass(uid);
    }
  }

  // Função disparada ao parar um envio de arquivo.
  private stopUploadHandler(file: PoUploadFile) {
    file.status = PoUploadStatus.None;
    this.removeFileNameClass(file.uid);
    this.setProgressStatus(file.uid, 0, false);
    this.setUploadStatus(file, 'po-upload-progress', 100);
  }

  // Função disparada quando o envio é realizado com sucesso.
  private successHandler(file: PoUploadFile) {
    file.status = PoUploadStatus.Uploaded;
    this.setProgressStatus(file.uid, 0, false);
    this.setUploadStatus(file, 'po-upload-progress-success', 100);
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
    this.onModelChange ? this.onModelChange(files) : this.ngModelChange.emit(files);
  }

  // Função disparada enquanto o arquivo está sendo enviado ao serviço.
  private uploadingHandler(file: PoUploadFile, percent: number) {
    file.status = PoUploadStatus.Uploading;
    this.setProgressStatus(file.uid, percent, true);
    this.setUploadStatus(file, 'po-upload-progress', percent);
  }

}
