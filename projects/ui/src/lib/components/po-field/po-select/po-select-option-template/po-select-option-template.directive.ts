import { Directive, TemplateRef } from '@angular/core';

/**
 * @usedBy PoSelectComponent
 *
 * @description
 *
 * Esta diretiva permite personalizar o conteúdo dos itens exibidos na lista suspensa do componente.
 *
 * > Quando utilizada em _mobile_ será exibido o componente nativo.
 *
 * Para personalizar o conteúdo de cada item da lista deve-se utilizar a diretiva `p-select-option-template` com `ng-template`
 * dentro da tag `po-select`.
 *
 * Para obter a referência do item atual, use `let-option`, com isso você terá acesso aos valores e poderá personalizar sua exibição.
 *
 * Esta diretiva compõe-se de dois meios para uso, de forma explícita tal como em *syntax sugar*. Veja a seguir ambos, respectivamente:
 *
 * ```
 * ...
 * <po-select
 *   name="select"
 *   [(ngModel)]="select"
 *   [p-options]="options">
 *     <ng-template p-select-option-template let-option>
 *       <option-template [option]="option"></option-template>
 *     </ng-template>
 * </po-select>
 * ...
 * ```
 *
 * ```
 * ...
 * <po-select
 *   name="select"
 *   [(ngModel)]="select"
 *   [p-options]="options">
 *     <div *p-select-option-template="let option">
 *       <option-template [option]="option"></option-template>
 *     </div>
 * </po-select>
 * ...
 *
 * ```
 */
@Directive({
  selector: '[p-select-option-template]'
})
export class PoSelectOptionTemplateDirective {
  // Necessário manter templateRef para o funcionamento do row template.
  constructor(public templateRef: TemplateRef<any>) {}
}
