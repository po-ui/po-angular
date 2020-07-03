import { Directive, Input, TemplateRef } from '@angular/core';

/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Esta diretiva permite que seja possível alterar o conteúdo das células de uma coluna, para que os valores possam ser exibidos
 * de acordo com a necessidade do usuário.
 *
 * Em seu uso, deve-se utilizar como parâmetro de entrada o input [p-property], o qual é responsável por informar ao PO-TABLE qual a coluna que
 * será adicionado o conteúdo do template.
 *
 * Retorno:
 *  - value: valor referente ao conteúdo da linha corrente.
 *
 * Modo de uso:
 * ```html
 * ...
 * <po-table
 *   [p-columns]="columns"
 *   [p-items]="items">
 *   <ng-template p-table-column-template [p-property]="targetProperty" let-value>
 *     <span [innerText]="value"></span>
 *   </ng-template>
 * </po-table>
 * ...
 * ```
 * > No exemplo acima, todas as células correspondentes a coluna `status` terão o conteúdo alterado para `<h1>${value}</h1>`,
 * sendo que `value` refere-se ao conteúdo da linha.
 *
 * ```html
 * ...
 * <po-table
 *   [p-columns]="columns"
 *   [p-items]="items">
 *   <ng-template  p-table-column-template [p-property]="targetProperty" let-value>
 *     <span *ngIf="value === 'FINISHED'" [style.background]="'silver'" [innerText]="value"></span>
 *     <span *ngIf="value === 'OPENED'" [style.background]="'gray'" [innerText]="value"></span>
 *   </ng-template>
 * </po-table>
 * ...
 * ```
 * > Agora, neste exemplo, com o valor da linha corrente retornado (value), é feito uma validação para
 * definir o template exato para adicionar a uma específica célula.
 *
 * Abaixo, a declaração dos dados de entrada do PO-TABLE para o uso da directiva.
 * ```typescript
 * ...
 * export class AppComponent {
 *
 *    targetProperty= 'status';
 *
 *    items = [{
 *      code: 1200,
 *      product: 'Rice',
 *      status: 'CANCELED'
 *      },{
 *      code: 1355,
 *      product: 'Bean',
 *      status: 'FINISHED'
 *    }];
 *
 *    columns = [
 *      { property: 'code', label: 'ID' },
 *      { property: 'product', label: 'PRODUTO' },
 *      { property: 'status', label: 'STATUS', type: 'columnTemplate' }
 *    ];
 * }
 * ...
 * ```
 * > Observação: Sempre adicionar o **type** da coluna que deseja manipular com a directiva como `columnTemplate`
 */

@Directive({
  selector: '[p-table-column-template]'
})
export class PoTableColumnTemplateDirective {
  /**
   * @optional
   *
   * @description
   *
   * Variável responsável por armazenar a property da coluna da tabela que será adicionado o template.
   *
   * Caso não seja informada esta propriedade, serão apresentados normalmente os dados da coluna.
   */
  @Input('p-property') targetProperty: string;

  // Necessário manter templateRef para o funcionamento do column template.
  constructor(public templateRef: TemplateRef<any>) {}
}
