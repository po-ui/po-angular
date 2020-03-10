import { validateParameter } from '../../utils/utils';

import {
  PoEventSourcingOperation,
  PoEventSourcingService,
  PoEventSourcingSummaryItem
} from '../../services/po-event-sourcing';
import { PoQueryBuilder } from './../po-query-builder/po-query-builder.model';
import { PoSchemaService, PoSchemaUtil } from '../../services/po-schema';
import { PoSyncSchema } from '../../services/po-sync/interfaces/po-sync-schema.interface';

/**
 * @description
 *
 * Uma instância `PoEntity` representa um *schema* e ela contém métodos que possibilitam manipular seus registros,
 * como por exemplo: buscar, criar e remover.
 *
 * Esta instância pode ser obtida a partir do retorno do método `PoSyncService.getModel('schema name')`.
 */
export class PoEntity {
  constructor(
    private eventSourcing: PoEventSourcingService,
    private schema: PoSyncSchema,
    private poSchemaService: PoSchemaService
  ) {}

  /**
   * Busca os registros do *schema*, podendo filtrar o resultado a partir do filtro passado e retornando apenas
   * os campos definidos.
   *
   * Para que esta busca seja concluída é necessário utilizar o método `PoQueryBuilder.exec()`.
   * Veja mais em: [PoQueryBuilder](/documentation/po-query-builder).
   *
   * @param {object} filter Objeto que contém os campos e valores a serem filtrados no *schema*.
   * @param {string} fields Campos que serão retornados nos registros. Este campos devem estar dentro de
   * uma *string* separados por espaço podendo usar o caractere `-` para excluir campos.
   * Por exemplo, a definição abaixo:
   *
   * ```
   * PoQueryBuilder.select('name age address');
   * ```
   * Irá retornar apenas os campos `name`, `age` e `address`. E para não mostrar um campo ou mais basta fazer:
   *
   * ```
   * PoQueryBuilder.select('-name -age');
   * ```
   * @returns {PoQueryBuilder} Objeto que possibilita encadear um método do `PoQueryBuilder`.
   */
  find(filter?: object, fields?: string): PoQueryBuilder {
    const query = new PoQueryBuilder(this.poSchemaService, this.schema);

    if (filter) {
      query.filter(filter);
    }

    if (fields) {
      query.select(fields);
    }

    return query;
  }

  /**
   * Busca um registro pelo seu *id*.
   *
   * Para que esta busca seja concluída é necessário utilizar o método `PoQueryBuilder.exec()`.
   * Veja mais em: [PoQueryBuilder](/documentation/po-query-builder).
   *
   * @param {any} id Identificador do registro.
   * @param {string} fields Campos que serão retornados nos registros. Este campos devem estar dentro de
   * uma *string* separados por espaço podendo usar o caractere `-` para excluir campos.
   * Por exemplo, a definição abaixo:
   *
   * ```
   * PoQueryBuilder.select('name age address');
   * ```
   * Irá retornar apenas os campos `name`, `age` e `address`. E para não mostrar um campo ou mais basta fazer:
   *
   * ```
   * PoQueryBuilder.select('-name -age');
   * ```
   * @returns {PoQueryBuilder} Objeto que possibilita encadear um método do `PoQueryBuilder`.
   */
  findById(id: any, fields?: string): PoQueryBuilder {
    return this.findOne({ [this.schema.idField]: id }, fields);
  }

  /**
   * Semelhante ao método `PoEntity.find()`, porém retorna apenas o primeiro registro encontrado na busca.
   *
   * Para que esta busca seja concluída é necessário utilizar o método `PoQueryBuilder.exec()`.
   * Veja mais em: [PoQueryBuilder](/documentation/po-query-builder).
   *
   * @param {any} filter Objeto que contém os campos e valores a serem filtrados no *schema*.
   * @param {string} fields Campos que serão retornados nos registros. Este campos devem estar dentro de
   * uma *string* separados por espaço podendo usar o caractere `-` para excluir campos.
   * Por exemplo, a definição abaixo:
   *
   * ```
   * PoQueryBuilder.select('name age address');
   * ```
   * Irá retornar apenas os campos `name`, `age` e `address`. E para não mostrar um campo ou mais basta fazer:
   *
   * ```
   * PoQueryBuilder.select('-name -age');
   * ```
   * @returns {PoQueryBuilder} Objeto que possibilita encadear um método do `PoQueryBuilder`.
   */
  findOne(filter?: any, fields?: string): PoQueryBuilder {
    const query = this.find(filter, fields);
    query.limit(1);
    return query;
  }

  /**
   * Remove um registro.
   *
   * @param {object} record Registro que será removido.
   * @param {string} customRequestId Identificador customizado do comando.
   * @returns {Promise} Promessa que é concluída após o registro ser removido.
   */
  async remove(record: object, customRequestId?: string): Promise<any> {
    validateParameter({ record });

    const remove = async () => {
      const idField = record[this.schema.idField] ? this.schema.idField : PoSchemaUtil.syncInternalIdFieldName;
      const serverRecord = PoSchemaUtil.separateSchemaFields(this.schema, record)['serverRecord'];

      await this.poSchemaService.remove(this.schema.name, record[idField]);
      await this.eventSourcing.remove(this.schema.name, serverRecord, customRequestId);
    };

    return this.poSchemaService.limitedCallWrap(remove);
  }

  /**
   * Altera ou inclui um registro.
   *
   * > O registro será alterado se ele possuir um *id*, caso contrário um novo registro será criado.
   *
   * @param {object} record Registro que será persistido.
   * @param {string} customRequestId Identificador customizado do comando.
   * @returns {Promise} Promessa que é concluída após o registro ser alterado ou incluído.
   */
  async save(record: object, customRequestId?: string): Promise<any> {
    validateParameter({ record });

    return this.poSchemaService.limitedCallWrap(this.selectSaveType.bind(this, record, true, customRequestId));
  }

  /**
   * Salva uma lista de registros em lote.
   *
   * > Para cada registro da lista, será inserido um novo registro se o mesmo não tiver *id*, caso contrário
   * será contado como uma atualização de um registro existente.
   *
   * @param {Array<object>} records Lista de registros que serão persistidos.
   * @param {Array<string> | string} customRequestIds Identificador customizado do comando.
   *
   * Ao passar uma lista de identificadores, cada índice da lista de identificadores deverá
   * corresponder ao índice do registro na lista de registros.
   * @returns {Promise<any>} Promessa que é concluída após os registros serem alterados ou incluídos.
   */
  async saveAll(records: Array<object>, customRequestIds?: Array<string> | string): Promise<any> {
    validateParameter({ records });

    const saveAll = async () => {
      const batchEvents = [];

      for (let index = 0; index < records.length; index++) {
        const record = records[index];
        const sendToEventSourcing = false;

        const isNonLocalRecordChanged = await this.isNonLocalRecordChanged(record);
        const updatedRecord = await this.selectSaveType(record, sendToEventSourcing);

        if (isNonLocalRecordChanged) {
          const customRequestId = customRequestIds instanceof Array ? customRequestIds[index] : customRequestIds;
          const eventOperation = this.createEventOperation(record, updatedRecord, customRequestId);
          batchEvents.push(eventOperation);
        }
      }

      await this.eventSourcing.createBatchEvents(this.schema.name, batchEvents);
    };

    return this.poSchemaService.limitedCallWrap(saveAll);
  }

  private async create(newRecord: any, sendToEventSourcing: boolean, customRequestId?: string): Promise<any> {
    const time = new Date().getTime();

    const syncProperties = {
      [PoSchemaUtil.syncInternalIdFieldName]: time,
      SyncInsertedDateTime: time,
      SyncUpdatedDateTime: null,
      SyncExclusionDateTime: null,
      SyncDeleted: false,
      SyncStatus: 0
    };
    const recordWithSyncProperties = { ...newRecord, ...syncProperties };

    const recordedData = await this.poSchemaService.create(this.schema, recordWithSyncProperties);

    if (sendToEventSourcing) {
      await this.eventSourcing.create(this.schema.name, recordWithSyncProperties, customRequestId);
    }

    return recordedData;
  }

  private createEventOperation(
    record: object,
    updatedRecord: object,
    customRequestId?: string
  ): PoEventSourcingSummaryItem {
    const operation = PoSchemaUtil.getRecordId(record, this.schema)
      ? PoEventSourcingOperation.Update
      : PoEventSourcingOperation.Insert;

    const serverRecord = PoSchemaUtil.separateSchemaFields(this.schema, updatedRecord)['serverRecord'];

    return {
      record: serverRecord,
      customRequestId: customRequestId,
      operation: operation
    };
  }

  private async isNonLocalRecordChanged(updatedRecord: object): Promise<boolean> {
    const nonLocalFieldNames = PoSchemaUtil.getNonLocalFieldNames(this.schema);
    const record = await this.poSchemaService.get(this.schema.name, updatedRecord[this.schema.idField]);

    return !PoSchemaUtil.isModelsEqual(nonLocalFieldNames, record, updatedRecord);
  }

  private async selectSaveType(
    record: object,
    sendToEventSourcing: boolean,
    customRequestId?: string
  ): Promise<object> {
    const hasId = PoSchemaUtil.getRecordId(record, this.schema);

    return hasId
      ? await this.update(record, sendToEventSourcing, customRequestId)
      : await this.create(record, sendToEventSourcing, customRequestId);
  }

  private async update(updatedRecord: any, sendToEventSourcing: boolean, customRequestId?: string): Promise<object> {
    updatedRecord.SyncUpdatedDateTime = new Date().getTime();
    updatedRecord.SyncStatus = 0;

    const isNonLocalRecordChanged = await this.isNonLocalRecordChanged(updatedRecord);
    const recordedData = await this.poSchemaService.update(this.schema, updatedRecord);

    if (isNonLocalRecordChanged && sendToEventSourcing) {
      const serverRecord = PoSchemaUtil.separateSchemaFields(this.schema, updatedRecord)['serverRecord'];
      await this.eventSourcing.update(this.schema.name, serverRecord, customRequestId);
    }

    return recordedData;
  }
}
