import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

import { PoButtonGroupModule } from '../po-button-group/index';
import { PoButtonModule } from '../po-button/index';
import { PoCheckboxGroupModule } from './po-checkbox-group/po-checkbox-group.module';
import { PoRadioGroupModule } from './po-radio-group/po-radio-group.module';
import { PoRadioModule } from './po-radio/po-radio.module';
import { PoContainerModule } from '../po-container/index';
import { PoCalendarModule } from '../po-calendar/po-calendar.module';
import { PoCleanModule } from './po-clean/po-clean.module';
import { PoDatepickerModule } from './po-datepicker/po-datepicker.module';
import { PoDisclaimerGroupModule } from './../po-disclaimer-group/po-disclaimer-group.module';
import { PoDisclaimerModule } from './../po-disclaimer/po-disclaimer.module';
import { PoFieldContainerModule } from './po-field-container/po-field-container.module';
import { PoLoadingModule } from '../po-loading/index';
import { PoModalModule } from '../po-modal/po-modal.module';
import { PoProgressModule } from './../po-progress/po-progress.module';
import { PoServicesModule } from '../../services/services.module';
import { PoTableModule } from '../po-table/po-table.module';
import { PoTooltipModule } from './../../directives/po-tooltip/po-tooltip.module';
import { PoIconModule } from '../po-icon/po-icon.module';
import { PoListBoxModule } from '../po-listbox/po-listbox.module';

import { PoComboComponent } from './po-combo/po-combo.component';
import { PoComboOptionTemplateDirective } from './po-combo/po-combo-option-template/po-combo-option-template.directive';
import { PoMultiselectOptionTemplateDirective } from './po-multiselect/po-multiselect-option-template/po-multiselect-option-template.directive';
import { PoDatepickerComponent } from './po-datepicker/po-datepicker.component';
import { PoDatepickerRangeComponent } from './po-datepicker-range/po-datepicker-range.component';
import { PoDecimalComponent } from './po-decimal/po-decimal.component';
import { PoEmailComponent } from './po-email/po-email.component';
import { PoLoginComponent } from './po-login/po-login.component';
import { PoLookupComponent } from './po-lookup/po-lookup.component';
import { PoLookupModalComponent } from './po-lookup/po-lookup-modal/po-lookup-modal.component';
import { PoMultiselectDropdownComponent } from './po-multiselect/po-multiselect-dropdown/po-multiselect-dropdown.component';
import { PoMultiselectComponent } from './po-multiselect/po-multiselect.component';
import { PoMultiselectSearchComponent } from './po-multiselect/po-multiselect-search/po-multiselect-search.component';
import { PoRichTextBodyComponent } from './po-rich-text/po-rich-text-body/po-rich-text-body.component';
import { PoRichTextComponent } from './po-rich-text/po-rich-text.component';
import { PoRichTextImageModalComponent } from './po-rich-text/po-rich-text-image-modal/po-rich-text-image-modal.component';
import { PoRichTextLinkModalComponent } from './po-rich-text/po-rich-text-link-modal/po-rich-text-link-modal.component';
import { PoRichTextToolbarComponent } from './po-rich-text/po-rich-text-toolbar/po-rich-text-toolbar.component';
import { PoInputComponent } from './po-input/po-input.component';
import { PoNumberComponent } from './po-number/po-number.component';
import { PoPasswordComponent } from './po-password/po-password.component';
import { PoSelectComponent } from './po-select/po-select.component';
import { PoTextareaComponent } from './po-textarea/po-textarea.component';
import { PoUploadComponent } from './po-upload/po-upload.component';
import { PoUploadDragDropComponent } from './po-upload/po-upload-drag-drop/po-upload-drag-drop.component';
import { PoUploadDragDropDirective } from './po-upload/po-upload-drag-drop/po-upload-drag-drop.directive';
import { PoUploadDragDropAreaOverlayComponent } from './po-upload/po-upload-drag-drop/po-upload-drag-drop-area-overlay/po-upload-drag-drop-area-overlay.component';
import { PoUploadDragDropAreaComponent } from './po-upload/po-upload-drag-drop/po-upload-drag-drop-area/po-upload-drag-drop-area.component';
import { PoUploadFileRestrictionsComponent } from './po-upload/po-upload-file-restrictions/po-upload-file-restrictions.component';
import { PoUrlComponent } from './po-url/po-url.component';
import { PoCheckboxModule } from './po-checkbox/po-checkbox.module';
import { PoSwitchModule } from './po-switch/po-switch.module';
import { PoLabelModule } from '../po-label';

/**
 * @description
 *
 * Módulo dos componentes: po-checkbox, po-checkbox-group, po-combo, po-datepicker, po-datepicker-range, po-email, po-input,
 * po-lookup, po-number, po-multiselect, po-password, po-radio-group, po-select, po-switch, po-textarea, po-upload
 * e po-url.
 *
 * > Não esqueça de importar o módulo `FormsModule` para usar os componentes de formulários e caso esteja trabalhando com
 * > formulários reativos, importe o módulo `ReactiveFormsModule`, ambos nativos do Angular.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FormsModule.withConfig({
      callSetDisabledState: 'whenDisabledForLegacyCode'
    }),
    OverlayModule,
    PoButtonGroupModule,
    PoButtonModule,
    PoCleanModule,
    PoCalendarModule,
    PoCheckboxGroupModule,
    PoRadioGroupModule,
    PoContainerModule,
    PoDatepickerModule,
    PoDisclaimerGroupModule,
    PoDisclaimerModule,
    PoFieldContainerModule,
    PoLoadingModule,
    PoModalModule,
    PoProgressModule,
    PoServicesModule,
    PoTableModule,
    PoTooltipModule,
    PoIconModule,
    PoCheckboxModule,
    PoRadioModule,
    PoLabelModule,
    PoListBoxModule,
    PoSwitchModule
  ],
  exports: [
    PoCheckboxGroupModule,
    PoRadioGroupModule,
    PoCleanModule,
    PoDatepickerModule,
    PoComboComponent,
    PoComboOptionTemplateDirective,
    PoMultiselectOptionTemplateDirective,
    PoDecimalComponent,
    PoDatepickerRangeComponent,
    PoEmailComponent,
    PoFieldContainerModule,
    PoInputComponent,
    PoLoginComponent,
    PoLookupComponent,
    PoLookupModalComponent,
    PoMultiselectComponent,
    PoNumberComponent,
    PoPasswordComponent,
    PoRichTextComponent,
    PoSelectComponent,
    PoTextareaComponent,
    PoUploadComponent,
    PoUrlComponent,
    PoCheckboxModule,
    PoRadioModule,
    PoLabelModule,
    PoSwitchModule
  ],
  declarations: [
    PoComboComponent,
    PoComboOptionTemplateDirective,
    PoMultiselectOptionTemplateDirective,
    PoDecimalComponent,
    PoDatepickerRangeComponent,
    PoEmailComponent,
    PoInputComponent,
    PoLoginComponent,
    PoLookupComponent,
    PoLookupModalComponent,
    PoMultiselectComponent,
    PoMultiselectDropdownComponent,
    PoMultiselectSearchComponent,
    PoNumberComponent,
    PoPasswordComponent,
    PoRichTextBodyComponent,
    PoRichTextComponent,
    PoRichTextImageModalComponent,
    PoRichTextLinkModalComponent,
    PoRichTextToolbarComponent,
    PoSelectComponent,
    PoTextareaComponent,
    PoUploadComponent,
    PoUploadDragDropComponent,
    PoUploadDragDropDirective,
    PoUploadDragDropAreaOverlayComponent,
    PoUploadDragDropAreaComponent,
    PoUploadFileRestrictionsComponent,
    PoUrlComponent
  ],
  providers: []
})
export class PoFieldModule {}
