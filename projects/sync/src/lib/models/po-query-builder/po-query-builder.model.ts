import { validateParameter } from '../../utils/utils';

import { PoResponseApi } from './../../services/po-http-client/interfaces/po-response-api.interface';
import { PoSchemaService } from './../../services/po-schema';
import { PoSyncSchema } from '../../services/po-sync/interfaces/po-sync-schema.interface';

/**
 * @description
 *
 * Classe utilitária para construir consultas sobre os registros de um *schema*.
 *
 * A utilização dos métodos desta classe é feita a partir do retorno do método `PoEntity.find()`. Por exemplo,
 * para utilizar o método `PoQueryBuilder.page()`, é necessário:
 *
 * ``` typescript
 * PoSyncService.getModel('schema name').find().page(2).exec();
 * ```
 *
 * O `PoQueryBuilder` foi projetado para que os seus métodos sejam
 * chamados em cascata e ao final desse encadeamento invocar o método
 * `PoQueryBuilder.exec()` para que a busca seja concluída. Por exemplo:
 *
 * ``` typescript
 * PoSyncService
 *   .getModel('schema name')
 *   .find()
 *   .page(2)
 *   .pageSize(5)
 *   .sort()
 *   .exec();
 * ```
 */
export class PoQueryBuilder {
  private fields: string;
  private filters: any;

  private _limit: number;
  private _page: number;
  private _pageSize: number;
  private _sort: string;

  constructor(private poSchemaService: PoSchemaService, private schema: PoSyncSchema) {
    this._page = 1;
    this.filters = {};
  }

  /**
   * Ao final da chamada dos métodos do `PoQueryBuilder` utilizados, este método deve ser chamado para que a busca seja concluída.
   *
   * @return {Promise<PoResponseApi | object>} Registros do *schema* na qual foi aplicado a consulta.
   */
  async exec(): Promise<PoResponseApi | object> {
    let storageData = await this.poSchemaService.getAll(this.schema.name);

    if (storageData && storageData.length) {
      if (Object.keys(this.filters).length) {
        storageData = this.applyFilters(storageData);
      }
      if (this.fields) {
        storageData = this.applyFields(this.schema.fields, storageData);
      }
      if (this._sort) {
        storageData = this.order(storageData, this._sort);
      }

      if (this._limit) {
        return storageData[0];
      } else {
        return this.paginate(storageData);
      }
    } else {
      return {
        hasNext: false,
        items: []
      };
    }
  }

  /**
   * Aplica filtros sobre os registros, baseados nos campos e valores definidos como filtro. Por exemplo:
   *
   * ```
   * PoQueryBuilder.filter({ name: 'Marie', age: 24 });
   * ```
   * Retorna todos os registros que contenham a propriedade `name` igual a Marie e `age` igual a 24.
   *
   * @param {object} filter Objeto que contém os campos e valores a serem filtrados no *schema*.
   *
   * @returns {PoQueryBuilder} Objeto que possibilita encadear um novo método do `PoQueryBuilder`.
   */
  filter(filter?: object): PoQueryBuilder {
    if (filter && typeof filter === 'object') {
      this.filters = { ...this.filters, ...filter };
    } else {
      throw new Error('Filter must be an object');
    }

    return this;
  }

  /**
   * Limita o número de registros que serão retornados.
   *
   * @param {number} limit Número de registros retornados.
   * @returns {PoQueryBuilder} Objeto que possibilita encadear um novo método do `PoQueryBuilder`.
   */
  limit(limit: number): PoQueryBuilder {
    this._limit = limit;
    return this;
  }

  /**
   * Especifica a página de registros que se deseja retornar.
   *
   * @param {number} page Número da página.
   * @returns {PoQueryBuilder} Objeto que possibilita encadear um novo método do `PoQueryBuilder`.
   */
  page(page: number): PoQueryBuilder {
    validateParameter({ page });

    this._page = page;
    return this;
  }

  /**
   * Define quantos elementos serão retornados por página.
   *
   * @param {number} pageSize Número de registros por página.
   * @returns {PoQueryBuilder} Objeto que possibilita encadear um novo método do `PoQueryBuilder`.
   */
  pageSize(pageSize: number): PoQueryBuilder {
    validateParameter({ pageSize });

    this._pageSize = pageSize;
    return this;
  }

  /**
   * Utilizado para definir quais campos do *schema* serão retornados na consulta.
   *
   * @param {string} fields Campos que serão retornados nos registros. Este campos devem estar dentro de
   * uma *string* separados por espaço podendo usar o caractere `-` para excluir campos.
   * Por exemplo, a definição abaixo:
   *
   * ```
   * PoQueryBuilder.select('name age address');
   * ```
   * Irá retornar apenas os campos `name`, `age` e `address`. Para não retornar um campo ou mais basta fazer:
   *
   * ```
   * PoQueryBuilder.select('-name -age');
   * ```
   *
   * @returns {PoQueryBuilder} Objeto que possibilita encadear um novo método do `PoQueryBuilder`.
   */
  select(fields: string): PoQueryBuilder {
    validateParameter({ fields });

    this.fields = fields;
    return this;
  }

  /**
   * Ordena os registros por um campo.
   *
   * @param {string} field Campo a ser ordenado. Para ordenar de forma decrescente basta colocar o caractere `-`
   * na frente do campo. Por exemplo:
   * ```
   * PoQueryBuilder.sort('-name');
   * ```
   *
   * @returns {PoQueryBuilder} Objeto que possibilita encadear um novo método do `PoQueryBuilder`.
   */
  sort(field: string): PoQueryBuilder {
    validateParameter({ field });

    this._sort = field;
    return this;
  }

  /**
   * Essa função serve como alias para o `PoQueryBuilder.filter()`. É utilizada somente para dar maior legibilidade ao código.
   *
   * @param {object} filter Objeto que contém os campos e valores a serem filtrados no *schema*.
   * @returns {PoQueryBuilder} Objeto que possibilita encadear um novo método do `PoQueryBuilder`.
   */
  where(filter: object): PoQueryBuilder {
    return this.filter(filter);
  }

  private applyFields(schemaFields: Array<any>, data: Array<object>): Array<object> {
    const receivedFields = this.fields.split(' ');
    let restrictedFields = [];
    let selectedFields = [];

    [selectedFields, restrictedFields] = this.groupFields(receivedFields);

    if (!selectedFields.length && restrictedFields.length) {
      selectedFields = [...schemaFields];
    }

    if (restrictedFields.length) {
      selectedFields = this.removeRestrictedFields(restrictedFields, selectedFields);
    }

    selectedFields = this.removeDuplicate(selectedFields);

    return this.removeFieldsData(data, selectedFields);
  }

  private applyFilters(data: Array<object>): Array<object> {
    Object.keys(this.filters).forEach(filterKey => {
      data = data.filter(item => item[filterKey] === this.filters[filterKey]);
    });

    return data;
  }

  private groupFields(receivedFields: Array<string>): Array<Array<string>> {
    const restrictedFields = [];
    const selectedFields = [];

    receivedFields.forEach(fields => {
      if (fields.startsWith('-')) {
        restrictedFields.push(fields.substring(1));
      } else {
        selectedFields.push(fields);
      }
    });
    return [selectedFields, restrictedFields];
  }

  private paginate(data: Array<any>): { hasNext: boolean; items: Array<any> } {
    const dataLength = data.length;
    const pageSize = this._pageSize || dataLength;

    const pages = Math.ceil(dataLength / pageSize);
    const begin = this._page * pageSize - pageSize;
    const end = begin + pageSize;

    return { hasNext: this._page < pages, items: data.slice(begin, end) };
  }

  private order(data: Array<any>, sortingField: string): Array<any> {
    const descendingOrder = sortingField.startsWith('-');
    sortingField = descendingOrder ? sortingField.substr(1) : sortingField;

    return data.sort((optionA, optionB) => {
      if (optionA[sortingField] > optionB[sortingField]) {
        return !descendingOrder ? 1 : -1;
      }

      if (optionA[sortingField] < optionB[sortingField]) {
        return !descendingOrder ? -1 : 1;
      }

      return 0;
    });
  }

  private removeDuplicate(fields): Array<any> {
    return fields.filter((item, position) => fields.indexOf(item) === position);
  }

  private removeFieldsData(data: Array<object>, chosenFields: Array<string>): Array<object> {
    data.forEach(item => {
      Object.keys(item).forEach(keyItem => {
        if (!chosenFields.includes(keyItem)) {
          delete item[keyItem];
        }
      });
    });
    return data;
  }

  private removeRestrictedFields(restrictedFields: Array<any>, fields: Array<any>) {
    return fields.filter(field => !restrictedFields.includes(field));
  }
}
