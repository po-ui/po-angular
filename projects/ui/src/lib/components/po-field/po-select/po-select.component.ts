import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  IterableDiffers,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  removeDuplicatedOptions,
  removeDuplicatedOptionsWithFieldValue,
  removeUndefinedAndNullOptions,
  removeUndefinedAndNullOptionsWithFieldValue,
  validValue
} from '../../../utils/util';

import { InputBoolean } from '../../../decorators';
import { PoFieldValidateModel } from '../po-field-validate.model';
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
 *   <file name='sample-po-select-customer-registration/sample-po-select-customer-registration.component.e2e-spec.ts'> </file>
 *   <file name='sample-po-select-customer-registration/sample-po-select-customer-registration.component.po.ts'> </file>
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
  ]
})
export class PoSelectComponent extends PoFieldValidateModel<any> implements DoCheck, OnChanges {
  @ViewChild('select', { read: ElementRef, static: true }) selectElement: ElementRef;

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
  @Input('p-readonly') @InputBoolean() readonly: boolean = false;

  /** Mensagem que aparecerá enquanto nenhuma opção estiver selecionada. */
  @Input('p-placeholder') placeholder?: string;

  displayValue;
  modelValue: any;
  selectedValue: any;
  onModelTouched: any;

  private differ: any;
  private _fieldLabel?: string = PO_SELECT_FIELD_LABEL_DEFAULT;
  private _fieldValue?: string = PO_SELECT_FIELD_VALUE_DEFAULT;
  private _options: Array<PoSelectOption> | Array<any>;

  /**
   * Nesta propriedade deve ser definido uma coleção de objetos que implementam a interface `PoSelectOption`.
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
   */
  @Input('p-options') set options(options: Array<any>) {
    if (this.fieldLabel && this.fieldValue && options) {
      options.map(option => {
        option.label = option[this.fieldLabel];
        option.value = option[this.fieldValue];
      });
    }

    if (options) {
      this.validateOptions([...options]);
      this.onUpdateOptions();
      this._options = [...options];
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

  get fieldValue() {
    return this._fieldValue;
  }

  /* istanbul ignore next */
  constructor(private changeDetector: ChangeDetectorRef, differs: IterableDiffers, public renderer: Renderer2) {
    super();
    this.differ = differs.find([]).create(null);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options?.currentValue) {
      this.options = changes.options.currentValue;
    }
  }

  ngDoCheck() {
    const change = this.differ.diff(this.options);

    if (change) {
      this.validateOptions(this.options);
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

  onBlur() {
    this.onModelTouched?.();
  }

  // Altera o valor ao selecionar um item.
  onSelectChange(value: any) {
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
      this.updateModel(option[this.fieldValue]);
      this.displayValue = option[this.fieldLabel];
      this.emitChange(option[this.fieldValue]);
    }
  }

  // Recebe as alterações do model
  onWriteValue(value: any) {
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

  private validateOptions(options: Array<any>) {
    removeDuplicatedOptions(options);
    removeUndefinedAndNullOptions(options);
    removeDuplicatedOptionsWithFieldValue(options, this.fieldValue);
    removeUndefinedAndNullOptionsWithFieldValue(options, this.fieldValue);
  }
}
