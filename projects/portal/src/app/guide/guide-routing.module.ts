import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GuidesComponent } from './guides.components';
import { GuideApiComponent } from './guides/guide-api/guide-api.component';
import { GuideBrowserSupportComponent } from './guides/guide-browser-support/guide-browser-support.component';
import { GuideDevelopmentFlowComponent } from './guides/guide-development-flow/guide-development-flow.component';
import { GuideGettingStartedComponent } from './guides/guide-getting-started/guide-getting-started.component';
import { GuideGuideChartsComponent } from './guides/guide-guide-charts/guide-guide-charts.component';
import { GuideMigrationPouiV2Component } from './guides/guide-migration-poui-v2/guide-migration-poui-v2.component';
import { GuideMigrationPouiV3Component } from './guides/guide-migration-poui-v3/guide-migration-poui-v3.component';
import { GuideMigrationPouiV4Component } from './guides/guide-migration-poui-v4/guide-migration-poui-v4.component';
import { GuideMigrationThfToPoUiComponent } from './guides/guide-migration-thf-to-po-ui/guide-migration-thf-to-po-ui.component';
import { GuidePressKitComponent } from './guides/guide-press-kit/guide-press-kit.component';
import { GuideSchematicsComponent } from './guides/guide-schematics/guide-schematics.component';
import { GuideSyncFundamentalsComponent } from './guides/guide-sync-fundamentals/guide-sync-fundamentals.component';
import { GuideSyncGetStartedComponent } from './guides/guide-sync-get-started/guide-sync-get-started.component';
import { GuideColorsCustomizationComponent } from './guides/guide-colors-customization/guide-colors-customization.component';
import { GuideCreateThemeCustomizationComponent } from './guides/guide-create-theme-customization/guide-create-theme-customization.component';
import { GuideGridSystemComponent } from './guides/guide-grid-system/guide-grid-system.component';
import { GuideIconsComponent } from './guides/guide-icons/guide-icons.component';
import { GuideSpacingComponent } from './guides/guide-spacing/guide-spacing.component';
import { GuideTypographyComponent } from './guides/guide-typography/guide-typography.component';
import { GuideGettingStartedPoTslintComponent } from './guides/guide-getting-started-po-tslint/guide-getting-started-po-tslint.component';

// Route Configuration
export const guidesRoutes: Routes = [
  {
    path: '',
    component: GuidesComponent,
    children: [
      { path: 'api', component: GuideApiComponent },
      { path: 'browser-support', component: GuideBrowserSupportComponent },
      { path: 'development-flow', component: GuideDevelopmentFlowComponent },
      { path: 'getting-started', component: GuideGettingStartedComponent },
      { path: 'guide-charts', component: GuideGuideChartsComponent },
      { path: 'migration-poui-v2', component: GuideMigrationPouiV2Component },
      { path: 'migration-poui-v3', component: GuideMigrationPouiV3Component },
      { path: 'migration-poui-v4', component: GuideMigrationPouiV4Component },
      { path: 'migration-thf-to-po-ui', component: GuideMigrationThfToPoUiComponent },
      { path: 'press-kit', component: GuidePressKitComponent },
      { path: 'schematics', component: GuideSchematicsComponent },
      { path: 'sync-fundamentals', component: GuideSyncFundamentalsComponent },
      { path: 'sync-get-started', component: GuideSyncGetStartedComponent },
      { path: 'colors-customization', component: GuideColorsCustomizationComponent },
      { path: 'create-theme-customization', component: GuideCreateThemeCustomizationComponent },
      { path: 'grid-system', component: GuideGridSystemComponent },
      { path: 'icons', component: GuideIconsComponent },
      { path: 'spacing', component: GuideSpacingComponent },
      { path: 'typography', component: GuideTypographyComponent },
      { path: 'getting-started-po-tslint', component: GuideGettingStartedPoTslintComponent },
      { path: '', redirectTo: 'getting-started' }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(guidesRoutes)],
  exports: [RouterModule]
})
export class GuideRoutingModule {}
