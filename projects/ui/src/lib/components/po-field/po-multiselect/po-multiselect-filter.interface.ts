import { Observable } from 'rxjs';

import { PoMultiselectOption } from './po-multiselect-option.interface';

/**
 * @usedBy PoMultiselectComponent
 *
 * @description
 *
 * Interface para os serviços que serão utilizados no po-multiselect.
 */
export interface PoMultiselectFilter {
  /**
   * Método responsável por retornar um Observable que contém uma coleção de objetos que seguem a interface PoMultiselectOption,
   * será informado por parametro o campo, de acordo com o fieldLabel, e o valor a ser pesquisado.
   *
   * @param {{ property: string, value: string }} params Objeto contendo a propriedade e o valor responsável por realizar o filtro. // melhorar tipagem
   */
  getFilteredData(params: { property: string; value: string }): Observable<Array<PoMultiselectOption>>; // trocar para objeto e voltar a tipar o retorno

  /**
   * Método responsável por retornar um Observable que contém apenas os objetos filtrados que seguem a interface PoMultiselectOption,
   * será informado por parametro valor a ser pesquisado.
   *
   * @param {string | number} value Valor responsável por realizar a busca de um ou mais objetos. // aceitar vários valores
   */
  getObjectsByValues(value: Array<string | number>): Observable<Array<PoMultiselectOption>>;
}
