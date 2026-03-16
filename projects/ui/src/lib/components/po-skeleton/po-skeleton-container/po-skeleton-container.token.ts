import { InjectionToken, Signal } from '@angular/core';

/**
 * Interface que define o contrato do container de skeleton.
 *
 * Componentes podem injetar este token opcionalmente para
 * verificar se estão dentro de um container com estado skeleton ativo.
 */
export interface PoSkeletonContainerState {
  /** Signal indicando se o estado skeleton está ativo. */
  readonly skeleton: Signal<boolean>;
}

/**
 * Token de injeção utilizado pela diretiva `p-skeleton` para propagar
 * o estado de skeleton aos componentes filhos via hierarquia de DI do Angular.
 *
 * Componentes podem injetar este token com `inject(PO_SKELETON_CONTAINER, { optional: true })`
 * para reagir ao estado global de skeleton quando necessário.
 */
export const PO_SKELETON_CONTAINER = new InjectionToken<PoSkeletonContainerState>('PO_SKELETON_CONTAINER');
