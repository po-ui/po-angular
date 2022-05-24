import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoCheckboxComponent } from './po-checkbox.component';

@NgModule({
  declarations: [PoCheckboxComponent],
  imports: [CommonModule, FormsModule],
  exports: [PoCheckboxComponent]
})
export class PoCheckboxModule {}
