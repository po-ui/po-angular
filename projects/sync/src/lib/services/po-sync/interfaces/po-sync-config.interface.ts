import { PoDataTransform } from './../../../models/po-data-transform.model';
import { PoNetworkType } from './../../../models/po-network-type.enum';

/**
 * @usedBy PoSyncService
 *
 * @description
 *
 * Interface para a definição das configurações do sincronismo.
 */

export interface PoSyncConfig {
  /**
   * Classe usada para a trasformação dos dados nas requisições.
   *
   * > Veja mais detalhes em [Fundamentos do PO Sync - Adaptando a resposta da API para o padrão do PO UI](/guides/sync-fundamentals).
   */
  dataTransform?: PoDataTransform;

  /**
   * Tempo em segundos do sicronismo periódico.
   * Caso não seja definido, o sincronismo periódico estará desabilitado.
   */
  period?: number;

  /** Tipos de conexões permitidas para o sincronismo. */
  type: PoNetworkType | Array<PoNetworkType>;
}
