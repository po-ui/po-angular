/**
 * @usedBy PoDynamicFormComponent
 *
 * @description
 *
 * Enum para definição do tipo de componente a ser renderizado.
 */
export enum ForceBooleanComponentEnum {
  /** Força a renderização de um po-switch */
  switch = 'switch',

  /** Força a renderização de um po-checkbox */
  checkbox = 'checkbox'
}

/**
 * @usedBy PoDynamicFormComponent
 *
 * @description
 *
 * Enum para definição do tipo de componente a ser renderizado.
 */
export enum ForceOptionComponentEnum {
  /** Força a renderização de um po-radio-group independente da quantidade do opções */
  radioGroup = 'radioGroup',

  /** Força a renderização de um po-select independente da quantidade do opções */
  select = 'select'
}
