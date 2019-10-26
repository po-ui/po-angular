import { Directive, Input, TemplateRef } from '@angular/core';

/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Esta diretiva permite que a utilização de colunas com layout customizado, dando uma maior flexibilidade ao componente.
 *
 * ```
 * ...
 * <po-table
 *   [p-columns]="columns"
 *   [p-items]="items">
 *     <ng-template p-table-column-template p-column="columnName" let-row="row">
 *       {{ row.column }}
 *     </ng-template>
 * ...
 * ```
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
 *          <ng-template p-table-column-template p-column="product" let-row="row">
 *            <span class="po-font-text-bold">{{ row.product }}</span>
 *          </ng-template>
 *
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
 * }
 * ```
 */
@Directive({
  selector: '[p-table-column-template]'
})
export class PoTableColumnTemplateDirective {

  @Input('p-column') column: string;

  // Necessário manter templateRef para o funcionamento do row template.
  constructor(public templateRef: TemplateRef<any>) { }

}
