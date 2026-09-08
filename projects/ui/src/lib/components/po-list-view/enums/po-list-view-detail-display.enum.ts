/**
 * @usedBy PoListViewComponent
 *
 * @description
 *
 * Define o modo de exibição do detalhe do item do `po-list-view`, utilizado em conjunto com a
 * diretiva `p-list-view-detail-template`.
 */
export enum PoListViewDetailDisplay {
  /** Exibe o detalhe expandindo o conteúdo abaixo do item (comportamento padrão). */
  Inline = 'inline',

  /** Exibe o detalhe no corpo de um `po-modal`. */
  Modal = 'modal'
}
