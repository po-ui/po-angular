import { ModuleWithProviders, NgModule } from '@angular/core';

import { PO_TELEMETRY_CONFIG } from './po-telemetry.injection-token';
import { PoTelemetryConfig } from './po-telemetry-config.interface';
import { PoTelemetryService } from './po-telemetry.service';

/**
 * @description
 *
 * Módulo do serviço de telemetria do PO UI.
 *
 * Para utilização do serviço de telemetria, deve-se importar este módulo e invocar o método `forRoot`,
 * informando um objeto que implementa a interface `PoTelemetryConfig`.
 *
 * A telemetria é **opt-in** e requer consentimento do usuário.
 *
 * **Exemplo de configuração:**
 *
 * ```
 * import { PoTelemetryModule } from '@po-ui/ng-components';
 *
 * @NgModule({
 *   imports: [
 *     PoModule,
 *     PoTelemetryModule.forRoot({
 *       enabled: true,
 *       endpointUrl: 'https://my-telemetry-api.example.com/events',
 *       showConsentDialog: true
 *     })
 *   ]
 * })
 * export class AppModule {}
 * ```
 */
@NgModule({})
export class PoTelemetryModule {
  static forRoot(config: PoTelemetryConfig): ModuleWithProviders<PoTelemetryModule> {
    return {
      ngModule: PoTelemetryModule,
      providers: [{ provide: PO_TELEMETRY_CONFIG, useValue: config }, PoTelemetryService]
    };
  }
}
