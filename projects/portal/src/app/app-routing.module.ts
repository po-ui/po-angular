import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Route Configuration
const routes: Routes = [
  {
    path: 'documentation',
    loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule)
  },
  { path: 'guides', loadChildren: () => import('./guide/guide.module').then(m => m.GuideModule) },
  { path: 'tools', loadChildren: () => import('./tools/tools.module').then(m => m.ToolsModule) },
  {
    path: 'construtor-de-temas',
    loadChildren: () => import('./theme-builder/theme-builder.module').then(m => m.ThemeBuilderModule)
  },
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
