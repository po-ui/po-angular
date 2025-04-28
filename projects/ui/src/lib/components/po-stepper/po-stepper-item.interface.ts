import { TemplateRef } from '@angular/core';
import { PoStepperStatus } from './enums/po-stepper-status.enum';

/**
 * @usedBy PoStepperComponent
 *
 * @description
 *
 * Interface para definição dos *steps* do componente `po-stepper` quando utilizada a propriedade `p-steps`.
 */
export interface PoStepperItem {
  /** Identificador único do step. */
  id?: string;

  /** Define o ícone do *step* ativo. */
  iconActive?: string | TemplateRef<void>;

  /** Define o ícone do *step* concluído. */
  iconDone?: string | TemplateRef<void>;

  /** Define o ícone do *step* default. */
  iconDefault?: string | TemplateRef<void>;

  /** Texto do item do stepper. */
  label?: string;

  /** Define o estado de exibição do *step*. */
  status?: PoStepperStatus;
}
