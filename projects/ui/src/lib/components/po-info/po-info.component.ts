import { ChangeDetectionStrategy, Component } from '@angular/core';

import { isExternalLink } from '../../utils/util';

import { PoInfoBaseComponent } from './po-info-base.component';

/**
 * @docsExtends PoInfoBaseComponent
 *
 * @description
 *
 * Este componente tem como objetivo renderizar valores na tela no estilo label na parte superior e
 * valor na parte inferior. Facilita a exibição de dados pois vem com layout padrão PO.
 *
 * @example
 *
 * <example name="po-info-basic" title="PO Info Basic">
 *  <file name="sample-po-info-basic/sample-po-info-basic.component.html"> </file>
 *  <file name="sample-po-info-basic/sample-po-info-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-info-labs" title="PO Info Labs">
 *  <file name="sample-po-info-labs/sample-po-info-labs.component.html"> </file>
 *  <file name="sample-po-info-labs/sample-po-info-labs.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-info',
  templateUrl: './po-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoInfoComponent extends PoInfoBaseComponent {
  get isExternalLink() {
    return isExternalLink(this.url);
  }
}
