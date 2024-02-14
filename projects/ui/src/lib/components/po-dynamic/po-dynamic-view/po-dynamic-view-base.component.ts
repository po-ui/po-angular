import { CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Directive, Input } from '@angular/core';

import { PoTimePipe } from '../../../pipes/po-time/po-time.pipe';
import { convertToBoolean, isTypeof, sortFields } from '../../../utils/util';

import { Observable, catchError, map, of } from 'rxjs';
import { getGridColumnsClasses, isVisibleField } from '../po-dynamic.util';
import { PoDynamicViewField } from './po-dynamic-view-field.interface';
import { PoDynamicViewService } from './services/po-dynamic-view.service';
import { PoComboFilterService } from '../../po-field/po-combo/po-combo-filter.service';
import { PoMultiselectFilterService } from '../../po-field/po-multiselect/po-multiselect-filter.service';

/**
 *
 * @description
 *
 * Componente para listar dados dinamicamente a partir de uma lista de objetos.
 *
 * > Por padrão esse componente cria `po-info` para exibição, é possível criar `po-tag` passando a propriedade { tag: true }.
 *
 */
@Directive()
export class PoDynamicViewBaseComponent {
  /**
   * @optional
   *
   * @description
   *
   * Possibilita executar uma função quando o componente é inicializado.
   *
   * A propriedade aceita os seguintes tipos:
   * - **String**: Endpoint usado pelo componente para requisição via `POST`.
   * - **Function**: Método que será executado na inicialização do componente.
   *
   * Para os dois tipos de utilização da propriedade espera-se o seguinte retorno:
   *
   * ```
   * {
   *   value: {
   *     cnpj: '**************', // altera valor do campo
   *     updated: (new Date()).toString() // atribui valor ao campo novo
   *   },
   *   fields: [
   *     { property: 'cnpj', tag: true, inverse: true }, // atribui novas propriedades ao field
   *     { property: 'updated', tag: true } // inclui campo novo
   *   ]
   * }
   * ```
   * > **value**: any = atribui novo valor do model.
   *
   * > **fields**: `Array<PoDynamicViewField>` = Lista de campos que deseja alterar as propriedades,
   * caso enviar um campo a mais será criado um novo campo.
   *
   * - Para esconder/remover campos precisa informar no field a propriedade `visible = false`.
   *
   */
  @Input('p-load') load: string | Function;

  visibleFields = [];
  service: any;

  private _fields: Array<PoDynamicViewField> = [];
  private _showAllValue: boolean = false;
  private _value = {};

  /**
   * @optional
   *
   * @description
   *
   * Lista de objetos que implementam a interface `PoDynamicView`.
   *
   * > Ex: `[ { property: 'age' } ]`
   *
   * Regras de tipagem e formatação dos valores exibidos:
   *
   * - Caso o *type* informado seja *currency* e não seja informado o *format* o mesmo recebe "'BRL', 'symbol', '1.2-2'"
   * como formato padrão.
   * - Caso o *type* informado seja *date* e não seja informado o *format* o mesmo recebe 'dd/MM/yyyy' como formato padrão.
   * - Caso o *type* informado seja *dateTime* e não seja informado o *format* o mesmo recebe 'dd/MM/yyyy HH:mm:ss' como formato padrão.
   * - Caso o *type* informado seja *number* e não seja informado o *format* o mesmo não será formatado.
   * - Caso o *type* informado seja *time* e não seja informado o *format* o mesmo recebe 'HH:mm:ss.ffffff' como formato padrão.
   *
   * > As propriedades informadas serão exibidas mesmo não contendo valor de referência no objeto da propriedade `p-value`.
   *
   * @default `[]`
   */
  @Input('p-fields') set fields(fields: Array<PoDynamicViewField>) {
    this._fields = Array.isArray(fields) ? [...fields] : [];
  }

  get fields() {
    return this._fields;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica se exibirá todas as informações contidas dentro do objeto informado na propriedade `p-value`.
   *
   * @default `false`
   */
  @Input('p-show-all-value') set showAllValue(value: boolean) {
    this._showAllValue = convertToBoolean(value);
  }

  get showAllValue() {
    return this._showAllValue;
  }

  /**
   * @description
   *
   * Objeto que será utilizado para exibir as informações dinâmicas, o valor será recuperado através do atributo *property*
   * dos objetos contidos na propridade `p-fields`.
   *
   * > Ex: `{ age: '35' }`
   */
  @Input('p-value') set value(value: object) {
    this._value = value && isTypeof(value, 'object') ? value : {};
  }

  get value() {
    return this._value;
  }

  constructor(
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private timePipe: PoTimePipe,
    private titleCasePipe: TitleCasePipe,
    protected dynamicViewService: PoDynamicViewService,
    protected comboFilterService: PoComboFilterService,
    protected multiselectFilterService: PoMultiselectFilterService
  ) {}

  protected getConfiguredFields(useSearchService = true) {
    const newFields = [];

    this.fields.forEach((field, index) => {
      if (!isVisibleField(field)) {
        return;
      }

      if (!field.searchService && !field.optionsService) {
        newFields.push(this.createField(field));
        return;
      }

      const hasValue =
        this.value[field.property]?.length ||
        (!Array.isArray(this.value[field.property]) && this.value[field.property] && useSearchService);

      if (hasValue) {
        if (field.searchService) {
          if (typeof field.searchService === 'object') {
            this.service = field.searchService as PoDynamicViewService;
          } else if (typeof field.searchService === 'string') {
            this.service = this.dynamicViewService;
            this.service.setConfig(field.searchService);
          }
        } else if (field.optionsService) {
          if (field.optionsMulti) {
            if (typeof field.optionsService === 'object') {
              this.service = field.optionsService as PoMultiselectFilterService;
            } else {
              this.service = this.multiselectFilterService;
              this.service.configProperties(field.optionsService, field.fieldLabel, field.fieldValue);
            }
          } else {
            if (typeof field.optionsService === 'object') {
              this.service = field.optionsService as PoComboFilterService;
            } else {
              this.service = this.comboFilterService;
              this.service.configProperties(field.optionsService, field.fieldLabel, field.fieldValue);
            }
          }
        }

        const indexUpdated = field.order || index;
        this.createFieldWithService(field, newFields, indexUpdated);
      }
    });

    return sortFields(newFields);
  }

  // retorna fields ligado ao value mais os atributos do value que não possuiam fields.
  protected getMergedFields() {
    const mergedFields = [...this.getConfiguredFields()];

    this.getValueFields().forEach(valueField => {
      const fieldIndex = mergedFields.findIndex(field => field.property === valueField.property);
      const property = valueField.property;

      if (fieldIndex === -1) {
        mergedFields.push(this.createField({ property }));
      }
    });

    return mergedFields;
  }

  // retorna o objeto value como fields.
  protected getValueFields() {
    return Object.keys(this.value).map(property => this.createField({ property }));
  }

  private createField(field: PoDynamicViewField) {
    const property = field.property;
    let value;
    if (field.isArrayOrObject && this.value[property]) {
      value = this.transformArrayValue(this.value[property], field);
    } else if (field.fieldLabel) {
      value = this.transformFieldLabel(property, field);
    }

    if (!value) {
      value = this.transformValue(field.type, this.value[property], field.format);
    }

    return this.returnValues(field, value);
  }

  private createFieldWithService(field: PoDynamicViewField, newFields?, index?) {
    const property = field.property;

    this.searchById(this.value[property], field).subscribe(response => {
      const value = response;
      const allValues = this.returnValues(field, value);
      newFields.splice(index, 0, allValues);
      sortFields(newFields);
    });
  }

  private returnValues(field: PoDynamicViewField, value: any) {
    const property = field.property;
    const classesGridColumns = getGridColumnsClasses(
      field.gridColumns,
      field.offsetColumns,
      {
        smGrid: field.gridSmColumns,
        mdGrid: field.gridMdColumns,
        lgGrid: field.gridLgColumns,
        xlGrid: field.gridXlColumns
      },
      {
        smOffset: field.offsetSmColumns,
        mdOffset: field.offsetMdColumns,
        lgOffset: field.offsetLgColumns,
        xlOffset: field.offsetXlColumns
      },
      {
        smPull: field.gridSmPull,
        mdPull: field.gridMdPull,
        lgPull: field.gridLgPull,
        xlPull: field.gridXlPull
      }
    );

    return {
      property,
      value,
      label: this.titleCasePipe.transform(property),
      cssClass: classesGridColumns,
      ...field
    };
  }

  private searchById(value: any, field: PoDynamicViewField): Observable<any> {
    if (typeof value === 'string') {
      value = value.trim();
    }

    if (value !== '') {
      if (field.optionsMulti) {
        return this.service
          .getObjectsByValues(value, field.params)
          .pipe(map(res => this.transformArrayValue(res, field)))
          .pipe(catchError(() => of(null)));
      } else {
        return this.service
          .getObjectByValue(value, field.params)
          .pipe(map(res => this.transformArrayValue(res, field)))
          .pipe(catchError(() => of(null)));
      }
    } else {
      return of(null);
    }
  }

  private transformArrayValue(valueProperty: any, field: PoDynamicViewField) {
    const valueArray = Array.isArray(valueProperty) ? valueProperty : [valueProperty];
    let labels: Array<string>;

    if (Array.isArray(field.format)) {
      labels = valueArray.map(objectData => this.formatField(objectData, field.format));
    } else {
      const arrayWithLabel = valueArray.map(item => ({
        value: item[field.fieldValue] || item.value,
        label: item[field.fieldLabel] || item.label
      }));

      labels = arrayWithLabel.map(optionValue => {
        if (optionValue.label) {
          const labelTranformed = this.transformValue(field.type, optionValue.label, field.format);
          if (field.concatLabelValue && optionValue.value) {
            return `${labelTranformed} - ${optionValue.value}`;
          } else {
            return labelTranformed;
          }
        }
      });
    }

    if (labels[0] !== undefined && labels.join()) {
      return labels.join(', ');
    } else {
      valueProperty = '';
      return undefined;
    }
  }

  private transformFieldLabel(property: string, field: PoDynamicViewField) {
    if (field.concatLabelValue && field.fieldLabel && field.fieldValue && !field.isArrayOrObject) {
      const transformedValue = this.transformValue(field.type, this.value[field.fieldLabel], field.format);
      return `${transformedValue} - ${this.value[field.fieldValue]}`;
    }

    if (field.fieldLabel && !field.concatLabelValue && !field.isArrayOrObject) {
      this.value[property] = this.value[field.fieldLabel];
    }
    return undefined;
  }

  private transformValue(type: string, value, format) {
    let transformedValue = value;

    switch (type) {
      case 'currency':
        transformedValue = this.currencyPipe.transform(value, format || 'BRL', 'symbol', '1.2-2');
        break;
      case 'date':
        transformedValue = this.datePipe.transform(value, format || 'dd/MM/yyyy');
        break;
      case 'dateTime':
        transformedValue = this.datePipe.transform(value, format || 'dd/MM/yyyy HH:mm:ss');
        break;
      case 'number':
        transformedValue = this.decimalPipe.transform(value, format);
        break;
      case 'time':
        transformedValue = this.timePipe.transform(value, format || 'HH:mm:ss.ffffff');
        break;
    }

    return transformedValue;
  }

  private formatField(objectSelected, properties) {
    let formattedField;
    if (Array.isArray(properties)) {
      for (const property of properties) {
        if (objectSelected && objectSelected[property]) {
          if (!formattedField) {
            formattedField = objectSelected[property];
          } else {
            formattedField += ' - ' + objectSelected[property];
          }
        }
      }
    }
    return formattedField;
  }
}
