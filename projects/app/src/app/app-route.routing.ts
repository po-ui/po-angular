import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculadoraComponent } from './calculadora/calculadora.component';
import { ChartComponent } from './chart/chart.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FinalFormComponent } from './final-form/final-form.component';
import { HcAppComponent } from './hc-app/hc-app.component';
import { PocComponent } from './poc/poc.component';
import { ResultadosComponent } from './resultados/resultados.component';
import { TableComponent } from './table/table.component';
import { TesteComponent } from './teste/teste.component';

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
  },
  {
    path: 'hc',
    component: HcAppComponent
  },
  {
    path: 'final-form',
    component: FinalFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
