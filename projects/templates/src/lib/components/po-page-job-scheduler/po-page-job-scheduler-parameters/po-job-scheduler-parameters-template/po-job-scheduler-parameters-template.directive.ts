import { Directive, Input, TemplateRef } from '@angular/core';

/**
 * @usedBy PoPageJobScheduler
 *
 * @description
 *
 * Esta diretiva permite personalizar o conteúdo da uma ou várias etapa(s) de parametrização do componente de PoPageJobScheduler.
 *
 * Para repassar as alterações realizadas no componente customizado ao model do PoPageJobScheduler, deve
 * ser atualizado os valores através da propriedade p-execution-parameter. Dessa forma as alterações serão adicionadas ao
 * atributo executionParameter do objeto de envio a Api.
 * É possível também controlar a permissão de avançar, fazendo uso da propriedade p-disable-advance.
 *
 * ```
 * ...
 * <po-page-job-scheduler [p-service-api]="serviceApi">
 *     <ng-template p-job-scheduler-parameters-template
 *      [p-execution-parameter]="executionParameter"
 *      [p-disable-advance]="disableAdvance"
 *      p-label-step="titleStep"
 *     >
 *       ...
 *     </ng-template>
 *     <ng-template p-job-scheduler-parameters-template
 *      [p-execution-parameter]="executionParameter"
 *      [p-disable-advance]="disableAdvance"
 *      p-label-step="titleStep"
 *     >
 *       ...
 *     </ng-template>
 * </po-page-job-scheduler>
 * ...
 * ```
 *
 */
@Directive({
  selector: '[p-job-scheduler-parameters-template]',
  standalone: false
})
export class PoJobSchedulerParametersTemplateDirective {
  /**
   * @optional
   *
   * @description
   *
   * Objeto que deve conter as alterações feitas pelo componente de template que serão repassadas dentro do atributo
   * `executionParameter` para envio na api.
   *
   * > O componente deve manter essa propriedade atualizada. É chamada após o avançar da etapa de parametrização.
   */
  @Input('p-execution-parameter') executionParameter: object;

  /**
   * @optional
   *
   * @default false
   *
   * @description
   *
   * Determina se deve desabilitar o botão de avançar para a próxima etapa
   *
   * > Pode ser utilizado para validar campos antes de avançar.
   */
  @Input('p-disable-advance') disabledAdvance: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Determina o label do step
   */
  @Input('p-label-step') title: string;

  // Necessário manter templateRef para o funcionamento do row template.
  constructor(public templateRef: TemplateRef<any>) {}
}
