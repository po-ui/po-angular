import { Component } from '@angular/core';

import { PoLoadingBaseComponent } from './po-loading-base.component';

/**
 * @docsPrivate
 *
 * @docsExtends PoLoadingBaseComponent
 */
@Component({
  selector: 'po-loading',
  templateUrl: 'po-loading.component.html',
  standalone: false
})
export class PoLoadingComponent extends PoLoadingBaseComponent {}
