import { Directive, TemplateRef, Input } from '@angular/core';

/**
 * @usedBy PoListViewComponent
 *
 * @description
 *
 * Esta diretiva permite que sejam apresentadas informações adicionais de cada item, construindo um
 * botão `Exibir detalhes` abaixo do conteúdo principal do item.
 *
 * Deve-se utilizar como parâmetro a referência do item e/ou índice, sendo por padrão o item.
 *  - Item: `item` determina o item da linha corrente.
 *  - Índice: `index` determina o índice da linha corrente.
 *
 * Esta diretiva pode ser usada de duas formas: explícita ou *syntax sugar*. Veja a seguir ambos, respectivamente:
 *
 * ```
 * ...
 * <po-list-view
 *   p-property-title="name"
 *   [p-items]="items">
 *
 *   <ng-template p-list-view-detail-template let-item let-code="index">
 *     <div class="po-row">
 *       <po-info class="po-md-6" p-label="Code" [p-value]="code"></po-info>
 *       <po-info class="po-md-12" p-label="Email" [p-value]="item.email"></po-info>
 *     </div>
 *   </ng-template>
 *
 * </po-list-view>
 *
 * ...
 * ```
 *
 * ```
 * ...
 * <po-list-view
 *    p-property-title="name"
 *    [p-items]="items">
 *    <div *p-list-view-detail-template="let item, let i=index" class="po-row">
 *      <po-info class="po-md-12" p-label="Email" [p-value]="item.email"></po-info>
 *    </div>
 * </po-list-view>
 * ...
 *
 * ```
 */
@Directive({
  selector: '[p-list-view-detail-template]'
})
export class PoListViewDetailTemplateDirective {
  /**
   * @optional
   *
   * @description
   *
   * Função que deve retornar um valor do tipo `boolean`, que será utilizado como a validação para que o detalhe de item
   * da lista inicie aberto ou fechado.
   *
   */
  @Input('p-show-detail') showDetail: (item) => boolean;

  // Necessário manter templateRef para o funcionamento do row template.
  constructor(public templateRef: TemplateRef<any>) {}
}
