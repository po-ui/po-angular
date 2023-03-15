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
   *  - <span class="dot po-color-01"></span> `color-01`
   *  - <span class="dot po-color-02"></span> `color-02`
   *  - <span class="dot po-color-03"></span> `color-03`
   *  - <span class="dot po-color-04"></span> `color-04`
   *  - <span class="dot po-color-05"></span> `color-05`
   *  - <span class="dot po-color-06"></span> `color-06`
   *  - <span class="dot po-color-07"></span> `color-07`
   *  - <span class="dot po-color-08"></span> `color-08`
   *  - <span class="dot po-color-09"></span> `color-09`
   *  - <span class="dot po-color-10"></span> `color-10`
   *  - <span class="dot po-color-11"></span> `color-11`
   *  - <span class="dot po-color-12"></span> `color-12`
   *
   * - Para uma melhor acessibilidade no uso do componente é recomendável utilizar cores com um melhor contraste em relação ao background.
   *
   * > **Atenção:** A propriedade `p-type` sobrepõe esta definição.
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
   * - <span class="po-icon po-icon-ok"></span> - `success`
   * - <span class="po-icon po-icon-warning"></span> - `warning`
   * - <span class="po-icon po-icon-close"></span> - `danger`
   * - <span class="po-icon po-icon-info"></span> - `info`
   *
   * Também É possível usar qualquer um dos ícones da [Biblioteca de ícones](/guides/icons). conforme exemplo abaixo:
   * ```
   * <po-tag p-icon="po-icon-user" p-value="PO Tag"></po-tag>
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
   * > Caso a propriedade `p-hide-text-overflow` esteja habilitada e o conteúdo da célula exceder a largura da coluna,
   * é ignorado o valor atribuido ao tooltip e será exibido justamente o conteúdo da célula.
   */
  tooltip?: string;

  /** Valor que será usado como referência para exibição do conteúdo na coluna. */
  value: string | number;
}
