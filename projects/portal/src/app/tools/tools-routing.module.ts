import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ToolsDynamicViewComponent } from './tools-dynamic-view/tools-dynamic-view.component';
import { ToolsDynamicFormComponent } from './tools-dynamic-form/tools-dynamic-form.component';

export const toolsRoutes: Routes = [
  { path: '', redirectTo: 'dynamic-form' },
  { path: 'dynamic-form', component: ToolsDynamicFormComponent },
  { path: 'dynamic-view', component: ToolsDynamicViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(toolsRoutes)],
  exports: [RouterModule]
})
export class ToolsRoutingModule {}
