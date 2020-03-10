/**
 * @usedBy PoUploadComponent
 *
 * @description
 *
 * Interface que define as restrições dos arquivos a serem selecionados com base em regras predefinidas
 * para o seu tamanho, extensão e quantidade.
 */
export interface PoUploadFileRestrictions {
  /**
   * Extensões permitidas de arquivos que serão enviados ao servidor, devendo ser informada uma coleção de extensões, por exemplo:
   * ```
   *  allowedExtensions = ['.png', '.jpg', '.pdf'];
   * ```
   */
  allowedExtensions?: Array<string>;

  /**
   * Quantidade máxima de arquivos para o *upload*.
   *
   * > Esta propriedade será válida somente se a propriedade `p-multiple` estiver habilitada e seu valor for maior do que zero.
   */
  maxFiles?: number;

  /**
   * Tamanho máximo do arquivo a ser enviado ao servidor.
   *
   * Deve ser informado um valor em *bytes*, por exemplo: `31457280` (30MB).
   *
   * > Por padrão o valor é `30 MB`.
   */
  maxFileSize?: number;

  /**
   * Tamanho mínimo em *bytes* do arquivo que será enviado ao servidor.
   *
   * > Por padrão o valor é `0`.
   */
  minFileSize?: number;
}
