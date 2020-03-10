import { PoSyncFieldOptions } from './po-sync-field-options.interface';

/**
 * @usedBy PoSyncService
 *
 * @description
 *
 * Interface que irá mapear as informações dos recursos, principalmente sua origem e as informações que serão retornadas.
 */
export interface PoSyncSchema {
  /** Nome da propriedade que informa a data de criação do registro. */
  readonly createdAtField?: string;

  /** Nome da propriedade que informa a data de deleção. */
  readonly deletedAtField?: string;

  /** Nome da propriedade que informa se o registro foi excluído. */
  readonly deletedField: string;

  /** Endereço do endpoint para excluir registros. */
  readonly deleteUrlApi?: string;

  /** Endereço do endpoint que proverá apenas dados alterados no servidor. */
  readonly diffUrlApi: string;

  /** Campos que serão retornados pela API. */
  readonly fields: Array<string | PoSyncFieldOptions>;

  /** Endereço do endpoint que utiliza o método GET que proverá os dados. */
  readonly getUrlApi: string;

  /** Nome da propriedade referente ao identificador único para os itens do *schema*. */
  readonly idField: string;

  /** Identifição para representar o *schema*. */
  readonly name: string;

  /** Quantidade de itens por página que será enviado pela API. */
  readonly pageSize: number;

  /** Endereço do endpoint que utiliza o método PUT para atualizar registros. */
  readonly patchUrlApi?: string;

  /** Endereço do endpoint que utiliza o método POST para incluir os registros. */
  readonly postUrlApi?: string;

  /** Nome da propriedade que informa a data de atualização do registro. */
  readonly updatedAtField?: string;

  // Data/Hora da última vez que a sincronia aconteceu para esse *schema*.
  lastSync?: string;
}
