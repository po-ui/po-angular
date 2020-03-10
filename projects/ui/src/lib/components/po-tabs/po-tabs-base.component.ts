import { Input, Directive } from '@angular/core';

import { convertToBoolean } from '../../utils/util';

/**
 * @description
 *
 * O componente `po-tabs` é responsável por agrupar [abas](/documentation/po-tab) dispostas numa linha horizontal,
 * ideal para facilitar a organização de conteúdos.
 *
 * Em dispositivos móveis o componente exibirá tadas as abas de maneira linear gerando um *scroll* na horizontal. Já em telas telas com
 * resoluções maiores, o componente exibirá até cinco abas normalmente, porém, à partir de seis abas o componente automaticamente torna
 * visível apenas as quatro primeiras, agrupando as subsequentes na quinta aba rotulada de **Mais**.
 *
 * > As abas que estiverem agrupadas serão dispostas numa cascata suspensa que será exibida ao clicar no botão **Mais**.
 *
 * É possível realizar a navegação entre as abas através da tecla TAB do teclado.
 * Caso uma aba estiver desabilitada, não receberá foco de navegação.
 *
 * #### Boas práticas
 *
 * - Evite utilizar uma quantidade excessiva de abas, pois irá gerar um *scroll* muito longo no `dropdown`;
 * - Evite `labels` extensos para as `tabs` pois podem quebrar seu *layout*, use `labels` diretos, curtos e intuitivos.
 */
@Directive()
export class PoTabsBaseComponent {
  private _small?: boolean = false;

  /**
   * @optinal
   *
   * @description
   *
   * Diminui o tamanho das abas.
   *
   * @default `false`
   */
  @Input('p-small') set small(value: boolean) {
    this._small = convertToBoolean(value);
  }

  get small(): boolean {
    return this._small;
  }
}
