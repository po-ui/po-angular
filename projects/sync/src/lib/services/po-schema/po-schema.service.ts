import { Injectable } from '@angular/core';

import { PoStorageService } from '@po-ui/ng-storage';

import { PoSchemaDefinitionService } from './po-schema-definition/po-schema-definition.service';
import { PoSchemaUtil } from './po-schema-util/po-schema-util.model';
import { PoSyncSchema } from '../po-sync/interfaces/po-sync-schema.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Serviço que realiza as operações nos `schemas`.
 */
@Injectable()
export class PoSchemaService {
  /**
   * Retorna o id a partir de uma chave de um *schema*.
   *
   * @param {string} schemaKey Chave do *schema* em que será realizada a busca do id.
   */
  private static getIdByRecordKey(schemaKey: string): string {
    return schemaKey.split(':')[1];
  }

  /**
   * Retorna a chave do *schema* informado.
   *
   * @param {string} schemaName Nome do *schema*.
   * @param {any} recordId Id do registro.
   * @param {boolean} isLocalKey Indica se é uma chave local.
   */
  private static getRecordKey(schemaName: string, recordId: any, isLocalKey: boolean = false): string {
    return isLocalKey ? `${schemaName}_local:${recordId}` : `${schemaName}:${recordId}`;
  }

  /**
   * Verifica se o dado informado é uma chave de um *schema*.
   *
   * @param {string} data Dado que será verificado se é uma chave de um *schema*.
   * @param {string} schemaName Nome do *schema*.
   */
  private static isSchemaKey(data: string, schemaName: string): boolean {
    return data ? data.startsWith(`${schemaName}:`) : false;
  }

  constructor(private poSchemaDefinitionService: PoSchemaDefinitionService, private poStorage: PoStorageService) {}

  /**
   * Cria um novo registro para o *schema* informado.
   *
   * @param {PoSyncSchema} schema **Schema* em que será criado o registro.
   * @param {object} newRecord Registro que será criado.
   */
  async create(schema: PoSyncSchema, newRecord: object): Promise<object> {
    const id = PoSchemaUtil.getRecordId(newRecord, schema);
    return this.save(schema, newRecord, id);
  }

  /**
   * Destrói as chaves do *storage* que contém os registros dos *schemas*.
   *
   * @returns {Promise<void>} Promessa que é resolvida quando as chaves referentes aos *schemas* forem destruídas.
   */
  async destroySchemasRecords(): Promise<void> {
    const schemas = await this.poSchemaDefinitionService.getAll();
    const storageKeys = await this.poStorage.keys();

    for (const key of storageKeys) {
      const schemaKey = schemas.find(schema => PoSchemaService.isSchemaKey(key, schema.name));

      if (schemaKey) {
        const id = PoSchemaService.getIdByRecordKey(key);
        await this.remove(schemaKey.name, id);
      }
    }
  }

  /**
   * Retorna o registro referente ao *schema* informado.
   *
   * @param {string} schemaName Nome do *schema*.
   * @param {any} recordId Id do registro.
   */
  async get(schemaName: string, recordId: any): Promise<object> {
    const isLocalRecord = true;
    const localRecord = await this.getRecord(schemaName, recordId, isLocalRecord);
    const record = await this.getRecord(schemaName, recordId);

    return Object.assign(record, localRecord);
  }

  /**
   * Retorna todos os registros referente ao *schema* informado.
   *
   * @param {string} schemaName Nome do *schema*.
   */
  async getAll(schemaName: string): Promise<Array<object>> {
    const storageKeys = await this.poStorage.keys();
    const schemaRecords = [];

    for (const key of storageKeys) {
      if (PoSchemaService.isSchemaKey(key, schemaName)) {
        const id = PoSchemaService.getIdByRecordKey(key);
        schemaRecords.push(await this.get(schemaName, id));
      }
    }

    return schemaRecords;
  }

  /**
   * Aguarda a liberação do recurso limitado, posteriormente o envolve em um comportamento
   * de bloqueio e desbloqueio.
   *
   * @param {Function} limitedResource Função que será envolvida no comportamento de bloqueio e desbloqueio.
   */
  limitedCallWrap(limitedResource: Function): Promise<any> {
    return this.poStorage.limitedCallWrap(limitedResource);
  }

  /**
   * Remove um registro de um *schema* informado.
   *
   * @param {string} schemaName Nome do *schema*.
   * @param {any} recordId Id do registro.
   */
  async remove(schemaName: string, recordId: any): Promise<any> {
    const recordKey = PoSchemaService.getRecordKey(schemaName, recordId);
    const localRecordKey = PoSchemaService.getRecordKey(schemaName, recordId, true);

    await this.poStorage.remove(recordKey);
    await this.poStorage.remove(localRecordKey);
  }

  /**
   * Atualiza um registro de um *schema* informado.
   *
   * @param {PoSyncSchema} schema **Schema* referente ao registro que será alterado.
   * @param {object} record Registro que será atualizado.
   * @param {any} recordId Id do registro que deseja ser alterado. Deve ser utilizado em casos em que o id foi alterado.
   */
  async update(schema: PoSyncSchema, record: object, recordId?: any): Promise<object> {
    const id = PoSchemaUtil.getRecordId(record, schema);

    if (recordId) {
      record = await this.updateRecordId(schema.name, record, recordId);
    }

    return this.save(schema, record, id);
  }

  /**
   * Atualiza todos os registros de um *schema*.
   *
   * @param {PoSyncSchema} schema **Schema* referente aos registros que serão alterados.
   * @param {Array<object>} records Lista de registros que serão alterados.
   */
  async updateAll(schema: PoSyncSchema, records: Array<object>): Promise<void> {
    for (const record of records) {
      await this.update(schema, record);
    }
  }

  private async getRecord(schemaName, recordId, isLocalRecord = false): Promise<object> {
    return (await this.poStorage.get(PoSchemaService.getRecordKey(schemaName, recordId, isLocalRecord))) || {};
  }

  private async save(schema: PoSyncSchema, record: object, recordId: any) {
    const { serverRecord, localRecord } = PoSchemaUtil.separateSchemaFields(schema, record);
    const recordKey = PoSchemaService.getRecordKey(schema.name, recordId);

    await this.poStorage.set(recordKey, serverRecord);
    await this.saveLocalFields(schema.name, localRecord, recordId);

    return record;
  }

  private async saveLocalFields(schemaName: string, localFields: object, recordId): Promise<void> {
    const containsLocalFields = Object.keys(localFields).length;

    if (containsLocalFields) {
      const localRecordKey = PoSchemaService.getRecordKey(schemaName, recordId, true);
      await this.poStorage.set(localRecordKey, localFields);
    }
  }

  private async updateRecordId(schemaName, record, recordId) {
    const isLocalRecord = true;

    const localRecord = await this.getRecord(schemaName, recordId, isLocalRecord);
    await this.remove(schemaName, recordId);

    return Object.assign(record, localRecord);
  }
}
