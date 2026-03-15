import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Dthfui11105Component } from './dthfui-11105/dthfui-11105.component';
import { Dthfui11105PoTableComponent } from './dthfui-11105/components/poTable/poTable-component';
import { Dthfui11105PoTableLabsComponent } from './dthfui-11105/components/PoTable_labs/poTable-labs.component';
import { PoDynamicComponent } from './dthfui-11105/components/poDynamic/poDynamic-component';
import { PoLookup2Component } from './dthfui-11105/components/poLookup/poLookup-component';
import { PoSampleComponent } from './dthfui-11105/components/poSample/poSample-component';
import { ColumnAlignmentComponent } from './dthfui-11105/components/column-alignment/column-alignment.component';
import { FrozenColumnsComponent } from './dthfui-11105/components/frozen-columns/frozen-columns.component';
import { SelectionTestComponent } from './dthfui-11105/components/selection/selection.component';
import { SortTestComponent } from './dthfui-11105/components/sort/sort.component';
import { DragDropTestComponent } from './dthfui-11105/components/drag-drop/drag-drop.component';
import { InfiniteScrollTestComponent } from './dthfui-11105/components/infinite-scroll/infinite-scroll.component';
import { StripedTestComponent } from './dthfui-11105/components/striped/striped.component';
import { HeightSpacingTestComponent } from './dthfui-11105/components/height-spacing/height-spacing.component';
import { ColumnManagerTestComponent } from './dthfui-11105/components/column-manager/column-manager.component';
import { LoadingEmptyTestComponent } from './dthfui-11105/components/loading-empty/loading-empty.component';
import { ResizeTestComponent } from './dthfui-11105/components/resize/resize.component';
import { PerformanceTestComponent } from './dthfui-11105/components/performance/performance.component';
import { IndexTestComponent } from './dthfui-11105/components/index/index.component';

// Route Configuration
export const DthfuiRoutes: Routes = [
  {
    path: '',
    component: Dthfui11105Component,
    children: [
      { path: '', component: IndexTestComponent },
      { path: 'PoTable', component: Dthfui11105PoTableComponent },
      { path: 'PoTableLabs', component: Dthfui11105PoTableLabsComponent },
      { path: 'PoDynamic', component: PoDynamicComponent },
      { path: 'PoLookup', component: PoLookup2Component },
      { path: 'PoSample', component: PoSampleComponent },
      { path: 'ColumnAlignment', component: ColumnAlignmentComponent },
      { path: 'FrozenColumns', component: FrozenColumnsComponent },
      { path: 'Selection', component: SelectionTestComponent },
      { path: 'Sort', component: SortTestComponent },
      { path: 'DragDrop', component: DragDropTestComponent },
      { path: 'InfiniteScroll', component: InfiniteScrollTestComponent },
      { path: 'Striped', component: StripedTestComponent },
      { path: 'HeightSpacing', component: HeightSpacingTestComponent },
      { path: 'ColumnManager', component: ColumnManagerTestComponent },
      { path: 'LoadingEmpty', component: LoadingEmptyTestComponent },
      { path: 'Resize', component: ResizeTestComponent },
      { path: 'Performance', component: PerformanceTestComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(DthfuiRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
