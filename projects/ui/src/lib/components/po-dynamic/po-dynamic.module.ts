import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PoDividerModule } from '../po-divider/po-divider.module';
import { PoFieldModule } from '../po-field/po-field.module';
import { PoInfoModule } from '../po-info/po-info.module';
import { PoTagModule } from '../po-tag/po-tag.module';
import { PoTimeModule } from '../../pipes/po-time/po-time.module';
import { PoTimePipe } from '../../pipes/po-time/po-time.pipe';

import { PoDynamicFormComponent } from './po-dynamic-form/po-dynamic-form.component';
import { PoDynamicFormFieldsComponent } from './po-dynamic-form/po-dynamic-form-fields/po-dynamic-form-fields.component';
import { PoDynamicFormLoadService } from './po-dynamic-form/po-dynamic-form-load/po-dynamic-form-load.service';
import { PoDynamicFormValidationService } from './po-dynamic-form/po-dynamic-form-validation/po-dynamic-form-validation.service';
import { PoDynamicViewComponent } from './po-dynamic-view/po-dynamic-view.component';
import { PoDynamicViewService } from './po-dynamic-view/po-dynamic-view.service';

@NgModule({
  imports: [CommonModule, FormsModule, PoDividerModule, PoInfoModule, PoFieldModule, PoTagModule, PoTimeModule],
  declarations: [PoDynamicFormComponent, PoDynamicFormFieldsComponent, PoDynamicViewComponent],
  exports: [PoDynamicFormComponent, PoDynamicViewComponent],
  providers: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    PoTimePipe,
    TitleCasePipe,
    PoDynamicFormLoadService,
    PoDynamicFormValidationService,
    PoDynamicViewService
  ]
})
export class PoDynamicModule {}
