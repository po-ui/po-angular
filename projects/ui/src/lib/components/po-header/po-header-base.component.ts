import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { PoMenuItem } from '../po-menu';
import { PoHeaderActionTool } from './interfaces/po-header-action-tool.interface';
import { PoHeaderActions } from './interfaces/po-header-actions.interface';
import { PoHeaderBrand } from './interfaces/po-header-brand.interface';
import { PoHeaderUser } from './interfaces/po-header-user.interface';

/**
 * @description
 *
 * O componente `po-header` é um cabeçalho fixo que permite apresentar itens com ações, divididos em `brand`, `menu`, `tools` e `customer`.
 *
 * - `brand`: Possibilita a inclusão de uma imagem e o titulo do header.
 * - `menu`: Possibilita a inclusão de uma lista de itens com ações.
 * - `tools`: Possibilita a inclusão de até 3 botões com ações.
 * - `customer`: Possibilita a inclusão de uma imagem representando a marca e avatar.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                              | Descrição                                                  | Valor Padrão                                      |
 * |------------------------------------------|------------------------------------------------------------|---------------------------------------------------|
 * | `--font-family`                          | Família tipográfica usada                                  | `var(--font-family-theme)`                        |
 * | `--font-weight`                          | Peso da fonte                                              | `var(--font-weight-bold)`                         |
 * | `--text-color`                           | Cor do texto                                               | `var(--color-neutral-dark-70)`                    |                                                                        | ---                                             |
 * | `--outline-color-focused`                | Cor do outline dos itens de sub-menu e customer            | `var(--color-neutral-dark-95)`                    |                                                                        | ---                                             |
 * | **Header**                               |                                                            |                                                   |
 * | `--background-color`                     | Cor de background do header                                | `var(--color-neutral-light-05)`                   |
 * | `--border-radius-bottom-left`            | Valor do radius do lado esquerdo do header                 | `var(--border-radius-md)`                         |
 * | `--border-radius-bottom-right`           | Valor do radius do lado direito do header                  | `var(--border-radius-md)`                         |
 * | `--base shadow`                          | Cor da sombra do header                                    | `0 1px 8px rgba(0, 0, 0, 0.1)`                  |
 * | **Sub-menu**                             |                                                            |                                                   |
 * | `--border-radius`                        | Valor do radius dos itens do sub-menu                      | `var(--border-radius-md);`                        |
 * | `--text-color-submenu`                   | Cor do texto dos itens do sub-menu                         | `var(--color-brand-01-base)`                      |
 * | `--icon-color`                           | Cor do ícone do sub-menu com itens                         | `var(--color-brand-01-base)`                      |
 * | `--border-color`                         | Cor da borda                                               | `var(--color-transparent)`                        |
 * | `--shadow`                               | Contém o valor da sombra do elemento                       | `var(--shadow-none)`                              |
 * | **Sub-menu - Hover**                     |                                                            |                                                   |
 * | `--background-hover`                     | Cor de background dos itens do sub-menu no estado hover    | `var(--color-brand-01-lighter)`                   |
 * | `--icon-color-hover`                     | Cor do ícone dos itens de sub-menu no estado hover         | `var(--color-brand-01-darkest)`                   |
 * | `--text-color-hover`                     | Cor do texo dos itens de sub-menu no estado hover          | `var(--color-brand-01-darkest)`                   |
 * | **Sub-menu - pressed**                   |                                                            |                                                   |
 * | `--background-pressed`                   | Cor de background dos itens do sub-menu no estado pressed  | `var(--color-brand-01-light)`                     |
 * | `--icon-color-pressed`                   | Cor do ícone dos itens de sub-menu no estado pressed       | `var(--color-brand-01-darkest)`                   |
 * | `--text-color-pressed`                   | Cor do texo dos itens de sub-menu no estado pressed        | `var(--color-brand-01-darkest)`                   |
 * | **Customer**                             |                                                            |                                                   |
 * | `--background-color-customer`            | Cor do background da seção customer                        | `var(--color-neutral-light-00)`                   |
 * | `--border-color`                         | Cor da borda da seção customer                             | `var(--color-neutral-light-10)`                   |
 * | `--border-style`                         | Estilo da borda da seção customer                          | `solid`                                           |
 * | `--border-width`                         | Largura da borda da seção customer                         | `var(--border-width-sm)`                          |
 * | **Customer - hover**                     |                                                            |                                                   |
 * | `--background-color-customer-hover`      | Cor do background da seção customer no estado hover        | `var(--color-brand-01-lighter)`                   |
 * | `--background-color-customer-hover`      | Cor do background da seção customer no estado hover        | `var(--color-brand-01-lighter)`                   |
 * | **Customer - pressed**                   |                                                            |                                                   |
 * | `--background-color-customer-pressed`    | Cor do background da seção customer no estado pressed      | `var(--color-brand-01-light)`                     |
 * | `--border-width-pressed`                 | Cor da borda da seção customer no estado pressed           | `var(--border-width-lg)`                          |
 * | **Customer - focus**                     |                                                            |                                                   |
 * | `--border-width-focus`                   | largura da borda da seção customer no estado focus         | `var(--border-width-lg)`                          |
 *
 */
@Directive()
export abstract class PoHeaderBaseComponent {
  private _menuItems: Array<PoHeaderActions> = [];
  public menuSmallItems = [];

  /**
   * @optional
   *
   * @description
   *
   * Número de itens dentro do botão de overflow. Caso a largura do header não suportar a quantidade de itens passadas, um botão com itens será criado.
   * Essa propriedade possibilita a escolha de quantos itens estarão dentro do botão de overflow.
   *
   * > Ao utilizar essa propriedade o `po-header` não irá realizar o calculo automatíco de itens.
   *
   */
  @Input('p-amount-more') amountMore?: number;

  /**
   * @optional
   *
   * @description
   *
   * Esconde o botão de menu colapsado. O botão de menu aparece quando o tamanho da tela é inferior a 960px.
   *
   */
  @Input('p-hide-button-menu') hideButtonMenu?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Propriedade para configurar a seção de brand do `po-header`
   *
   */
  @Input('p-brand') brand: PoHeaderBrand;

  /**
   * @optional
   *
   * @description
   *
   * Propriedade para configurar a seção de tools do `po-header`
   *
   * > Máximo de 3 itens, o componente irá ignorar os itens caso seja mandado mais itens que o suportado.
   *
   */
  @Input('p-actions-tools') actionsTools: Array<PoHeaderActionTool> = [];

  /**
   * @optional
   *
   * @description
   *
   * Propriedade para configurar a seção de headerUser do `po-header`
   *
   */
  @Input('p-header-user') headerUser: PoHeaderUser;

  /**
   * @optional
   *
   * @description
   *
   * Propriedade para configurar a seção de menu do `po-header`.
   * Cada item pode receber uma label e uma ação
   *
   * > Os itens irão ficar visíveis em uma tela de até 960px
   *
   */
  @Input('p-menu-items') set menuItems(items: Array<PoHeaderActions>) {
    this._menuItems = (items || []).map(item => ({
      ...item,
      id: item.id || this.generateRandomId()
    }));
  }

  /**
   * @optional
   *
   * @description
   *
   * Lista dos itens do menu. Se o valor estiver indefinido ou inválido, será inicializado como um array vazio.
   *
   * > O menu poderá ser aberto via botão hamburguer quando a tela tiver menos que 960px
   *
   */
  @Input('p-menus') menuCollapse: Array<PoMenuItem> = [];

  /**
   * @optional
   *
   * @description
   *
   * Evento emitido ao clicar no botão para colapsar ou expandir menu.
   *
   */
  @Output('p-colapsed-menu') colapsedMenuEvent = new EventEmitter();

  get menuItems(): Array<PoHeaderActions> {
    return this._menuItems;
  }

  private generateRandomId(): string {
    return String(Math.floor(Math.random() * 999 + 1));
  }
}
