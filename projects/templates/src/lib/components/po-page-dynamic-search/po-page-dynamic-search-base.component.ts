import { EventEmitter, Input, Output, Directive } from '@angular/core';

import {
  InputBoolean,
  PoBreadcrumb,
  PoDynamicFormField,
  PoLanguageService,
  PoPageAction,
  poLocaleDefault
} from '@po-ui/ng-components';

import { convertToInt } from '../../utils/util';

import { PoPageDynamicSearchLiterals } from './po-page-dynamic-search-literals.interface';
import { poAdvancedFiltersLiteralsDefault } from './po-advanced-filter/po-advanced-filter-base.component';
import { PoAdvancedFilterLiterals } from './po-advanced-filter/po-advanced-filter-literals.interface';
import { PoPageDynamicSearchOptions } from './po-page-dynamic-search-options.interface';
import { PoPageDynamicSearchFilters } from './po-page-dynamic-search-filters.interface';

export const poPageDynamicSearchLiteralsDefault = {
  en: <PoPageDynamicSearchLiterals>{
    disclaimerGroupTitle: 'Displaying results filtered by:',
    filterTitle: poAdvancedFiltersLiteralsDefault.en.title,
    filterCancelLabel: poAdvancedFiltersLiteralsDefault.en.cancelLabel,
    filterConfirmLabel: poAdvancedFiltersLiteralsDefault.en.confirmLabel,
    quickSearchLabel: 'Quick search:',
    searchPlaceholder: 'Search'
  },
  es: <PoPageDynamicSearchLiterals>{
    disclaimerGroupTitle: 'Presentando resultados filtrados por:',
    filterTitle: poAdvancedFiltersLiteralsDefault.es.title,
    filterCancelLabel: poAdvancedFiltersLiteralsDefault.es.cancelLabel,
    filterConfirmLabel: poAdvancedFiltersLiteralsDefault.es.confirmLabel,
    quickSearchLabel: 'Búsqueda rápida:',
    searchPlaceholder: 'Buscar'
  },
  pt: <PoPageDynamicSearchLiterals>{
    disclaimerGroupTitle: 'Apresentando resultados filtrados por:',
    filterTitle: poAdvancedFiltersLiteralsDefault.pt.title,
    filterCancelLabel: poAdvancedFiltersLiteralsDefault.pt.cancelLabel,
    filterConfirmLabel: poAdvancedFiltersLiteralsDefault.pt.confirmLabel,
    quickSearchLabel: 'Pesquisa rápida:',
    searchPlaceholder: 'Pesquisar'
  },
  ru: <PoPageDynamicSearchLiterals>{
    disclaimerGroupTitle: 'Отображение результатов, отфильтрованных по:',
    filterTitle: poAdvancedFiltersLiteralsDefault.ru.title,
    filterCancelLabel: poAdvancedFiltersLiteralsDefault.ru.cancelLabel,
    filterConfirmLabel: poAdvancedFiltersLiteralsDefault.ru.confirmLabel,
    quickSearchLabel: 'Быстрый поиск:',
    searchPlaceholder: 'исследование'
  }
};

/**
 * @description
 *
 * Componente com as ações de pesquisa já definidas, bastando que o desenvolvedor implemente apenas a chamada para as APIs
 * e exiba as informações.
 */
@Directive()
export abstract class PoPageDynamicSearchBaseComponent {
  private _filters: Array<PoDynamicFormField> = [];
  private _literals: PoPageDynamicSearchLiterals;
  private _quickSearchWidth: number;

  advancedFilterLiterals: PoAdvancedFilterLiterals;

  private previousFilters: Array<PoDynamicFormField>;
  private language: string;

  /** Nesta propriedade deve ser definido um array de objetos que implementam a interface `PoPageAction`. */
  @Input('p-actions') actions?: Array<PoPageAction> = [];

  /** Objeto com propriedades do breadcrumb. */
  @Input('p-breadcrumb') breadcrumb?: PoBreadcrumb = { items: [] };

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as literais usadas no `po-page-dynamic-search`.
   *
   * Existem duas maneiras de customizar o componente, passando um objeto com todas as literais disponíveis:
   *
   * ```
   *  const customLiterals: PoPageDynamicSearchLiterals = {
   *    disclaimerGroupTitle: 'Filtros aplicados:',
   *    filterTitle: 'Filtro avançado',
   *    filterCancelLabel: 'Fechar',
   *    filterConfirmLabel: 'Aplicar',
   *    quickSearchLabel: 'Valor pesquisado:',
   *    searchPlaceholder: 'Pesquise aqui'
   *  };
   * ```
   *
   * Ou passando apenas as literais que deseja customizar:
   *
   * ```
   *  const customLiterals: PoPageDynamicSearchLiterals = {
   *    filterTitle: 'Filtro avançado'
   *  };
   * ```
   *
   * E para carregar as literais customizadas, basta apenas passar o objeto para o componente.
   *
   * ```
   * <po-page-dynamic-search
   *   [p-literals]="customLiterals">
   * </po-page-dynamic-search>
   * ```
   *
   * > O valor padrão será traduzido de acordo com o idioma configurado no [`PoI18nService`](/documentation/po-i18n) ou *browser*.
   */
  @Input('p-literals') set literals(value: PoPageDynamicSearchLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poPageDynamicSearchLiteralsDefault[poLocaleDefault],
        ...poPageDynamicSearchLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poPageDynamicSearchLiteralsDefault[this.language];
    }

    this.setAdvancedFilterLiterals(this.literals);
  }

  get literals() {
    return this._literals || poPageDynamicSearchLiteralsDefault[this.language];
  }

  /**
   * @optional
   *
   * @description
   *
   * Lista dos campos usados na busca avançada. Caso o mesmo não seja passado a busca avançada não será exibida.
   */
  @Input('p-filters') set filters(filters: Array<PoPageDynamicSearchFilters>) {
    this._filters = Array.isArray(filters) ? [...filters] : [];

    if (JSON.stringify(this._filters) !== JSON.stringify(this.previousFilters)) {
      this.onChangeFilters(this.filters);

      this.previousFilters = [...this._filters];
    }
  }

  get filters(): Array<PoPageDynamicSearchFilters> {
    return this._filters;
  }

  /**
   * @optional
   *
   * @description
   *
   * Mantém na busca avançada os valores preenchidos do último filtro realizado pelo usuário.
   *
   * @default `false`
   */
  @InputBoolean()
  @Input('p-keep-filters')
  keepFilters: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Permite a utilização da pesquisa rápida junto com a pesquisa avançada.
   *
   * Desta forma, ao ter uma pesquisa avançada estabelecida e ser
   * preenchido a pesquisa rápida, o filtro será concatenado adicionando a pesquisa
   * rápida também na lista de `disclaimers`.
   *
   * > Os valores que são emitidos no `p-quick-search` e no `p-advanced-search`
   * permanecem separados durante a emissão dos valores alterados. A concatenação
   * é apenas nos `disclaimers`.
   *
   * @default `false`
   */
  @InputBoolean()
  @Input('p-concat-filters')
  concatFilters: boolean = false;

  /**
   * Função ou serviço que será executado na inicialização do componente.
   *
   * A propriedade aceita os seguintes tipos:
   * - `string`: *Endpoint* usado pelo componente para requisição via `POST`.
   * - `function`: Método que será executado.
   *
   * O retorno desta função deve ser do tipo `PoPageDynamicSearchOptions`,
   * onde o usuário poderá customizar novos filtros, breadcrumb, title e actions
   *
   * Por exemplo:
   *
   * ```
   * getPageOptions(): PoPageDynamicSearchOptions {
   * return {
   *   actions: [
   *     { label: 'Find on Google' },
   *   ],
   *   filters: [
   *     { property: 'idCard', gridColumns: 6 }
   *   ]
   * };
   * }
   *
   * ```
   * Para referenciar a sua função utilize a propriedade `bind`, por exemplo:
   * ```
   *  [p-load]="onLoadOptions.bind(this)"
   * ```
   */
  @Input('p-load') onLoad: string | (() => PoPageDynamicSearchOptions);

  /** Título da página. */
  @Input('p-title') title: string;

  /**
   * @optional
   *
   * @description
   *
   * Largura do campo de busca, utilizando o *Grid System*,
   * e limitado ao máximo de 6 colunas. O tamanho mínimo é controlado
   * conforme resolução de tela para manter a consistência do layout.
   */
  @Input('p-quick-search-width') set quickSearchWidth(value: number) {
    this._quickSearchWidth = convertToInt(value);
  }

  get quickSearchWidth(): number {
    return this._quickSearchWidth;
  }

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao executar a pesquisa avançada, o mesmo irá repassar um objeto com os valores preenchidos no modal de pesquisa.
   *
   * > Campos não preenchidos não irão aparecer no objeto passado por parâmetro.
   */
  @Output('p-advanced-search') advancedSearch: EventEmitter<any> = new EventEmitter();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao remover um ou todos os disclaimers pelo usuário.
   */
  @Output('p-change-disclaimers') changeDisclaimers: EventEmitter<any> = new EventEmitter();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao realizar uma busca pelo campo de pesquisa rápida, o mesmo será chamado repassando o valor digitado.
   */
  @Output('p-quick-search') quickSearch: EventEmitter<string> = new EventEmitter();

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }

  abstract onChangeFilters(filters: Array<PoPageDynamicSearchFilters>);

  protected setAdvancedFilterLiterals(literals: PoPageDynamicSearchLiterals) {
    this.advancedFilterLiterals = {
      cancelLabel: literals.filterCancelLabel,
      confirmLabel: literals.filterConfirmLabel,
      title: literals.filterTitle
    };
  }
}
