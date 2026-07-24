import { TemplateRef } from '@angular/core';

/**
 * @usedBy PoDashboardComponent
 *
 * @description
 *
 * Interface que define a estrutura de um card exibido no `po-dashboard`.
 */
export interface PoDashboardCard {
  /**
   * @description
   *
   * Identificador único do card. Utilizado para rastrear a ordem dos cards após reordenação.
   */
  id: string;

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho lógico do card no grid, determinando quantas colunas e linhas ele irá ocupar.
   *
   * Os spans lógicos mapeados são:
   * - `extrasmall`: 1 coluna × 1 linha
   * - `small`: 1 coluna × 2 linhas
   * - `medium`: 2 colunas × 2 linhas
   * - `large`: 3 colunas × 2 linhas
   * - `extralarge`: 4 colunas × 2 linhas
   *
   * > Caso não seja informado, o tamanho será `extrasmall`.
   *
   * @default `extrasmall`
   */
  displaySize?: 'extrasmall' | 'small' | 'medium' | 'large' | 'extralarge';

  /**
   * @description
   *
   * Template Angular (`ng-template`) que define o conteúdo interno do card.
   *
   * Exemplo de uso:
   * ```html
   * <ng-template #myCard>
   *   <p>Conteúdo do card</p>
   * </ng-template>
   * ```
   */
  template: TemplateRef<void>;
}
