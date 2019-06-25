import { Component } from '@angular/core';

import { PoInfoBaseComponent } from './po-info-base.component';

/**
 * @docsExtends PoInfoBaseComponent
 *
 * @description
 *
 * Este componente tem como objetivo renderizar valores na tela no estilo label na parte superior e
 * valor na parte inferior. Facilita a exibição de dados pois vem com layout padrão Portinari.
 *
 * @example
 *
 * <example name="po-info-basic" title="Portinari Info Basic">
 *  <file name="sample-po-info-basic/sample-po-info-basic.component.html"> </file>
 *  <file name="sample-po-info-basic/sample-po-info-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-info-labs" title="Portinari Info Labs">
 *  <file name="sample-po-info-labs/sample-po-info-labs.component.html"> </file>
 *  <file name="sample-po-info-labs/sample-po-info-labs.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-info',
  templateUrl: './po-info.component.html'
})
export class PoInfoComponent extends PoInfoBaseComponent { }
