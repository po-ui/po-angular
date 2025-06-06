import { ChangeDetectorRef, Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, Validator, Validators } from '@angular/forms';

import {
  convertDateToISODate,
  convertDateToISOExtended,
  convertIsoToDate,
  convertToBoolean,
  formatYear,
  getDefaultSize,
  isTypeof,
  replaceFormatSeparator,
  setYearFrom0To100,
  validateDateRange,
  validateSize
} from '../../../utils/util';
import { PoMask } from '../po-input/po-mask';
import { dateFailed, requiredFailed } from './../validators';

import { Observable, Subscription, switchMap } from 'rxjs';
import { PoFieldSize } from '../../../enums/po-field-size.enum';
import { PoThemeService } from '../../../services';
import { poLocaleDefault } from '../../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { PoDatepickerIsoFormat } from './enums/po-datepicker-iso-format.enum';

const poDatepickerFormatDefault: string = 'dd/mm/yyyy';

/**
 * @description
 *
 * O `po-datepicker` é um componente específico para manipulação de datas permitindo a digitação e / ou seleção.
 *
 * O formato de exibição da data, ou seja, o formato que é apresentado ao usuário é o dd/mm/yyyy,
 * mas podem ser definidos outros padrões (veja mais na propriedade `p-format`).
 *
 * O idioma padrão do calendário será exibido de acordo com o navegador, caso tenha necessidade de alterar
 * use a propriedade `p-locale`.
 *
 * O datepicker aceita três formatos de data: o E8601DZw (yyyy-mm-ddThh:mm:ss+|-hh:mm), o E8601DAw (yyyy-mm-dd) e o
 * Date padrão do Javascript.
 *
 * > Por padrão, o formato de saída do *model* se ajustará conforme o formato de entrada. Se por acaso precisar controlar o valor de saída,
 * a propriedade `p-iso-format` provê esse controle independentemente do formato de entrada. Veja abaixo os formatos disponíveis:
 *
 * - Formato de entrada e saída (E8601DZw) - `'2017-11-28T00:00:00-02:00'`;
 *
 * - Formato de entrada e saída (E8601DAw) - `'2017-11-28'`;
 *
 * - Formato de entrada (Date) - `new Date(2017, 10, 28)` e saída (E8601DAw) - `'2017-11-28'`;
 *
 * **Importante:**
 *
 * - Para utilizar datas com ano inferior a 100, verificar o comportamento do [`new Date`](https://www.w3schools.com/js/js_dates.asp)
 * e utilizar o método [`setFullYear`](https://www.w3schools.com/jsref/jsref_setfullyear.asp).
 * - Caso a data esteja inválida, o `model` receberá **'Data inválida'**.
 * - Caso o `input` esteja passando um `[(ngModel)]`, mas não tenha um `name`, então irá ocorrer um erro
 * do próprio Angular (`[ngModelOptions]="{standalone: true}"`).
 *
 * Exemplo:
 *
 * ```
 * <po-datepicker
 *   [(ngModel)]="pessoa.nome"
 *   [ngModelOptions]="{standalone: true}"
 * </po-datepicker>
 * ```
 *
 * > Não esqueça de importar o `FormsModule` em seu módulo, tal como para utilizar o `input default`.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS): <br>
 * Obs: Só é possível realizar alterações ao adicionar a classe `.po-input`
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                            | Descrição                                             | Valor Padrão                                     |
 * |----------------------------------------|-------------------------------------------------------|--------------------------------------------------|
 * | **Default Values**                     |                                                       |                                                  |
 * | `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                       |
 * | `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-default)`                       |
 * | `--text-color-placeholder` &nbsp;      | Cor principal do texto do placeholder                 | `var(--color-neutral-light-30)`                  |
 * | `--color`                              | Cor principal do datepicker                           | `var(--color-neutral-dark-70)`                   |
 * | `--background`                         | Cor de background                                     | `var(--color-neutral-light-05)`                  |
 * | `--padding`                            | Preenchimento                                         | `0 0.5rem`                                       |
 * | `--text-color`                         | Cor do texto                                          | `var(--color-neutral-dark-90)`                   |
 * | **Hover**                              |                                                       |                                                  |
 * | `--color-hover`                        | Cor principal no estado hover                         | `var(--color-brand-01-dark)`                     |
 * | `--background-hover`                   | Cor de background no estado hover                     | `var(--color-brand-01-lightest)`                 |
 * | **Focused**                            |                                                       |                                                  |
 * | `--color-focused`                      | Cor principal no estado de focus                      | `var(--color-action-default)`                    |
 * | `--outline-color-focused`              | Cor do outline do estado de focus                     | `var(--color-action-focus)`                      |
 * | **Disabled**                           |                                                       |                                                  |
 * | `--color-disabled`                     | Cor principal no estado disabled                      | `var(--color-neutral-light-30)`                  |
 * | `--background-disabled`                | Cor de background no estado disabled &nbsp;           | `var(--color-neutral-light-20)`                  |
 * | `--text-color-disabled`                | Cor do texto no estado disabled                       | `var(--color-neutral-dark-70)`                   |
 *
 */
@Directive()
export abstract class PoDatepickerBaseComponent implements ControlValueAccessor, OnInit, OnDestroy, Validator {
  // Propriedade interna que define se o ícone de ajuda adicional terá cursor clicável (evento) ou padrão (tooltip).
  @Input() additionalHelpEventTrigger: string | undefined;

  /**
   * @optional
   *
   * @description
   * Exibe um ícone de ajuda adicional ao `p-help`, com o texto desta propriedade no tooltip.
   * Se o evento `p-additional-help` estiver definido, o tooltip não será exibido.
   * **Como boa prática, indica-se utilizar um texto com até 140 caracteres.**
   * > Requer um recuo mínimo de 8px se o componente estiver próximo à lateral da tela.
   */
  @Input('p-additional-help-tooltip') additionalHelpTooltip?: string;

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
   *
   * Função executada para realizar a validação assíncrona personalizada.
   * Executada ao disparar o output `change`.
   *
   * @param value Valor atual preenchido no campo.
   *
   * @returns Retorna Observable com o valor `true` para sinalizar o erro `false` para indicar que não há erro.
   */
  @Input('p-error-async') errorAsync: (value) => Observable<boolean>;

  /* Nome do componente datepicker. */
  @Input('name') name: string;

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
   * Mensagem apresentada quando a data for inválida ou fora do período.
   *
   * > Por padrão, esta mensagem não é apresentada quando o campo estiver vazio, mesmo que ele seja requerido.
   * Para exibir a mensagem com o campo vazio, utilize a propriedade `p-required-field-error-message` em conjunto.
   */
  @Input('p-error-pattern') errorPattern?: string = '';

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
   * @optional
   *
   * @description
   *
   * Exibe a mensagem setada na propriedade `p-error-pattern` se o campo estiver vazio e for requerido.
   *
   * > Necessário que a propriedade `p-required` esteja habilitada.
   *
   * @default `false`
   */
  @Input('p-required-field-error-message') showErrorMessageRequired: boolean = false;

  /**
   * @optional
   *
   * @description
   * Evento disparado ao clicar no ícone de ajuda adicional.
   * Este evento ativa automaticamente a exibição do ícone de ajuda adicional ao `p-help`.
   */
  @Output('p-additional-help') additionalHelp: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao sair do campo.
   */
  @Output('p-blur') onblur: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao alterar valor do campo.
   */
  @Output('p-change') onchange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   * Evento disparado quando uma tecla é pressionada enquanto o foco está no componente.
   * Retorna um objeto `KeyboardEvent` com informações sobre a tecla.
   */
  @Output('p-keydown') keydown: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  offset: number;
  protected firstStart = true;
  protected hour: string = 'T00:00:00-00:00';
  protected isExtendedISO: boolean = false;
  protected objMask: any;
  protected onChangeModel: any = null;
  protected validatorChange: any;
  protected onTouchedModel: any = null;
  protected shortLanguage: string;
  protected isInvalid: boolean;
  protected hasValidatorRequired: boolean;

  private _format?: string = poDatepickerFormatDefault;
  private _isoFormat: PoDatepickerIsoFormat;
  private _maxDate: Date;
  private _minDate: Date;
  private _noAutocomplete?: boolean = false;
  private _placeholder?: string = '';
  private previousValue: any;
  private _size?: string = undefined;
  private subscription: Subscription = new Subscription();
  private _date: Date;

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
   * Mensagem que aparecerá enquanto o campo não estiver preenchido.
   */
  @Input('p-placeholder') set placeholder(placeholder: string) {
    this._placeholder = isTypeof(placeholder, 'string') ? placeholder : '';
  }

  get placeholder() {
    return this._placeholder;
  }

  /** Desabilita o campo. */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  disabled?: boolean = false;
  @Input('p-disabled') set setDisabled(disabled: string) {
    this.disabled = disabled === '' ? true : convertToBoolean(disabled);

    this.validateModel(convertDateToISOExtended(this.date, this.hour));
  }

  /** Torna o elemento somente leitura. */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly?: boolean = false;
  @Input('p-readonly') set setReadonly(readonly: string) {
    this.readonly = readonly === '' ? true : convertToBoolean(readonly);
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
  // eslint-disable-next-line @typescript-eslint/member-ordering
  required?: boolean = false;
  @Input('p-required') set setRequired(required: string) {
    this.required = required === '' ? true : convertToBoolean(required);

    this.validateModel(convertDateToISOExtended(this.date, this.hour));
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
    this._size = validateSize(value, this.poThemeService, PoFieldSize);
  }

  get size(): string {
    return this._size ?? getDefaultSize(this.poThemeService, PoFieldSize);
  }

  /** Habilita ação para limpar o campo. */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  clean?: boolean = false;
  @Input('p-clean') set setClean(clean: string) {
    this.clean = clean === '' ? true : convertToBoolean(clean);
  }

  /**
   * @optional
   *
   * @description
   *
   * Define uma data mínima para o `po-datepicker`.
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

    this.validateModel(convertDateToISOExtended(this.date, this.hour));
  }

  get minDate() {
    return this._minDate;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define uma data máxima para o `po-datepicker`.
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

    this.validateModel(convertDateToISOExtended(this.date, this.hour));
  }

  get maxDate() {
    return this._maxDate;
  }

  /**
   * @optional
   *
   * @description
   *
   * Formato de exibição da data.
   *
   * Valores válidos:
   *  - `dd/mm/yyyy`
   *  - `mm/dd/yyyy`
   *  - `yyyy/mm/dd`
   *
   * @default `dd/mm/yyyy`
   */
  @Input('p-format') set format(value: string) {
    if (value) {
      value = value.toLowerCase();
      if (value.match(/dd/) && value.match(/mm/) && value.match(/yyyy/)) {
        this._format = value;
        this.objMask = this.buildMask(
          replaceFormatSeparator(this.format, this.languageService.getDateSeparator(this.locale))
        );
        this.refreshValue(this.date);
        return;
      }
    }
    this._format = poDatepickerFormatDefault;
    this.objMask = this.buildMask(
      replaceFormatSeparator(this.format, this.languageService.getDateSeparator(this.locale))
    );
  }

  get format() {
    return this._format;
  }

  /**
   * @optional
   *
   * @description
   *
   * Padrão de formatação para saída do *model*, independentemente do formato de entrada.
   *
   * > Veja os valores válidos no *enum* `PoDatepickerIsoFormat`.
   */
  @Input('p-iso-format') set isoFormat(value: PoDatepickerIsoFormat) {
    if (Object.values(PoDatepickerIsoFormat).includes(value)) {
      this._isoFormat = value;
      this.isExtendedISO = value === PoDatepickerIsoFormat.Extended;
    }
  }

  get isoFormat() {
    return this._isoFormat;
  }

  /**
   * @optional
   *
   * @description
   *
   * Idioma do Datepicker.
   *
   * > O locale padrão sera recuperado com base no [`PoI18nService`](/documentation/po-i18n) ou *browser*.
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  _locale?: string;
  @Input('p-locale') set locale(value: string) {
    if (value) {
      this._locale = value.length >= 2 ? value : poLocaleDefault;
      this.objMask = this.buildMask(
        replaceFormatSeparator(this.format, this.languageService.getDateSeparator(this.locale))
      );
    } else {
      this._locale = this.shortLanguage;
      this.objMask = this.buildMask(
        replaceFormatSeparator(this.format, this.languageService.getDateSeparator(this.locale))
      );
    }
    this.refreshValue(this.date);
  }
  get locale() {
    return this._locale || this.shortLanguage;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define que o `calendar` e/ou tooltip (`p-additional-help-tooltip` e/ou `p-error-limit`) serão incluídos no body da
   * página e não dentro do componente. Essa opção pode ser necessária em cenários com containers que possuem scroll ou
   * overflow escondido, garantindo o posicionamento correto de ambos próximo ao elemento.
   *
   * > Quando utilizado com `p-additional-help-tooltip`, leitores de tela como o NVDA podem não ler o conteúdo do tooltip.
   *
   * @default `false`
   */
  @Input({ alias: 'p-append-in-body', transform: convertToBoolean }) appendBox: boolean = false;

  constructor(
    protected languageService: PoLanguageService,
    protected cd: ChangeDetectorRef,
    protected poThemeService: PoThemeService
  ) {}

  set date(value: any) {
    this._date = typeof value === 'string' ? convertIsoToDate(value, false, false) : value;
  }

  get date() {
    return this._date;
  }

  ngOnInit() {
    this.offset = new Date().getTimezoneOffset();
    this.formatTimezoneAndHour(this.offset);
    // Classe de máscara
    this.objMask = this.buildMask(
      replaceFormatSeparator(this.format, this.languageService.getDateSeparator(this.locale))
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  // Converte um objeto string em Date
  getDateFromString(dateString: string) {
    const day = parseInt(dateString.substring(this.format.indexOf('d'), this.format.indexOf('d') + 2), 10);
    const month = parseInt(dateString.substring(this.format.indexOf('m'), this.format.indexOf('m') + 2), 10) - 1;
    const year = parseInt(dateString.substring(this.format.indexOf('y'), this.format.indexOf('y') + 4), 10);

    const date = new Date(year, month, day);

    setYearFrom0To100(date, year);

    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : null;
  }

  // Formata a data.
  formatToDate(value: Date) {
    let dateFormatted = this.format;

    dateFormatted = dateFormatted.replace('dd', ('0' + value.getDate()).slice(-2));
    dateFormatted = dateFormatted.replace('mm', ('0' + (value.getMonth() + 1)).slice(-2));
    dateFormatted = dateFormatted.replace('yyyy', formatYear(value.getFullYear()));

    return dateFormatted;
  }

  // Método responsável por controlar o modelo.
  controlModel(date: Date) {
    this.date = date;
    if (date && this.isExtendedISO) {
      this.callOnChange(convertDateToISOExtended(this.date, this.hour));
    } else if (date && !this.isExtendedISO) {
      this.callOnChange(convertDateToISODate(this.date));
    } else {
      date === undefined ? this.callOnChange('') : this.callOnChange('Data inválida');
    }
  }

  // Executa a função onChange
  callOnChange(value: any, retry: boolean = true) {
    if (this.onChangeModel && value !== this.previousValue) {
      this.onChangeModel(value);
      this.previousValue = value;
    } else if (retry) {
      setTimeout(() => this.callOnChange(value, false));
    }
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar os estados de habilitado via forms api
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
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

  registerOnValidatorChange(fn: () => void) {
    this.validatorChange = fn;
  }

  validate(c: AbstractControl): { [key: string]: any } {
    // Verifica se já possui algum error pattern padrão.
    this.errorPattern =
      this.errorPattern !== 'Data inválida' && this.errorPattern !== 'Data fora do período' ? this.errorPattern : '';

    if (!this.hasValidatorRequired && this.showErrorMessageRequired && c.hasValidator(Validators.required)) {
      this.hasValidatorRequired = true;
    }

    if (dateFailed(c.value)) {
      this.errorPattern = this.errorPattern || 'Data inválida';

      this.cd?.markForCheck();
      return {
        date: {
          valid: false
        }
      };
    }

    if (requiredFailed(this.required, this.disabled, c.value)) {
      this.cd?.markForCheck();
      return {
        required: {
          valid: false
        }
      };
    }

    if (this.date && !validateDateRange(this.date, this._minDate, this._maxDate)) {
      this.errorPattern = this.errorPattern || 'Data fora do período';

      this.cd?.markForCheck();
      return {
        date: {
          valid: false
        }
      };
    }

    if (this.errorPattern !== '') {
      this.subscription?.unsubscribe();
      this.subscription = c.statusChanges
        .pipe(
          switchMap(status => {
            if (status === 'INVALID') {
              this.cd?.markForCheck();
            }
            return [];
          })
        )
        .subscribe();
    }

    return null;
  }

  protected validateModel(model: any) {
    if (this.validatorChange) {
      this.validatorChange(model);
    }
  }

  // Retorna um objeto do tipo PoMask com a mascara configurada.
  protected buildMask(format: string = this.format) {
    let mask = format.toUpperCase();

    mask = mask.replace(/DD/g, '99');
    mask = mask.replace(/MM/g, '99');
    mask = mask.replace(/YYYY/g, '9999');

    return new PoMask(mask, true);
  }

  formatTimezoneAndHour(offset: number) {
    const offsetAbsolute = Math.abs(offset);
    const timezone =
      (offset < 0 ? '+' : '-') +
      ('00' + Math.floor(offsetAbsolute / 60)).slice(-2) +
      ':' +
      ('00' + (offsetAbsolute % 60)).slice(-2);
    this.hour = 'T00:00:00' + timezone;
  }

  abstract writeValue(value: any): void;

  abstract refreshValue(value: Date): void;
}
