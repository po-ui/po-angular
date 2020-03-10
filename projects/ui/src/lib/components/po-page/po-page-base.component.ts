/**
 * @docsPrivate
 *
 * @description
 *
 * O componente **po-page** é utilizado como container principal para os componentes po-page-header, po-page-content
 * e para as ações dos componentes po-page-edit e po-page-detail.
 *
 * Quando estiver sendo utilizado o componente po-menu junto ao po-page, ambos devem estar no mesmo nível
 * e inseridos em uma div com a classe **po-wrapper**. Esta classe será responsável por fazer os cálculos
 * necessários de alinhamento dos componentes.
 *
 * O componente **po-page** também pode ser utilizado sem o po-menu e neste caso o corpo da página deve ser
 * definido com a altura de 100% para que o po-page maximize seu tamanho.
 * ```
 * html, body {
 *   height:100%;
 * }
 * ```
 */
export class PoPageBaseComponent {}
