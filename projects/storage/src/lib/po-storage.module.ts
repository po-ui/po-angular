import { ModuleWithProviders, NgModule } from '@angular/core';

import { PoStorageConfig } from './services/po-storage-config.interface';
import { PoStorageService, PO_STORAGE_CONFIG_TOKEN } from './services/po-storage.service';

/**
 * @description
 *
 * Módulo do componente PoStorage responsável por manipular o storage do browser.
 */

@NgModule()
export class PoStorageModule {
  static forRoot(storageConfig?: PoStorageConfig): ModuleWithProviders<PoStorageModule> {
    return {
      ngModule: PoStorageModule,
      providers: [
        {
          provide: PO_STORAGE_CONFIG_TOKEN,
          useValue: storageConfig || PoStorageService.getDefaultConfig()
        },
        {
          provide: PoStorageService,
          useFactory: PoStorageService.providePoStorage,
          deps: [PO_STORAGE_CONFIG_TOKEN]
        }
      ]
    };
  }
}
