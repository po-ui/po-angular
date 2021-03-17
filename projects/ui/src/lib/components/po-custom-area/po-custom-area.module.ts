import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoCustomAreaComponent } from './po-custom-area.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [PoCustomAreaComponent],
  imports: [CommonModule, HttpClientModule]
})
export class PoCustomAreaModule {}
