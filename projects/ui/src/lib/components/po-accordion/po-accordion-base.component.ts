/**
 * @description
 *
 * Componente utilizado para agrupar visualmente uma lista de conteúdos, mostrando-os individualmente
 * ao clicar no título de cada item.
 *
 * Para utilizá-lo, é necessário envolver cada item no componente [`po-accordion-item`](/documentation/po-accordion-item),
 * como no exemplo abaixo:
 *
 * ```
 * <po-accordion>
 *   <po-accordion-item p-label="PO Accordion 1">
 *      Accordion 1
 *   </po-accordion-item>
 *
 *   <po-accordion-item p-label="PO Accordion 2">
 *      Accordion 2
 *   </po-accordion-item>
 * </po-accordion>
 * ```
 *
 * O componente já faz o controle de abertura e fechamento dos itens automaticamente.
 *
 * Caso houver a necessidade de abrir algum dos `po-accordion-item` via Typescript
 * acesse a [documentação do PoAccordionItem](/documentation/po-accordion-item).
 */
export class PoAccordionBaseComponent {}
