import { PoDisclaimer } from '../po-disclaimer/po-disclaimer.interface';

/**
 * @usedBy
 *
 * PoPageListComponent
 *
 * @description
 *
 * Interface que representa o objeto `po-disclaimer-group`.
 */
export interface PoDisclaimerGroup {
  /**
   * @optional
   *
   * @description
   *
   * Função que será disparada quando a lista de *disclaimers* for modificada.
   * Será passado por parâmetro a nova lista de *disclaimers*.
   */
  change?: Function;

  /**
   *
   * @description
   *
   * Lista de *disclaimers*.
   *
   * Exemplo:
   * ```
   *  disclaimers: [
   *    { property: 'type', label: 'Hotel', value: 'hotel' },
   *    { property: 'cost', label: '$500,00', value: '500'  },
   *    { property: 'dates', label: '10/05/2018 - 15/05/2018', value: '10/05/2018|15/05/2018'  }
   *   ]
   * ```
   *
   * Para que a lista de *disclaimers* seja atualizada dinamicamente deve-se passar uma nova referência do array de `PoDisclaimer`.
   *
   * Exemplo:
   * ```
   * this.disclaimerGroup.disclaimers = [...this.disclaimers];
   * ```
   */
  disclaimers: Array<PoDisclaimer>;

  /**
   * @optional
   *
   * @description
   *
   * Oculta o botão para remover todos os *disclaimers* do grupo.
   *
   * > Por padrão, o mesmo é exibido à partir de dois ou mais *disclaimers* com a opção `hideClose` habilitada.
   *
   * @default `false`
   */
  hideRemoveAll?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Título do grupo de *disclaimers*.
   */
  title: string;

  /**
   * Função que será disparada quando um *disclaimer* for removido da lista de
   * *disclaimers* pelo usuário.
   *
   * Recebe como parâmetro um objeto conforme a interface `PoDisclaimerGroupRemoveAction`.
   */
  remove?: Function;

  /**
   * Função que será disparada quando todos os *disclaimers* forem removidos da lista de *disclaimers* pelo usuário,
   * utilizando o botão "remover todos".
   *
   * Recebe como parâmetro uma lista contendo todos os `disclaimers` removidos.
   */
  removeAll?: Function;
}
