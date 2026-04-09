import { TemplateRef } from '@angular/core';
import { PoTagType } from '../../po-tag/enums/po-tag-type.enum';

/**
 * @usedBy PoTableComponent, PoPageDynamicTableComponent
 *
 * @description
 *
 * Interface para configuração das colunas de labels do `po-table`.
 */
export interface PoTableColumnLabel {
  /**
   * @optional
   *
   * @description
   *
   * Define a cor do label.
   *
   * Valores válidos:
   * - <span class="dot po-color-01"></span> `color-01`
   * - <span class="dot po-color-02"></span> `color-02`
   * - <span class="dot po-color-03"></span> `color-03`
   * - <span class="dot po-color-04"></span> `color-04`
   * - <span class="dot po-color-05"></span> `color-05`
   * - <span class="dot po-color-06"></span> `color-06`
   * - <span class="dot po-color-07"></span> `color-07`
   * - <span class="dot po-color-08"></span> `color-08`
   * - <span class="dot po-color-09"></span> `color-09`
   * - <span class="dot po-color-10"></span> `color-10`
   * - <span class="dot po-color-11"></span> `color-11`
   * - <span class="dot po-color-12"></span> `color-12`
   *
   * > Também é possível utilizar as 35 cores da paleta **Caption Tag Colors**:
   *
   *   - <span class="dot po-caption-tag-01"></span> `caption-tag-01` <span class="dot po-caption-tag-02"></span> `caption-tag-02` <span class="dot po-caption-tag-03"></span> `caption-tag-03` <span class="dot po-caption-tag-04"></span> `caption-tag-04` <span class="dot po-caption-tag-05"></span> `caption-tag-05`
   *   - <span class="dot po-caption-tag-06"></span> `caption-tag-06` <span class="dot po-caption-tag-07"></span> `caption-tag-07` <span class="dot po-caption-tag-08"></span> `caption-tag-08` <span class="dot po-caption-tag-09"></span> `caption-tag-09` <span class="dot po-caption-tag-10"></span> `caption-tag-10`
   *   - <span class="dot po-caption-tag-11"></span> `caption-tag-11` <span class="dot po-caption-tag-12"></span> `caption-tag-12` <span class="dot po-caption-tag-13"></span> `caption-tag-13` <span class="dot po-caption-tag-14"></span> `caption-tag-14` <span class="dot po-caption-tag-15"></span> `caption-tag-15`
   *   - <span class="dot po-caption-tag-16"></span> `caption-tag-16` <span class="dot po-caption-tag-17"></span> `caption-tag-17` <span class="dot po-caption-tag-18"></span> `caption-tag-18` <span class="dot po-caption-tag-19"></span> `caption-tag-19` <span class="dot po-caption-tag-20"></span> `caption-tag-20`
   *   - <span class="dot po-caption-tag-21"></span> `caption-tag-21` <span class="dot po-caption-tag-22"></span> `caption-tag-22` <span class="dot po-caption-tag-23"></span> `caption-tag-23` <span class="dot po-caption-tag-24"></span> `caption-tag-24` <span class="dot po-caption-tag-25"></span> `caption-tag-25`
   *   - <span class="dot po-caption-tag-26"></span> `caption-tag-26` <span class="dot po-caption-tag-27"></span> `caption-tag-27` <span class="dot po-caption-tag-28"></span> `caption-tag-28` <span class="dot po-caption-tag-29"></span> `caption-tag-29` <span class="dot po-caption-tag-30"></span> `caption-tag-30`
   *   - <span class="dot po-caption-tag-31"></span> `caption-tag-31` <span class="dot po-caption-tag-32"></span> `caption-tag-32` <span class="dot po-caption-tag-33"></span> `caption-tag-33` <span class="dot po-caption-tag-34"></span> `caption-tag-34` <span class="dot po-caption-tag-35"></span> `caption-tag-35`
   *
   * Exemplo de uso:
   * ```
   * { property: 'status', type: 'label', labels: [
   *   { value: 'ativo', color: 'caption-tag-13', label: 'Ativo' },
   *   { value: 'pendente', color: 'caption-tag-08', label: 'Pendente' }
   * ]}
   * ```
   */
  color?: string;

  /**
   * @optional
   *
   * @description
   *
   * Determina a cor do texto da tag. As maneiras de customizar as cores são:
   * - Hexadeximal, por exemplo `#c64840`;
   * - RGB, como `rgb(0, 0, 165)`;
   * - O nome da cor, por exemplo `blue`;
   * - Usando uma das cores do tema do PO:
   * Valores válidos:
   *   - <span class="dot po-color-01"></span> `color-01`
   *   - <span class="dot po-color-02"></span> `color-02`
   *   - <span class="dot po-color-03"></span> `color-03`
   *   - <span class="dot po-color-04"></span> `color-04`
   *   - <span class="dot po-color-05"></span> `color-05`
   *   - <span class="dot po-color-06"></span> `color-06`
   *   - <span class="dot po-color-07"></span> `color-07`
   *   - <span class="dot po-color-08"></span> `color-08`
   *   - <span class="dot po-color-09"></span> `color-09`
   *   - <span class="dot po-color-10"></span> `color-10`
   *   - <span class="dot po-color-11"></span> `color-11`
   *   - <span class="dot po-color-12"></span> `color-12`
   *
   * - Para uma melhor acessibilidade no uso do componente é recomendável utilizar cores com um melhor contraste em relação ao background.
   *
   * > **Atenção:** A propriedade `p-type` sobrepõe esta definição.
   *
   * > **Atenção:** As cores da paleta **Caption Tag Colors** (`caption-tag-01` a `caption-tag-35`) não são aceitas nesta propriedade,
   * pois possuem cor de texto fixa definida via token CSS.
   */
  textColor?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define ou ativa um ícone que será exibido ao lado do valor da *tag*.
   *
   * Quando `p-type` estiver definida, basta informar um valor igual a `true` para que o ícone seja exibido conforme descrições abaixo:
   * - <span class="an an-check"></span> - `success`
   * - <span class="an an-warning-circle"></span> - `warning`
   * - <span class="an an-x"></span> - `danger`
   * - <span class="an an-info"></span> - `info`
   *
   * Também É possível usar qualquer um dos ícones da [Biblioteca de ícones](https://po-ui.io/icons). conforme exemplo abaixo:
   * ```
   * <po-tag p-icon="an an-user" p-value="PO Tag"></po-tag>
   * ```
   * como também utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, da seguinte forma:
   * ```
   * <po-tag p-icon="fa fa-podcast" p-value="PO Tag"></po-button>
   * ```
   * Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
   * ```
   * <po-tag [p-icon]="template" p-value="Tag template ionic"></po-button>
   *
   * <ng-template #template>
   *  <ion-icon style="font-size: inherit" name="heart"></ion-icon>
   * </ng-template>
   * ```
   * > Para o ícone enquadrar corretamente, deve-se utilizar `font-size: inherit` caso o ícone utilizado não aplique-o.
   *
   * @default `false`
   */
  icon?: boolean | string | TemplateRef<void>;

  /**
   * @optional
   *
   * @description
   *
   * Define o tipo da *tag*.
   *
   * Valores válidos:
   *  - `success`: cor verde utilizada para simbolizar sucesso ou êxito.
   *  - `warning`: cor amarela que representa aviso ou advertência.
   *  - `danger`: cor vermelha para erro ou aviso crítico.
   *  - `info`: cor cinza escuro que caracteriza conteúdo informativo.
   *
   * > Quando esta propriedade for definida, irá sobrepor a definição de `p-color` e `p-icon` somente será exibido caso seja `true`.
   *
   * @default `info`
   */
  type?: PoTagType;

  /** Texto que será exibido na coluna. */
  label: string;

  /**
   * Define um texto de ajuda que será exibido ao passar o *mouse* em cima do *label*.
   *
   * > Caso o conteúdo da célula exceder a largura da coluna,
   * é ignorado o valor atribuido ao tooltip e será exibido justamente o conteúdo da célula.
   */
  tooltip?: string;

  /** Valor que será usado como referência para exibição do conteúdo na coluna. */
  value: string | number;
}
