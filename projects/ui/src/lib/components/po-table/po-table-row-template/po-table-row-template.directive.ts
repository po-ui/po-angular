import { Directive, Input, TemplateRef } from '@angular/core';
import { PoTableRowTemplateArrowDirection } from '../enums/po-table-row-template-arrow-direction.enum';

/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Esta diretiva permite que seja apresentada informações adicionais a respeito de uma determinada linha de
 * dados, de forma que possam ser exibidas e ocultadas através do botão de acionamento.
 *
 * > Quando utilizada, sobrepõe as funcionalidade básicas do *master-detail*.
 *
 * Em seu uso, deve-se utilizar como parâmetro a referência da _linha_ e/ou _índice_, sendo por padrão linha. Caso não seja declarado,
 * o componente não exibirá conteúdo.
 *  - Linha: `row` determina o item da linha corrente.
 *  - Índice: `rowIndex` determina o índice da linha corrente.
 *
 * Esta diretiva compõe-se de dois meios para uso, de forma explícita tal como em *syntax sugar*. Veja a seguir ambos, respectivamente:
 *
 * ```
 * ...
 * <po-table
 *   [p-columns]="columns"
 *   [p-items]="items">
 *     <ng-template p-table-row-template let-rowItem let-i="rowIndex" [p-table-row-template-show]="isShow">
 *       <detail-row [row]="rowItem"></detail-row>
 *     </ng-template>
 * ...
 * ```
 *
 * ```
 * ...
 * <po-table
 *   [p-columns]="columns"
 *   [p-items]="items">
 *     <div *p-table-row-template="let rowItem, let i=rowIndex">
 *       <detail-row [row]="rowItem"></detail-row>
 *     </div>
 * ...
 *
 * ```
 *
 * A diretiva **p-table-row-template**, possibilita também que determinada linha apresente ou não seu _template_. Para isto,
 * é necessário atribuir a referência da função que faz esta verificação, à propriedade `p-table-row-template-show`,
 * a mesma deve retornar um valor do tipo *boolean*. Veja o exemplo a seguir:
 *
 * ```
 * ...
 * @Component({
 *    selector: 'app-root',
 *    templateUrl: `
 *      ...
 *      <po-table
 *        [p-columns]="columns"
 *        [p-items]="items">
 *          <ng-template p-table-row-template let-rowItem let-i="rowIndex" [p-table-row-template-show]="isUndelivered">
 *            <detail-row [row]="rowItem"> </detail-row>
 *          </div>
 *      ...
 *    `
 * })
 * export class AppComponent {
 *    public dataTable = [{
 *      code: 1200,
 *      product: 'Rice',
 *      costumer: 'Supermarket 1',
 *      quantity: 3,
 *      status: 'delivered',
 *      license_plate: 'MDJD9191',
 *      batch_product: 18041822,
 *      driver: 'José Oliveira'
 *    }, {
 *      code: 1355,
 *      product: 'Bean',
 *      costumer: 'Supermarket 2',
 *      quantity: 1,
 *      status: 'transport',
 *      license_plate: 'XXA5454',
 *      batch_product: 18041821,
 *      driver: 'Francisco Pereira'
 *    }];
 *
 *    isUndelivered(row, index: number) {
 *      return row.status !== 'delivered';
 *    }
 * }
 * ```
 * > No exemplo acima, somente será disponibilizado os detalhes de informações nas linhas cujo o valor de `status`
 * não correspondam à *delivered*.
 */
@Directive({
  selector: '[p-table-row-template]'
})
export class PoTableRowTemplateDirective {
  private _tableRowTemplateArrowDirection: PoTableRowTemplateArrowDirection = PoTableRowTemplateArrowDirection.Left;

  /**
   * @optional
   *
   * @description
   *
   * Função que deve retornar um valor booleano, informando se apresentará o template da linha.
   * Serão passados o objeto da linha e o indice da mesma por parâmetro, para que seja possível
   * tomar uma decisão a partir do objeto da linha corrente.
   *
   * Caso não ser utilizado esta propriedade, serão apresentados todos os detalhes das linhas.
   *
   * @default `true`
   */
  @Input('p-table-row-template-show') poTableRowTemplateShow: (row: any, index: number) => boolean;

  /**
   * @optional
   *
   * @description
   *
   * Propriedade responsável por informar a posição do colapse que abrirá os detalhes da linha.
   *
   * @default `'LEFT'`
   */
  @Input('p-table-row-template-arrow-direction') set tableRowTemplateArrowDirection(
    value: PoTableRowTemplateArrowDirection
  ) {
    value = value?.toUpperCase() as PoTableRowTemplateArrowDirection;
    this._tableRowTemplateArrowDirection = (<any>Object).values(PoTableRowTemplateArrowDirection).includes(value)
      ? value
      : PoTableRowTemplateArrowDirection.Left;
  }

  get tableRowTemplateArrowDirection() {
    return this._tableRowTemplateArrowDirection;
  }

  // Necessário manter templateRef para o funcionamento do row template.
  constructor(public templateRef: TemplateRef<any>) {}
}
