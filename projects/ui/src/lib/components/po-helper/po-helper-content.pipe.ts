import { Pipe, PipeTransform } from '@angular/core';
import { parseHelperContent, PoHelperTextFragment } from './po-helper-content-utils';

/**
 * @description
 *
 * Pipe que transforma o conteúdo do helper em fragmentos de texto formatados,
 * utilizando o Safe Parser para garantir segurança contra XSS.
 *
 * Uso interno do componente `po-helper`.
 */
@Pipe({
  name: 'poHelperContent',
  standalone: false
})
export class PoHelperContentPipe implements PipeTransform {
  transform(content: string): Array<PoHelperTextFragment> {
    return parseHelperContent(content);
  }
}
