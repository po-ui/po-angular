import { AbstractControl, ControlValueAccessor, Validator } from '@angular/forms';
import { EventEmitter, Input, Output } from '@angular/core';

import { browserLanguage, convertToBoolean, isEquals, poLocaleDefault } from '../../../utils/util';
import { requiredFailed } from '../validators';

import { PoUploadFile } from './po-upload-file';
import { PoUploadFileRestrictions } from './interfaces/po-upload-file-restriction.interface';
import { PoUploadLiterals } from './interfaces/po-upload-literals.interface';
import { PoUploadService } from './po-upload.service';
import { PoUploadStatus } from './po-upload-status.enum';

export const poUploadLiteralsDefault = {
  en: <PoUploadLiterals> {
    selectFile: 'Select file',
    deleteFile: 'Delete',
    cancel: 'Cancel',
    tryAgain: 'Try again',
    startSending: 'Start sending',
    dragFilesHere: 'Drag files here',
    selectFilesOnComputer: 'or select files on your computer',
    dropFilesHere: 'Drop files here',
    invalidDropArea: 'Files were not dropped in the correct area'
  },
  es: <PoUploadLiterals> {
    selectFile: 'Seleccionar archivo',
    deleteFile: 'Borrar',
    cancel: 'Cancelar',
    tryAgain: 'Intentar de nuevo',
    startSending: 'Iniciar carga',
    dragFilesHere: 'Arrastra los archivos aquí',
    selectFilesOnComputer: 'o selecciona los archivos en tu computadora',
    dropFilesHere: 'Deja los archivos aquí',
    invalidDropArea: 'Los archivos no se insertaron en la ubicación correcta'
  },
  pt: <PoUploadLiterals> {
    selectFile: 'Selecionar arquivo',
    deleteFile: 'Excluir',
    cancel: 'Cancelar',
    tryAgain: 'Tentar Novamente',
    startSending: 'Iniciar envio',
    dragFilesHere: 'Arraste os arquivos aqui',
    selectFilesOnComputer: 'ou selecione os arquivos no computador',
    dropFilesHere: 'Solte os arquivos aqui',
    invalidDropArea: 'Os arquivos não foram inseridos no local correto'
  }
};

const poUploadFormFieldDefault = 'files';

/**
 * @description
 *
 * O componente `po-upload` permite que o usuário envie arquivo(s) ao servidor e acompanhe o progresso.
 * Este componente também possibilita algumas configurações como:
 *  - Múltipla seleção, onde o usuário pode enviar mais de um arquivo ao servidor.
 *  - Auto envio, onde o arquivo é enviado imediatamente após a seleção do usuário, não necessitando que o usuário
 * clique em enviar.
 *  - Restrições de formatos de arquivo e tamanho.
 *  - Função de sucesso que será disparada quando os arquivos forem enviados com sucesso.
 *  - Função de erro que será disparada quando houver erro no envio dos arquivos.
 *  - Permite habilitar uma área onde os arquivos podem ser arrastados.
 */
export class PoUploadBaseComponent implements ControlValueAccessor, Validator {

  private _disabled?: boolean;
  private _dragDrop?: boolean = false;
  private _fileRestrictions?: PoUploadFileRestrictions;
  private _formField?: string;
  private _hideSelectButton?: boolean;
  private _hideSendButton?: boolean;
  private _literals?: any;
  private _required?: boolean;

  allowedExtensions: string;
  currentFiles: Array<PoUploadFile>;

  onModelChange: any;
  onModelTouched: any;

  private validatorChange: any;

  /**
   * @optional
   *
   * @description
   *
   * Define em *pixels* a altura da área onde podem ser arrastados os arquivos. A altura mínima aceita é `160px`.
   *
   * > Esta propriedade funciona somente se a propriedade `p-drag-drop` estiver habilitada.
   *
   * @default `320`
   */
  @Input('p-drag-drop-height') dragDropHeight: number;

  /**
   * @optional
   *
   * @description
   *
   * Exibe a área onde é possível arrastar e selecionar os arquivos. Quando estiver definida, omite o botão para seleção de arquivos
   * automaticamente.
   *
   * > Recomendamos utilizar apenas um `po-upload` com esta funcionalidade por tela.
   *
   * @default `false`
   */
  @Input('p-drag-drop') set dragDrop(value: boolean) {
    this._dragDrop = convertToBoolean(value);
  }

  get dragDrop() {
    return this._dragDrop;
  }

  /**
   * @optional
   *
   * @description
   *
   * Omite o botão de seleção de arquivos.
   *
   * > Caso o valor definido seja `true`, caberá ao desenvolvedor a responsabilidade
   * pela chamada do método `selectFiles()` para seleção de arquivos.
   *
   * @default `false`
   */
  @Input('p-hide-select-button') set hideSelectButton(value: boolean) {
    this._hideSelectButton = convertToBoolean(value);
  }
  get hideSelectButton(): boolean {
    return this._hideSelectButton;
  }

  /**
   * @optional
   *
   * @description
   *
   * Omite o botão de envio de arquivos.
   *
   * > Caso o valor definido seja `true`, caberá ao desenvolvedor a responsabilidade
   * pela chamada do método `sendFiles()` para envio do(s) arquivo(s) selecionado(s).
   *
   * @default `false`
   */
  @Input('p-hide-send-button') set hideSendButton(value: boolean) {
    this._hideSendButton = convertToBoolean(value);
  }
  get hideSendButton(): boolean {
    return this._hideSendButton;
  }

  /** Rótulo do campo. */
  @Input('p-label') label?: string;

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as literais usadas no `po-upload`.
   *
   * Existem duas maneiras de customizar o componente, passando um objeto com todas as literais disponíveis:
   *
   * ```
   *  const customLiterals: PoUploadLiterals = {
   *    cancel: 'Desistir',
   *    deleteFile: 'Deletar',
   *  };
   *
   * Ou passando apenas as literais que deseja customizar:,
   *    selectFile: 'Buscar arquivo',
   * ```
   *    startSending: 'Enviar'
   *   tryAgain: 'Recomeçar',
   *
   * ```
   *  const customLiterals: PoUploadLiterals = {
   *    deleteFile: 'Deletar'
   *  };
   * ```
   *
   * E para carregar as literais customizadas, basta apenas passar o objeto para o componente:
   *
   * ```
   * <po-upload
   *   [p-literals]="customLiterals">
   * </po-upload>
   * ```
   *
   * > O objeto padrão de literais será traduzido de acordo com o idioma do *browser* (pt, en, es).
   */
  @Input('p-literals') set literals(value: PoUploadLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poUploadLiteralsDefault[poLocaleDefault],
        ...poUploadLiteralsDefault[browserLanguage()],
        ...value
      };
    } else {
      this._literals = poUploadLiteralsDefault[browserLanguage()];
    }
  }
  get literals() {
    return this._literals || poUploadLiteralsDefault[browserLanguage()];
  }

  /** Texto de apoio para o campo. */
  @Input('p-help') help?: string;

  /** URL que deve ser feita a requisição com os arquivos selecionados. */
  @Input('p-url') url: string;

  /**
   * @optional
   *
   * @description
   *
   * Objeto que segue a definição da interface `PoUploadFileRestrictions`,
   * que possibilita definir tamanho máximo/mínimo e extensão dos arquivos permitidos.
   */
  @Input('p-restrictions') set fileRestrictions(restrictions: PoUploadFileRestrictions) {
    this._fileRestrictions = restrictions;

    this.setAllowedExtensions(restrictions);
  }

  get fileRestrictions(): PoUploadFileRestrictions {
    return this._fileRestrictions;
  }

  /** Define o valor do atributo `name` do componente. */
  @Input('name') name: string = 'file';

  /**
   * @optional
   *
   * @description
   *
   * Nome do campo de formulário que será enviado para o serviço informado na propriedade `p-url`.
   *
   * @default `files`
   */
  @Input('p-form-field') set formField(value: string) {
    this._formField = value && typeof value === 'string' ? value : poUploadFormFieldDefault;

    this.getUploadService().formField = this.formField;
  }

  get formField(): string {
    return this._formField;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica que o campo será desabilitado.
   */
  @Input('p-disabled') set disabled(value: boolean) {
    this._disabled = convertToBoolean(value);

    this.validateModel(this.currentFiles);
  }

  get disabled() {
    return this._disabled;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define se o envio do arquivo será automático ao selecionar o mesmo.
   *
   * @default `false`
   */
  @Input('p-auto-upload') autoUpload?: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define se pode selecionar mais de um arquivo.
   */
  @Input('p-multiple') isMultiple?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Define se a indicação de campo opcional será exibida.
   *
   * > Não será exibida a indicação se:
   *  - O campo conter `p-required`;
   *  - Não possuir `p-help` e/ou `p-label`.
   *
   * @default `false`
   */
  @Input('p-optional') optional: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Indica que o campo será obrigatório.
   *
   * @default `false`
   */
  @Input('p-required') set required(required: boolean) {
    this._required = convertToBoolean(required);

    this.validateModel(this.currentFiles);
  }

  get required() {
    return this._required;
  }

  /**
   * Função que será executada no momento de realizar o envio do arquivo,
   * onde será possível adicionar informações ao parâmetro que será enviado na requisição.
   * É passado por parâmetro um objeto com o arquivo e a propiedade data nesta propriedade pode ser informado algum dado,
   * que será enviado em conjunto com o arquivo na requisição, por exemplo:
   *
   * ```
   *   event.data = {id: 'id do usuario'};
   * ```
   */
  @Output('p-upload') onUpload?: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Evento será disparado quando ocorrer algum erro no envio do arquivo.
   * > Por parâmetro será passado o objeto do retorno que é do tipo `HttpErrorResponse`.
   */
  @Output('p-error') onError?: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Evento será disparado quando o envio do arquivo for realizado com sucesso.
   * > Por parâmetro será passado o objeto do retorno que é do tipo `HttpResponse`.
   */
  @Output('p-success') onSuccess?: EventEmitter<any> = new EventEmitter<any>();

  // Função para atualizar o ngModel do componente, necessário quando não for utilizado dentro da *tag* `form`.
  @Output('ngModelChange') ngModelChange?: EventEmitter<any> = new EventEmitter<any>();

  constructor(protected uploadService: PoUploadService) { }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }

  registerOnValidatorChange(fn: () => void) {
    this.validatorChange = fn;
  }

  validate(abstractControl: AbstractControl): { [key: string]: any; } {

    if (requiredFailed(this.required, this.disabled, abstractControl.value)) {
      return {
        required: {
          valid: false,
        }
      };
    }

  }

  writeValue(model: any): void {
    if (model) {
      if (!isEquals(this.currentFiles, model)) {

        this.currentFiles = this.parseFiles(model);
      }
    } else {

      this.currentFiles = undefined;
    }
  }

  protected isExceededFileLimit(currentFilesLength: number): boolean {
    return this.isMultiple &&
      this.fileRestrictions &&
      this.fileRestrictions.maxFiles > 0 &&
      this.fileRestrictions.maxFiles <= currentFilesLength;
  }

  // Faz o parse dos arquivos selecionados para arquivos do formato PoUploadFile e atualiza os arquivos correntes.
  protected parseFiles(files: Array<File>): Array<PoUploadFile> {
    let poUploadFiles: Array<PoUploadFile> = this.currentFiles || [];
    const filesLength = files.length;

    for (let i = 0; i < filesLength; i++) {

      if (this.isExceededFileLimit(poUploadFiles.length)) {
        break;
      }

      const file = new PoUploadFile(files[i]);

      if (this.checkRestrictions(file)) {
        poUploadFiles = this.insertFileInFiles(file, poUploadFiles);
      }

    }

    return poUploadFiles;
  }

  protected validateModel(model: any) {
    if (this.validatorChange) {
      this.validatorChange(model);
    }
  }

  // Verifica se o arquivo está de acordo com as restrições.
  private checkRestrictions(file: PoUploadFile): boolean {
    const restrictions = this.fileRestrictions;

    if (restrictions) {
      const allowedExtensions = restrictions.allowedExtensions;
      const minFileSize = restrictions.minFileSize || 0;
      const maxFileSize = restrictions.maxFileSize || 31457280; // 30MB

      const isAccept = allowedExtensions ? this.isAllowedExtension(file.extension, allowedExtensions) : true;
      const isAcceptSize = file.size >= minFileSize && file.size <= maxFileSize;

      return isAccept && isAcceptSize;
    }

    return true;
  }

  private existsFileSameName(file: PoUploadFile, files: Array<PoUploadFile>): boolean {
    return files.some(currentFile => file.name === currentFile.name);
  }

  private getUploadService(): PoUploadService {
    return this.uploadService;
  }

  private insertFileInFiles(newFile: PoUploadFile, files: Array<PoUploadFile>) {

    if (this.existsFileSameName(newFile, files)) {

      return this.updateExistsFileInFiles(newFile, files);
    }

    if (this.isMultiple) {

      files.push(newFile);
    } else {

      files.splice(0, files.length, newFile);
    }

    return files;
  }

  private isAllowedExtension(extension: string, allowedExtensions: Array<string> = []): boolean {
    return allowedExtensions.some(ext => ext.toLowerCase() === extension);
  }

  private setAllowedExtensions(restrictions: PoUploadFileRestrictions = {}) {
    const _allowedExtensions = restrictions.allowedExtensions || [];

    this.allowedExtensions = _allowedExtensions.join(',');
  }

  private updateExistsFileInFiles(newFile: PoUploadFile, files: Array<PoUploadFile>) {
    const fileIndex = files.findIndex(currentFile => newFile.name === currentFile.name && currentFile.status !== PoUploadStatus.Uploaded);

    if (fileIndex !== -1) {
      files.splice(fileIndex, 1, newFile);
    }

    return files;
  }

}
