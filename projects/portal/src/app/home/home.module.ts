import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeIllustrationSlotComponent } from './home-illustration-slot/home-illustration-slot.component';
import { HomeHeroComponent } from './home-hero/home-hero.component';
import { HomeBenefitsComponent } from './home-benefits/home-benefits.component';
import { HomeStatementComponent } from './home-statement/home-statement.component';
import { HomeFeaturesComponent } from './home-features/home-features.component';
import { HomeOpenSourceComponent } from './home-open-source/home-open-source.component';
import { HomeFooterComponent } from './home-footer/home-footer.component';
import { HomeBannerService } from './home-banner/home-banner.service';

@NgModule({
  imports: [SharedModule, HomeRoutingModule],
  declarations: [
    HomeComponent,
    HomeIllustrationSlotComponent,
    HomeHeroComponent,
    HomeBenefitsComponent,
    HomeStatementComponent,
    HomeFeaturesComponent,
    HomeOpenSourceComponent,
    HomeFooterComponent
  ],
  providers: [HomeBannerService],
  bootstrap: []
})
export class HomeModule {}
