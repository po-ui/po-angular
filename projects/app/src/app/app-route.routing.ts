import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { ClientesComponent } from './clientes/clientes.component';
import { TesteComponent } from './teste/teste.component';
import { CalculadoraComponent } from './calculadora/calculadora.component';
import { ResultadosComponent } from './resultados/resultados.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
