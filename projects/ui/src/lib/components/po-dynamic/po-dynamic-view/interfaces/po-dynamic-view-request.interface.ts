import { Observable } from 'rxjs';

/**
 * @usedBy PoDynamicViewComponent
 *
 * @description
 *
 * Define o tipo de busca customizada para um campo em específico.
 */
export interface PoDynamicViewRequest {
  /**
   * Método responsável por enviar um valor que será buscado no serviço.
   *
   *
   * @param {string|Array<any>} value Valor único a ser buscado na fonte de dados.
   * @param {any} filterParams Valor opcional para informar filtros customizados.
   */
  getObjectByValue(value: string | Array<any>, filterParams?: any): Observable<any>;
}
