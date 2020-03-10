import { PipeTransform } from '@angular/core';

/**
 * @description
 *
 * O pipe po-i18n é responsável por tratar literais parâmetrizadas, dando mais flexibilidade as literais de tradução.
 * O número de parâmetros inseridos nas literais deve coincidir com a quantia de parâmetros passados por parâmetro,
 * os parâmetros serão substituidos de acordo com a ordem informada.
 *
 * Para inserir um parâmetro em uma literal, o mesmo deverá ser inserido entre chaves dentro da literal e posicionado
 * de acordo como deve ser exibido após a sua transformação.
 *
 * ```
 * const i18nPT = {
 *   pagination: 'Página {1} de {2} páginas.',
 *   totalPages: 'Total de {totalPages} encontradas.'
 * };
 * ```
 *
 * É possível passar um valor ou um array de valores para o pipe, caso seja passado um array, os valores devem obedecer a ordem
 * informada na literal.
 *
 * ```
 * {{ i18nPT.pagination | poI18n:[1,10] }}
 * {{ i18nPT.totalPages | poI18n:10 }}
 * ```
 */
export class PoI18nBasePipe implements PipeTransform {
  transform(value: string, args: any): string {
    if (!value) {
      return '';
    }

    if (!(args instanceof Array)) {
      args = [args];
    }

    for (const arg of args) {
      value = value.replace(/(\{\w*\})+/, arg);
    }

    return value;
  }
}
