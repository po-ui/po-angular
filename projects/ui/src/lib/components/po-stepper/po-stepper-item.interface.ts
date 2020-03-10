import { PoStepperStatus } from './enums/po-stepper-status.enum';

/**
 * @usedBy PoStepperComponent
 *
 * @description
 *
 * Interface para definição dos *steps* do componente `po-stepper` quando utilizada a propriedade `p-steps`.
 */
export interface PoStepperItem {
  /** Texto do item do stepper. */
  label: string;

  /** Define o estado de exibição do *step*. */
  status?: PoStepperStatus;
}
