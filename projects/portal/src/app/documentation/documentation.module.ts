import { NgModule, SecurityContext } from '@angular/core';

import { SharedModule } from './../shared/shared.module';

import { MarkdownModule, SANITIZE } from 'ngx-markdown';

import { DocumentationRoutingModule } from './documentation-routing.module';
import { DocumentationComponent } from './documentation.component';
import { DocumentationService } from './documentation.service';
import { DocumentationListComponent } from './documentation-list.component';

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
  declarations: [DocumentationComponent, DocumentationListComponent],
  exports: [],
  providers: [DocumentationService]
})
export class DocumentationModule {}
