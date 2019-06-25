/**
 * @usedBy PoUploadComponent
 *
 * @description
 *
 * Os arquivos a serem selecionados podem ser restritos com base em regras pré definidas
 * para o seu tamanho e / ou extensão.
 */
export interface PoUploadFileRestrictions {

  /**
   * Tamanho minimo do arquivo a ser enviado ao servidor. Deve ser informado o valor em bytes.
   * Por padrão o valor é 0.
   */
  minFileSize?: number;

  /**
   * Quantidade máxima de arquivos para o *upload*.
   * Este valor deve ser maior que zero, caso contrário será desconsiderado e a funcionalidade não será habilitada.
   *
   * > Esta propriedade somente será válida se a propriedade `p-multiple` estiver habilitada.
   */
  maxFiles?: number;

  /**
   * Tamanho máximo do arquivo a ser enviado ao servidor. Deve ser informado o valor em bytes,
   * Por exemplo: 31457280 (30MB).
   */
  maxFileSize?: number;

  /**
   * Extensões permitidas a serem enviadas ao servidor, deve ser informado uma coleção de extensões.
   * Exemplo de valores válidos: ['.png', '.jpg', '.pdf'].
   */
  allowedExtensions?: Array<string>;
}
