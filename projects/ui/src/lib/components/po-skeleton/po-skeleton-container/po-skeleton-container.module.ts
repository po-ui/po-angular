import { NgModule } from '@angular/core';

import { PoSkeletonContainerDirective } from './po-skeleton-container.directive';

/**
 * @description
 *
 * Módulo da diretiva `PoSkeletonContainerDirective`.
 *
 * > Para utilizar a diretiva, basta importar este módulo no módulo da aplicação:
 *
 * ```typescript
 * import { PoSkeletonContainerModule } from '@po-ui/ng-components';
 *
 * @NgModule({
 *   imports: [PoSkeletonContainerModule]
 * })
 * export class AppModule {}
 * ```
 */
@NgModule({
  declarations: [PoSkeletonContainerDirective],
  exports: [PoSkeletonContainerDirective]
})
export class PoSkeletonContainerModule {}
