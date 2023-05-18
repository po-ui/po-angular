import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//import { PoModule } from '@po-ui/ng-components';
import { PoModule } from '../../../ui/src/lib';

import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';
import { TabelaComponent } from './tabela/tabela.component';
import { TabelaDoisComponent } from './tabela-dois/tabela-dois.component';
import { TabelaTresComponent } from './tabela-tres/tabela-tres.component';

@NgModule({
  declarations: [AppComponent, TabelaComponent, TabelaDoisComponent, TabelaTresComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AppRoutingModule,
    PoModule,
    FormsModule,
    GridModule,
    ButtonsModule,
    InputsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
