import { BrowserModule } from '@angular/platform-browser';
import { DoBootstrap, NgModule, Injector, inject } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import {
  PoAccordionComponent,
  PoAccordionItemComponent,
  PoAccordionModule,
  PoAvatarComponent,
  PoBadgeComponent,
  PoBreadcrumbComponent,
  PoButtonComponent,
  PoButtonGroupComponent,
  PoCalendarComponent,
  PoChartComponent,
  PoCheckboxComponent,
  PoCheckboxGroupComponent,
  PoComboComponent,
  PoContainerComponent,
  PoDatepickerComponent,
  PoDatepickerRangeComponent,
  PoDecimalComponent,
  PoDisclaimerComponent,
  PoDisclaimerGroupComponent,
  PoDividerComponent,
  PoDropdownComponent,
  PoDynamicContainerComponent,
  PoDynamicFormComponent,
  PoDynamicViewComponent,
  PoEmailComponent,
  PoGaugeComponent,
  PoIconComponent,
  PoImageComponent,
  PoInfoComponent,
  PoInputComponent,
  PoLabelComponent,
  PoLanguageService,
  PoLinkComponent,
  PoListViewComponent,
  PoLoginComponent,
  PoLookupComponent,
  PoMenuComponent,
  PoMenuPanelComponent,
  PoModalComponent,
  PoModule,
  PoMultiselectComponent,
  PoNavbarComponent,
  PoNumberComponent,
  PoPageDefaultComponent,
  PoPasswordComponent,
  PoProgressComponent,
  PoRadioComponent,
  PoRadioGroupComponent,
  PoRichTextComponent,
  PoSearchComponent,
  PoSelectComponent,
  PoSlideComponent,
  PoStepperComponent,
  PoSwitchComponent,
  PoTableComponent,
  PoTabsComponent,
  PoTagComponent,
  PoTextareaComponent,
  PoTimePipe,
  PoToasterComponent,
  PoToolbarComponent,
  PoTooltipDirective,
  PoTreeViewComponent,
  PoUploadComponent,
  PoUrlComponent,
  PoWidgetComponent
} from '../../../ui/src/lib';
import { PoAccordionService } from '../../../ui/src/lib/components/po-accordion/services/po-accordion.service';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { PoAccordionItemBodyComponent } from '../../../ui/src/lib/components/po-accordion/po-accordion-item-body/po-accordion-item-body.component';
import { PoAccordionItemHeaderComponent } from '../../../ui/src/lib/components/po-accordion/po-accordion-item-header/po-accordion-item-header.component';
import { PoAccordionManagerComponent } from '../../../ui/src/lib/components/po-accordion/po-accordion-manager/po-accordion-manager.component';
import { HttpClient } from '@angular/common/http';
import { PoBreadcrumbFavoriteComponent } from '../../../ui/src/lib/components/po-breadcrumb/po-breadcrumb-favorite/po-breadcrumb-favorite.component';
import { PoCalendarHeaderComponent } from '../../../ui/src/lib/components/po-calendar/po-calendar-header/po-calendar-header.component';
import { PoCalendarWrapperComponent } from '../../../ui/src/lib/components/po-calendar/po-calendar-wrapper/po-calendar-wrapper.component';
import { PoChartAreaComponent } from '../../../ui/src/lib/components/po-chart/po-chart-container/po-chart-line/po-chart-area/po-chart-area.component';
import { FormsModule } from '@angular/forms';
import { PoResizeObserverDirective } from '../../../ui/src/lib/components/po-chart/directives/po-resize-observer.directive';
import { PoChartAxisLabelComponent } from '../../../ui/src/lib/components/po-chart/po-chart-container/po-chart-axis/po-chart-axis-label/po-chart-axis-label.component';
import { PoChartAxisPathComponent } from '../../../ui/src/lib/components/po-chart/po-chart-container/po-chart-axis/po-chart-axis-path/po-chart-axis-path.component';
import { PoChartAxisComponent } from '../../../ui/src/lib/components/po-chart/po-chart-container/po-chart-axis/po-chart-axis.component';
import { PoChartBarPathComponent } from '../../../ui/src/lib/components/po-chart/po-chart-container/po-chart-bar/po-chart-bar-path/po-chart-bar-path.component';
import { PoChartBarComponent } from '../../../ui/src/lib/components/po-chart/po-chart-container/po-chart-bar/po-chart-bar.component';
import { PoChartColumnComponent } from '../../../ui/src/lib/components/po-chart/po-chart-container/po-chart-bar/po-chart-column/po-chart-column.component';
import { PoChartCircularLabelComponent } from '../../../ui/src/lib/components/po-chart/po-chart-container/po-chart-circular/po-chart-circular-label/po-chart-circular-label.component';
import { PoChartCircularPathComponent } from '../../../ui/src/lib/components/po-chart/po-chart-container/po-chart-circular/po-chart-circular-path/po-chart-circular-path.component';
import { PoChartTooltipDirective } from '../../../ui/src/lib/components/po-chart/po-chart-container/po-chart-circular/po-chart-circular-path/po-chart-tooltip.directive';
import { PoChartDonutComponent } from '../../../ui/src/lib/components/po-chart/po-chart-container/po-chart-circular/po-chart-donut/po-chart-donut.component';
import { PoChartPieComponent } from '../../../ui/src/lib/components/po-chart/po-chart-container/po-chart-circular/po-chart-pie/po-chart-pie.component';
import { PoChartContainerComponent } from '../../../ui/src/lib/components/po-chart/po-chart-container/po-chart-container.component';
import { PoChartLineComponent } from '../../../ui/src/lib/components/po-chart/po-chart-container/po-chart-line/po-chart-line.component';
import { PoChartPathComponent } from '../../../ui/src/lib/components/po-chart/po-chart-container/po-chart-line/po-chart-path/po-chart-path.component';
import { PoChartSeriesPointComponent } from '../../../ui/src/lib/components/po-chart/po-chart-container/po-chart-line/po-chart-series-point/po-chart-series-point.component';
import { PoChartLegendComponent } from '../../../ui/src/lib/components/po-chart/po-chart-legend/po-chart-legend.component';
import { PoDisclaimerRemoveComponent } from '../../../ui/src/lib/components/po-disclaimer-group/po-disclaimer-remove/po-disclaimer-remove.component';
import { PoDynamicFormFieldsComponent } from '../../../ui/src/lib/components/po-dynamic/po-dynamic-form/po-dynamic-form-fields/po-dynamic-form-fields.component';
import { PoDynamicFormLoadService } from '../../../ui/src/lib/components/po-dynamic/po-dynamic-form/po-dynamic-form-load/po-dynamic-form-load.service';
import { PoDynamicFormValidationService } from '../../../ui/src/lib/components/po-dynamic/po-dynamic-form/po-dynamic-form-validation/po-dynamic-form-validation.service';
import { PoDynamicViewService } from '../../../ui/src/lib/components/po-dynamic/po-dynamic-view/services/po-dynamic-view.service';
import { PoComboFilterService } from '../../../ui/src/lib/components/po-field/po-combo/po-combo-filter.service';
import { PoMultiselectFilterService } from '../../../ui/src/lib/components/po-field/po-multiselect/po-multiselect-filter.service';
// import { PoAccordionModule } from '../../../../dist/ng-components';

@NgModule({
  declarations: [
    // PoAccordionComponent,
    // PoAccordionItemBodyComponent,
    // PoAccordionItemComponent,
    // PoAccordionItemHeaderComponent,
    // PoAccordionManagerComponent,
    // PoAvatarComponent,
    // PoBadgeComponent,
    // PoBreadcrumbComponent,
    // PoBreadcrumbFavoriteComponent,
    // PoButtonComponent,
    // PoButtonGroupComponent,
    // PoCalendarComponent,
    // PoCalendarHeaderComponent,
    // PoCalendarWrapperComponent,
    // PoChartAreaComponent,
    // PoChartAxisComponent,
    // PoChartAxisPathComponent,
    // PoChartAxisLabelComponent,
    // PoChartComponent,
    // PoChartContainerComponent,
    // PoChartLegendComponent,
    // PoChartLineComponent,
    // PoChartPathComponent,
    // PoChartPieComponent,
    // PoChartDonutComponent,
    // PoChartSeriesPointComponent,
    // PoChartBarComponent,
    // PoChartColumnComponent,
    // PoChartBarPathComponent,
    // PoChartCircularPathComponent,
    // PoChartCircularLabelComponent,
    // PoChartTooltipDirective,
    // PoResizeObserverDirective,
    // PoContainerComponent,
    // PoDisclaimerComponent,
    // PoDisclaimerGroupComponent,
    // PoDisclaimerRemoveComponent,
    // PoDividerComponent,
    // PoDropdownComponent,
    // PoDynamicFormComponent,
    // PoDynamicFormFieldsComponent,
    // PoDynamicViewComponent,
    // PoDynamicContainerComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    // HttpClient,
    FormsModule,
    PoAccordionModule
  ],
  exports: [
    // PoAccordionComponent,
    // PoAccordionItemComponent,
    // PoAvatarComponent,
    // PoBadgeComponent,
    // PoBreadcrumbComponent,
    // PoButtonComponent,
    // PoButtonGroupComponent,
    // PoCalendarComponent,
    // PoChartComponent,
    // PoContainerComponent,
    // PoDisclaimerComponent,
    // PoDisclaimerGroupComponent,
    // PoDividerComponent,
    // PoDropdownComponent,
    // PoDynamicFormComponent,
    // PoDynamicViewComponent,
    // PoDynamicContainerComponent,
  ],
  providers: [
    PoAccordionService,
    PoLanguageService
    // CurrencyPipe,
    // DatePipe,
    // DecimalPipe,
    // PoTimePipe,
    // TitleCasePipe,
    // PoDynamicFormLoadService,
    // PoDynamicFormValidationService,
    // PoDynamicViewService,
    // PoComboFilterService,
    // PoMultiselectFilterService
  ]
})
export class AppModule implements DoBootstrap {
  private _injector = inject(Injector);

  // constructor(private injector: Injector,
  // ) {

  // const poCalendarElement = createCustomElement(PoCalendarComponent, {injector: this._injector});
  // customElements.define('po-calendar', poCalendarElement);

  // const poChartElement = createCustomElement(PoChartComponent, {injector: this._injector});
  // customElements.define('po-chart', poChartElement);

  // const poDisclaimerElement = createCustomElement(PoDisclaimerComponent, {injector: this._injector});
  // customElements.define('po-disclaimer', poDisclaimerElement);

  // const poDisclaimerGroupElement = createCustomElement(PoDisclaimerGroupComponent, {injector: this._injector});
  // customElements.define('po-disclaimer-group', poDisclaimerGroupElement);

  // const poDividerElement = createCustomElement(PoDividerComponent, {injector: this._injector});
  // customElements.define('po-divider', poDividerElement);

  // const poDropdownElement = createCustomElement(PoDropdownComponent, {injector: this._injector});
  // customElements.define('po-dropdown', poDropdownElement);

  // const poDynamicFormElement = createCustomElement(PoDynamicFormComponent, {injector: this._injector});
  // customElements.define('po-dynamic-form', poDynamicFormElement);

  // const poDynamicViewElement = createCustomElement(PoDynamicViewComponent, {injector: this._injector});
  // customElements.define('po-dynamic-view', poDynamicViewElement);

  // const poCheckboxElement = createCustomElement(PoCheckboxComponent, {injector: this._injector});
  // customElements.define('po-checkbox', poCheckboxElement);

  // const poCheckboxGroupElement = createCustomElement(PoCheckboxGroupComponent, {injector: this._injector});
  // customElements.define('po-checkbox-group', poCheckboxGroupElement);

  // const poComboElement = createCustomElement(PoComboComponent, {injector: this._injector});
  // customElements.define('po-combo', poComboElement);

  // const poDatepickerElement = createCustomElement(PoDatepickerComponent, {injector: this._injector});
  // customElements.define('po-ce-datepicker', poDatepickerElement);

  // const poDatepickerRangeElement = createCustomElement(PoDatepickerRangeComponent, {injector: this._injector});
  // customElements.define('po-datepicker-range', poDatepickerRangeElement);

  // const poDecimalElement = createCustomElement(PoDecimalComponent, {injector: this._injector});
  // customElements.define('po-decimal', poDecimalElement);

  // const poEmailElement = createCustomElement(PoEmailComponent, {injector: this._injector});
  // customElements.define('po-email', poEmailElement);

  // const poInputElement = createCustomElement(PoInputComponent, {injector: this._injector});
  // customElements.define('po-input', poInputElement);

  // const poLoginElement = createCustomElement(PoLoginComponent, {injector: this._injector});
  // customElements.define('po-login', poLoginElement);

  // const poLookupElement = createCustomElement(PoLookupComponent, {injector: this._injector});
  // customElements.define('po-lookup', poLookupElement);

  // const poMultiselectElement = createCustomElement(PoMultiselectComponent, {injector: this._injector});
  // customElements.define('po-multiselect', poMultiselectElement);

  // const poNumberElement = createCustomElement(PoNumberComponent, {injector: this._injector});
  // customElements.define('po-number', poNumberElement);

  // const poPasswordElement = createCustomElement(PoPasswordComponent, {injector: this._injector});
  // customElements.define('po-password', poPasswordElement);

  // const poRadioGroupElement = createCustomElement(PoRadioGroupComponent, {injector: this._injector});
  // customElements.define('po-radio-group', poRadioGroupElement);

  // const poRichTextElement = createCustomElement(PoRichTextComponent, {injector: this._injector});
  // customElements.define('po-rich-text', poRichTextElement);

  // const poSelectElement = createCustomElement(PoSelectComponent, {injector: this._injector});
  // customElements.define('po-select', poSelectElement);

  // const poSwitchElement = createCustomElement(PoSwitchComponent, {injector: this._injector});
  // customElements.define('po-switch', poSwitchElement);

  // const poTextareaElement = createCustomElement(PoTextareaComponent, {injector: this._injector});
  // customElements.define('po-textarea', poTextareaElement);

  // const poUploadElement = createCustomElement(PoUploadComponent, {injector: this._injector});
  // customElements.define('po-upload', poUploadElement);

  // const poUrlElement = createCustomElement(PoUrlComponent, {injector: this._injector});
  // customElements.define('po-url', poUrlElement);

  // const poGaugeElement = createCustomElement(PoGaugeComponent, {injector: this._injector});
  // customElements.define('po-gauge', poGaugeElement);

  // const poImageElement = createCustomElement(PoImageComponent, {injector: this._injector});
  // customElements.define('po-image', poImageElement);

  // const poLinkElement = createCustomElement(PoLinkComponent, {injector: this._injector});
  // customElements.define('po-link', poLinkElement);

  // const poListViewElement = createCustomElement(PoListViewComponent, {injector: this._injector});
  // customElements.define('po-list-view', poListViewElement);

  // const poMenuElement = createCustomElement(PoMenuComponent, {injector: this._injector});
  // customElements.define('po-menu', poMenuElement);

  // const poMenuPanelElement = createCustomElement(PoMenuPanelComponent, {injector: this._injector});
  // customElements.define('po-menu-panel', poMenuPanelElement);

  // const poModalElement = createCustomElement(PoModalComponent, {injector: this._injector});
  // customElements.define('po-modal', poModalElement);

  // const poNavbarElement = createCustomElement(PoNavbarComponent, {injector: this._injector});
  // customElements.define('po-navbar', poNavbarElement);

  // const poProgressElement = createCustomElement(PoProgressComponent, {injector: this._injector});
  // customElements.define('po-progress', poProgressElement);

  // const poSearchElement = createCustomElement(PoSearchComponent, {injector: this._injector});
  // customElements.define('po-search', poSearchElement);

  // const poSlideElement = createCustomElement(PoSlideComponent, {injector: this._injector});
  // customElements.define('po-slide', poSlideElement);

  // const poStepperElement = createCustomElement(PoStepperComponent, {injector: this._injector});
  // customElements.define('po-stepper', poStepperElement);

  // const poTableElement = createCustomElement(PoTableComponent, {injector: this._injector});
  // customElements.define('po-table', poTableElement);

  // const poTabsElement = createCustomElement(PoTabsComponent, { injector: this._injector });
  // customElements.define('po-tabs', poTabsElement);

  // const poToasterElement = createCustomElement(PoToasterComponent, { injector: this._injector });
  // customElements.define('po-toaster', poToasterElement);

  // const poToolbarElement = createCustomElement(PoToolbarComponent, { injector: this._injector });
  // customElements.define('po-toolbar', poToolbarElement);

  // const poTreeViewElement = createCustomElement(PoTreeViewComponent, { injector: this._injector });
  // customElements.define('po-tree-view', poTreeViewElement);

  // const poWidgetElement = createCustomElement(PoWidgetComponent, { injector: this._injector });
  // customElements.define('po-widget', poWidgetElement);
  // }

  public ngDoBootstrap() {
    // const poAccordionItemElement = createCustomElement(PoAccordionItemComponent, {injector: this._injector});
    // customElements.define('po-ce-accordion-item', poAccordionItemElement);

    // const poAccordionElement = createCustomElement(PoAccordionComponent, {injector: this._injector});
    // customElements.define('po-ce-accordion', poAccordionElement);

    // const poAccordionItemBodyElement = createCustomElement(PoAccordionItemBodyComponent, {injector: this._injector});
    // customElements.define('po-ce-accordion-item-body', poAccordionItemBodyElement);

    // const poAccordionItemHeaderElement = createCustomElement(PoAccordionItemHeaderComponent, {injector: this._injector});
    // customElements.define('po-ce-accordion-item-header', poAccordionItemHeaderElement);

    // const poAccordionManagerElement = createCustomElement(PoAccordionManagerComponent, {injector: this._injector});
    // customElements.define('po-ce-accordion-menager', poAccordionManagerElement);

    const poTagElement = createCustomElement(PoTagComponent, { injector: this._injector });
    customElements.define('po-tag', poTagElement);

    const poAvatarElement = createCustomElement(PoAvatarComponent, { injector: this._injector });
    customElements.define('po-avatar', poAvatarElement);

    const poContainerElement = createCustomElement(PoContainerComponent, { injector: this._injector });
    customElements.define('po-container', poContainerElement);

    const poBadgeElement = createCustomElement(PoBadgeComponent, { injector: this._injector });
    customElements.define('po-badge', poBadgeElement);

    const poInfoElement = createCustomElement(PoInfoComponent, { injector: this._injector });
    customElements.define('po-info', poInfoElement);

    const poPageDefaultElement = createCustomElement(PoPageDefaultComponent, { injector: this._injector });
    customElements.define('po-page-default', poPageDefaultElement);

    const poBreadcrumbElement = createCustomElement(PoBreadcrumbComponent, { injector: this._injector });
    customElements.define('po-breadcrumb', poBreadcrumbElement);

    const poButtonElement = createCustomElement(PoButtonComponent, { injector: this._injector });
    customElements.define('po-ce-button', poButtonElement);

    const poButtonGroupElement = createCustomElement(PoButtonGroupComponent, { injector: this._injector });
    customElements.define('po-button-group', poButtonGroupElement);
  }
}
