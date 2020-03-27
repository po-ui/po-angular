import { Pipe, PipeTransform } from '@angular/core';

import { PoI18nBasePipe } from './po-i18n-base.pipe';

/**
 * @docsExtends PoI18nBasePipe
 *
 * @example
 * <example name='po-i18n-pipe-labs' title='PO i18n Pipe Labs' >
 *  <file name='sample-po-i18n-pipe-labs.component.html'> </file>
 *  <file name='sample-po-i18n-pipe-labs.component.ts'> </file>
 *  <file name='sample-po-i18n-pipe.component.html'> </file>
 *  <file name='sample-po-i18n-pipe.component.ts'> </file>
 * </example>
 */
@Pipe({
  name: 'poI18n'
})
export class PoI18nPipe extends PoI18nBasePipe implements PipeTransform {}
