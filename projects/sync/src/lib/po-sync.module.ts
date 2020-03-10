import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { Network } from '@ionic-native/network/ngx';

import { PoEventSourcingService } from './services/po-event-sourcing/po-event-sourcing.service';
import { PoHttpClientService } from './services/po-http-client/po-http-client.service';
import { PoNetworkService } from './services/po-network/po-network.service';
import { PoSchemaDefinitionService } from './services/po-schema/po-schema-definition/po-schema-definition.service';
import { PoSchemaService } from './services/po-schema/po-schema.service';
import { PoSyncService } from './services/po-sync/po-sync.service';

/**
 * @description
 *
 * Módulo do componente PoSync responsável pela sincronia de dados com backends
 */
@NgModule({
  providers: [
    PoEventSourcingService,
    PoNetworkService,
    PoSchemaDefinitionService,
    PoSchemaService,
    PoSyncService,
    PoHttpClientService,
    Network
  ],
  imports: [HttpClientModule]
})
export class PoSyncModule {}
