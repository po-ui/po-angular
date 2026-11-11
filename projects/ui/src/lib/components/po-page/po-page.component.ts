import { Component, ChangeDetectionStrategy } from '@angular/core';

import { PoPageBaseComponent } from './po-page-base.component';

/**
 * @docsPrivate
 *
 * @docsExtends PoPageBaseComponent
 */
@Component({
  selector: 'po-page',
  templateUrl: './po-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PoPageComponent extends PoPageBaseComponent {}
