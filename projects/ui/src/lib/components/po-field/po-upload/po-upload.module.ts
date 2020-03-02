import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PoFieldContainerModule } from '../po-field-container/po-field-container.module';

import { PoUploadComponent } from './po-upload.component';
import { PoUploadDragDropComponent } from './po-upload-drag-drop/po-upload-drag-drop.component';
import { PoUploadDragDropDirective } from './po-upload-drag-drop/po-upload-drag-drop.directive';
import { PoUploadDragDropAreaOverlayComponent
} from './po-upload-drag-drop/po-upload-drag-drop-area-overlay/po-upload-drag-drop-area-overlay.component';
import { PoUploadDragDropAreaComponent } from './po-upload-drag-drop/po-upload-drag-drop-area/po-upload-drag-drop-area.component';
import { PoUploadFileRestrictionsComponent } from './po-upload-file-restrictions/po-upload-file-restrictions.component';
import { PoButtonModule } from '../../po-button/po-button.module';
import { PoProgressModule } from '../../po-progress';
import { PoContainerModule } from '../../po-container';
import { PoServicesModule } from '../../../services/services.module';

/**
 * @description
 *
 * Módulo do componente `po-url`.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PoButtonModule,
    PoFieldContainerModule,
    PoProgressModule,
    PoContainerModule,
    PoServicesModule
  ],
  exports: [
    PoUploadComponent
  ],
  declarations: [
    PoUploadComponent,
    PoUploadDragDropComponent,
    PoUploadDragDropDirective,
    PoUploadDragDropAreaOverlayComponent,
    PoUploadDragDropAreaComponent,
    PoUploadFileRestrictionsComponent
  ]
})
export class PoUploadModule { }
