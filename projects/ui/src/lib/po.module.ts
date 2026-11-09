import { inject, NgModule } from '@angular/core';

import { PoComponentsModule } from './components/components.module';
import { PoDirectivesModule } from './directives/directives.module';
import { PoGuardsModule } from './guards/guards.module';
import { PoInterceptorsModule } from './interceptors/interceptors.module';
import { PoPipesModule } from './pipes/pipes.module';
import { PoNotificationService } from './services/po-notification/po-notification.service';
import { PoServicesModule } from './services/services.module';
import { PoThemeService } from './services';

@NgModule({
  declarations: [],
  imports: [
    PoComponentsModule,
    PoDirectivesModule,
    PoGuardsModule,
    PoInterceptorsModule,
    PoPipesModule,
    PoServicesModule
  ],
  exports: [
    PoComponentsModule,
    PoDirectivesModule,
    PoInterceptorsModule,
    PoGuardsModule,
    PoPipesModule,
    PoServicesModule
  ],
  providers: [PoNotificationService],
  bootstrap: []
})
export class PoModule {
  readonly themeService = inject(PoThemeService);
}
