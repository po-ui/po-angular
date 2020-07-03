import { Directive, TemplateRef } from '@angular/core';
/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Esta diretiva permite que seja possível alterar o conteúdo das células de uma coluna, para que os valores possam ser exibidos
 * de acordo com a necessidade do usuário.
 *
 * Em seu uso, deve-se apenas adicionar a diretiva **p-table-cell-template** à tag `ng-template`.
 *
 * Retorno:
 *  - `column`: conteúdo da coluna corrente.
 *  - `row`: conteúdo da linha corrente
 *
 * Modo de uso:
 *
 * ```
 * ...
 * <po-table
 *   [p-columns]="columns"
 *   [p-items]="items">
 *     <ng-template p-table-cell-template let-column="column" let-row="row">
 *      <div *ngIf="column.property === 'status' && row.status === 'CANCELED'">
 *        <h1 [style.background]="'red'">CANCELADA</h1>
 *        <span (click)="onClick()"><small>clique aqui</small></span>
 *      </div>
 *      <h1 *ngIf="column.property === 'status' && row.status === 'FINISHED'" [style.background]="'green'">FINALIZADA</h1>
 *      <h1 *ngIf="column.property === 'status' && row.status === 'OPENED'" [style.background]="'orange'">ABERTA</h1>
 *      <h1 *ngIf="column.property === 'status2'">Conteúdo do status 2</h1>
 *      <h1 *ngIf="column.property === 'status3'">Conteúdo do status 3</h1>
 *    </ng-template>
 * ...
 * ```
 * > No exemplo acima, o usuário tem como retorno `row` e a `column` corrente, neste caso ele tem total liberdade para manipular os objetos.
 *
 * Abaixo, a declaração dos dados de entrada do PO-TABLE para o uso da directiva.
 * ```
 * ...
 * export class AppComponent {
 *
 *    items = [{
 *      code: 1200,
 *      product: 'Rice',
 *      status: 'CANCELED',
 *      status2: '',
 *      status3: ''
 *      },{
 *      code: 1355,
 *      product: 'Bean',
 *      status: 'FINISHED',
 *      status2: '',
 *      status3: ''
 *      }];
 *
 *    columns = [
 *       { property: 'code', label: 'ID' },
 *       { property: 'product', label: 'PRODUTO' },
 *       { property: 'status', label: 'STATUS', type: 'cellTemplate' },
 *       { property: 'status2', label: 'STATUS 2', type: 'cellTemplate' },
 *       { property: 'status3', label: 'STATUS 3', type: 'cellTemplate' }
 *    ];
 * }
 * ...
 * ```
 * > Observação: Sempre adicionar o **type** da coluna que deseja manipular com a directiva como `cellTemplate`
 */
@Directive({
  selector: '[p-table-cell-template]'
})
export class PoTableCellTemplateDirective {
  // Necessário manter templateRef para o funcionamento do cell template.
  constructor(public templateRef: TemplateRef<any>) {}
}
