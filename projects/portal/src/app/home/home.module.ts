import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeColorfulComponent } from './home-colorful/home-colorful.component';
import { HomeColorfulService } from './home-colorful/home-colorful.service';

@NgModule({
  imports: [SharedModule, HomeRoutingModule],
  declarations: [HomeComponent, HomeColorfulComponent],
  providers: [HomeColorfulService],
  bootstrap: []
})
export class HomeModule {}
