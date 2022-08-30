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
   * Método que será chamado ao realizar uma busca no componente, deve retornar um Observable que contém uma coleção de objetos que seguem
   * a interface `PoMultiselectOption`, será informado por parametro o campo e o valor a ser pesquisado.
   *
   * @param {{ property: string, value: string }} params Objeto contendo a propriedade e o valor responsável por realizar o filtro.
   */
  getFilteredData(params: { property: string; value: string }): Observable<Array<PoMultiselectOption | any>>;

  /**
   * Método que será chamado ao iniciar o componente com valor, deve retornar um Observable que contém apenas os objetos filtrados que
   * seguem a interface `PoMultiselectOption`, será informado por parâmetro valor a ser pesquisado.
   *
   * @param {Array<string | number>} values Array com os valores a serem buscados.
   */
  getObjectsByValues(values: Array<string | number>): Observable<Array<PoMultiselectOption | any>>;
}
