import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { PoButtonModule } from '../po-button/po-button.module';
import { PoFieldModule } from '../po-field/po-field.module';
import { PoModalModule } from '../po-modal/po-modal.module';
import { PoPopoverModule } from '../po-popover/po-popover.module';
import { FilterModule } from '@progress/kendo-angular-filter';

import { NgModule } from '@angular/core';
import { PoKendoComponent } from './po-kendo.component';

@NgModule({
  declarations: [PoKendoComponent],
  exports: [PoKendoComponent],
  imports: [
    FormsModule,
    CommonModule,
    FormsModule,
    GridModule,
    PDFModule,
    ButtonsModule,
    InputsModule,
    PoButtonModule,
    PoFieldModule,
    FilterModule,
    PoModalModule,
    PoPopoverModule,
    HttpClientModule
  ],
  bootstrap: [PoKendoComponent]
})
export class PoKendoModule {}
