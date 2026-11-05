import { Component, Type } from '@angular/core';

import { PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { PoCodeEditorModule } from '@po-ui/ng-code-editor';

/**
 * Wrappers standalone (POC) que reproduzem o exemplo "basic" de cada componente,
 * para renderização dentro dos cards da listagem.
 *
 * GERADO a partir dos templates estáticos (sem lógica no .ts e sem bindings
 * dinâmicos) dos samples basic oficiais. Ficam de fora: componentes de página
 * inteira, os que dependem de outro módulo (ex.: code-editor) e os que fazem
 * chamada a API externa (lookup/upload/page-dynamic-table). Esses mantêm o
 * preview textual.
 *
 * Carregado dinamicamente (import()) pela diretiva de host -> chunk separado.
 */

@Component({
  selector: 'app-preview-po-accordion',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-accordion>
      <po-accordion-item p-label="PO Accordion 1">
        <p class="po-text-color-neutral-dark-40">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </po-accordion-item>
      <po-accordion-item p-label="PO Accordion 2">
        <p class="po-text-color-neutral-dark-40">
          In rhoncus condimentum elit, egestas efficitur orci tincidunt a. Etiam ut neque
        </p>
      </po-accordion-item>
    </po-accordion>
  `
})
export class PreviewPoAccordionComponent {}

@Component({
  selector: 'app-preview-po-avatar',
  standalone: true,
  imports: [PoModule],
  template: `<po-avatar p-src="https://po-ui.io/assets/graphics/logo-po.png"></po-avatar>`
})
export class PreviewPoAvatarComponent {}

@Component({
  selector: 'app-preview-po-badge',
  standalone: true,
  imports: [PoModule],
  template: `<po-badge></po-badge>`
})
export class PreviewPoBadgeComponent {}

@Component({
  selector: 'app-preview-po-calendar',
  standalone: true,
  imports: [PoModule],
  template: `<po-calendar></po-calendar>`
})
export class PreviewPoCalendarComponent {}

@Component({
  selector: 'app-preview-po-checkbox',
  standalone: true,
  imports: [PoModule],
  template: `<po-checkbox name="checkbox" p-label="PO Checkbox"></po-checkbox>`
})
export class PreviewPoCheckboxComponent {}

@Component({
  selector: 'app-preview-po-container',
  standalone: true,
  imports: [PoModule],
  template: `<po-container></po-container>`
})
export class PreviewPoContainerComponent {}

@Component({
  selector: 'app-preview-po-context-tabs',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-context-tabs>
      <po-tab p-label="PO Tabs 1"></po-tab>
      <po-tab p-label="PO Tabs 2"></po-tab>
    </po-context-tabs>
  `
})
export class PreviewPoContextTabsComponent {}

@Component({
  selector: 'app-preview-po-datepicker-range',
  standalone: true,
  imports: [PoModule],
  template: `<po-datepicker-range name="datepickerRange" p-label="PO Datepicker Range"></po-datepicker-range>`
})
export class PreviewPoDatepickerRangeComponent {}

@Component({
  selector: 'app-preview-po-datepicker',
  standalone: true,
  imports: [PoModule],
  template: `<po-datepicker name="datepicker" p-label="PO Datepicker"></po-datepicker>`
})
export class PreviewPoDatepickerComponent {}

@Component({
  selector: 'app-preview-po-datetimepicker',
  standalone: true,
  imports: [PoModule],
  template: `<po-datetimepicker name="datetimepicker" p-label="PO Datetimepicker"></po-datetimepicker>`
})
export class PreviewPoDatetimepickerComponent {}

@Component({
  selector: 'app-preview-po-decimal',
  standalone: true,
  imports: [PoModule],
  template: `<po-decimal name="decimal" p-label="PO Decimal"></po-decimal>`
})
export class PreviewPoDecimalComponent {}

@Component({
  selector: 'app-preview-po-divider',
  standalone: true,
  imports: [PoModule],
  template: `<po-divider></po-divider>`
})
export class PreviewPoDividerComponent {}

@Component({
  selector: 'app-preview-po-email',
  standalone: true,
  imports: [PoModule],
  template: `<po-email name="email" p-label="PO Email"></po-email>`
})
export class PreviewPoEmailComponent {}

@Component({
  selector: 'app-preview-po-filter-chip',
  standalone: true,
  imports: [PoModule],
  template: `<po-filter-chip p-label="Filter"></po-filter-chip>`
})
export class PreviewPoFilterChipComponent {}

@Component({
  selector: 'app-preview-po-info',
  standalone: true,
  imports: [PoModule],
  template: `<po-info p-label="PO Info" p-value="Value"></po-info>`
})
export class PreviewPoInfoComponent {}

@Component({
  selector: 'app-preview-po-input',
  standalone: true,
  imports: [PoModule],
  template: `<po-input name="input" p-label="PO Input"></po-input>`
})
export class PreviewPoInputComponent {}

@Component({
  selector: 'app-preview-po-link',
  standalone: true,
  imports: [PoModule],
  template: `<po-link p-label="PO Link" p-url="https://po-ui.io"></po-link>`
})
export class PreviewPoLinkComponent {}

@Component({
  selector: 'app-preview-po-loading-overlay',
  standalone: true,
  imports: [PoModule],
  template: `
    <div class="sample-container" style="position: relative;">
      <po-loading-overlay></po-loading-overlay>
    </div>
  `
})
export class PreviewPoLoadingOverlayComponent {}

@Component({
  selector: 'app-preview-po-number',
  standalone: true,
  imports: [PoModule],
  template: `<po-number name="number" p-label="PO Number"></po-number>`
})
export class PreviewPoNumberComponent {}

@Component({
  selector: 'app-preview-po-password',
  standalone: true,
  imports: [PoModule],
  template: `<po-password name="password" p-label="PO Password"></po-password>`
})
export class PreviewPoPasswordComponent {}

@Component({
  selector: 'app-preview-po-rich-text',
  standalone: true,
  imports: [PoModule],
  template: `<po-rich-text></po-rich-text>`
})
export class PreviewPoRichTextComponent {}

@Component({
  selector: 'app-preview-po-search',
  standalone: true,
  imports: [PoModule],
  template: `<po-search></po-search>`
})
export class PreviewPoSearchComponent {}

@Component({
  selector: 'app-preview-po-skeleton',
  standalone: true,
  imports: [PoModule],
  template: `
    <div class="po-row">
      <po-skeleton class="po-md-12"></po-skeleton>
      <po-skeleton class="po-md-12"></po-skeleton>
      <po-skeleton class="po-md-12"></po-skeleton>
    </div>
  `
})
export class PreviewPoSkeletonComponent {}

@Component({
  selector: 'app-preview-po-switch',
  standalone: true,
  imports: [PoModule],
  template: `<po-switch name="switch" p-label="PO Switch"></po-switch>`
})
export class PreviewPoSwitchComponent {}

@Component({
  selector: 'app-preview-po-tabs',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-tabs>
      <po-tab p-label="PO Tabs 1"></po-tab>
      <po-tab p-label="PO Tabs 2"></po-tab>
    </po-tabs>
  `
})
export class PreviewPoTabsComponent {}

@Component({
  selector: 'app-preview-po-tag',
  standalone: true,
  imports: [PoModule],
  template: `<po-tag p-value="PO Tag"></po-tag>`
})
export class PreviewPoTagComponent {}

@Component({
  selector: 'app-preview-po-textarea',
  standalone: true,
  imports: [PoModule],
  template: `<po-textarea name="textarea" p-label="PO Textarea"></po-textarea>`
})
export class PreviewPoTextareaComponent {}

@Component({
  selector: 'app-preview-po-timepicker',
  standalone: true,
  imports: [PoModule],
  template: `<po-timepicker name="timepicker" p-label="PO Timepicker"></po-timepicker>`
})
export class PreviewPoTimepickerComponent {}

@Component({
  selector: 'app-preview-po-timer',
  standalone: true,
  imports: [PoModule],
  template: `<po-timer></po-timer>`
})
export class PreviewPoTimerComponent {}

@Component({
  selector: 'app-preview-po-toaster',
  standalone: true,
  imports: [PoModule],
  template: `
    <div class="po-row">
      <po-toaster class="po-md-12" p-message="Toaster Basic"></po-toaster>
    </div>
  `
})
export class PreviewPoToasterComponent {}

@Component({
  selector: 'app-preview-po-toolbar',
  standalone: true,
  imports: [PoModule],
  template: `<po-toolbar p-title="PO Toolbar"></po-toolbar>`
})
export class PreviewPoToolbarComponent {}

@Component({
  selector: 'app-preview-po-tooltip',
  standalone: true,
  imports: [PoModule],
  template: `<po-button p-label="Open Tooltip" p-tooltip="po-tooltip"></po-button>`
})
export class PreviewPoTooltipComponent {}

@Component({
  selector: 'app-preview-po-url',
  standalone: true,
  imports: [PoModule],
  template: `<po-url name="url" p-label="PO Url" p-value="https://po-ui.io"></po-url>`
})
export class PreviewPoUrlComponent {}

@Component({
  selector: 'app-preview-po-widget',
  standalone: true,
  imports: [PoModule],
  template: `<po-widget></po-widget>`
})
export class PreviewPoWidgetComponent {}

@Component({
  selector: 'app-preview-po-breadcrumb',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-breadcrumb
      [p-items]="[
        { label: 'Po Portal', link: 'portal' },
        { label: 'Po Breadcrumb', link: 'breadcrumb' }
      ]"
    >
    </po-breadcrumb>
  `
})
export class PreviewPoBreadcrumbComponent {}

@Component({
  selector: 'app-preview-po-chart',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-chart
      [p-series]="[
        { label: 'Angular', data: 100 },
        { label: 'React', data: 10 }
      ]"
    >
    </po-chart>
  `
})
export class PreviewPoChartComponent {}

@Component({
  selector: 'app-preview-po-checkbox-group',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-checkbox-group
      name="checkboxGroup"
      p-label="PO Checkbox Group"
      [p-options]="[
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' }
      ]"
    >
    </po-checkbox-group>
  `
})
export class PreviewPoCheckboxGroupComponent {}

@Component({
  selector: 'app-preview-po-combo',
  standalone: true,
  imports: [PoModule],
  template: `<po-combo name="combo" p-label="PO Combo" [p-options]="[{ value: 'Option 1' }, { value: 'Option 2' }]"></po-combo>`
})
export class PreviewPoComboComponent {}

@Component({
  selector: 'app-preview-po-disclaimer-group',
  standalone: true,
  imports: [PoModule],
  template: `<po-disclaimer-group [p-disclaimers]="[{ value: 'disclaimer' }]"></po-disclaimer-group>`
})
export class PreviewPoDisclaimerGroupComponent {}

@Component({
  selector: 'app-preview-po-dropdown',
  standalone: true,
  imports: [PoModule],
  template: `<po-dropdown p-label="PO Dropdown" [p-actions]="[{ label: 'How to install PO', url: '/guides/how-install' }]"></po-dropdown>`
})
export class PreviewPoDropdownComponent {}

@Component({
  selector: 'app-preview-po-dynamic-form',
  standalone: true,
  imports: [PoModule],
  template: `<po-dynamic-form [p-fields]="[{ property: 'name', required: true, showRequired: true }]"></po-dynamic-form>`
})
export class PreviewPoDynamicFormComponent {}

@Component({
  selector: 'app-preview-po-dynamic-view',
  standalone: true,
  imports: [PoModule],
  template: `<po-dynamic-view [p-fields]="[{ property: 'name' }]" [p-value]="{ name: 'Jhon' }"></po-dynamic-view>`
})
export class PreviewPoDynamicViewComponent {}

@Component({
  selector: 'app-preview-po-list-view',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-list-view
      [p-field-properties]="{ title: 'name' }"
      [p-items]="[
        { name: 'Register 1', email: 'register@po-ui.com' },
        { name: 'Register 2', email: 'register2@po-ui.com' }
      ]"
    >
      <ng-template p-list-view-content-template let-item>
        <div class="po-row">
          <po-info class="po-md-12" p-label="Email" [p-value]="item.email"></po-info>
        </div>
      </ng-template>
    </po-list-view>
  `
})
export class PreviewPoListViewComponent {}

@Component({
  selector: 'app-preview-po-menu-panel',
  standalone: true,
  imports: [PoModule],
  template: `
    <div class="po-wrapper-menu-panel" style="position: relative; height: 120px;">
      <po-menu-panel [p-menus]="[{ label: 'PO HTML Framework', link: '/', icon: 'an an-house-line' }]"></po-menu-panel>
    </div>
  `
})
export class PreviewPoMenuPanelComponent {}

@Component({
  selector: 'app-preview-po-progress',
  standalone: true,
  imports: [PoModule],
  template: `
    <div>
      <po-widget p-title="Bar">
        <po-progress [p-value]="25"></po-progress>
      </po-widget>
    </div>
  `
})
export class PreviewPoProgressComponent {}

@Component({
  selector: 'app-preview-po-radio-group',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-radio-group
      name="radioGroupBasic"
      p-label="PO Radio Group"
      [p-options]="[
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' }
      ]"
    >
    </po-radio-group>
  `
})
export class PreviewPoRadioGroupComponent {}

@Component({
  selector: 'app-preview-po-select',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-select
      name="select"
      p-label="PO Select"
      [p-options]="[
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' }
      ]"
    >
    </po-select>
  `
})
export class PreviewPoSelectComponent {}

@Component({
  selector: 'app-preview-po-stepper',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-stepper [p-align-center]="false">
      <po-step p-label="Step 1"></po-step>
      <po-step p-label="Step 2"></po-step>
      <po-step p-label="Step 3"></po-step>
    </po-stepper>
  `
})
export class PreviewPoStepperComponent {}

@Component({
  selector: 'app-preview-po-table',
  standalone: true,
  imports: [PoModule],
  template: `<po-table [p-items]="[{ table: 'PO Table', angular: 'PO-UI' }]"></po-table>`
})
export class PreviewPoTableComponent {}

@Component({
  selector: 'app-preview-po-tree-view',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-tree-view
      [p-items]="[
        {
          label: 'User manager',
          value: 1,
          subItems: [{ label: 'Add', value: 1.1 }]
        }
      ]"
    >
    </po-tree-view>
  `
})
export class PreviewPoTreeViewComponent {}

// --- Exemplos mínimos (não seguem o basic oficial; customizáveis depois). ---

@Component({
  selector: 'app-preview-po-accordion-item',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-accordion>
      <po-accordion-item p-label="PO Accordion Item">
        <p class="po-font-text">Conteúdo do item.</p>
      </po-accordion-item>
    </po-accordion>
  `
})
export class PreviewPoAccordionItemComponent {}

@Component({
  selector: 'app-preview-po-button',
  standalone: true,
  imports: [PoModule],
  template: `<po-button p-label="PO Button" p-kind="primary"></po-button>`
})
export class PreviewPoButtonComponent {}

@Component({
  selector: 'app-preview-po-button-group',
  standalone: true,
  imports: [PoModule],
  template: `<po-button-group [p-buttons]="[{ label: 'Um', action: noop }, { label: 'Dois', action: noop }]"></po-button-group>`
})
export class PreviewPoButtonGroupComponent {
  noop = () => {};
}

@Component({
  selector: 'app-preview-po-code-editor',
  standalone: true,
  imports: [PoCodeEditorModule],
  template: `<po-code-editor p-height="200"></po-code-editor>`
})
export class PreviewPoCodeEditorComponent {}

@Component({
  selector: 'app-preview-po-code-editor-register',
  standalone: true,
  imports: [PoCodeEditorModule],
  template: `<po-code-editor p-height="200" p-language="terraform"></po-code-editor>`
})
export class PreviewPoCodeEditorRegisterComponent {}

@Component({
  selector: 'app-preview-po-context-menu',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-context-menu [p-items]="[{ label: 'Editar', action: noop }, { label: 'Remover', action: noop }]">
      <div class="po-font-text">Clique com o botão direito</div>
    </po-context-menu>
  `
})
export class PreviewPoContextMenuComponent {
  noop = () => {};
}

@Component({
  selector: 'app-preview-po-grid',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-grid
      [p-columns]="[{ property: 'id', label: 'ID' }, { property: 'name', label: 'Nome' }]"
      [p-data]="[{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]"
    >
    </po-grid>
  `
})
export class PreviewPoGridComponent {}

@Component({
  selector: 'app-preview-po-header',
  standalone: true,
  imports: [PoModule],
  template: `
  <po-page-default>
    <po-header style="--nav-position: flex" [p-brand]="{ title: 'PO Header' }"></po-header>
  </po-page-default>
  `
})
export class PreviewPoHeaderComponent {}

@Component({
  selector: 'app-preview-po-helper',
  standalone: true,
  imports: [PoModule],
  template: `<po-helper [p-helper]="{ title: 'PO Helper' }"></po-helper>`
})
export class PreviewPoHelperComponent {}

@Component({
  selector: 'app-preview-po-image',
  standalone: true,
  imports: [PoModule],
  template: `<po-image p-src="https://po-ui.io/assets/graphics/logo-po.png" p-alt="PO Image" [p-height]="120"></po-image>`
})
export class PreviewPoImageComponent {}

@Component({
  selector: 'app-preview-po-login',
  standalone: true,
  imports: [PoModule],
  template: `<po-login name="login" p-label="PO Login"></po-login>`
})
export class PreviewPoLoginComponent {}

@Component({
  selector: 'app-preview-po-lookup',
  standalone: true,
  imports: [PoModule],
  template: `<po-lookup name="lookup" p-label="PO Lookup" p-field-label="label" p-field-value="value"></po-lookup>`
})
export class PreviewPoLookupComponent {}

@Component({
  selector: 'app-preview-po-menu',
  standalone: true,
  imports: [PoModule],
  template: `
    <div class="po-wrapper" style="position: relative">
      <po-menu [p-menus]="[{ label: 'Home', link: '/' }, { label: 'Sobre', link: '/about' }]"></po-menu>
    </div>
  `
})
export class PreviewPoMenuComponent {}

@Component({
  selector: 'app-preview-po-modal',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-modal #modal p-title="PO Modal">We are TOTVS!</po-modal>
    <po-button p-label="Abrir modal" (p-click)="modal.open()"></po-button>
  `
})
export class PreviewPoModalComponent {}

@Component({
  selector: 'app-preview-po-modal-footer',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-modal #modal p-title="PO Modal Footer">
      Conteúdo
      <po-modal-footer>
        <po-button p-label="OK" (p-click)="modal.close()"></po-button>
      </po-modal-footer>
    </po-modal>
    <po-button p-label="Abrir modal" (p-click)="modal.open()"></po-button>
  `
})
export class PreviewPoModalFooterComponent {}

@Component({
  selector: 'app-preview-po-modal-password-recovery',
  standalone: true,
  imports: [PoModule, PoTemplatesModule],
  template: `
    <po-modal-password-recovery #recovery></po-modal-password-recovery>
    <po-button p-label="Recuperar senha" (p-click)="recovery.open()"></po-button>
  `
})
export class PreviewPoModalPasswordRecoveryComponent {}

@Component({
  selector: 'app-preview-po-multiselect',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-multiselect
      name="multiselect"
      p-label="PO Multiselect"
      [p-options]="[{ value: '1', label: 'Um' }, { value: '2', label: 'Dois' }]"
    >
    </po-multiselect>
  `
})
export class PreviewPoMultiselectComponent {}

@Component({
  selector: 'app-preview-po-popover',
  standalone: true,
  imports: [PoModule],
  template: `
    <div #target class="po-font-text">Alvo do popover</div>
    <po-popover [p-target]="target" p-title="PO Popover">Conteúdo do popover.</po-popover>
  `
})
export class PreviewPoPopoverComponent {}

@Component({
  selector: 'app-preview-po-popup',
  standalone: true,
  imports: [PoModule],
  template: `
    <div #target class="po-clickable po-font-text" (click)="popup.toggle()">Abrir Popup</div>
    <po-popup #popup [p-actions]="[{ label: 'Ação 1' }, { label: 'Ação 2' }]" [p-target]="target"></po-popup>
  `
})
export class PreviewPoPopupComponent {}

@Component({
  selector: 'app-preview-po-search-ai',
  standalone: true,
  imports: [PoModule],
  template: `<po-search-ai name="searchAi" p-label="PO Search A.I."></po-search-ai>`
})
export class PreviewPoSearchAiComponent {}

@Component({
  selector: 'app-preview-po-slide',
  standalone: true,
  imports: [PoModule],
  template: `<po-slide [p-slides]="['https://po-ui.io/assets/graphics/logo-po.png']"></po-slide>`
})
export class PreviewPoSlideComponent {}

@Component({
  selector: 'app-preview-po-step',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-stepper>
      <po-step p-label="Passo 1"></po-step>
      <po-step p-label="Passo 2"></po-step>
    </po-stepper>
  `
})
export class PreviewPoStepComponent {}

@Component({
  selector: 'app-preview-po-tab',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-tabs>
      <po-tab p-label="Aba 1"></po-tab>
      <po-tab p-label="Aba 2"></po-tab>
    </po-tabs>
  `
})
export class PreviewPoTabComponent {}

@Component({
  selector: 'app-preview-po-upload',
  standalone: true,
  imports: [PoModule],
  template: `<po-upload name="upload" p-label="PO Upload"></po-upload>`
})
export class PreviewPoUploadComponent {}

/**
 * Mapa `name do componente` -> wrapper. Chaves batem com `item.name`.
 */
export const PREVIEW_SAMPLES: Record<string, Type<unknown>> = {
  'po-accordion': PreviewPoAccordionComponent,
  'po-accordion-item': PreviewPoAccordionItemComponent,
  'po-avatar': PreviewPoAvatarComponent,
  'po-badge': PreviewPoBadgeComponent,
  'po-breadcrumb': PreviewPoBreadcrumbComponent,
  'po-button': PreviewPoButtonComponent,
  'po-button-group': PreviewPoButtonGroupComponent,
  'po-calendar': PreviewPoCalendarComponent,
  'po-chart': PreviewPoChartComponent,
  'po-checkbox': PreviewPoCheckboxComponent,
  'po-checkbox-group': PreviewPoCheckboxGroupComponent,
  'po-code-editor': PreviewPoCodeEditorComponent,
  'po-code-editor-register': PreviewPoCodeEditorRegisterComponent,
  'po-combo': PreviewPoComboComponent,
  'po-container': PreviewPoContainerComponent,
  'po-context-menu': PreviewPoContextMenuComponent,
  'po-context-tabs': PreviewPoContextTabsComponent,
  'po-datepicker-range': PreviewPoDatepickerRangeComponent,
  'po-datepicker': PreviewPoDatepickerComponent,
  'po-datetimepicker': PreviewPoDatetimepickerComponent,
  'po-decimal': PreviewPoDecimalComponent,
  'po-disclaimer-group': PreviewPoDisclaimerGroupComponent,
  'po-divider': PreviewPoDividerComponent,
  'po-dropdown': PreviewPoDropdownComponent,
  'po-dynamic-form': PreviewPoDynamicFormComponent,
  'po-dynamic-view': PreviewPoDynamicViewComponent,
  'po-email': PreviewPoEmailComponent,
  'po-filter-chip': PreviewPoFilterChipComponent,
  'po-grid': PreviewPoGridComponent,
  'po-header': PreviewPoHeaderComponent,
  'po-helper': PreviewPoHelperComponent,
  'po-image': PreviewPoImageComponent,
  'po-info': PreviewPoInfoComponent,
  'po-input': PreviewPoInputComponent,
  'po-link': PreviewPoLinkComponent,
  'po-list-view': PreviewPoListViewComponent,
  'po-loading-overlay': PreviewPoLoadingOverlayComponent,
  'po-login': PreviewPoLoginComponent,
  'po-lookup': PreviewPoLookupComponent,
  'po-menu': PreviewPoMenuComponent,
  'po-menu-panel': PreviewPoMenuPanelComponent,
  'po-modal': PreviewPoModalComponent,
  'po-modal-footer': PreviewPoModalFooterComponent,
  'po-modal-password-recovery': PreviewPoModalPasswordRecoveryComponent,
  'po-multiselect': PreviewPoMultiselectComponent,
  'po-number': PreviewPoNumberComponent,
  'po-password': PreviewPoPasswordComponent,
  'po-popover': PreviewPoPopoverComponent,
  'po-popup': PreviewPoPopupComponent,
  'po-progress': PreviewPoProgressComponent,
  'po-radio-group': PreviewPoRadioGroupComponent,
  'po-rich-text': PreviewPoRichTextComponent,
  'po-search': PreviewPoSearchComponent,
  'po-search-ai': PreviewPoSearchAiComponent,
  'po-select': PreviewPoSelectComponent,
  'po-skeleton': PreviewPoSkeletonComponent,
  'po-slide': PreviewPoSlideComponent,
  'po-step': PreviewPoStepComponent,
  'po-stepper': PreviewPoStepperComponent,
  'po-switch': PreviewPoSwitchComponent,
  'po-tab': PreviewPoTabComponent,
  'po-table': PreviewPoTableComponent,
  'po-tabs': PreviewPoTabsComponent,
  'po-tag': PreviewPoTagComponent,
  'po-textarea': PreviewPoTextareaComponent,
  'po-timepicker': PreviewPoTimepickerComponent,
  'po-timer': PreviewPoTimerComponent,
  'po-toaster': PreviewPoToasterComponent,
  'po-toolbar': PreviewPoToolbarComponent,
  'po-tooltip': PreviewPoTooltipComponent,
  'po-tree-view': PreviewPoTreeViewComponent,
  'po-upload': PreviewPoUploadComponent,
  'po-url': PreviewPoUrlComponent,
  'po-widget': PreviewPoWidgetComponent
};
