import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GuidesComponent } from './guides.components';
<% docItems.forEach(function(doc) {
  %>import { Guide<%- doc.name %>Component } from './guides/guide-<%- doc.path %>/guide-<%- doc.path %>.component';
<%});%>
// Route Configuration
export const guidesRoutes: Routes = [
  {
    path: '',
    component: GuidesComponent,
    children: [
      <% docItems.forEach(function(doc) {
        %>{ path: '<%- doc.path %>', component: Guide<%- doc.name %>Component },
      <%
    });%>{ path: '', redirectTo: 'getting-started' }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(guidesRoutes)],
  exports: [RouterModule]
})
export class GuideRoutingModule {}
