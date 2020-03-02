import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PoFieldContainerModule } from '../po-field-container/po-field-container.module';

import { PoModalModule } from '../../po-modal/po-modal.module';
import { PoRichTextBodyComponent } from './po-rich-text-body/po-rich-text-body.component';
import { PoRichTextComponent } from './po-rich-text.component';
import { PoRichTextModalComponent } from './po-rich-text-modal/po-rich-text-modal.component';
import { PoRichTextToolbarComponent } from './po-rich-text-toolbar/po-rich-text-toolbar.component';
import { PoButtonGroupModule } from '../../po-button-group';
import { PoTooltipModule } from '../../../directives';
import { PoUploadModule } from '../po-upload/po-upload.module';
import { PoUrlModule } from '../po-url/po-url.module';
import { PoInputModule } from '../po-input/po-input.module';

/**
 * @description
 *
 * Módulo do componente `po-rich-text`.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PoModalModule,
    PoFieldContainerModule,
    PoButtonGroupModule,
    PoTooltipModule,
    PoUploadModule,
    PoUrlModule,
    PoInputModule
  ],
  exports: [
    PoRichTextComponent
  ],
  declarations: [
    PoRichTextBodyComponent,
    PoRichTextComponent,
    PoRichTextToolbarComponent,
    PoRichTextModalComponent
  ]
})
export class PoRichTextModule { }
