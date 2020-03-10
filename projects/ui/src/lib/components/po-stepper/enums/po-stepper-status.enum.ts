/**
 * @usedBy PoStepperComponent
 *
 * @description
 *
 * <a id="stepperStatus"></a>
 *
 * *Enums* para os status do `po-stepper` quando utilizada a propriedade `p-steps`.
 */
export enum PoStepperStatus {
  /** Define o estado do *step* como ativo. */
  Active = 'active',

  /** Define o estado do *step* como padrão. */
  Default = 'default',

  /** Define o estado do *step* como desabilitado. */
  Disabled = 'disabled',

  /** Define o estado do *step* como concluído. */
  Done = 'done',

  /** Define o estado do *step* com erro. */
  Error = 'error'
}
