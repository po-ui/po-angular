import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';

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
    HttpClientModule
  ],
  bootstrap: [PoKendoComponent]
})
export class PoKendoModule {}
