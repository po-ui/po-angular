import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { PoModule } from '../../../ui/src/lib';
import { AppComponent } from './app.component';

// import { PoModule } from '@po-ui/ng-components';

const routes: Routes = [
  {
    path: 'normal',
    loadChildren: () => import('./normal/normal.module').then(m => m.NormalModule)
  },
  {
    path: 'virtual',
    loadChildren: () => import('./virtual/virtual.module').then(m => m.VirtualModule)
  }
];
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    PoModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
