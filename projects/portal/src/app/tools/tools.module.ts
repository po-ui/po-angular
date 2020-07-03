import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { ToolsRoutingModule } from './tools-routing.module';
import { ToolsDynamicFormComponent } from './tools-dynamic-form/tools-dynamic-form.component';
import { ToolsDynamicViewComponent } from './tools-dynamic-view/tools-dynamic-view.component';

@NgModule({
  imports: [SharedModule, ToolsRoutingModule],
  declarations: [ToolsDynamicFormComponent, ToolsDynamicViewComponent]
})
export class ToolsModule {}
