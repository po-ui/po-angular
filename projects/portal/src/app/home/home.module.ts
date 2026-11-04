import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeBannerComponent } from './home-banner/home-banner.component';
import { HomeBannerService } from './home-banner/home-banner.service';

@NgModule({
  imports: [SharedModule, HomeRoutingModule],
  declarations: [HomeComponent, HomeBannerComponent],
  providers: [HomeBannerService],
  bootstrap: []
})
export class HomeModule {}
