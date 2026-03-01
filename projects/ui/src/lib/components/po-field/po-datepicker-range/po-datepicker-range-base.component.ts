import { ChangeDetectorRef, Directive, EventEmitter, input, Input, OnDestroy, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, ValidationErrors, Validator, Validators } from '@angular/forms';
import { Subscription, switchMap } from 'rxjs';
import { PoFieldSize } from '../../../enums/po-field-size.enum';
import { poLocaleDefault } from '../../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { PoMask } from '../po-input/po-mask';
import { PoValidators } from '../validators';
import { PoDateService } from './../../../services/po-date/po-date.service';
import {
  convertIsoToDate,
  convertToBoolean,
  getDefaultSizeFn,
  replaceFormatSeparator,
  setYearFrom0To100,
  validateDateRange,
  validateSizeFn
} from './../../../utils/util';
import { PoDatepickerRangeLiterals } from './interfaces/po-datepicker-range-literals.interface';
import { PoDatepickerRange } from './interfaces/po-datepicker-range.interface';
import { poDatepickerRangeLiteralsDefault } from './po-datepicker-range.literals';
import { PoHelperOptions } from '../../po-helper';

/**
 * @description
 *
 * O `po-datepicker-range` é um componente para seleção de um período entre duas datas, onde é possível informar apenas
 * a data inicial ou a data final.
 *
 * O componente `[(ngModel)]` do `po-datepicker-range` trabalha com um objeto que implementa a interface
 * `PoDatepickerRange`, contendo as seguintes propriedades:
 * ```
 * { "start": '2017-11-28', "end": '2017-11-30' }
 * ```
 *
 * <a id="accepted-formats"></a>
 * Este componente pode receber os seguintes formatos de data:
 *
 * - **Data e hora combinados (E8601DZw): yyyy-mm-ddThh:mm:ss+|-hh:mm**
 *   ```
 *   '2017-11-28T00:00:00-02:00';
 *   ```
 *
 * - **Data (E8601DAw.): yyyy-mm-dd**
 *   ```
 *   '2017-11-28';
 *   ```
 *
 * - **JavaScript Date Object:**
 *   ```
 *   new Date(2017, 10, 28);
 *   ```
 *
 * > O componente respeitará o formato passado para o *model* via codificação. Porém, caso seja feita alteração em algum
 * dos valores de data em tela, o componente atribuirá o formato **Data (E8601DAw.): yyyy-mm-dd** ao model.
 *
 * Importante:
 *
 * - Quando preenchidas a data inicial e final, a data inicial deve ser sempre menor ou igual a data final;
 * - Ao passar uma data inválida via codificação, o valor será mantido no *model* e o `input` da tela aparecerá vazio;
 * - Permite trabalhar com as duas datas separadamente através das propriedades `p-start-date` e `p-end-date` no lugar do
 * `[(ngModel)]`, no entanto sem a validação do formulário;
 * - Para a validação do formulário, utilize o `[(ngModel)]`.
 */
@Directive()
export abstract class PoDatepickerRangeBaseComponent implements ControlValueAccessor, Validator, OnDestroy {
  // Propriedade interna que define se o ícone de ajuda adicional terá cursor clicável (evento) ou padrão (tooltip).
  @Input() additionalHelpEventTrigger: string | undefined;

  /* Nome do componente. */
  @Input('name') name: string;

  /**
   *
   * @deprecated v23.x.x use `p-helper`
   *
   * @optional
   *
   * @description
   * Exibe um ícone de ajuda adicional, com o texto desta propriedade sendo passado para o popover do componente `po-helper`.
   * **Como boa prática, indica-se utilizar um texto com até 140 caracteres.**
   * > Requer um recuo mínimo de 8px se o componente estiver próximo à lateral da tela.
   *
   * > Essa propriedade está **depreciada** e será removida na versão `23.x.x`. Recomendamos utilizar a propriedade `p-helper` que oferece mais recursos e flexibilidade.
   */
  @Input('p-additional-help-tooltip') additionalHelpTooltip?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define que o `calendar` e/ou tooltip (`p-additional-help-tooltip` e/ou `p-error-limit`) serão incluídos no body da
   * página e não dentro do componente. Essa opção pode ser necessária em cenários com containers que possuem scroll ou
   * overflow escondido, garantindo o posicionamento correto de ambos próximo ao elemento.
   *
   * > Quando utilizado com `p-helper`, leitores de tela como o NVDA podem não ler o conteúdo do popover.
   *
   * @default `false`
   */
  @Input({ alias: 'p-append-in-body', transform: convertToBoolean }) appendBox?: boolean = false;

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
  @Input({ alias: 'p-auto-focus', transform: convertToBoolean }) autoFocus: boolean = false;

  /**
   * @optional
   *
   * @description
   * Define se o título do campo será exibido de forma compacta.
   *
   * Quando habilitado (`true`), o modo compacto afeta o conjunto composto por:
   * - `po-label`
   * - `p-requirement (showRequired)`
   * - `po-helper`
   *
   * Ou seja, todos os elementos relacionados ao título do campo
   * (rótulo, indicador de obrigatoriedade e componente auxiliar) passam
   * a seguir o comportamento de layout compacto.
   *
   * Também é possível definir esse comportamento de forma global,
   * uma única vez, na folha de estilo geral da aplicação, por meio
   * da customização dos tokens CSS:
   *
   * - `--field-container-title-justify`
   * - `--field-container-title-flex`
   *
   * Exemplo:
   *
   * ```
   * :root {
   *   --field-container-title-justify: flex-start;
   *   --field-container-title-flex: 0 1 auto;
   * }
   * ```
   *
   * Dessa forma, o layout compacto passa a ser o padrão da aplicação,
   * sem a necessidade de definir a propriedade individualmente em cada campo.
   *
   * @default `false`
   */
  @Input({ alias: 'p-compact-label', transform: convertToBoolean }) compactLabel: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Texto de apoio do campo.
   */
  @Input('p-help') help?: string;

  /**
   * @optional
   *
   * @description
   *
   * Rótulo do campo.
   */
  @Input('p-label') label?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define se a indicação de campo opcional será exibida.
   *
   * > Não será exibida a indicação se:
   * - O campo conter `p-required`;
   * - Não possuir `p-help` e/ou `p-label`.
   *
   * @default `false`
   */
  @Input('p-optional') optional: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Exibe a mensagem setada se o campo estiver vazio e for requerido.
   *
   * > Necessário que a propriedade `p-required` esteja habilitada.
   *
   */
  @Input('p-field-error-message') fieldErrorMessage: string;

  /**
   *
   * @deprecated v23.x.x use `p-helper`
   *
   * @optional
   *
   * @description
   * Evento disparado ao clicar no ícone de ajuda adicional.
   *
   * > Essa propriedade está **depreciada** e será removida na versão `23.x.x`. Recomendamos utilizar a propriedade `p-helper` que oferece mais recursos e flexibilidade.
   */
  @Output('p-additional-help') additionalHelp = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo.
   *
   * > Caso essa propriedade seja definida como `true`, a mensagem de erro será limitada a duas linhas
   * e um tooltip será exibido ao passar o mouse sobre a mensagem para mostrar o conteúdo completo.
   *
   * @default `false`
   */
  @Input('p-error-limit') errorLimit: boolean = false;

  /**
   * @Input
   *
   * @optional
   *
   * @description
   *
   * Define as opções do componente de ajuda (po-helper) que será exibido ao lado do label quando a propriedade `p-label` for definida, ou, ao lado do componente na ausência da propriedade `p-label`.
   * > Para mais informações acesse: https://po-ui.io/documentation/po-helper.
   *
   * > Ao configurar esta propriedade, o antigo ícone de ajuda adicional (`p-additional-help-tooltip` e `p-additional-help`) será ignorado.
   */
  poHelperComponent = input<PoHelperOptions | string>(undefined, { alias: 'p-helper' });

  /**
   * @Input
   *
   * @optional
   *
   * @description
   *
   * Habilita a quebra automática do texto da propriedade `p-label`. Quando `p-label-text-wrap` for verdadeiro, o texto que excede
   * o espaço disponível é transferido para a próxima linha em pontos apropriados para uma
   * leitura clara.
   *
   * @default `false`
   */
  labelTextWrap = input<boolean>(false, { alias: 'p-label-text-wrap' });

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao alterar valor do campo.
   */
  @Output('p-change') onChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   * Evento disparado quando uma tecla é pressionada enquanto o foco está no componente.
   * Retorna um objeto `KeyboardEvent` com informações sobre a tecla.
   */
  @Output('p-keydown') keydown: EventEmitter<KeyboardEvent> = new EventEmitter<any>();

  errorMessage: string = '';
  dateRange: PoDatepickerRange = { start: '', end: '' };
  displayAdditionalHelp: boolean = false;

  protected format: any = 'dd/mm/yyyy';
  protected isDateRangeInputFormatValid: boolean = true;
  protected isStartDateRangeInputValid: boolean = true;
  protected onTouchedModel: any;
  protected poMaskObject: PoMask;
  protected hasValidatorRequired = false;

  private _clean?: boolean = false;
  private _disabled?;
  private _endDate?;
  private _literals?: any;
  private _maxDate: Date;
  private _minDate: Date;
  private _noAutocomplete?: boolean = false;
  private _readonly: boolean = false;
  private _required?: boolean = false;
  private _startDate?;
  private _locale?: string;
  private _size?: string = undefined;

  private language;
  private onChangeModel: any;
  private validatorChange: any;
  private subscription = new Subscription();

  get isDateRangeInputValid() {
    return this.isDateRangeInputFormatValid && this.isStartDateRangeInputValid;
  }

  /**
   * @optional
   *
   * @description
   *
   * Habilita ação para limpar o campo.
   *
   * @default `false`
   */
  @Input('p-clean') set clean(clean: boolean) {
    this._clean = convertToBoolean(clean);
  }

  get clean() {
    return this._clean;
  }

  /**
   * @optional
   *
   * @description
   *
   * Desabilita o campo.
   *
   * @default `false`
   */
  @Input('p-disabled') set disabled(value: boolean) {
    this._disabled = convertToBoolean(value);

    this.validateModel(this.dateRange);
  }

  get disabled() {
    return this._disabled;
  }

  /**
   * @optional
   *
   * @description
   *
   * Data final.
   */
  @Input('p-end-date') set endDate(date: string | Date) {
    this._endDate = this.convertPatternDateFormat(date);
    this.dateRange.end = this.endDate;

    this.updateScreenByModel(this.dateRange);
    this.updateModel(this.dateRange);
  }

  get endDate() {
    return this._endDate;
  }

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as literais usadas no `po-datepicker-range`.
   *
   * Existem duas maneiras de customizar o componente, passando um objeto com todas as literais disponíveis:
   *
   * ```
   *  const customLiterals: PoDatepickerRangeLiterals = {
   *    invalidFormat: 'Date in inconsistent format',
   *    startDateGreaterThanEndDate: 'End date less than start date'
   *  };
   * ```
   *
   * Ou passando apenas as literais que deseja customizar:
   *
   * ```
   *  const customLiterals: PoDatepickerRangeLiterals = {
   *    invalidFormat: 'Date in inconsistent format'
   *  };
   * ```
   *
   * E para carregar as literais customizadas, basta apenas passar o objeto para o componente.
   *
   * ```
   * <po-datepicker-range
   *   [p-literals]="customLiterals">
   * </po-datepicker-range>
   * ```
   *
   * > O objeto padrão de literais será traduzido de acordo com o idioma do
   * [`PoI18nService`](/documentation/po-i18n) ou do browser.
   */
  @Input('p-literals') set literals(value: PoDatepickerRangeLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poDatepickerRangeLiteralsDefault[poLocaleDefault],
        ...poDatepickerRangeLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poDatepickerRangeLiteralsDefault[this.language];
    }
  }

  get literals() {
    return this._literals || poDatepickerRangeLiteralsDefault[this.language];
  }

  /**
   * @optional
   *
   * @description
   *
   * Define uma data mínima para o `po-datepicker-range`.
   */
  @Input('p-min-date') set minDate(value: string | Date) {
    if (value instanceof Date) {
      const year = value.getFullYear();

      const date = new Date(year, value.getMonth(), value.getDate(), 0, 0, 0);
      setYearFrom0To100(date, year);

      this._minDate = date;
    } else {
      this._minDate = convertIsoToDate(value, true, false);
    }
  }

  get minDate() {
    return this._minDate;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define uma data máxima para o `po-datepicker-range`.
   */
  @Input('p-max-date') set maxDate(value: string | Date) {
    if (value instanceof Date) {
      const year = value.getFullYear();

      const date = new Date(year, value.getMonth(), value.getDate(), 23, 59, 59);
      setYearFrom0To100(date, year);

      this._maxDate = date;
    } else {
      this._maxDate = convertIsoToDate(value, false, true);
    }
  }

  get maxDate() {
    return this._maxDate;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a propriedade nativa `autocomplete` do campo como `off`.
   *
   * @default `false`
   */
  @Input('p-no-autocomplete') set noAutocomplete(value: boolean) {
    this._noAutocomplete = convertToBoolean(value);
  }

  get noAutocomplete() {
    return this._noAutocomplete;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica que o campo será somente leitura.
   *
   * @default `false`
   */
  @Input('p-readonly') set readonly(value: boolean) {
    this._readonly = convertToBoolean(value);

    this.validateModel(this.dateRange);
  }

  get readonly() {
    return this._readonly;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define que o campo será obrigatório.
   *
   * @default `false`
   */
  @Input('p-required') set required(required: boolean) {
    this._required = convertToBoolean(required);

    this.validateModel(this.dateRange);
  }

  get required() {
    return this._required;
  }

  /**
   * Define se a indicação de campo obrigatório será exibida.
   *
   * > Não será exibida a indicação se:
   * - Não possuir `p-help` e/ou `p-label`.
   */
  @Input('p-show-required') showRequired: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do componente:
   * - `small`: altura do input como 32px (disponível apenas para acessibilidade AA).
   * - `medium`: altura do input como 44px.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  @Input('p-size') set size(value: string) {
    this._size = validateSizeFn(value, PoFieldSize);
  }

  get size(): string {
    return this._size ?? getDefaultSizeFn(PoFieldSize);
  }

  /**
   * @optional
   *
   * @description
   *
   * Data inicial.
   */
  @Input('p-start-date') set startDate(date: string | Date) {
    this._startDate = this.convertPatternDateFormat(date);
    this.dateRange.start = this.startDate;

    this.updateScreenByModel(this.dateRange);
    this.updateModel(this.dateRange);
  }

  get startDate() {
    return this._startDate;
  }

  /**
   * @optional
   *
   * @description
   *
   * Idioma que o calendário utilizará para exibir as datas.
   *
   * > O locale padrão será recuperado com base no [`PoI18nService`](/documentation/po-i18n) ou *browser*.
   */
  @Input('p-locale') set locale(value: string) {
    if (value) {
      this._locale = value.length >= 2 ? value : poLocaleDefault;
      this.poMaskObject = this.buildMask(
        replaceFormatSeparator(this.format, this.languageService.getDateSeparator(this.locale))
      );
    } else {
      this._locale = this.language;
      this.poMaskObject = this.buildMask(
        replaceFormatSeparator(this.format, this.languageService.getDateSeparator(this.locale))
      );
    }
  }

  get locale(): string {
    return this._locale || this.language;
  }

  constructor(
    protected changeDetector: ChangeDetectorRef,
    protected poDateService: PoDateService,
    private languageService: PoLanguageService
  ) {
    this.language = languageService.getShortLanguage();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar os estados de habilitado via forms api
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this.changeDetector.markForCheck();
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar as mudanças e não atualizar automaticamente o Model
  registerOnChange(func: any): void {
    this.onChangeModel = func;
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar as mudanças e não atualizar automaticamente o Model
  registerOnTouched(func: any): void {
    this.onTouchedModel = func;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.validatorChange = fn;
  }

  validate(control: AbstractControl): ValidationErrors {
    const value: PoDatepickerRange = control.value || {};
    const startDate = value.start ? this.convertPatternDateFormat(value.start) : '';
    const endDate = value.end ? this.convertPatternDateFormat(value.end) : '';

    if (!this.hasValidatorRequired && this.fieldErrorMessage && control.hasValidator(Validators.required)) {
      this.hasValidatorRequired = true;
    }

    if (this.requiredDateRangeFailed(startDate, endDate)) {
      this.errorMessage = '';

      return {
        required: {
          valid: false
        }
      };
    }

    if (!this.verifyValidDate(startDate, endDate)) {
      this.errorMessage = this.literals.invalidDate;
      return {
        date: {
          valid: false
        }
      };
    }

    if (this.dateRangeObjectFailed(control.value) || this.dateRangeFormatFailed(startDate, endDate)) {
      this.errorMessage = this.literals.invalidFormat;

      return {
        date: {
          valid: false
        }
      };
    }

    if (this.dateRangeFailed(startDate, endDate)) {
      this.errorMessage = this.literals.startDateGreaterThanEndDate;

      return {
        date: {
          valid: false
        }
      };
    }

    if ((startDate && !this.validateDateInRange(startDate)) || (endDate && !this.validateDateInRange(endDate))) {
      this.errorMessage = this.literals.dateOutOfPeriod;

      return {
        date: {
          valid: false
        }
      };
    }

    if (this.fieldErrorMessage) {
      this.subscription?.unsubscribe();
      this.subscription = control.statusChanges
        .pipe(
          switchMap(status => {
            if (status === 'INVALID') {
              this.changeDetector.markForCheck();
            }
            return [];
          })
        )
        .subscribe();
    }

    return null;
  }

  validateDateInRange(startDate: any): boolean {
    return validateDateRange(convertIsoToDate(startDate, false, false), this._minDate, this._maxDate);
  }

  writeValue(dateRange: PoDatepickerRange): void {
    this.resetDateRangeInputValidation();

    if (!dateRange || this.dateRangeObjectFailed(dateRange)) {
      this.dateRange = { start: '', end: '' };
    }

    if (!dateRange) {
      this.validateModel(this.dateRange);
    }

    if (this.dateRangeObjectFailed(dateRange)) {
      this.updateModel(dateRange);
    }

    if (this.isDateRangeObject(dateRange)) {
      this.dateRange = {
        start: this.convertPatternDateFormat(dateRange.start),
        end: this.convertPatternDateFormat(dateRange.end)
      };

      this.updateModel(this.dateRange);
    }

    this.updateScreenByModel(this.dateRange);
  }

  // Retorna um objeto do tipo PoMask com a mascara configurada.
  protected buildMask(format: string = this.format): PoMask {
    let mask = format.toUpperCase();

    mask = mask.replace(/DD/g, '99');
    mask = mask.replace(/MM/g, '99');
    mask = mask.replace(/YYYY/g, '9999');

    return new PoMask(mask, true);
  }

  protected dateFormatFailed(value: string): boolean {
    return value && !this.poDateService.isValidIso(value);
  }

  // Executa a função onChange
  protected updateModel(value: any) {
    const model = typeof value === 'object' ? { ...value } : value;
    // Quando o input não possui um formulário, então esta função não é registrada
    if (this.onChangeModel) {
      this.onChangeModel(model);
    }
  }

  protected validateModel(value: any) {
    const model = { ...value };
    if (this.validatorChange) {
      this.validatorChange(model);
    }
  }

  protected verifyValidDate(startDate: string, endDate: string) {
    if (startDate !== '' && endDate !== '') {
      return this.dateIsValid(startDate) && this.dateIsValid(endDate);
    } else if (startDate !== '') {
      return this.dateIsValid(startDate);
    } else {
      return this.dateIsValid(endDate);
    }
  }

  private convertPatternDateFormat(value: any) {
    if (value instanceof Date) {
      return this.poDateService.convertDateToISO(value);
    }

    return value;
  }

  private dateRangeFailed(startDate: string, endDate: string): boolean {
    return !this.poDateService.isDateRangeValid(endDate, startDate) || !this.isStartDateRangeInputValid;
  }

  private dateRangeFormatFailed(startDate: string, endDate: string): boolean {
    return this.dateFormatFailed(endDate) || this.dateFormatFailed(startDate) || !this.isDateRangeInputFormatValid;
  }

  private dateRangeObjectFailed(value): boolean {
    return value && !this.isDateRangeObject(value);
  }

  private isDateRangeObject(value): boolean {
    return value && value.hasOwnProperty('start') && value.hasOwnProperty('end');
  }

  private requiredDateRangeFailed(startDate: string, endDate: string): boolean {
    return (
      this.isDateRangeInputValid &&
      PoValidators.requiredFailed(this.required || this.hasValidatorRequired, this.disabled, startDate) &&
      PoValidators.requiredFailed(this.required || this.hasValidatorRequired, this.disabled, endDate)
    );
  }

  private dateIsValid(date: string) {
    const [strYear, strMonth, strDay] = date.split('-');
    const year = Number(strYear);
    const month = Number(strMonth);
    const day = Number(strDay);

    //verificação dos meses com 31 dias
    if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
      return day < 1 || day > 31 ? false : true;
    } else if (month === 4 || month === 6 || month === 9 || month === 11) {
      //verificação dos meses com 30 dias
      return day < 1 || day > 30 ? false : true;
    } else {
      //verificacao de ano bissexto para verificar até qual dia irá o mês de fevereiro
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        return day < 1 || day > 29 ? false : true;
      } else {
        return day < 1 || day > 28 ? false : true;
      }
    }
  }

  protected abstract resetDateRangeInputValidation(): void;

  protected abstract updateScreenByModel(dateRange: PoDatepickerRange);
}
