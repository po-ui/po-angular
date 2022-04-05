import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { PoModule } from '../../../../ui/src/lib';
import { VirtualComponent } from './virtual.component';

const routes: Routes = [
  {
    path: '',
    component: VirtualComponent
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), PoModule, HttpClientModule],
  declarations: [VirtualComponent]
})
export class VirtualModule {}
