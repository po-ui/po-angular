/**
 * @usedBy PoUploadComponent
 *
 * @description
 *
 * Interface para definição das literais usadas no `po-upload`.
 */
export interface PoUploadLiterals {

  /** Texto exibido no label para cancelar o envio. */
  cancel?: string;

  /** Texto exibido no label para excluir o arquivo. */
  deleteFile?: string;

  /** Texto exibido na área onde podem ser arrastados os arquivos ao utilizar a opção de *dragDrop*. */
  dragFilesHere?: string;

  /** Texto exibido na área onde podem ser arrastados os arquivos ao utilizar a opção de *dragDrop*. */
  dropFilesHere?: string;

  /** Texto exibido caso o usuário arrastar um arquivo para um local inválido ao utilizar a opção de *dragDrop*. */
  invalidDropArea?: string;

  /** Texto exibido no label do botão de seleção dos arquivos. */
  selectFile?: string;

  /**
   * Texto utilizado para indicar a possibilidade de seleção de arquivos na área onde podem ser arrastados os arquivos
   * ao utilizar a opção de *dragDrop*.
   */
  selectFilesOnComputer?: string;

  /** Texto exibido no label do botão para iniciar o envio dos arquivos. */
  startSending?: string;

  /** Texto exibido no label para tentar novamente. */
  tryAgain?: string;

}
