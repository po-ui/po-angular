import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';

import { GuideRoutingModule } from './guide-routing.module';

import { GuidesComponent } from './guides.components';
import { GuideApiComponent } from './guides/guide-api/guide-api.component';
import { GuideBrowserSupportComponent } from './guides/guide-browser-support/guide-browser-support.component';
import { GuideDeprecationsComponent } from './guides/guide-deprecations/guide-deprecations.component';
import { GuideDevelopmentFlowComponent } from './guides/guide-development-flow/guide-development-flow.component';
import { GuideGettingStartedComponent } from './guides/guide-getting-started/guide-getting-started.component';
import { GuideGuideChartsComponent } from './guides/guide-guide-charts/guide-guide-charts.component';
import { GuideMigrationPouiV2Component } from './guides/guide-migration-poui-v2/guide-migration-poui-v2.component';
import { GuideMigrationPouiComponent } from './guides/guide-migration-poui/guide-migration-poui.component';
import { GuideMigrationThfToPoUiComponent } from './guides/guide-migration-thf-to-po-ui/guide-migration-thf-to-po-ui.component';
import { GuidePressKitComponent } from './guides/guide-press-kit/guide-press-kit.component';
import { GuideReleasesComponent } from './guides/guide-releases/guide-releases.component';
import { GuideSchematicsComponent } from './guides/guide-schematics/guide-schematics.component';
import { GuideSyncFundamentalsComponent } from './guides/guide-sync-fundamentals/guide-sync-fundamentals.component';
import { GuideSyncGetStartedComponent } from './guides/guide-sync-get-started/guide-sync-get-started.component';

@NgModule({
  imports: [SharedModule, GuideRoutingModule],
  declarations: [
    GuidesComponent,
    GuideApiComponent,
    GuideBrowserSupportComponent,
    GuideDeprecationsComponent,
    GuideDevelopmentFlowComponent,
    GuideGettingStartedComponent,
    GuideGuideChartsComponent,
    GuideMigrationPouiV2Component,
    GuideMigrationPouiComponent,
    GuideMigrationThfToPoUiComponent,
    GuidePressKitComponent,
    GuideReleasesComponent,
    GuideSchematicsComponent,
    GuideSyncFundamentalsComponent,
    GuideSyncGetStartedComponent
  ]
})
export class GuideModule {}
