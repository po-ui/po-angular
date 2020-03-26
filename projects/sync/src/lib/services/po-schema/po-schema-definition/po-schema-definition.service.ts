import { Injectable } from '@angular/core';

import { PoStorageService } from '@po-ui/ng-storage';

import { PoSchemaUtil } from './../po-schema-util/po-schema-util.model';
import { PoSyncSchema } from './../../po-sync/interfaces/po-sync-schema.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Serviço que disponibiliza métodos que permite operar sobre as definições dos *schemas*.
 */
@Injectable()
export class PoSchemaDefinitionService {
  constructor(private poStorage: PoStorageService) {}

  /**
   * Destrói a chave do *storage* que contém as definições dos *schemas*.
   *
   * > Para que não venham ocorrer erros em ações que dependam das definições dos *schemas*,
   * recomenda-se utilizar o método `prepare()` em seguida.
   *
   * @returns {Promise<void>} Promessa que é resolvida quando a chave referente as definições dos *schemas* for destruída.
   */
  destroy(): Promise<void> {
    return this.poStorage.remove(PoSchemaUtil.syncSchemasName);
  }

  /**
   * Busca um *schema* a partir do nome informado.
   *
   * @param {string} schemaName Nome do *schema*.
   * @returns {Promise<PoSyncSchema>} Promessa que é resolvida quando o *schema* for retornado.
   */
  get(schemaName: string): Promise<PoSyncSchema> {
    return this.poStorage.getItemByField(PoSchemaUtil.syncSchemasName, 'name', schemaName);
  }

  /**
   * Retorna uma promessa com a lista dos *schemas* definidos.
   *
   * @returns {Promise<Array<PoSyncSchema>>} Promessa que é resolvida quando a lista dos *schemas* definidos for retornada.
   */
  getAll(): Promise<Array<PoSyncSchema>> {
    return this.poStorage.get(PoSchemaUtil.syncSchemasName);
  }

  /**
   * Salva uma lista de *schemas*.
   *
   * @param {Array<PoSyncSchema>} schemas Lista de schemas que serão salvos.
   * @returns {Promise<Array<PoSyncSchema>>} Promessa que é resolvida quando a lista de *schemas* for salva.
   */
  saveAll(schemas: Array<PoSyncSchema>): Promise<Array<PoSyncSchema>> {
    return this.poStorage.set(PoSchemaUtil.syncSchemasName, schemas);
  }

  /**
   * Atualiza um *schema* a partir do *schema name*.
   *
   * @param {PoSyncSchema} updatedSchema **Schema* que será atualizado.
   */
  async update(updatedSchema: PoSyncSchema) {
    let schemas = await this.getAll();

    const replaceUpdatedSchema = schema => {
      if (schema.name === updatedSchema.name) {
        return updatedSchema;
      } else {
        return schema;
      }
    };

    schemas = schemas.map(replaceUpdatedSchema);
    return this.saveAll(schemas);
  }
}
