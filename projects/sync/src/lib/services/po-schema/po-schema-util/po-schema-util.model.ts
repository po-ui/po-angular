import { PoRequestType } from '../../../models/po-request-type.enum';
import { PoSyncFieldOptions } from '../../po-sync/interfaces/po-sync-field-options.interface';
import { PoSyncSchema } from '../../po-sync/interfaces/po-sync-schema.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Serviço utilitário para operações no PoSyncSchema.
 */
export class PoSchemaUtil {
  /** Valor `default` para o campo `lastSync`. */
  public static readonly defaultLastSync: string = new Date(-8640000000000000).toISOString();

  /** Nome da chave do identificador interno do sync. */
  public static readonly syncInternalIdFieldName: string = 'SyncInternalId';

  /** Nome da chave no `storage` para os Schemas. */
  public static readonly syncSchemasName: string = 'SyncSchemas';

  /**
   * Verica se existem campos locais no *schema* informado.
   *
   * @param {PoSyncSchema} schema **Schema* a ser processado.
   *
   * @returns {boolean} Valor do tipo *boolean* que indica se existem campos locais no *schema* informado.
   */
  public static containsLocalFields(schema: PoSyncSchema): boolean {
    if (schema.fields) {
      return !!schema.fields.find(field => typeof field === 'object' && field.local);
    }
  }

  /**
   * Retorna o valor atual do `lastSync` para determinado *schema*.
   *
   * @param {Array<PoSyncSchema>} storageSchemas Lista de *schemas* a serem pesquisados.
   * @param {string} schemaName Nome do *schema* que se deseja ler o lastSync.
   *
   * @returns {string} Retorna uma *string* com o valor da última sincronização.
   */
  public static getLastSync(storageSchemas: Array<PoSyncSchema>, schemaName: string): string {
    if (storageSchemas) {
      const schemaFound = storageSchemas.find(schema => schema.name === schemaName);
      return schemaFound && schemaFound.lastSync ? schemaFound.lastSync : PoSchemaUtil.defaultLastSync;
    }
    return PoSchemaUtil.defaultLastSync;
  }

  /**
   * Retorna a lista de campos locais definidos no *schema*.
   *
   * @param {PoSyncSchema} schema **Schema* a ser processado.
   */
  public static getLocalFieldNames(schema: PoSyncSchema): Array<string> {
    if (schema.fields) {
      return schema.fields.reduce((fieldsAccumulator: Array<string>, currentField: string | PoSyncFieldOptions) => {
        if (typeof currentField === 'object' && currentField.local) {
          fieldsAccumulator.push(currentField.name);
        }
        return fieldsAccumulator;
      }, []);
    }
  }

  /**
   * Retorna a lista de campos não locais definidos no *schema*.
   *
   * @param {PoSyncSchema} schema **Schema* a ser processado.
   */
  public static getNonLocalFieldNames(schema: PoSyncSchema): Array<string> {
    if (schema.fields) {
      return schema.fields.reduce((fieldsAccumulator: Array<string>, currentField: string | PoSyncFieldOptions) => {
        if (typeof currentField === 'string' || !currentField.local) {
          fieldsAccumulator.push(typeof currentField === 'string' ? currentField : currentField.name);
        }
        return fieldsAccumulator;
      }, []);
    }
  }

  /**
   * Retorna o `id` referente ao registro do *schema* informado.
   *
   * @param {object} record Registro que será buscado o id.
   * @param {PoSyncSchema} schema **Schema* a ser processado.
   */
  public static getRecordId(record: object, schema: PoSyncSchema) {
    return record[schema.idField] || record[PoSchemaUtil.syncInternalIdFieldName];
  }

  /**
   * Retorna a url correspondente do `PoSyncSchema` dependendo do tipo da requisição `PoRequestType`.
   *
   * @param {PoSyncSchema} schema **Schema* a ser processado.
   * @param {PoRequestType} requestType Tipo da requisição.
   */
  public static getUrl(schema: PoSyncSchema, requestType: PoRequestType): string {
    return schema[`${requestType}UrlApi`];
  }

  /**
   * Compara se dois objetos são iguais baseado na lista de campos.
   *
   * @param {Array<string>} fields Lista de campos a serem considerados na comparação.
   * @param {any} model1 Objeto 1 a ser comparado.
   * @param {any} model2 Objeto 2 a ser comparado.
   */
  public static isModelsEqual(fields: Array<string>, model1: any, model2: any): boolean {
    if (fields) {
      return fields.every(field => JSON.stringify(model1[field]) === JSON.stringify(model2[field]));
    }
  }

  /**
   * Retorna uma lista com dois objetos referentes ao registro informado.
   * O primeiro é o registro com os campos que vão para o servidor e o segundo é com os campos locais.
   *
   * @param {PoSyncSchema} schema **Schema* do registro.
   * @param {object} record Registro que será realizada a separação dos campos locais e do servidor.
   */
  public static separateSchemaFields(
    schema: PoSyncSchema,
    record: object
  ): { serverRecord: object; localRecord: object } {
    const localFields = PoSchemaUtil.getLocalFieldNames(schema);
    const localRecord = {};
    const serverRecord = {};

    Object.keys(record).forEach(field => {
      if (localFields.includes(field)) {
        localRecord[field] = record[field];
      } else {
        serverRecord[field] = record[field];
      }
    });

    return { serverRecord, localRecord };
  }
}
