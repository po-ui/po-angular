/**
 * @usedBy PoUserGuideService
 *
 * @description
 *
 * *Enum* que define o alinhamento do popover do tour ao longo do eixo da posição configurada,
 * utilizado na propriedade `align` de `PoUserGuideStep`.
 *
 * > Quando o valor não é informado, é aplicado o padrão `PoUserGuideAlignment.Start`.
 */
export enum PoUserGuideAlignment {
  /** O popover é alinhado ao início do eixo da posição (topo ou esquerda, conforme a `PoUserGuidePosition`). */
  Start = 'start',

  /** O popover é alinhado ao centro do eixo da posição. */
  Center = 'center',

  /** O popover é alinhado ao final do eixo da posição (rodapé ou direita, conforme a `PoUserGuidePosition`). */
  End = 'end'
}
