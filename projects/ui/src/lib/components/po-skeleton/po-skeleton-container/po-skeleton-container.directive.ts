import { Directive, HostBinding, input, computed } from '@angular/core';

import { convertToBoolean } from '../../../utils/util';

import { PO_SKELETON_CONTAINER, PoSkeletonContainerState } from './po-skeleton-container.token';

/**
 * @description
 *
 * Diretiva que define um container de skeleton para componentes PO UI.
 *
 * Ao aplicar `[p-skeleton]="true"` em um elemento container (form, div, section, etc.),
 * todos os componentes PO UI descendentes desse container passarão automaticamente
 * para o estado visual de skeleton, sem necessidade de alterar o template interno
 * de cada componente.
 *
 * A diretiva funciona de duas formas complementares:
 *
 * 1. **CSS Overlay** (principal): Adiciona o atributo `data-po-skeleton="true"` ao elemento host,
 *    ativando regras CSS globais que aplicam um overlay visual de skeleton sobre os componentes descendentes.
 *
 * 2. **Injeção de Dependência** (opcional): Provê o token `PO_SKELETON_CONTAINER` via DI,
 *    permitindo que componentes reajam programaticamente ao estado de skeleton quando necessário.
 *
 * A diretiva também suporta configuração de animação via `p-skeleton-animation`:
 * - `shimmer` (padrão): Animação de brilho deslizante
 * - `pulse`: Animação de pulsação
 * - `none`: Sem animação
 *
 * #### Exemplo de uso
 *
 * ```html
 * <form [p-skeleton]="isLoading">
 *   <po-input p-label="Nome"></po-input>
 *   <po-combo p-label="Estado" [p-options]="states"></po-combo>
 *   <po-textarea p-label="Observações"></po-textarea>
 * </form>
 * ```
 *
 * No exemplo acima, quando `isLoading` for `true`, todos os campos
 * exibirão automaticamente o estado visual de skeleton.
 *
 * #### Tokens CSS customizáveis
 *
 * É possível alterar o estilo do skeleton container usando as seguintes variáveis CSS:
 *
 * | Propriedade                                  | Descrição                                    | Valor Padrão                    |
 * |----------------------------------------------|----------------------------------------------|---------------------------------|
 * | `--po-skeleton-container-color`              | Cor de fundo do overlay skeleton             | `var(--color-neutral-light-20)` |
 * | `--po-skeleton-container-shimmer-highlight`   | Cor de destaque do shimmer                   | `var(--color-neutral-light-30)` |
 * | `--po-skeleton-container-border-radius`       | Raio da borda do overlay                     | `var(--border-radius-md)`       |
 * | `--po-skeleton-container-animation-duration`  | Duração da animação                          | `3s`                            |
 * | `--po-skeleton-container-animation-timing`    | Função de temporização da animação           | `ease-in-out`                   |
 *
 * @example
 *
 * <example name="po-skeleton-container-basic" title="PO Skeleton Container Basic">
 *  <file name="sample-po-skeleton-container-basic/sample-po-skeleton-container-basic.component.html"> </file>
 *  <file name="sample-po-skeleton-container-basic/sample-po-skeleton-container-basic.component.ts"> </file>
 * </example>
 */
@Directive({
  selector: '[p-skeleton]',
  providers: [
    {
      provide: PO_SKELETON_CONTAINER,
      useExisting: PoSkeletonContainerDirective
    }
  ],
  standalone: false
})
export class PoSkeletonContainerDirective implements PoSkeletonContainerState {
  /**
   * @optional
   *
   * @description
   *
   * Define se o estado skeleton está ativo no container.
   *
   * Quando `true`, todos os componentes PO UI descendentes recebem
   * um overlay visual de skeleton automaticamente.
   *
   * @default `false`
   */
  readonly pSkeleton = input<boolean, unknown>(false, {
    alias: 'p-skeleton',
    transform: convertToBoolean
  });

  /**
   * @optional
   *
   * @description
   *
   * Define o tipo de animação do skeleton container.
   *
   * Valores válidos:
   * - `shimmer`: Animação de brilho deslizante (padrão)
   * - `pulse`: Animação de pulsação
   * - `none`: Sem animação
   *
   * @default `shimmer`
   */
  readonly pSkeletonAnimation = input<string>('shimmer', {
    alias: 'p-skeleton-animation'
  });

  /** Signal que expõe o estado skeleton para componentes filhos via DI. */
  readonly skeleton = computed(() => this.pSkeleton());

  /** Atributo data-po-skeleton no host element para ativar as regras CSS. */
  @HostBinding('attr.data-po-skeleton')
  get dataPoSkeleton(): string | null {
    return this.pSkeleton() ? 'true' : null;
  }

  /** Atributo data-po-skeleton-animation no host element para controlar o tipo de animação. */
  @HostBinding('attr.data-po-skeleton-animation')
  get dataPoSkeletonAnimation(): string | null {
    return this.pSkeleton() ? this.pSkeletonAnimation() : null;
  }

  /** Atributo aria-busy para acessibilidade. */
  @HostBinding('attr.aria-busy')
  get ariaBusy(): string | null {
    return this.pSkeleton() ? 'true' : null;
  }
}
