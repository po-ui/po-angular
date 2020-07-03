import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';

import { MarkdownModule } from 'ngx-markdown';

import { DocumentationRoutingModule } from './documentation-routing.module';
import { DocumentationComponent } from './documentation.component';
import { DocumentationService } from './documentation.service';
import { DocumentationListComponent } from './documentation-list.component';

@NgModule({
  imports: [SharedModule, MarkdownModule.forRoot(), DocumentationRoutingModule],
  declarations: [DocumentationComponent, DocumentationListComponent],
  exports: [],
  providers: [DocumentationService]
})
export class DocumentationModule {}
