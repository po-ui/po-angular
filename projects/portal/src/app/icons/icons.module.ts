import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { IconsRoutingModule } from './icons-routing.module';
import { IconsComponent } from './icons.component';

@NgModule({
  imports: [IconsRoutingModule, SharedModule],
  declarations: [IconsComponent]
})
export class IconsModule {}
