import { Directive, TemplateRef } from '@angular/core';

/**
 * @usedBy PoMultiselectComponent
 *
 * @description
 *
 * Esta diretiva permite personalizar o conteúdo dos itens exibidos na lista de opções do componente.
 *
 * Para personalizar o conteúdo de cada item da lista deve-se utilizar a diretiva `p-multiselect-option-template` com `ng-template`
 * dentro da *tag* `po-multiselect`, o seu array de `p-options` repassado para com componente deve conter a propriedade `value` e `label`.
 *
 * Para obter a referência do item atual utilize `let-option`, com isso você terá acesso aos valores e poderá personalizar sua exibição.
 *
 * Exemplo de uso:
 *
 * ```
 * ...
 * <po-multiselect
 *   name="multiselect"
 *   [(ngModel)]="multiselect"
 *   [p-options]="options"
 *   [p-hide-select-all]="true">
 *     <ng-template p-multiselect-option-template let-option>
 *        <!-- template customizado -->
 *       <div class="po-font-text-large-bold" [innerHtml]="option.label"></div>
 *       <!-- template customizado -->
 *     </ng-template>
 * </po-multiselect>
 * ...
 * ```
 *
 */
@Directive({
  selector: '[p-multiselect-option-template]'
})
export class PoMultiselectOptionTemplateDirective {
  // Necessário manter templateRef para o funcionamento do row template.
  constructor(public templateRef: TemplateRef<any>) {}
}
