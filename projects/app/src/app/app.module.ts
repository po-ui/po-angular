import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-route.routing';
import { PoTemplatesModule } from './../../../templates/src/lib/po-templates.module';
import { ClientesComponent } from './clientes/clientes.component';
import { PoModule, PoTableModule } from '../../../ui/src/lib';
import { TesteComponent } from './teste/teste.component';
import { CalculadoraComponent } from './calculadora/calculadora.component';
import { ResultadosComponent } from './resultados/resultados.component';
import { PocComponent } from './poc/poc.component';
import { TableComponent } from './table/table.component';
import { ChartComponent } from './chart/chart.component';
import { HcAppComponent } from './hc-app/hc-app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FinalFormComponent } from './final-form/final-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientesComponent,
    TesteComponent,
    CalculadoraComponent,
    ResultadosComponent,
    PocComponent,
    TableComponent,
    ChartComponent,
    HcAppComponent,
    FinalFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    PoModule,
    PoTemplatesModule,
    PoTableModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
