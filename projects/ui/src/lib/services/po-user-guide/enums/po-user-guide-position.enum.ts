/**
 * @usedBy PoUserGuideService
 *
 * @description
 *
 * *Enum* que define a posição preferida do popover do tour em relação ao elemento destacado,
 * utilizado na propriedade `position` de `PoUserGuideStep`.
 *
 * > Quando o valor não é informado, é aplicado o padrão `PoUserGuidePosition.Auto`.
 */
export enum PoUserGuidePosition {
  /** O popover é renderizado acima do elemento destacado. */
  Top = 'top',

  /** O popover é renderizado à direita do elemento destacado. */
  Right = 'right',

  /** O popover é renderizado abaixo do elemento destacado. */
  Bottom = 'bottom',

  /** O popover é renderizado à esquerda do elemento destacado. */
  Left = 'left',

  /** O popover é renderizado sobreposto ao elemento destacado. */
  Over = 'over',

  /** A posição é calculada automaticamente conforme o espaço disponível na viewport. */
  Auto = 'auto'
}
