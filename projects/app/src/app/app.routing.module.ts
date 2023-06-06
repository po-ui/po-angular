import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TabelaComponent } from './tabela/tabela.component';
import { TabelaDoisComponent } from './tabela-dois/tabela-dois.component';
import { TabelaTresComponent } from './tabela-tres/tabela-tres.component';
import { TabelaQuatroComponent } from './tabela-quatro/tabela-quatro.component';
import { TabelaCincoComponent } from './tabela-cinco/tabela-cinco.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'tabela',
    pathMatch: 'full',
    component: TabelaComponent,
    data: {
      serviceApi: 'https://po-sample-api.fly.dev/v1/people' // endpoint dos dados
    }
  },
  {
    path: 'tabeladois',
    pathMatch: 'full',
    component: TabelaDoisComponent
  },
  {
    path: 'tabelatres',
    pathMatch: 'full',
    component: TabelaTresComponent
  },
  {
    path: 'tabelaquatro',
    pathMatch: 'full',
    component: TabelaQuatroComponent
  },
  {
    path: 'tabelacinco',
    pathMatch: 'full',
    component: TabelaCincoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
