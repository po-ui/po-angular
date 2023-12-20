import { PoLanguageService } from '../../services/po-language/po-language.service';
import { poLocaleDefault } from '../../services/po-language/po-language.constant';

import { Directive, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { convertToBoolean } from '../../utils/util';
import { PoSearchLiterals } from './literals/po-search-literals';
import { poSearchLiteralsDefault } from './literals/po-search-literals-default';
import { PoSearchFilterMode } from './enum/po-search-filter-mode.enum';

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
 */
@Directive()
export class PoSearchBaseComponent {
  private _literals?: PoSearchLiterals;
  private _ariaLabel?: string;
  private language: string;

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

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }
}
