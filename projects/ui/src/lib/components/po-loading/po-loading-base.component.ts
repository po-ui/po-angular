import { Input, Directive } from '@angular/core';

/**
 * @docsPrivate
 *
 * @description
 *
 * Este componente tem o objetivo de mostrar visualmente aos usuários que a aplicação está processando
 * ou aguardando a resposta de alguma requisição.
 */
@Directive()
export class PoLoadingBaseComponent {
  /**
   * Texto a ser exibido no componente.
   */
  @Input('p-text') text?: string = 'Carregando';
}
