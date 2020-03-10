/**
 * @usedBy PoStorageService
 *
 * @description
 *
 * <a id="po-storage-config"></a>
 *
 * Interface para as configurações da base de dados local do `PoStorageService`.
 */

export interface PoStorageConfig {
  /**
   * Ordem de preferência dos *drivers* para gravação dos dados.
   *
   * Os *drivers* utilizados pelo `PoStorageService` são:
   * - `indexeddb`;
   * - `websql`;
   * - `localstorage`;
   * - `lokijs`.
   *
   * Exemplo de ordem de preferência: `['lokijs', 'websql', 'indexeddb', 'localstorage']`.
   */
  driverOrder?: Array<string>;

  /** Nome da base de dados. */
  name?: string;

  /** Nome da coleção onde os dados serão armazenados. Deve ser alfanumérico e conter "_"(underscores). */
  storeName?: string;
}
