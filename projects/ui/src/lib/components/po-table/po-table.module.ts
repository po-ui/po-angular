import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoButtonModule } from './../po-button/po-button.module';
import { PoCheckboxGroupModule } from '../po-field/po-checkbox-group/po-checkbox-group.module';
import { PoContainerModule } from '../po-container/po-container.module';
import { PoLoadingModule } from '../po-loading/po-loading.module';
import { PoModalModule } from '../po-modal/po-modal.module';
import { PoPopoverModule } from '../po-popover/po-popover.module';
import { PoPopupModule } from './../po-popup/po-popup.module';
import { PoTimeModule } from '../../pipes/po-time/index';
import { PoTooltipModule } from '../../directives/po-tooltip/index';

import { PoTableColumnIconComponent } from './po-table-column-icon/po-table-column-icon.component';
import { PoTableColumnLabelComponent } from './po-table-column-label/po-table-column-label.component';
import { PoTableColumnLinkComponent } from './po-table-column-link/po-table-column-link.component';
import { PoTableColumnManagerComponent } from './po-table-column-manager/po-table-column-manager.component';
import { PoTableComponent } from './po-table.component';
import { PoTableDetailComponent } from './po-table-detail/po-table-detail.component';
import { PoTableIconComponent } from './po-table-icon/po-table-icon.component';
import { PoTableRowTemplateDirective } from './po-table-row-template/po-table-row-template.directive';
import { PoTableShowSubtitleComponent } from './po-table-show-subtitle/po-table-show-subtitle.component';
import { PoTableSubtitleCircleComponent } from './po-table-subtitle-circle/po-table-subtitle-circle.component';
import { PoTableSubtitleFooterComponent } from './po-table-subtitle-footer/po-table-subtitle-footer.component';
import { PoTableCellTemplateDirective } from './po-table-cell-template/po-table-cell-template.directive';
import { PoTableColumnTemplateDirective } from './po-table-column-template/po-table-column-template.directive';

/**
 * @description
 * Módulo do componente po-table
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PoButtonModule,
    PoCheckboxGroupModule,
    PoContainerModule,
    PoLoadingModule,
    PoModalModule,
    PoPopoverModule,
    PoPopupModule,
    PoTimeModule,
    PoTooltipModule
  ],
  declarations: [
    PoTableComponent,
    PoTableColumnIconComponent,
    PoTableColumnLabelComponent,
    PoTableColumnLinkComponent,
    PoTableColumnManagerComponent,
    PoTableDetailComponent,
    PoTableIconComponent,
    PoTableRowTemplateDirective,
    PoTableShowSubtitleComponent,
    PoTableSubtitleCircleComponent,
    PoTableSubtitleFooterComponent,
    PoTableCellTemplateDirective,
    PoTableColumnTemplateDirective
  ],
  exports: [
    PoTableComponent,
    PoTableRowTemplateDirective,
    PoTableCellTemplateDirective,
    PoTableColumnTemplateDirective
  ],
  providers: [DecimalPipe]
})
export class PoTableModule {}
