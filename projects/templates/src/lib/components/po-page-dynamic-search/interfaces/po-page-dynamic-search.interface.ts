import { PoDynamicFormField, PoPageDefault } from '@po-ui/ng-components';

/**
 * @docsPrivate
 *
 * @description
 *
 * Interface para o atributo `filter` do componente `po-page-dynamic-search`.
 */
export interface PoPageDynamicSearch extends PoPageDefault {
  /**
   * @description
   *
   * Nome do método a ser executado quando a busca avançada for finalizada.
   */
  advancedSearch?: Function;

  /**
   * @description
   *
   * Lista dos filtros usados na busca avançada.
   */
  filters?: Array<PoDynamicFormField>;

  /**
   * @description
   *
   * Nome do método a ser executado quando é pressionado a tecla `ENTER` dentro do `input` de pesquisa rápida do componente, o mesmo
   * receberá o valor digitado ao ser invocado.
   */
  quickSearch?: Function;
}
