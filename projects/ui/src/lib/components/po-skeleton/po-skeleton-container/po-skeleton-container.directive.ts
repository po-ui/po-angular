import { Directive, input, computed } from '@angular/core';

import { convertToBoolean } from '../../../utils/util';

import { PO_SKELETON_CONTAINER, PoSkeletonContainerState } from './po-skeleton-container.token';

/**
 * @docsPrivate
 *
 * @description
 *
 * Diretiva que define um container de skeleton para componentes de formulário.
 *
 * Ao aplicar `[p-skeleton]="true"` em um elemento container (form, div, etc.),
 * todos os componentes de formulário do PO UI que forem filhos desse container
 * passarão automaticamente para o estado visual de skeleton.
 *
 * A diretiva utiliza o sistema de injeção de dependência do Angular para propagar
 * o estado de skeleton aos componentes filhos, sem necessidade de binding individual.
 *
 * #### Exemplo de uso
 *
 * ```html
 * <form [p-skeleton]="isLoading">
 *   <po-input p-label="Nome" [(ngModel)]="name"></po-input>
 *   <po-select p-label="Estado" [p-options]="states" [(ngModel)]="state"></po-select>
 *   <po-textarea p-label="Observações" [(ngModel)]="notes"></po-textarea>
 * </form>
 * ```
 *
 * No exemplo acima, quando `isLoading` for `true`, todos os campos (`po-input`,
 * `po-select`, `po-textarea`) exibirão automaticamente o estado skeleton.
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
  /** Define se o estado skeleton está ativo no container. */
  readonly pSkeleton = input<boolean, unknown>(false, {
    alias: 'p-skeleton',
    transform: convertToBoolean
  });

  /** Signal que expõe o estado skeleton para os componentes filhos. */
  readonly skeleton = computed(() => this.pSkeleton());
}
