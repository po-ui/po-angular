/**
 * @usedBy PoListViewComponent
 *
 * @description
 *
 * Define o modo de exibição do detalhe do item do `po-list-view`, utilizado em conjunto com a
 * diretiva [`p-list-view-detail-template`](/documentation/po-list-view-detail-template).
 */
export enum PoListViewDetailDisplay {
  /** Expande os detalhes abaixo do item (padrão). */
  Inline = 'inline',

  /** Exibe os detalhes dentro de um `po-modal`. */
  Modal = 'modal'
}
