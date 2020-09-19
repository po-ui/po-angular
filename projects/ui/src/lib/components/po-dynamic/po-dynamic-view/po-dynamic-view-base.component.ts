import { Input, Directive } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';

import { convertToBoolean, isTypeof, sortFields } from '../../../utils/util';
import { PoTimePipe } from '../../../pipes/po-time/po-time.pipe';

import { getGridColumnsClasses, isVisibleField } from '../po-dynamic.util';
import { PoDynamicViewField } from './po-dynamic-view-field.interface';
import { PoDynamicViewService } from './po-dynamic-view.service';

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
  private _fields: Array<PoDynamicViewField> = [];
  private _showAllValue: boolean = false;
  private _value = {};

  visibleFields = [];

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
    protected dynamicViewService: PoDynamicViewService
  ) {}

  // retorna os fields com os valores recuperados do objeto value.
  protected getConfiguredFields() {
    const newFields = [];

    this.fields.forEach(field => {
      if (isVisibleField(field)) {
        newFields.push(this.createField(field));
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
    return Object.keys(this.value).map(property => {
      return this.createField({ property });
    });
  }

  private createField(field: PoDynamicViewField) {
    const property = field.property;
    const value = this.transformValue(field.type, this.value[property], field.format);

    const classesGridColumns = getGridColumnsClasses(
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
      property,
      value,
      label: this.titleCasePipe.transform(property),
      cssClass: classesGridColumns,
      ...field
    };
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
}
