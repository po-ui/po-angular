import { Component } from '@angular/core';

import { PoPageBaseComponent } from './po-page-base.component';

/**
 * @docsPrivate
 *
 * @docsExtends PoPageBaseComponent
 */
@Component({
  selector: 'po-page',
  templateUrl: './po-page.component.html',
  standalone: false
})
export class PoPageComponent extends PoPageBaseComponent {}
