import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ThemeBuilderComponent } from './theme-builder.component';

export const toolsRoutes: Routes = [{ path: '', component: ThemeBuilderComponent }];

@NgModule({
  imports: [RouterModule.forChild(toolsRoutes)],
  exports: [RouterModule]
})
export class ThemeBuilderRoutingModule {}
