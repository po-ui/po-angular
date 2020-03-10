import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PoBreadcrumbModule } from '../po-breadcrumb/po-breadcrumb.module';
import { PoButtonModule } from '../po-button/po-button.module';
import { PoDisclaimerGroupModule } from '../po-disclaimer-group/po-disclaimer-group.module';
import { PoDropdownModule } from '../po-dropdown/po-dropdown.module';
import { PoFieldModule } from '../po-field/po-field.module';
import { PoLanguageModule } from './../../services/po-language/po-language.module';
import { PoModalModule } from './../po-modal/po-modal.module';
import { PoPageComponent } from './po-page.component';
import { PoPageContentComponent } from './po-page-content/po-page-content.component';
import { PoPageDefaultComponent } from './po-page-default/po-page-default.component';
import { PoPageDetailComponent } from './po-page-detail/po-page-detail.component';
import { PoPageEditComponent } from './po-page-edit/po-page-edit.component';
import { PoPageHeaderComponent } from './po-page-header/po-page-header.component';
import { PoPageListComponent } from './po-page-list/po-page-list.component';

/**
 * @description
 * Módulo dos componentes po-page-default, po-page-edit, po-page-list, po-page-login e po-page-detail.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PoBreadcrumbModule,
    PoButtonModule,
    PoDisclaimerGroupModule,
    PoDropdownModule,
    PoFieldModule,
    PoLanguageModule,
    PoModalModule
  ],
  declarations: [
    PoPageComponent,
    PoPageContentComponent,
    PoPageDefaultComponent,
    PoPageDetailComponent,
    PoPageEditComponent,
    PoPageHeaderComponent,
    PoPageListComponent
  ],
  exports: [PoPageDetailComponent, PoPageDefaultComponent, PoPageEditComponent, PoPageListComponent]
})
export class PoPageModule {}
