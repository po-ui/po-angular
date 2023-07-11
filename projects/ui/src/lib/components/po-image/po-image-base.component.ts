import { Directive, Input } from '@angular/core';
import { isValidImageBase64 } from '../../utils/util';

type PoImageLoading = 'lazy' | 'eager' | 'auto';

/**
 * @description
 *
 * As imagens têm a função de traduzir visualmente ideias específicas ou mensagens complexas, mostrar um produto ou contar uma história, estabelecendo empatia e se conectando com os usuários.
 *
 * #### Boas Práticas
 *
 * O componente image foi projetado para atender os requisitos das Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.1. Também foram estruturadas padrões de usabilidade para auxiliar na utilização do componente e garantir uma boa experiência para os usuários. Por isso, é muito importante que, ao aplicar esse componente, o proprietário do conteúdo leve em consideração alguns critérios e práticas:
 * ##### Uso
 * - Ao utilizar imagens, mantenha uma coerência entre elas no produto, de modo que compartilhem um mesmo estilo e intenção entre si.
 * - Utilize imagens que expressem a mensagem e estilo do produto, respeitando as diretrizes e guia da marca.
 * - Ao utilizar fotografias, é recomendável o uso de proporções de aspecto padrão, como 1:1, 3:1, 3:2, 16:9.
 * - Mantenha um ponto focal na imagem, pois isso influencia em como ela se comportará em diferentes formatos. Isso também ajuda a transmitir a mensagem de forma objetiva e consistente.
 *
 * ##### Imagem como plano de fundo
 * - Avalie se é realmente necessário o uso de imagem como plano de fundo e evite sempre que possível, pois pode ocasionar em um baixo contraste entre texto e imagem.
 * - Caso utilize, redobre a atenção na escolha da imagem e certifique-se de que ela está adequada para a leitura do texto e não está sendo apenas um ruído.
 * - Tenha especial atenção em telas menores. Embora seja possível posicionar o texto em uma área mais vazia ou escurecida, o texto e imagem se ajustam aos diferentes espaços, de acordo com o dispositivo. Muitas vezes acaba resultando no comprometimento tanto da leitura do texto e quando na visualização da imagem.
 * - Verifique a taxa de contraste do texto em relação ao fundo. Deve ser suficiente para atender aos padrões de acessibilidade, sendo 4,5:1 para textos acima de 18pt ou bold e 7,1: 1 para textos menores que 18pt.
 * - Se não tiver controle sobre qual imagem será colocada por trás do texto, o recomendado é não utilizar nesse formato.
 *
 * #### Acessibilidade tratada no componente
 * As boas práticas de acessibilidade variam de acordo com tipo da imagem, que podem ser divididas em:
 * - Imagem informativa simples, como por exemplo uma fotografia de um produto.
 * - Imagem complexa, como um gráfico, infográfico ou diagrama.
 * - Imagem decorativa, como um plano de fundo ou uma fotografia que ilustra um assunto, mas não é essencial para compreender a informação.
 */
@Directive()
export class PoImageBaseComponent {
  isBase64: boolean = false;
  private _source: string;

  /**
   * @optional
   *
   * @description
   *
   * Define a altura da imagem em *pixels*. Caso não seja definida,
   * atribui o tamanho da imagem
   */
  @Input('p-height') height: number;

  /**
   * @optional
   *
   * @description
   *
   * Defini o texto alternativo descrevendo a imagem.
   */
  @Input('p-alt') alternate: string;

  /**
   * @optional
   *
   * @description
   *
   * Fonte da imagem que pode ser um caminho local (`./assets/images/logo-black-small.png`)
   * ou um servidor externo (`https://po-ui.io/assets/images/logo-black-small.png`).
   */
  @Input('p-src') set source(value: string) {
    if (isValidImageBase64(value)) {
      this.isBase64 = true;
    }
    this._source = value;
  }

  get source(): string {
    return this._source;
  }

  /**
   * @optional
   *
   * @description
   *
   * Defini a prioridade de carregamento da imagem.
   * > Para as imagens com carregamento prioritátio ativo é necessário incluir
   * > uma tag link no head do arquivo index.html da sua aplicação.
   *
   * ```
   * <link rel="preconnect" href="<url_base_da_imagem>">
   * ```
   *
   * @default `false`
   */
  @Input('p-priority') priority: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Defini o carregamento que pode ser dos tipo:
   *
   * — lazy
   * — eager
   * — auto
   *
   * > Não é permitido definir esta propriedade em conjunto com a propriedade `p-priority`.
   */
  @Input('p-loading') loading?: PoImageLoading;
}
