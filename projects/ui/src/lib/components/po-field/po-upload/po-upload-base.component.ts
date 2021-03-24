import { AbstractControl, ControlValueAccessor, Validator } from '@angular/forms';
import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { convertToBoolean, isEquals, isIE, isMobile } from '../../../utils/util';
import { requiredFailed } from '../validators';

import { PoUploadFile } from './po-upload-file';
import { PoUploadFileRestrictions } from './interfaces/po-upload-file-restriction.interface';
import { PoUploadLiterals } from './interfaces/po-upload-literals.interface';
import { PoUploadService } from './po-upload.service';
import { PoUploadStatus } from './po-upload-status.enum';
import { InputBoolean } from '../../../decorators';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { poLocaleDefault } from '../../../services/po-language/po-language.constant';

export const poUploadLiteralsDefault = {
  en: <PoUploadLiterals>{
    files: 'files',
    folders: 'folders',
    selectFile: 'Select file',
    selectFiles: 'Select files',
    selectFolder: 'Select folder',
    startSending: 'Start sending',
    dragFilesHere: 'Drag files here',
    dragFoldersHere: 'Drag folders here',
    selectFilesOnComputer: 'or select files on your computer',
    selectFolderOnComputer: 'or select folder on your computer',
    dropFilesHere: 'Drop files here',
    dropFoldersHere: 'Drop folders here',
    invalidDropArea: '{0} were not dropped in the correct area',
    invalidFileType: 'Failed to load {0} file(s) as it is not the allowed file type.',
    invalidAmount: 'Failed to load {0} file(s), as it exceeds the limit amount of files.',
    invalidFormat: 'Failed to load {0} file(s), as it does not match the format(s): {1}.',
    invalidSize: 'Failed to load {0} files(s), as it is not the allowed size: from {1} to {2}.',
    numberOfFilesAllowed: '{0} file(s) allowed',
    allowedFormats: 'Accepted file formats: {0}.',
    allowedFileSizeRange: 'Size limit per file: from {0} to {1}',
    maxFileSizeAllowed: 'Size limit per file: {0} maximum',
    minFileSizeAllowed: 'Size limit per file: {0} minimum',
    errorOccurred: 'An error has occurred',
    sentWithSuccess: 'Sent with success'
  },
  es: <PoUploadLiterals>{
    files: 'archivos',
    folders: 'carpetas',
    selectFile: 'Seleccionar archivo',
    selectFiles: 'Seleccionar archivos',
    selectFolder: 'Seleccionar carpeta',
    startSending: 'Iniciar carga',
    dragFilesHere: 'Arrastra los archivos aquí',
    dragFoldersHere: 'Arrastra las carpetas aquí',
    selectFilesOnComputer: 'o selecciona los archivos en tu computadora',
    selectFolderOnComputer: 'o selecciona la carpeta en tu computadora',
    dropFilesHere: 'Deja los archivos aquí',
    dropFoldersHere: 'Deja las carpetas aquí',
    invalidDropArea: 'Los {0} no se insertaron en la ubicación correcta',
    invalidFileType: 'Error al cargar {0} archivo (s) ya que no es el tipo de archivo permitido',
    invalidAmount: 'Error al cargar {0} archivo (s) ya que excede la cantidad limite de archivos.',
    invalidFormat: 'Error al cargar {0} archivo (s) ya que no coincide con el formato (s): {1}.',
    invalidSize: 'Error al cargar {0} archivo (s) ya que no cumple con el tamaño permitido: desde {1} hasta {2}.',
    numberOfFilesAllowed: '{0} archivo(s) permitido(s)',
    allowedFormats: 'Formatos aceptados: {0}.',
    allowedFileSizeRange: 'Limite de tamaño de archivo: desde {0} hasta {1}',
    maxFileSizeAllowed: 'Limite de tamaño de archivo: hasta {0}',
    minFileSizeAllowed: 'Limite de tamaño de archivo: minimo {0}',
    errorOccurred: 'Ocurrio un error',
    sentWithSuccess: 'Enviado con éxito'
  },
  pt: <PoUploadLiterals>{
    files: 'arquivos',
    folders: 'diretórios',
    selectFile: 'Selecionar arquivo',
    selectFiles: 'Selecionar arquivos',
    selectFolder: 'Selecionar pasta',
    startSending: 'Iniciar envio',
    dragFilesHere: 'Arraste os arquivos aqui',
    dragFoldersHere: 'Arraste as pastas aqui',
    selectFilesOnComputer: 'ou selecione os arquivos no computador',
    selectFolderOnComputer: 'ou selecione a pasta no computador',
    dropFilesHere: 'Solte os arquivos aqui',
    dropFoldersHere: 'Solte as pastas aqui',
    invalidDropArea: 'Os {0} não foram inseridos no local correto',
    invalidFileType: 'Falha ao carregar {0} arquivo (s), pois não é o tipo de arquivo permitido',
    invalidAmount: 'Falha ao carregar {0} arquivo(s), pois excede(m) a quantidade limite de arquivos.',
    invalidFormat: 'Falha ao carregar {0} arquivo(s), pois não corresponde(m) ao(s) formato(s): {1}.',
    invalidSize: 'Falha ao carregar {0} arquivo(s), pois não atende ao tamanho permitido: {1} até {2}.',
    numberOfFilesAllowed: 'Quantidade máxima: {0} arquivo(s)',
    allowedFormats: 'Formatos adotados: {0}.',
    allowedFileSizeRange: 'Limite de tamanho por arquivo: de {0} até {1}',
    maxFileSizeAllowed: 'Limite de tamanho por arquivo: até {0}',
    minFileSizeAllowed: 'Limite de tamanho por arquivo: no mínimo {0}',
    errorOccurred: 'Ocorreu um erro',
    sentWithSuccess: 'Enviado com sucesso'
  },
  ru: <PoUploadLiterals>{
    files: 'файлы',
    folders: 'папки с файлами',
    selectFile: 'Выберите файл',
    selectFiles: 'Выберите файлы',
    selectFolder: 'Выберите папку с файлами',
    startSending: 'Начать загрузку',
    dragFilesHere: 'Перетащите файлы сюда',
    dragFoldersHere: 'Перетащите сюда папки',
    selectFilesOnComputer: 'или выберите файлы на компьютере',
    selectFolderOnComputer: 'или выберите папку на вашем компьютере',
    dropFilesHere: 'Оставьте файлы здесь',
    dropFoldersHere: 'Перетащите сюда папки',
    invalidDropArea: '{0} не были вставлены в правильном месте.',
    invalidFileType: 'Не удалось загрузить файлы {0}, так как это неверный тип файла',
    invalidAmount: 'Não foi possível carregar os arquivos {0} porque eles excederam o limite de arquivos.',
    invalidFormat: 'Не удалось загрузить файлы {0}, так как они не соответствуют формату (ам): {1}.',
    invalidSize: 'Не удалось загрузить файлы {0}, поскольку они не соответствуют разрешенному размеру: от {1} до {2}.',
    numberOfFilesAllowed: 'Максимальное количество: {0} файлов',
    allowedFormats: 'Форматы приняты: {0}.',
    allowedFileSizeRange: 'Ограничение размера файла: от {0} до {1}',
    maxFileSizeAllowed: 'Ограничение размера файла: до {0}',
    minFileSizeAllowed: 'Ограничение размера файла: не менее {0}',
    errorOccurred: 'Произошла ошибка.',
    sentWithSuccess: 'Успешно отправлено'
  }
};

const poUploadFormFieldDefault = 'files';

const poUploadMaxFileSize = 31457280; // 30MB
const poUploadMinFileSize = 0;

/**
 * @description
 *
 * O componente `po-upload` permite que o usuário envie arquivo(s) ao servidor e acompanhe o progresso.
 * Este componente também possibilita algumas configurações como:
 *  – Envio de diretórios, onde ele acessa o diretório selecionado assim como seus sub-diretórios;
 *  - Múltipla seleção, onde o usuário pode enviar mais de um arquivo ao servidor.
 *  - Auto envio, onde o arquivo é enviado imediatamente após a seleção do usuário, não necessitando que o usuário
 * clique em enviar.
 *  - Restrições de formatos de arquivo e tamanho.
 *  - Função de sucesso que será disparada quando os arquivos forem enviados com sucesso.
 *  - Função de erro que será disparada quando houver erro no envio dos arquivos.
 *  - Permite habilitar uma área onde os arquivos podem ser arrastados.
 */
@Directive()
export abstract class PoUploadBaseComponent implements ControlValueAccessor, Validator {
  private _directory?: boolean;
  private _disabled?: boolean;
  private _dragDrop?: boolean = false;
  private _fileRestrictions?: PoUploadFileRestrictions;
  private _formField?: string;
  private _hideRestrictionsInfo?: boolean;
  private _hideSelectButton?: boolean;
  private _hideSendButton?: boolean;
  private _isMultiple?: boolean;
  private _literals?: any;
  private _required?: boolean;
  private language: string;

  allowedExtensions: string;
  currentFiles: Array<PoUploadFile>;

  canHandleDirectory: boolean;
  onModelChange: any;

  private validatorChange: any;

  protected extensionNotAllowed = 0;
  protected quantityNotAllowed = 0;
  protected sizeNotAllowed = 0;
  protected onModelTouched: any = null;

  /**
   * @optional
   *
   * @description
   *
   * Aplica foco no elemento ao ser iniciado.
   *
   * > Caso mais de um elemento seja configurado com essa propriedade, apenas o último elemento declarado com ela terá o foco.
   *
   * @default `false`
   */
  @Input('p-auto-focus') @InputBoolean() autoFocus: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Permite a seleção de diretórios contendo um ou mais arquivos para envio.
   *
   * > A habilitação desta propriedade se restringe apenas à seleção de diretórios.
   *
   * > Definição não suportada pelo browser **Internet Explorer**, todavia será possível a seleção de arquivos padrão.
   *
   * @default `false`
   */
  @Input('p-directory') set directory(value: boolean) {
    this._directory = convertToBoolean(value);

    this.canHandleDirectory = this._directory && !isIE() && !isMobile();
    this.setDirectoryAttribute(this.canHandleDirectory);
  }

  get directory() {
    return this._directory;
  }

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
   * Oculta visualmente as informações de restrições para o upload.
   *
   * @default `false`
   */
  @Input('p-hide-restrictions-info') set hideRestrictionsInfo(value: boolean) {
    this._hideRestrictionsInfo = convertToBoolean(value);
  }

  get hideRestrictionsInfo() {
    return this._hideRestrictionsInfo;
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
   * Existem duas maneiras de customizar o componente:
   *
   * - passando um objeto implementando a interface `PoUploadLiterals` com todas as literais disponíveis;
   * - passando apenas as literais que deseja customizar:
   * ```
   *  const customLiterals: PoUploadLiterals = {
   *    folders: 'Pastas',
   *    selectFile: 'Buscar arquivo',
   *    startSending: 'Enviar'
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
   * > O objeto padrão de literais será traduzido de acordo com o idioma do *browser* (pt, en, es, ru).
   */
  @Input('p-literals') set literals(value: PoUploadLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poUploadLiteralsDefault[poLocaleDefault],
        ...poUploadLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poUploadLiteralsDefault[this.language];
    }
  }
  get literals() {
    return this._literals || poUploadLiteralsDefault[this.language];
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
    this._fileRestrictions = this.initRestrictions(restrictions);

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
   *
   * > Se utilizada a `p-directory`, habilita-se automaticamente esta propriedade.
   */
  @Input('p-multiple') set isMultiple(value: boolean) {
    this._isMultiple = convertToBoolean(value);
  }

  get isMultiple() {
    return this.canHandleDirectory ? true : this._isMultiple;
  }

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

  /** Objeto que contém os cabeçalhos que será enviado na requisição dos arquvios. */
  @Input('p-headers') headers: { [name: string]: string | Array<string> };

  /**
   * @optional
   *
   * @description
   *
   * Função que será executada no momento de realizar o envio do arquivo,
   * onde será possível adicionar informações ao parâmetro que será enviado na requisição.
   * É passado por parâmetro um objeto com o arquivo e a propiedade data nesta propriedade pode ser informado algum dado,
   * que será enviado em conjunto com o arquivo na requisição, por exemplo:
   *
   * ```
   *   event.data = {id: 'id do usuario'};
   * ```
   */
  @Output('p-upload') onUpload: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento será disparado quando ocorrer algum erro no envio do arquivo.
   * > Por parâmetro será passado o objeto do retorno que é do tipo `HttpErrorResponse`.
   */
  @Output('p-error') onError: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento será disparado quando o envio do arquivo for realizado com sucesso.
   * > Por parâmetro será passado o objeto do retorno que é do tipo `HttpResponse`.
   */
  @Output('p-success') onSuccess: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Função para atualizar o ngModel do componente, necessário quando não for utilizado dentro da *tag* `form`.
   */
  @Output('ngModelChange') ngModelChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(protected uploadService: PoUploadService, languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }

  abstract sendFeedback(): void;

  // Função implementada do ControlValueAccessor
  // Usada para interceptar os estados de habilitado via forms api
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }

  registerOnValidatorChange(fn: () => void) {
    this.validatorChange = fn;
  }

  validate(abstractControl: AbstractControl): { [key: string]: any } {
    if (requiredFailed(this.required, this.disabled, abstractControl.value)) {
      return {
        required: {
          valid: false
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
    return (
      this.isMultiple &&
      this.fileRestrictions &&
      this.fileRestrictions.maxFiles > 0 &&
      this.fileRestrictions.maxFiles <= currentFilesLength
    );
  }

  // Faz o parse dos arquivos selecionados para arquivos do formato PoUploadFile e atualiza os arquivos correntes.
  protected parseFiles(files: Array<File>): Array<PoUploadFile> {
    let poUploadFiles: Array<PoUploadFile> = this.currentFiles || [];
    const filesLength = files.length;

    for (let i = 0; i < filesLength; i++) {
      if (this.isExceededFileLimit(poUploadFiles.length)) {
        this.quantityNotAllowed = filesLength - this.fileRestrictions.maxFiles;
        break;
      }
      const file = new PoUploadFile(files[i]);

      if (this.checkRestrictions(file)) {
        poUploadFiles = this.insertFileInFiles(file, poUploadFiles);
      }
    }
    this.sendFeedback();
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
      const minFileSize = restrictions.minFileSize;
      const maxFileSize = restrictions.maxFileSize;

      const isAccept = allowedExtensions ? this.isAllowedExtension(file.extension, allowedExtensions) : true;
      const isAcceptSize = file.size >= minFileSize && file.size <= maxFileSize;

      if (!isAcceptSize) {
        this.sizeNotAllowed = this.sizeNotAllowed + 1;
      }

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
    const isAllowed = allowedExtensions.some(ext => ext.toLowerCase() === extension);
    if (!isAllowed) {
      this.extensionNotAllowed = this.extensionNotAllowed + 1;
    }
    return isAllowed;
  }

  private setAllowedExtensions(restrictions: PoUploadFileRestrictions = {}) {
    const _allowedExtensions = restrictions.allowedExtensions || [];

    this.allowedExtensions = _allowedExtensions.join(',');
  }

  private initRestrictions(restrictions: PoUploadFileRestrictions): PoUploadFileRestrictions {
    if (!restrictions) {
      return;
    }

    const minFileSize = restrictions.minFileSize || poUploadMinFileSize;
    const maxFileSize = restrictions.maxFileSize || poUploadMaxFileSize;

    return {
      ...restrictions,
      maxFileSize: maxFileSize,
      minFileSize: minFileSize
    };
  }

  private updateExistsFileInFiles(newFile: PoUploadFile, files: Array<PoUploadFile>) {
    const fileIndex = files.findIndex(
      currentFile => newFile.name === currentFile.name && currentFile.status !== PoUploadStatus.Uploaded
    );

    if (fileIndex !== -1) {
      files.splice(fileIndex, 1, newFile);
    }

    return files;
  }

  abstract setDirectoryAttribute(value: boolean);
}
