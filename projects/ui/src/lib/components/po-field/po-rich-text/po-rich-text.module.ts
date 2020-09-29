import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PoRichTextComponent } from './po-rich-text.component';
import { PoRichTextService } from './po-rich-text.service';
import { PoRichTextToolbarComponent } from './po-rich-text-toolbar/po-rich-text-toolbar.component';
import { PoRichTextModalComponent } from './po-rich-text-modal/po-rich-text-modal.component';
import { PoRichTextBodyComponent } from './po-rich-text-body/po-rich-text-body.component';
import { PoButtonGroupModule } from '../../po-button-group/po-button-group.module';
import { PoFieldContainerModule } from '../po-field-container/po-field-container.module';
import { PoModalModule } from '../../po-modal/po-modal.module';
import { PoUrlComponent } from '../po-url/po-url.component';
import { PoTooltipModule } from '../../../directives/po-tooltip/po-tooltip.module';

@NgModule({
  imports: [CommonModule, FormsModule, PoButtonGroupModule, PoFieldContainerModule, PoModalModule, PoTooltipModule],
  declarations: [PoRichTextComponent, PoRichTextBodyComponent, PoRichTextModalComponent, PoRichTextToolbarComponent],
  exports: [PoRichTextComponent, PoRichTextBodyComponent, PoRichTextModalComponent, PoRichTextToolbarComponent]
})
export class PoRichTextModule {}
