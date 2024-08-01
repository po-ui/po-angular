import { Directive, TemplateRef } from '@angular/core';

/**
 * @usedBy PoPageJobScheduler
 *
 * @description
 *
 * Esta diretiva permite personalizar o conteúdo de resumo das informações de parâmetro na etapa de conclusão do componente de PoPageJobScheduler.
 *
 * Essa funcionalidade costuma ser útil em casos onde a propriedade parameters não tem valor e mesmo assim é necessário exibir
 * as informações de resumo na etapa de conclusão.
 *
 * ```
 * ...
 *   <po-page-job-scheduler [p-service-api]="serviceApi">
 *    <ng-template p-job-scheduler-summary-template>
 *    ...
 *     <po-dynamic-view
 *       [p-fields]="fieldsSummary"
 *       [p-value]="valueSummary"
 *     >
 *     </po-dynamic-view
 *    </ng-template>
 *   </po-page-job-scheduler>
 * ...
 * ```
 *
 */
@Directive({
  selector: '[p-job-scheduler-summary-template]'
})
export class PoJobSchedulerSummaryTemplateDirective {
  // Necessário manter templateRef para o funcionamento do row template.
  constructor(public templateRef: TemplateRef<any>) {}
}
