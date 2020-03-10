/**
 * @usedBy PoSyncService
 *
 * @description
 *
 * Interface que irá mapear as configurações dos campos do `PoSyncSchema`.
 */
export interface PoSyncFieldOptions {
  /** Propriedade que informa o nome do campo. */
  readonly name: string;

  /** Propriedade que informa se o campo será apenas para armazenamento local
   * ou se deve ser enviado para o servidor.
   */
  readonly local?: boolean;
}
