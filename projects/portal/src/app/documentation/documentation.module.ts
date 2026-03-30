import { NgModule, SecurityContext } from '@angular/core';

import { SharedModule } from './../shared/shared.module';

import { MarkdownModule, SANITIZE } from 'ngx-markdown';

import { DocumentationRoutingModule } from './documentation-routing.module';
import { DocumentationComponent } from './documentation.component';
import { DocumentationService } from './documentation.service';
import { DocumentationListComponent } from './documentation-list.component';
import { IaToolsLlmsComponent } from './ia-tools-llms/ia-tools-llms.component';
import { IaToolsMcpComponent } from './ia-tools-mcp/ia-tools-mcp.component';

@NgModule({
  imports: [
    SharedModule,
    MarkdownModule.forRoot({
      sanitize: {
        provide: SANITIZE,
        useValue: SecurityContext.NONE
      }
    }),
    DocumentationRoutingModule
  ],
  declarations: [DocumentationComponent, DocumentationListComponent, IaToolsLlmsComponent, IaToolsMcpComponent],
  exports: [],
  providers: [DocumentationService]
})
export class DocumentationModule {}
