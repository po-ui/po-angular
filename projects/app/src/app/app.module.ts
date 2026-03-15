import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoModule } from '../../../ui/src/public-api';

import { AppComponent } from './app.component';
import { Dthfui11105Component } from './dthfui-11105/dthfui-11105.component';
import { PoModalModule } from 'projects/ui/src/lib';
import { AppRoutingModule } from './app.routing.module';
import { PoSampleComponent } from './dthfui-11105/components/poSample/poSample-component';
import { PoLookup2Component } from './dthfui-11105/components/poLookup/poLookup-component';
import { PoDynamicComponent } from './dthfui-11105/components/poDynamic/poDynamic-component';
import { Dthfui11105PoTableComponent } from './dthfui-11105/components/poTable/poTable-component';
import { PoPageDynamicTableModule } from '@po-ui/ng-templates';
import { Dthfui11105PoTableLabsComponent } from './dthfui-11105/components/PoTable_labs/poTable-labs.component';
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

@NgModule({
  declarations: [
    AppComponent,
    Dthfui11105Component,
    PoSampleComponent,
    PoLookup2Component,
    PoDynamicComponent,
    Dthfui11105PoTableComponent,
    Dthfui11105PoTableLabsComponent,
    ColumnAlignmentComponent,
    FrozenColumnsComponent,
    SelectionTestComponent,
    SortTestComponent,
    DragDropTestComponent,
    InfiniteScrollTestComponent,
    StripedTestComponent,
    HeightSpacingTestComponent,
    ColumnManagerTestComponent,
    LoadingEmptyTestComponent,
    ResizeTestComponent,
    PerformanceTestComponent,
    IndexTestComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot([], {}),
    PoModule,
    PoPageDynamicTableModule,
    PoModalModule
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {}
