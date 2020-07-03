import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeColorfulComponent } from './home-colorful/home-colorful.component';

@NgModule({
  imports: [SharedModule, HomeRoutingModule],
  declarations: [HomeComponent, HomeColorfulComponent],
  providers: [],
  bootstrap: []
})
export class HomeModule {}
