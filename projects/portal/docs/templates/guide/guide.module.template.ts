import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';

import { GuideRoutingModule } from './guide-routing.module';

import { GuidesComponent } from './guides.components';
<% docItems.forEach(function(doc) {
  %>import { Guide<%- doc.name %>Component } from './guides/guide-<%- doc.path %>/guide-<%- doc.path %>.component';
<%});%>
@NgModule({
  imports: [SharedModule, GuideRoutingModule],
  declarations: [
    GuidesComponent,
  <% docItems.forEach(function(doc, index, docs) {
    %>  Guide<%- doc.name %>Component<%- (index === docs.length - 1) ? '' : ',' %>
  <%
  });%>]
})
export class GuideModule {}
