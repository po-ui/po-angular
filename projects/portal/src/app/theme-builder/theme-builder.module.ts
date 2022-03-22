import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ThemeBuilderRoutingModule } from './theme-builder-routing.module';
import { ThemeBuilderComponent } from './theme-builder.component';

@NgModule({
  imports: [SharedModule, ThemeBuilderRoutingModule],
  declarations: [ThemeBuilderComponent]
})
export class ThemeBuilderModule {}
