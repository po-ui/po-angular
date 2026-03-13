import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Dthfui11105Component } from './dthfui-11105/dthfui-11105.component';
import { Dthfui11105PoTableComponent } from './dthfui-11105/components/poTable/poTable-component';
import { Dthfui11105PoTableLabsComponent } from './dthfui-11105/components/PoTable_labs/poTable-labs.component';
import { PoDynamicComponent } from './dthfui-11105/components/poDynamic/poDynamic-component';
import { PoLookup2Component } from './dthfui-11105/components/poLookup/poLookup-component';
import { PoSampleComponent } from './dthfui-11105/components/poSample/poSample-component';

// Route Configuration
export const DthfuiRoutes: Routes = [
  {
    path: '',
    component: Dthfui11105Component,
    children: [
      { path: 'PoTable', component: Dthfui11105PoTableComponent },
      { path: 'PoTableLabs', component: Dthfui11105PoTableLabsComponent },
      { path: 'PoDynamic', component: PoDynamicComponent },
      { path: 'PoLookup', component: PoLookup2Component },
      { path: 'PoSample', component: PoSampleComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(DthfuiRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
