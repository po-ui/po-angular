import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ToolsDynamicViewComponent } from './tools-dynamic-view/tools-dynamic-view.component';
import { ToolsDynamicFormComponent } from './tools-dynamic-form/tools-dynamic-form.component';
import { PoUiChatComponent } from './po-ui-chat/po-ui-chat.component';

export const toolsRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dynamic-form' },
  { path: 'dynamic-form', component: ToolsDynamicFormComponent },
  { path: 'dynamic-view', component: ToolsDynamicViewComponent },
  { path: 'po-ui-chat', component: PoUiChatComponent }
];

@NgModule({
  imports: [RouterModule.forChild(toolsRoutes)],
  exports: [RouterModule]
})
export class ToolsRoutingModule {}
