import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-route.routing';
import { PoTemplatesModule } from './../../../templates/src/lib/po-templates.module';
import { ClientesComponent } from './clientes/clientes.component';
import { PoModule } from '../../../ui/src/lib';
import { TesteComponent } from './teste/teste.component';
import { CalculadoraComponent } from './calculadora/calculadora.component';

@NgModule({
  declarations: [AppComponent, ClientesComponent, TesteComponent, CalculadoraComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule, PoModule, PoTemplatesModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
