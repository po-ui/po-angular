import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PoButtonGroupModule } from '../po-button-group/index';
import { PoButtonModule } from '../po-button/index';
import { PoContainerModule } from '../po-container/index';
import { PoDisclaimerModule } from './../po-disclaimer/po-disclaimer.module';
import { PoLoadingModule } from '../po-loading/index';
import { PoModalModule } from '../po-modal/po-modal.module';
import { PoProgressModule } from './../po-progress/po-progress.module';
import { PoServicesModule } from '../../services/services.module';
import { PoTableModule } from '../po-table/po-table.module';
import { PoTooltipModule } from './../../directives/po-tooltip/po-tooltip.module';

import { PoCalendarComponent } from './po-datepicker/po-calendar/po-calendar.component';
import { PoCheckboxGroupComponent } from './po-checkbox-group/po-checkbox-group.component';
import { PoCleanComponent } from './po-clean/po-clean.component';
import { PoComboComponent } from './po-combo/po-combo.component';
import { PoDatepickerComponent } from './po-datepicker/po-datepicker.component';
import { PoDatepickerRangeComponent } from './po-datepicker-range/po-datepicker-range.component';
import { PoDecimalComponent } from './po-decimal/po-decimal.component';
import { PoEmailComponent } from './po-email/po-email.component';
import { PoFieldContainerComponent } from './po-field-container/po-field-container.component';
import { PoFieldContainerBottomComponent } from './po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoLoginComponent } from './po-login/po-login.component';
import { PoLookupComponent } from './po-lookup/po-lookup.component';
import { PoLookupModalComponent } from './po-lookup/po-lookup-modal/po-lookup-modal.component';
import { PoMultiselectDropdownComponent } from './po-multiselect/po-multiselect-dropdown/po-multiselect-dropdown.component';
import { PoMultiselectComponent } from './po-multiselect/po-multiselect.component';
import { PoMultiselectItemComponent } from './po-multiselect/po-multiselect-item/po-multiselect-item.component';
import { PoMultiselectSearchComponent } from './po-multiselect/po-multiselect-search/po-multiselect-search.component';
import { PoRichTextBodyComponent } from './po-rich-text/po-rich-text-body/po-rich-text-body.component';
import { PoRichTextComponent } from './po-rich-text/po-rich-text.component';
import { PoRichTextModalComponent } from './po-rich-text/po-rich-text-modal/po-rich-text-modal.component';
import { PoRichTextToolbarComponent } from './po-rich-text/po-rich-text-toolbar/po-rich-text-toolbar.component';
import { PoInputComponent } from './po-input/po-input.component';
import { PoNumberComponent } from './po-number/po-number.component';
import { PoPasswordComponent } from './po-password/po-password.component';
import { PoRadioGroupComponent } from './po-radio-group/po-radio-group.component';
import { PoSelectComponent } from './po-select/po-select.component';
import { PoSelectOptionTemplateDirective } from './po-select/po-select-option-template/po-select-option-template.directive';
import { PoSwitchComponent } from './po-switch/po-switch.component';
import { PoTextareaComponent } from './po-textarea/po-textarea.component';
import { PoUploadComponent } from './po-upload/po-upload.component';
import { PoUploadDragDropComponent } from './po-upload/po-upload-drag-drop/po-upload-drag-drop.component';
import { PoUploadDragDropDirective } from './po-upload/po-upload-drag-drop/po-upload-drag-drop.directive';
import {
  PoUploadDragDropAreaOverlayComponent
} from './po-upload/po-upload-drag-drop/po-upload-drag-drop-area-overlay/po-upload-drag-drop-area-overlay.component';
import { PoUploadDragDropAreaComponent } from './po-upload/po-upload-drag-drop/po-upload-drag-drop-area/po-upload-drag-drop-area.component';
import { PoUploadFileRestrictionsComponent } from './po-upload/po-upload-file-restrictions/po-upload-file-restrictions.component';
import { PoUrlComponent } from './po-url/po-url.component';

/**
 * @description
 *
 * Módulo dos componentes po-combo, po-checkbox-group, po-datepicker, po-datepicker-range, po-email, po-input, po-lookup,
 * po-number, po-multiselect, po-password, po-radio-group, po-select, po-switch, po-textarea, po-upload e po-url.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PoButtonGroupModule,
    PoButtonModule,
    PoContainerModule,
    PoDisclaimerModule,
    PoLoadingModule,
    PoModalModule,
    PoProgressModule,
    PoServicesModule,
    PoTableModule,
    PoTooltipModule
  ],
  exports: [
    PoCheckboxGroupComponent,
    PoCleanComponent,
    PoComboComponent,
    PoDecimalComponent,
    PoDatepickerComponent,
    PoDatepickerRangeComponent,
    PoEmailComponent,
    PoFieldContainerComponent,
    PoFieldContainerBottomComponent,
    PoInputComponent,
    PoLoginComponent,
    PoLookupComponent,
    PoLookupModalComponent,
    PoMultiselectComponent,
    PoNumberComponent,
    PoPasswordComponent,
    PoRadioGroupComponent,
    PoRichTextComponent,
    PoSelectComponent,
    PoSelectOptionTemplateDirective,
    PoSwitchComponent,
    PoTextareaComponent,
    PoUploadComponent,
    PoUrlComponent
  ],
  declarations: [
    PoCalendarComponent,
    PoCheckboxGroupComponent,
    PoCleanComponent,
    PoComboComponent,
    PoDecimalComponent,
    PoDatepickerComponent,
    PoDatepickerRangeComponent,
    PoEmailComponent,
    PoFieldContainerComponent,
    PoFieldContainerBottomComponent,
    PoInputComponent,
    PoLoginComponent,
    PoLookupComponent,
    PoLookupModalComponent,
    PoMultiselectComponent,
    PoMultiselectDropdownComponent,
    PoMultiselectItemComponent,
    PoMultiselectSearchComponent,
    PoNumberComponent,
    PoPasswordComponent,
    PoRadioGroupComponent,
    PoRichTextBodyComponent,
    PoRichTextComponent,
    PoRichTextModalComponent,
    PoRichTextToolbarComponent,
    PoSelectComponent,
    PoSelectOptionTemplateDirective,
    PoSwitchComponent,
    PoTextareaComponent,
    PoUploadComponent,
    PoUploadDragDropComponent,
    PoUploadDragDropDirective,
    PoUploadDragDropAreaOverlayComponent,
    PoUploadDragDropAreaComponent,
    PoUploadFileRestrictionsComponent,
    PoUrlComponent
  ],
  providers: [],
  entryComponents: [
    PoCalendarComponent,
    PoLookupModalComponent,
    PoRichTextModalComponent
  ]
})
export class PoFieldModule { }
