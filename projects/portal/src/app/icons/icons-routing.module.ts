import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { IconsComponent } from './icons.component';

export const iconsRoutes: Routes = [{ path: '', component: IconsComponent }];

@NgModule({
  imports: [RouterModule.forChild(iconsRoutes)],
  exports: [RouterModule]
})
export class IconsRoutingModule {}
