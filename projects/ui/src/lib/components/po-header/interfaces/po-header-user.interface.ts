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

  /**
   *
   * @optional
   *
   * @description
   *
   * Função executada quando o popup ou popover da seção de Customer é aberto.
   *
   * Esse evento é disparado toda vez que o usuário clica no botão da seção de Customer e o popup
   * (quando há `items`) ou o popover (quando há `popover`) é exibido.
   *
   * Exemplo: `onOpen: this.onOpenNotifications.bind(this)`
   */
  onOpen?: Function;

  /**
   *
   * @optional
   *
   * @description
   *
   * Função executada quando o popup ou popover da seção de Customer é fechado.
   *
   * Esse evento é disparado toda vez que o popup (quando há `items`) ou o popover (quando há `popover`)
   * é ocultado, seja por clique fora do elemento ou por ação programática.
   *
   * Exemplo: `onClose: this.onCloseNotifications.bind(this)`
   */
  onClose?: Function;
}
