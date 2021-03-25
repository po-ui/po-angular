import { Input, EventEmitter, Output, Directive } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { isTypeof, sortFields } from '../../../../utils/util';

import { getGridColumnsClasses, isVisibleField } from '../../po-dynamic.util';
import { PoDynamicFieldType } from '../../po-dynamic-field-type.enum';
import { PoDynamicFormField } from '../po-dynamic-form-field.interface';
import { PoDynamicFormFieldInternal } from './po-dynamic-form-field-internal.interface';
import { PoComboFilter } from '../../../po-field/po-combo/interfaces/po-combo-filter.interface';
import { PoLookupFilter } from '../../../po-field/po-lookup/interfaces/po-lookup-filter.interface';

@Directive()
export class PoDynamicFormFieldsBaseComponent {
  private _fields: Array<PoDynamicFormField>;
  private _validateFields: Array<string>;
  private _value?: any = {};

  visibleFields: Array<PoDynamicFormFieldInternal> = [];

  @Input('p-auto-focus') autoFocus?: string;

  // array de objetos que implementam a interface PoDynamicFormField, que serão exibidos no componente.
  @Input('p-fields') set fields(value: Array<PoDynamicFormField>) {
    this._fields = Array.isArray(value) ? [...value] : [];
  }

  get fields() {
    return this._fields;
  }

  @Output('p-fieldsChange') fieldsChange = new EventEmitter<any>();

  // Evento disparado se existir optionsService em visibleField. Necessário resgatar referência do objeto selecionado para quando se tratar de recebimento de opções via serviço.
  @Output('p-object-value') objectValue = new EventEmitter<any>();

  // valor que será utilizado para iniciar valor no componente.
  @Input('p-value') set value(value: any) {
    this._value = value && isTypeof(value, 'object') ? value : {};
  }

  get value() {
    return this._value;
  }

  @Input('p-disabled-form') disabledForm: boolean;

  @Input('p-validate') validate?: string | Function;

  @Input('p-validate-fields') set validateFields(value: Array<string>) {
    this._validateFields = Array.isArray(value) ? [...value] : [];
  }

  get validateFields() {
    return this._validateFields;
  }

  @Output('p-form-validate') formValidate = new EventEmitter<any>();

  constructor(private titleCasePipe: TitleCasePipe) {}

  compareTo(value, compareTo) {
    return value === compareTo;
  }

  // retorna um array com os objetos configurados e visiveis.
  protected getVisibleFields() {
    const visibleFields = [];

    this.fields.forEach(field => {
      if (this.existsProperty(visibleFields, field.property)) {
        this.printError(
          `"po-dynamic-form" property "${field.property}" está duplicado. Interface: PoDynamicFormField.`
        );
        return;
      }

      if (!field['property']) {
        this.printError('"po-dynamic-form" É obrigatório ser especificado um property.');
        return;
      }

      if (isVisibleField(field)) {
        visibleFields.push(this.createField(field));
      }
    });

    return sortFields(visibleFields);
  }

  // converte um array em string para um array de objetos que contem label e value.
  private convertOptions(options: Array<any>): Array<{ label: string; value: string }> {
    const everyOptionString = options.every(option => typeof option === 'string');

    if (everyOptionString) {
      return options.map(value => ({ label: value, value }));
    }

    return options;
  }

  // cria um novo objeto com as classes de grid system, com control (tipo do componente) e label default.
  private createField(field: PoDynamicFormField): PoDynamicFormFieldInternal {
    const control = this.getComponentControl(field);
    const options = !!field.options ? this.convertOptions(field.options) : undefined;
    const focus = this.hasFocus(field);
    const type = field && field.type ? field.type.toLocaleLowerCase() : 'string';

    const componentClass = getGridColumnsClasses(
      field.gridSmColumns,
      field.gridMdColumns,
      field.gridLgColumns,
      field.gridXlColumns,
      field.gridColumns,
      {
        smPull: field.gridSmPull,
        mdPull: field.gridMdPull,
        lgPull: field.gridLgPull,
        xlPull: field.gridXlPull
      }
    );

    return {
      label: this.titleCasePipe.transform(field.property),
      maskFormatModel: this.compareTo(type, PoDynamicFieldType.Time),
      ...field,
      componentClass,
      control,
      focus,
      options
    };
  }

  private existsProperty(fields: Array<PoDynamicFormField>, property: string) {
    return fields.some(field => {
      return field.property === property;
    });
  }

  // recupera o componente de acordo com algumas regras do field.
  private getComponentControl(field: PoDynamicFormField = <any>{}) {
    const type = field && field.type ? field.type.toLocaleLowerCase() : 'string';

    if (this.isNumberType(field, type)) {
      return 'number';
    } else if (this.isCurrencyType(field, type)) {
      return 'decimal';
    } else if (this.isSelect(field)) {
      return 'select';
    } else if (this.isRadioGroup(field)) {
      return 'radioGroup';
    } else if (this.isCheckboxGroup(field)) {
      return 'checkboxGroup';
    } else if (this.isMultiselect(field)) {
      return 'multiselect';
    } else if (this.compareTo(type, PoDynamicFieldType.Boolean)) {
      return 'switch';
    } else if (this.compareTo(type, PoDynamicFieldType.Date) || this.compareTo(type, PoDynamicFieldType.DateTime)) {
      return 'datepicker';
    } else if (this.compareTo(type, PoDynamicFieldType.Time)) {
      field.mask = field.mask || '99:99';

      return 'input';
    } else if (this.isCombo(field)) {
      return 'combo';
    } else if (this.isLookup(field)) {
      return 'lookup';
    } else if (this.isTextarea(field)) {
      return 'textarea';
    } else if (this.isPassword(field)) {
      return 'password';
    }

    return 'input';
  }

  private hasFocus(field: PoDynamicFormField) {
    return !!this.autoFocus && this.autoFocus === field.property;
  }

  private isCheckboxGroup(field: PoDynamicFormField) {
    const { optionsService, optionsMulti, options } = field;

    return !optionsService && optionsMulti && !!options && options.length <= 3;
  }

  private isCombo(field: PoDynamicFormField) {
    const { optionsService } = field;

    return !!optionsService && (isTypeof(optionsService, 'string') || this.isComboFilter(optionsService));
  }

  private isCurrencyType(field: PoDynamicFormField, type: string) {
    const { mask, pattern } = field;

    return this.compareTo(type, PoDynamicFieldType.Currency) && !mask && !pattern;
  }

  private isLookupFilter(object: any): object is PoLookupFilter {
    return object && (<PoLookupFilter>object).getObjectByValue !== undefined;
  }

  private isComboFilter(object: any): object is PoComboFilter {
    return object && (<PoComboFilter>object).getFilteredData !== undefined;
  }

  private isLookup(field: PoDynamicFormField) {
    const { searchService } = field;

    return !!searchService && (isTypeof(searchService, 'string') || this.isLookupFilter(searchService));
  }

  private isMultiselect(field: PoDynamicFormField) {
    const { optionsService, optionsMulti, options } = field;

    return !optionsService && optionsMulti && !!options && options.length > 3;
  }

  private isNumberType(field: PoDynamicFormField, type: string) {
    const { mask, pattern } = field;

    return this.compareTo(type, PoDynamicFieldType.Number) && !mask && !pattern;
  }

  private isPassword(field: PoDynamicFormField) {
    const { secret } = field;

    return secret;
  }

  private isRadioGroup(field: PoDynamicFormField) {
    const { optionsMulti, options } = field;

    return !optionsMulti && !!options && options.length <= 3;
  }

  private isSelect(field: PoDynamicFormField) {
    const { optionsMulti, options } = field;

    return !optionsMulti && !!options && options.length > 3;
  }

  private isTextarea(field: PoDynamicFormField) {
    const { rows } = field;

    return rows && rows >= 3;
  }

  private printError(error: string) {
    console.error(error);
  }
}
