import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { ClientesComponent } from './clientes/clientes.component';
import { TesteComponent } from './teste/teste.component';
import { CalculadoraComponent } from './calculadora/calculadora.component';
import { ResultadosComponent } from './resultados/resultados.component';
import { PocComponent } from './poc/poc.component';
import { TableComponent } from './table/table.component';
import { ChartComponent } from './chart/chart.component';

const routes: Routes = [
  {
    path: 'cliente',
    component: ClientesComponent
  },
  {
    path: 'teste',
    component: TesteComponent
  },
  {
    path: 'calculadora',
    component: CalculadoraComponent
  },
  {
    path: 'resultados',
    component: ResultadosComponent
  },
  {
    path: 'poc',
    component: PocComponent
  },
  {
    path: 'form',
    component: TableComponent
  },
  {
    path: 'chart',
    component: ChartComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
