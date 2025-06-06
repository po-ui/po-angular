import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnChanges,
  Optional,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  convertToBoolean,
  getDefaultSize,
  isSafari,
  removeDuplicatedOptions,
  removeUndefinedAndNullOptions,
  uuid,
  validateSize,
  validValue
} from '../../../utils/util';

import { PoFieldSize } from '../../../enums/po-field-size.enum';
import { PoThemeService } from '../../../services';
import { AnimaliaIconDictionary, ICONS_DICTIONARY } from '../../po-icon';
import { PoFieldValidateModel } from '../po-field-validate.model';
import { PoSelectOptionGroup } from './po-select-option-group.interface';
import { PoSelectOption } from './po-select-option.interface';

const PO_SELECT_FIELD_LABEL_DEFAULT = 'label';
const PO_SELECT_FIELD_VALUE_DEFAULT = 'value';

/**
 * @docsExtends PoFieldValidateModel
 *
 * @example
 *
 * <example name="po-select-basic" title="PO Select Basic">
 *   <file name="sample-po-select-basic/sample-po-select-basic.component.html"> </file>
 *   <file name="sample-po-select-basic/sample-po-select-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-select-labs" title="PO Select Labs">
 *   <file name="sample-po-select-labs/sample-po-select-labs.component.html"> </file>
 *   <file name="sample-po-select-labs/sample-po-select-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-select-customer-registration" title="PO Select - Customer registration">
 *   <file name="sample-po-select-customer-registration/sample-po-select-customer-registration.component.html"> </file>
 *   <file name="sample-po-select-customer-registration/sample-po-select-customer-registration.component.ts"> </file>
 *   <file name="sample-po-select-customer-registration/sample-po-select-customer-registration.service.ts"> </file>
 * </example>
 *
 * <example name="po-select-companies" title="PO Select Companies">
 *   <file name="sample-po-select-companies/sample-po-select-companies.component.html"> </file>
 *   <file name="sample-po-select-companies/sample-po-select-companies.component.ts"> </file>
 * </example>
 *
 * @description
 *
 * O componente po-select exibe uma lista de valores e permite que o usuário selecione um desses valores.
 * Os valores listados podem ser fixos ou dinâmicos de acordo com a necessidade do desenvolvedor, dando mais flexibilidade ao componente.
 * O po-select não permite que o usuário informe um valor diferente dos valores listados, isso garante a consistência da informação.
 * O po-select não permite que sejam passados valores duplicados, undefined e null para as opções, excluindo-os da lista.
 *
 * > Ao passar um valor para o _model_ que não está na lista de opções, o mesmo será definido como `undefined`.
 *
 * Também existe a possibilidade de utilizar um _template_ para a exibição dos itens da lista,
 * veja mais em **[p-combo-option-template](/documentation/po-combo-option-template)**.
 *
 * > Obs: o template **[p-select-option-template](/documentation/po-select-option-template)** será depreciado na versão 14.x.x.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                            | Descrição                                             | Valor Padrão                                    |
 * |----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
 * | **Default Values**                     |                                                       |                                                 |
 * | `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                      |
 * | `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-default)`                      |
 * | `--text-color-empty`                   | Cor do placeholder                                    | `var(--color-neutral-light-30)`                 |
 * | `--color`                              | Cor da borda                                          | `var(--color-neutral-dark-70)`                  |
 * | `--background`                         | Cor de background                                     | `var(--color-neutral-light-05)`                 |
 * | `--text-color`                         | Cor do texto                                          | `var(--color-neutral-dark-90)`                  |
 * | `--padding-horizontal`                 | Preenchimento horizontal                              | `0.5em`                                         |
 * | `--padding-vertical`                   | Preenchimento vertical                                | `0.7em`                                         |
 * | **Hover**                              |                                                       |                                                 |
 * | `--color-hover`                        | Cor principal no estado hover                         | `var(--color-brand-01-dark)`                    |
 * | `--background-hover`                   | Cor de background no estado hover                     | `var(--color-brand-01-lighter)`                 |
 * | **Focused**                            |                                                       |                                                 |
 * | `--outline-color-focused`              | Cor do outline do estado de focus                     | `var(--color-action-focus)`                     |
 * | `--color-focused`                      | Cor da borda no estado de focus                       | `var(--color-action-default)`                   |
 * | **Disabled**                           |                                                       |                                                 |
 * | `--color-disabled`                     | Cor principal no estado disabled                      | `var(--color-neutral-light-30)`                 |
 * | `--background-color-disabled`&nbsp;    | Cor de background no estado disabled                  | `var(--color-neutral-light-20)`                 |
 *
 */
@Component({
  selector: 'po-select',
  templateUrl: './po-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoSelectComponent),
      multi: true
    }
  ],
  standalone: false
})
export class PoSelectComponent extends PoFieldValidateModel<any> implements OnChanges {
  private _iconToken: { [key: string]: string };

  @ViewChild('select', { read: ElementRef, static: true }) selectElement: ElementRef;

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao sair do campo.
   */
  @Output('p-blur') blur: EventEmitter<any> = new EventEmitter();

  /**
   * @optional
   *
   * @description
   *
   * Função para atualizar o ngModel do componente, necessário quando não for utilizado dentro da tag form.
   *
   * Na versão 12.2.0 do Angular a verificação `strictTemplates` vem true como default. Portanto, para utilizar
   * two-way binding no componente deve se utilizar da seguinte forma:
   *
   * ```
   * <po-select ... [ngModel]="selectModel" (ngModelChange)="selectModel = $event"> </po-select>
   * ```
   */
  @Output('ngModelChange') ngModelChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Indica que o campo será somente para leitura.
   *
   * @default `false`
   */
  @Input({ alias: 'p-readonly', transform: convertToBoolean }) readonly: boolean = false;

  /** Mensagem que aparecerá enquanto nenhuma opção estiver selecionada. */
  @Input('p-placeholder') placeholder?: string;

  displayValue;
  id = `po-select[${uuid()}]`;
  modelValue: any;
  selectedValue: any;
  optionsDefault = [];
  listGroupOptions = [];
  optionWithoutGroup = [];
  isSafari: boolean = isSafari();

  protected onModelTouched: any;

  private _fieldLabel?: string = PO_SELECT_FIELD_LABEL_DEFAULT;
  private _fieldValue?: string = PO_SELECT_FIELD_VALUE_DEFAULT;
  private _options: Array<PoSelectOption> | Array<PoSelectOptionGroup> | Array<any>;
  private _size?: string = undefined;

  /**
   * Nesta propriedade deve ser definido uma coleção de objetos que implementam a interface `PoSelectOption`,
   * ou uma coleção de objetos dentro de grupos diferentes, que seriam da interface `PoSelectOptionGroup`.
   *
   * Caso esta lista estiver vazia, o model será `undefined`.
   *
   * > Essa propriedade é imutável, ou seja, sempre que quiser atualizar a lista de opções disponíveis
   * atualize a referência do objeto:
   *
   * ```
   * // atualiza a referência do objeto garantindo a atualização do template
   * this.options = [...this.options, { value: 'x', label: 'Nova opção' }];
   *
   * // evite, pois não atualiza a referência do objeto podendo gerar atrasos na atualização do template
   * this.options.push({ value: 'x', label: 'Nova opção' });
   * ```
   *
   * > Para coleção de objetos dentro de grupos distintos será exibido a label e opções somente se a propriedade `options` possua valores.
   *  Sendo assim, a estrutura seguiria dessa forma:
   *
   * ```
   * this.options = [{
   *  label: 'Opções',
   *  options: [
   *    { value: 1, label: 'opção 1' },
   *    { value: 2, label: 'opção 2' }
   *  ],
   * }];
   * ```
   *
   * É possível a utilização de opções agrupadas e desagrupadas em conjunto, porém será feita a ordenação de exibir as opções
   * desagrupadas acima.
   *
   */
  @Input('p-options') set options(options: Array<PoSelectOption | PoSelectOptionGroup | any>) {
    this.listGroupOptions = [];
    this.optionWithoutGroup = [];

    if (this.fieldLabel && this.fieldValue && options) {
      options.map(option => {
        if (this.isItemGroup(option)) {
          option.options.map(opt => {
            opt.label = opt[this.fieldLabel];
            opt.value = opt[this.fieldValue];
          });
        } else {
          option.label = option[this.fieldLabel];
          option.value = option[this.fieldValue];
        }
      });
    }

    if (options) {
      this.optionsDefault = [...options];
      this.separateOptions();

      this.optionsDefault = [];
      this.optionsDefault = [...this.optionWithoutGroup, ...this.transformInArray(this.listGroupOptions)];
      this.onUpdateOptions();
      this._options = [...this.optionsDefault];
    }
  }

  get options() {
    return this._options;
  }

  /**
   * @optional
   *
   * @description
   * Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na lista do componente
   * (`p-options`), esta propriedade será responsável pelo texto de apresentação de cada item da lista.
   *
   * @default `label`
   */
  @Input('p-field-label') set fieldLabel(value: string) {
    this._fieldLabel = value || PO_SELECT_FIELD_LABEL_DEFAULT;
    if (this.options && this.options.length > 0) {
      this.options = [...this.options];
    }
  }

  get fieldLabel() {
    return this._fieldLabel;
  }

  /**
   * @optional
   *
   * @description
   * Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na lista do componente
   * (`p-options`), esta propriedade será responsável pelo valor de cada item da lista.
   *
   * @default `value`
   */
  @Input('p-field-value') set fieldValue(value: string) {
    this._fieldValue = value || PO_SELECT_FIELD_VALUE_DEFAULT;
    if (this.options && this.options.length > 0) {
      this.options = [...this.options];
    }
  }

  /**
   * @docsPrivate
   *
   * Determinar se o valor do compo deve retorna objeto do tipo {value: any, label: any}
   */
  @Input({ alias: 'p-control-value-with-label', transform: convertToBoolean }) controlValueWithLabel?: boolean = false;

  get fieldValue() {
    return this._fieldValue;
  }

  get iconNameLib() {
    return this._iconToken.NAME_LIB;
  }

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

  /* istanbul ignore next */
  constructor(
    @Optional() @Inject(ICONS_DICTIONARY) value: { [key: string]: string },
    changeDetector: ChangeDetectorRef,
    private el: ElementRef,
    public renderer: Renderer2,
    protected poThemeService: PoThemeService
  ) {
    super(changeDetector);

    this._iconToken = value ?? AnimaliaIconDictionary;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options?.currentValue) {
      this.options = changes.options.currentValue;
    }
  }

  /**
   * Função que atribui foco ao componente.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoSelectComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoSelectComponent, { static: true }) select: PoSelectComponent;
   *
   * focusSelect() {
   *   this.select.focus();
   * }
   * ```
   */
  focus(): void {
    if (!this.disabled) {
      this.selectElement.nativeElement.focus();
    }
  }

  getErrorPattern() {
    return this.fieldErrorMessage && this.hasInvalidClass() ? this.fieldErrorMessage : '';
  }

  hasInvalidClass() {
    return (
      this.el.nativeElement.classList.contains('ng-invalid') && this.el.nativeElement.classList.contains('ng-dirty')
    );
  }

  onBlur(event: any) {
    this.onModelTouched?.();

    if (this.getAdditionalHelpTooltip() && this.displayAdditionalHelp) {
      this.showAdditionalHelp();
    }

    if (event.type === 'blur') {
      this.blur.emit();
    }
  }

  // Altera o valor ao selecionar um item.
  onSelectChange(value: any) {
    this.onModelTouched?.();
    if (value && this.options && this.options.length) {
      const optionFound: any = this.findOptionValue(value);

      if (optionFound) {
        this.updateValues(optionFound);
      }
    }
  }

  onUpdateOptions() {
    if (this.modelValue) {
      this.onSelectChange(this.modelValue);
    }
  }

  // Atualiza valores
  updateValues(option: any): void {
    if (this.selectedValue !== option[this.fieldValue]) {
      this.selectedValue = option[this.fieldValue];
      this.selectElement.nativeElement.value = option[this.fieldValue];
      this.updateModel(this.getValueUpdate(option));
      this.displayValue = option[this.fieldLabel];
      this.emitChange(option[this.fieldValue]);
    }
  }

  // Recebe as alterações do model
  onWriteValue(value: any) {
    value = this.getValueWrite(value);
    const optionFound: any = this.findOptionValue(value);

    if (optionFound) {
      this.selectElement.nativeElement.value = optionFound.value;
      this.selectedValue = optionFound[this.fieldValue];
      this.displayValue = optionFound[this.fieldLabel];
    } else if (validValue(this.selectedValue)) {
      this.selectElement.nativeElement.value = undefined;
      this.updateModel(undefined);
      this.selectedValue = undefined;
      this.displayValue = undefined;
    }

    this.modelValue = value;
    this.changeDetector.detectChanges();
  }

  extraValidation(c: AbstractControl): { [key: string]: any } {
    return null;
  }

  isItemGroup(item: PoSelectOption | PoSelectOptionGroup | any): boolean {
    if (item.options) {
      return Array.isArray(item.options) ? true : false;
    }
    return false;
  }

  onKeyDown(event: KeyboardEvent): void {
    const isFieldFocused = document.activeElement === this.selectElement.nativeElement;

    if (isFieldFocused) {
      this.keydown.emit(event);
    }
  }

  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }

  /**
   * Método que exibe `p-additionalHelpTooltip` ou executa a ação definida em `p-additionalHelp`.
   * Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.
   *
   * ```html
   * <po-select
   *  #select
   *  ...
   *  p-additional-help-tooltip="Mensagem de ajuda complementar"
   *  (p-keydown)="onKeyDown($event, select)"
   * ></po-select>
   * ```
   * ```typescript
   * onKeyDown(event: KeyboardEvent, inp: PoSelectComponent): void {
   *  if (event.code === 'F9') {
   *    inp.showAdditionalHelp();
   *  }
   * }
   * ```
   */
  override showAdditionalHelp(): boolean {
    return super.showAdditionalHelp();
  }

  private isEqual(value: any, inputValue: any): boolean {
    if ((value || value === 0) && inputValue) {
      return value.toString() === inputValue.toString();
    }

    if ((value === null && inputValue !== null) || (value === undefined && inputValue !== undefined)) {
      value = `${value}`; // Transformando em string
    }

    return value === inputValue;
  }

  private findOptionValue(value: any) {
    if (this.options) {
      return this.options.find(option => this.isEqual(option.value, value));
    }
  }

  private getValueUpdate(option: any) {
    if (this.controlValueWithLabel) {
      return {
        value: option[this.fieldValue],
        label: option[this.fieldLabel]
      };
    }

    return option[this.fieldValue];
  }

  private getValueWrite(data: any) {
    if (this.controlValueWithLabel && data?.value) {
      return data?.value;
    }

    return data;
  }

  private transformInArray(objectWithArray: Array<any>): Array<PoSelectOptionGroup | any> {
    return objectWithArray.reduce((options, items) => {
      if (items.options) {
        return options.concat(items.options);
      }
      return [];
    }, []);
  }

  private separateOptions() {
    this.optionsDefault.forEach(option => {
      if (this.isItemGroup(option)) {
        this.validateOptions(option.options);
        this.listGroupOptions.push(option);
      } else {
        this.optionWithoutGroup.push(option);
      }
    });

    if (this.optionWithoutGroup.length > 0) {
      this.validateOptions(this.optionWithoutGroup);
    }
  }

  private validateOptions(options: Array<any>) {
    removeDuplicatedOptions(options);
    removeUndefinedAndNullOptions(options);
  }
}
