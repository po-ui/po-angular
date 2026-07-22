import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PoModule } from '../../../ui/src/public-api';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { Fase1CdkPuroComponent } from './fase1-cdk-puro/fase1-cdk-puro.component';
import { Fase2CdkWidgetComponent } from './fase2-cdk-widget/fase2-cdk-widget.component';
import { CdkWidgetGridComponent } from './cdk-widget-grid/cdk-widget-grid.component';
import { Fase22GridLayoutSuiComponent } from './fase2-2-grid-layout-sui/fase2-2-grid-layout-sui.component';
import { Fase23SuiUxComponent } from './fase2-3-sui-ux/fase2-3-sui-ux.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'fase1', component: Fase1CdkPuroComponent },
  { path: 'fase2', component: Fase2CdkWidgetComponent },
  { path: 'fase2-1', component: CdkWidgetGridComponent },
  { path: 'fase2-2', component: Fase22GridLayoutSuiComponent },
  { path: 'fase2-3', component: Fase23SuiUxComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [AppComponent, HomeComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule, CommonModule, FormsModule, RouterModule.forRoot(routes, { useHash: true }), PoModule],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {}
