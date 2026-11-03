import { Directive, inject, input, TemplateRef } from '@angular/core';

import { PoTableColumn } from '../interfaces/po-table-column.interface';

/**
 * Contexto disponibilizado ao template de cabeçalho da coluna.
 */
export interface PoTableHeaderTemplateContext {
  /** Coluna corrente. */
  $implicit: PoTableColumn;
}

/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Esta diretiva permite adicionar um conteúdo personalizado ao **cabeçalho** das colunas, exibido logo abaixo do
 * título da coluna. É útil, por exemplo, para disponibilizar um campo de pesquisa por coluna, ícones ou ações
 * relacionadas à coluna.
 *
 * Em seu uso, pode-se utilizar o input `p-property` para informar a qual coluna o template será aplicado. Caso não seja
 * informado, o template será aplicado em todas as colunas que não possuírem um template específico.
 *
 * Os eventos de clique e de pressionar o mouse disparados dentro do template não acionam a ordenação nem o
 * *drag and drop* da coluna, permitindo o uso de campos e botões.
 *
 * Retorno:
 *  - `$implicit`: objeto da coluna corrente (`PoTableColumn`).
 *
 * Modo de uso:
 * ```html
 * ...
 * <po-table
 *   [p-columns]="columns"
 *   [p-items]="items">
 *   <ng-template p-table-header-template let-column>
 *     <input type="text" (input)="onFilter(column.property, $event)" />
 *   </ng-template>
 * </po-table>
 * ...
 * ```
 * > No exemplo acima, todas as colunas exibirão um campo de texto abaixo do título.
 *
 * ```html
 * ...
 * <po-table
 *   [p-columns]="columns"
 *   [p-items]="items">
 *   <ng-template p-table-header-template p-property="status" let-column>
 *     <span>Utilize o filtro avançado</span>
 *   </ng-template>
 *   <ng-template p-table-header-template let-column>
 *     <input type="text" (input)="onFilter(column.property, $event)" />
 *   </ng-template>
 * </po-table>
 * ...
 * ```
 * > Neste exemplo, a coluna `status` possui um template específico e as demais colunas utilizam o template genérico.
 */
@Directive({
  selector: '[p-table-header-template]',
  standalone: false
})
export class PoTableHeaderTemplateDirective {
  /**
   * @optional
   *
   * @description
   *
   * Property da coluna da tabela na qual o template será aplicado.
   *
   * Caso não seja informada, o template será aplicado em todas as colunas que não possuírem um template específico.
   */
  readonly targetProperty = input<string | undefined>(undefined, { alias: 'p-property' });

  // Necessário manter templateRef para o funcionamento do header template.
  readonly templateRef = inject<TemplateRef<PoTableHeaderTemplateContext>>(TemplateRef);
}
