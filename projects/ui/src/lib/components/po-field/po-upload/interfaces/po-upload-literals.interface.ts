/**
 * @usedBy PoUploadComponent
 *
 * @description
 *
 * Interface para definição das literais usadas no `po-upload`.
 */
export interface PoUploadLiterals {
  /** Texto indicativo para a área onde os arquivos devem ser arrastados quando utilizada a propriedade `p-drag-drop`. */
  dragFilesHere?: string;

  /** Texto indicativo para a área onde os diretórios devem ser arrastados quando utilizada a propriedade `p-drag-drop`. */
  dragFoldersHere?: string;

  /** Texto indicativo para a área onde os arquivos devem ser soltos quando utilizada a propriedade `p-drag-drop` */
  dropFilesHere?: string;

  /** Texto indicativo para a área onde os diretórios devem ser soltos quando utilizada a propriedade `p-drag-drop`. */
  dropFoldersHere?: string;

  /** Parâmetro *files* para o texto de exibição quando arrastado um arquivo para um local inválido com a opção de *dragDrop*. */
  files?: string;

  /** Parâmetro *folders* para o texto de exibição quando arrastado um arquivo para um local inválido com a opção de *dragDrop*. */
  folders?: string;

  /** Texto exibido caso o usuário arrastar um arquivo para um local inválido ao utilizar a opção de *dragDrop*. */
  invalidDropArea?: string;

  /** Texto exibido no label do botão de seleção dos arquivos. */
  selectFile?: string;

  /** Texto exibido no label do botão de seleção dos arquivos ao utilizar a propriedade `p-multiple`. */
  selectFiles?: string;

  /** Texto exibido no label do botão de seleção dos arquivos ao utilizar a propriedade `p-directory`. */
  selectFolder?: string;

  /**
   * Texto utilizado para indicar a possibilidade de seleção de arquivos na área onde podem ser arrastados os arquivos
   * ao utilizar a opção de *dragDrop*.
   */
  selectFilesOnComputer?: string;

  /**
   * Texto utilizado para indicar a possibilidade de seleção de diretório na área onde podem ser arrastados os arquivos
   * ao utilizar a opção de *dragDrop*.
   */
  selectFolderOnComputer?: string;

  /** Texto exibido no label do botão para iniciar o envio dos arquivos. */
  startSending?: string;

  /** Texto a ser exibido quando ocorrer erro no envio do arquivo. */
  errorOccurred?: string;

  /** Texto a ser exibido quando o envio do arquivo for realizado com sucesso. */
  sentWithSuccess?: string;
}
