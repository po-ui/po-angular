import { PoHeaderActionPopoverAction, PoHeaderActionToolItem } from './po-header-action-tool.interface';

/**
 * @usedBy PoHeaderComponent
 *
 * @description
 *
 * *Interface* que define a seção de Customer do header.
 *
 */
export interface PoHeaderUser {
  /**
   *
   * @description
   *
   * Logo representando o perfil
   *
   */
  avatar: string;

  /**
   *
   * @description
   *
   * Imagem da marca
   *
   */
  customerBrand: string;

  /**
   *
   * @optional
   *
   * @description
   *
   * Evento emitido ao clicar na seção
   *
   * Exemplo: `action: this.myFunction.bind(this)`
   */
  action?: Function;

  /**
   *
   * @optional
   *
   * @description
   *
   * Indicação representando o estado do usuário
   * Valores válidos:
   * - `positive`: Define a cor do `status` com a cor de feedback positivo.
   * - `negative`: Define a cor do `status` com a cor de feedback negative.
   * - `warning`: Define a cor do `status` com a cor de feedback warning.
   * - `disabled`: Define a cor do `status` com a cor de feedback disabled
   *
   */
  status?: 'positive' | 'negative' | 'warning' | 'disabled';

  /**
   *
   * @optional
   *
   * @description
   *
   * Template que será utilizado na ação
   */
  popover?: PoHeaderActionPopoverAction;

  /**
   *
   * @optional
   *
   * @description
   *
   * Itens de ações
   *
   *  > Caso seja passado items e popover, o componente irá renderizar o popover e os itens serão ignorados
   *
   */
  items?: Array<PoHeaderActionToolItem>;
}
