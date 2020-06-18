import { Directive, Input, TemplateRef } from '@angular/core';
/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Esta diretiva permite que seja possível alterar o conteúdo das celúlas de uma coluna, para que os valores possam ser exibidos
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
 *     <ng-template p-table-column-template [p-property]="targetProperty" let-value>
 *       <h1>`${value}`</h1>
 *     </ng-template>
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
 *     <ng-template  p-table-column-template [p-property]="targetProperty" let-value>
 *       <h1 *ngIf="value === 'FINISHED'" [style.background]="'silver'">`${value}`</h1>
 *       <h1 *ngIf="value === 'OPENED'" [style.background]="'gray'">`${value}`</h1>
 *     </ng-template>
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
 *    public items = [{
 *      code: 1200,
 *      product: 'Rice',
 *      status: 'CANCELED'
 *      },{
 *      code: 1355,
 *      product: 'Bean',
 *      status: 'FINISHED'
 *      }];
 *
 *    public columns = [
 *       { property: 'code', label: 'ID', type: 'string' },
 *       { property: 'product', label: 'PRODUTO', type: 'string' },
 *       { property: 'status', label: 'STATUS', type: 'column-template' }
 *      ];
 * }
 * ...
 * ```
 * > OBS: Sempre adicionar o **type** da property que deseja manipular com a directiva como `columnTemplate`
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
   *
   * @default `true`
   */
  @Input('p-property') targetProperty;

  // Necessário manter templateRef para o funcionamento do column template.
  constructor(public templateRef: TemplateRef<any>) {}
}
