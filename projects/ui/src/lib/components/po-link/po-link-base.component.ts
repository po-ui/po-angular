import { Input, Directive, Output, EventEmitter } from '@angular/core';

import { InputBoolean } from '../../decorators';
import { convertToBoolean, isExternalLink } from '../../utils/util';

/**
 * @description
 *
 * Os links são utilizados como rota. O destino dessa rota pode ser externo ou interno à aplicação. Eles podem ser usados dentro de texto ou isoladamente.
 *
 * #### Boas Práticas
 *
 * O componente link foi projetado para atender os requisitos das Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.1. Também foram estruturadas padrões de usabilidade para auxiliar na utilização do componente e garantir uma boa experiência para os usuários. Por isso, é muito importante que, ao aplicar esse componente, o proprietário do conteúdo leve em consideração alguns critérios e práticas:
 * ##### Uso
 * - Evite usar muitos links em uma única tela, pois isso pode confundir o usuário quanto a identificação e rotas.
 * - Em caso de interações que alteram ou manipulam dados ou acionam alguma ação, priorize o uso de botões ao invés de link.
 * - Use labels (rótulos) que descrevam a finalidade do link. Evite texto como "Clique aqui", por exemplo. (WCAG [2.4.9: Link Purpose - Link Only](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-link-only))
 * - Não use cores para o link com baixo contraste entre o fundo e o texto, pois isso dificulta o entendimento do conteúdo. É possível conferir se o contraste está adequado e atingindo o valor de 7:1 em um [Contrast Checker](https://webaim.org/resources/contrastchecker/) (WCAG [1.4.6: Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced.html))
 *
 * ##### Interação
 * - A interação de foco deve compor o componente, sendo a navegação por mouse ou teclado, e em sequência lógica. Como por exemplo, ao pressionar Enter, executa o link e move o foco para o destino do link. (WCAG [2.4.3: Focus Order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order))
 * - A distância entre o link e outras áreas interativas deve ter no mínimo 44px de altura e largura, para permitir distanciamento seguro e para que nenhum outro elemento seja acionado sem intenção. (WCAG [2.5.8: Pointer Target Spacing](https://w3c.github.io/wcag/understanding/pointer-target-spacing))
 * - Quando se tratar de um link para uma página externa, é recomendável que esta informação seja adicionada na label do componente link, para que a mudança de contexto seja informada ao usuário (WCAG [3.2.5: Change on Request](https://www.w3.org/WAI/WCAG21/Understanding/change-on-request)).
 *
 * #### Acessibilidade tratada no componente
 * Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo proprietário do conteúdo. São elas:
 * - O link foi desenvolvido utilizando controles padrões HTML para permitir a identificação do mesmo na interface por tecnologias assistivas. (WCAG [4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value))
 * - A cor não deve ser o único meio para diferenciar o link de textos comuns ou outros elementos, por isso deve-se manter o underline no link, para proporcionar essa diferença. (WCAG [1.4.1: Use of Color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color)/ [3.2.4: Consistent Identification](https://www.w3.org/WAI/WCAG21/Understanding/consistent-identification))
 * - O foco precisa ter uma área mínima do dobro do perímetro do link, ter contraste de pelo menos 4.5:1 entre o estado focado e não focado do componente; e o foco não pode ficar escondido por outros elementos da tela. (WCAG [2.4.12: Focus Appearance - Enhanced](https://w3c.github.io/wcag/understanding/focus-appearance-enhanced))
 * - O estado de foco do componente deve ser sempre preservado. (WCAG [2.4.7: Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible))
 */
@Directive()
export class PoLinkBaseComponent {
  /** Valor do rótulo a ser exibido. */
  @Input('p-label') label: string;

  /** Indica se o link deverá ser aberto em uma nova aba. Sempre que utilizar essa propriedade, é importante informar isso ao usuário através da label. */
  @Input({ alias: 'p-open-new-tab', transform: convertToBoolean }) openNewTab: boolean = false;

  /** Url que será aberta ao clicar no link. */
  @Input('p-url') url: string;

  get type(): string {
    if (!this.url && this.action.observed) {
      return 'action';
    }
    return isExternalLink(this.url) ? 'externalLink' : 'internalLink';
  }

  /** Ação que será executada quando o usuário clicar sobre o `po-link`.
   * > Ao utilizar junto da propriedade `p-url` a ação será ignorada.
   */
  @Output('p-action') action = new EventEmitter<null>();
}
