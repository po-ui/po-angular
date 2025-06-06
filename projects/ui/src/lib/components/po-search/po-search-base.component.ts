import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../services/po-language/po-language.service';

import { Directive, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { PoFieldSize } from '../../enums/po-field-size.enum';
import { PoThemeService } from '../../services/po-theme/po-theme.service';
import { convertToBoolean, getDefaultSize, validateSize } from '../../utils/util';
import { PoSearchFilterMode } from './enums/po-search-filter-mode.enum';
import { PoSearchFilterSelect } from './interfaces/po-search-filter-select.interface';
import { PoSearchLiterals } from './literals/po-search-literals';
import { poSearchLiteralsDefault } from './literals/po-search-literals-default';

export type searchMode = 'action' | 'trigger';
/**
 * @description
 *
 * O componente search, também conhecido como barra de pesquisa, é utilizado para ajudar os usuários a localizar um determinado conteúdo
 *
 * Normalmente localizado no canto superior direito, junto com o ícone de lupa, uma vez que este ícone é amplamente reconhecido.
 *
 * Portanto, é de extrema importância que, ao utilizar este componente, as pessoas responsáveis por seu desenvolvimento considerem os seguintes critérios.
 *
 * #### Boas práticas
 *
 * Foram estruturados os padrões de usabilidade para auxiliar na utilização do componente e garantir uma boa experiência aos usuários. Por isso, é muito importante que ao utilizar este componente, as pessoas que o projetarem devem levar em consideração os seguintes critérios:
 * - Utilize labels para apresentar resultados que estão sendo exibidos e apresente os resultados mais relevantes primeiro.
 * - Exiba uma mensagem clara quando não forem encontrados resultados para busca e sempre que possível ofereça outras sugestões de busca.
 * - Mantenha o texto original no campo de input, que facilita a ação do usuário caso queira fazer uma nova busca com alguma modificação na pesquisa.
 * - Caso seja possível detectar um erro de digitação, mostre os resultados para a palavra "corrigida", isso evita a frustração de não obter resultados e não força o usuário a realizar uma nova busca.
 * - Quando apropriado, destaque os termos da busca nos resultados.
 * - A entrada do campo de pesquisa deve caber em uma linha. Não use entradas de pesquisa de várias linhas.
 * - Recomenda-se ter apenas uma pesquisa por página. Se você precisar de várias pesquisas, rotule-as claramente para indicar sua finalidade.
 * - Se possível, forneça sugestões de pesquisa, seja em um helptext ou sugestão de pesquisa que é um autocomplete. Isso ajuda os usuários a encontrar o que estão procurando, especialmente se os itens pesquisáveis forem complexos.
 *
 * #### Acessibilidade tratada no componente
 *
 *  Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo proprietário do conteúdo. São elas:
 *
 * - Permitir a interação via teclado (2.1.1: Keyboard (A));
 * - Alteração entre os estados precisa ser indicada por mais de um elemento além da cor (1.4.1: Use of Color);
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                             | Descrição                                            | Valor Padrão                                      |
 * |----------------------------------------|-------------------------------------------------------|---------------------------------------------------|
 * | **Default Values**                     |                                                       |                                                   |
 * | `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                        |
 * | `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-default)`                        |
 * | `--text-color-placeholder`             | Cor do texto no placeholder                           | `var(--color-neutral-light-30)`                   |
 * | `--color`                              | Cor principal do search                               | `var(--color-neutral-dark-70)`                    |
 * | `--border-radius`                      | Contém o valor do raio dos cantos do elemento&nbsp;   | `var(--border-radius-md)`                         |
 * | `--background`                         | Cor de background                                     | `var(--color-neutral-light-05)`                   |
 * | `--text-color`                         | Cor do texto                                          | `var(--color-neutral-dark-90)`                    |
 * | `--color-clear`                        | Cor principal do icone close                          | `var(--color-action-default)`                     |
 * | **Icon**                               |                                                       |                                                   |
 * | `--color-icon-read`                    | Cor principal do icone de leitura                     | `var(--color-neutral-dark-70)`                    |
 * | `--color-icon`                         | Cor principal do icone                                | `var(--color-action-default)`                     |
 * | **Hover**                              |                                                       |                                                   |
 * | `--color-hover`                        | Cor principal no estado hover                         | `var(--color-action-hover)`                       |
 * | `--background-hover`                   | Cor de background no estado hover                     | `var(--color-brand-01-lightest)`                  |
 * | **Focused**                            |                                                       |                                                   |
 * | `--color-focused`                      | Cor principal no estado de focus                      | `var(--color-action-default)`                     |
 * | `--outline-color-focused`              | Cor do outline do estado de focus                     | `var(--color-action-focus)`                       |
 * | **Disabled**                           |                                                       |                                                   |
 * | `--color-disabled`                     | Cor principal no estado disabled                      | `var(--color-action-disabled)`                    |
 * | `--background-color-disabled`          | Cor de background no estado disabled                  | `var(--color-neutral-light-20)`                   |
 *
 */
@Directive()
export class PoSearchBaseComponent {
  private _literals?: PoSearchLiterals;
  private _ariaLabel?: string;
  private language: string;
  private _filterSelect?: Array<PoSearchFilterSelect>;
  private _size?: string = undefined;

  /**
   * @optional
   *
   * @description
   *
   * Desabilita o po-search e não permite que o usuário interaja com o mesmo.
   *
   * @default `false`
   */
  @Input({ alias: 'p-disabled', transform: convertToBoolean }) disabled?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Lista de itens que serão utilizados para pesquisa
   */
  @Input('p-items') items: Array<any> = [];

  /**
   * @optional
   *
   * @description
   *
   * Define um aria-label para o po-search.
   *
   * > Devido o componente não possuir uma label assim como outros campos de texto, o `aria-label` é utilizado para acessibilidade.
   */
  @Input('p-aria-label') set ariaLabel(value: string) {
    this._ariaLabel = value;

    if (value !== this.literals.search) {
      this._ariaLabel = `${this._ariaLabel} ${this.literals.search}`;
    }
  }

  get ariaLabel(): string {
    return this._ariaLabel;
  }

  /**
   * @description
   *
   * Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na lista do componente (p-items), esta propriedade será responsável pelo texto de apresentação de cada item da lista.
   */
  @Input('p-filter-keys') filterKeys: Array<any> = [];

  /**
   * @optional
   *
   * @description
   *
   * Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na lista do componente (p-items), esta propriedade será responsável pelo texto de apresentação de cada item da lista.
   */
  @Input('p-icon') icon: string | TemplateRef<void>;

  /**
   * @optional
   *
   * @description
   *
   * Determina a forma de realizar a pesquisa no componente
   *
   * Valores aceitos:
   * - `action`: Realiza a busca a cada caractere digitado.
   * - `trigger`: Realiza a busca ao pressionar `enter` ou clicar no ícone de busca.
   *
   * @default `action`
   */
  @Input('p-search-type') type: searchMode = 'action';

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as literais usadas no `po-search`.
   *
   * Para utilizar basta passar a literal que deseja customizar:
   *
   * ```
   *  const customLiterals: PoSearchLiterals = {
   *    search: 'Pesquisar',
   *    clean: 'Limpar',
   *  };
   * ```
   *
   * E para carregar a literal customizada, basta apenas passar o objeto para o componente.
   *
   * ```
   * <po-search
   *   [p-literals]="customLiterals">
   * </po-search>
   * ```
   *
   * > O objeto padrão de literais será traduzido de acordo com o idioma do
   * [`PoI18nService`](/documentation/po-i18n) ou do browser.
   */
  @Input('p-literals') set literals(value: PoSearchLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poSearchLiteralsDefault[poLocaleDefault],
        ...poSearchLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poSearchLiteralsDefault[this.language];
    }
  }

  get literals() {
    return this._literals || poSearchLiteralsDefault[this.language];
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o modo de pesquisa utilizado no campo de busca, quando habilitado. Valores definidos no enum: PoSearchFilterMode
   *
   * @default `startsWith`
   */
  @Input('p-filter-type') filterType: PoSearchFilterMode = PoSearchFilterMode.startsWith;

  /**
   * @optional
   *
   * @description
   *
   * Exibe uma lista (auto-complete) com as opções definidas no `p-filter-keys` enquanto realiza uma busca,
   * respeitando o `p-filter-type` como modo de pesquisa.
   *
   * @default `false`
   */
  @Input({ alias: 'p-show-listbox', transform: convertToBoolean }) showListbox?: boolean = false;

  /**
   * @description
   *
   * Define os tipos de filtros (p-filter-keys) a serem aplicados na busca ou lista do componente (p-items).
   * Automaticamente adiciona a opção 'Todos', com um mapeamento de todas as opções passadas.
   *
   * > O uso desta propriedade torna a propriedade 'p-filter-keys' inválida.
   *
   * Exemplo de uso:
   * ```typescript
   * const filterSelect = [
   *   { label: 'personal', value: ['name', 'email', 'nickname'] },
   *   { label: 'address', value: ['country', 'state', 'city', 'street'] },
   *   { label: 'family', value: ['father', 'mother', 'dependents'] }
   * ];
   * ```
   */
  @Input('p-filter-select') set filterSelect(values: Array<PoSearchFilterSelect>) {
    if (!Array.isArray(values) || values.length === 0 || values.every(value => Object.keys(value).length === 0)) {
      this._filterSelect = undefined;
      return;
    }
    const _values: Array<PoSearchFilterSelect> = this.ensureFilterSelectOption(values);

    const allValues = _values.flatMap(e => e.value);
    const uniqueValues = [...new Set(allValues)];

    const filterOptionAll: PoSearchFilterSelect = {
      label: this.literals.all,
      value: uniqueValues
    };

    this._filterSelect = [filterOptionAll, ..._values];
  }

  get filterSelect() {
    return this._filterSelect;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do componente:
   * - `small`: altura do input como 32px (disponível apenas para acessibilidade AA).
   * - `medium`: altura do input como 44px.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  @Input('p-size') set size(value: string) {
    this._size = validateSize(value, this.poThemeService, PoFieldSize);
  }

  get size(): string {
    return this._size ?? getDefaultSize(this.poThemeService, PoFieldSize);
  }

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao alterar valor do model.
   */
  @Output('p-change-model') changeModel: EventEmitter<any> = new EventEmitter();

  /**
   * @optional
   *
   * @description
   *
   * Pode ser informada uma função que será disparada quando houver alterações no input.
   */
  @Output('p-filtered-items-change') filteredItemsChange = new EventEmitter<Array<any>>();

  /**
   * @optional
   *
   * @description
   *
   * Pode ser informada uma função que será disparada quando houver alterações nos filtros.
   */
  @Output('p-filter') filter: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Pode ser informada uma função que será disparada quando houver click no listbox.
   */
  @Output('p-listbox-onclick') listboxOnClick = new EventEmitter<any>();

  constructor(
    languageService: PoLanguageService,
    protected poThemeService: PoThemeService
  ) {
    this.language = languageService.getShortLanguage();
  }

  ensureFilterSelectOption(values: any) {
    const _values = Array.isArray(values) ? values : Array.of(values);
    return _values.map(value => (typeof value === 'object' ? value : { label: value, value }));
  }
}
