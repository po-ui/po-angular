import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { convertToBoolean } from '../../utils/util';
import { PoAccordionLiterals } from './interfaces/po-accordion-literals.interface';

export const poAccordionLiteralsDefault = {
  en: <PoAccordionLiterals>{
    closeAllItems: 'Close all items',
    expandAllItems: 'Open all items'
  },
  es: <PoAccordionLiterals>{
    closeAllItems: 'Cerrar todos los elementos',
    expandAllItems: 'Abrir todos los elementos'
  },
  pt: <PoAccordionLiterals>{
    closeAllItems: 'Fechar todos os itens',
    expandAllItems: 'Abrir todos os itens'
  },
  ru: <PoAccordionLiterals>{
    closeAllItems: 'Закрыть все элементы',
    expandAllItems: 'Открыть все элементы'
  }
};

/**
 * @description
 *
 * Componente utilizado para agrupar visualmente uma lista de conteúdos, mostrando-os individualmente
 * ao clicar no título de cada item.
 *
 * Para utilizá-lo, é necessário envolver cada item no componente [`po-accordion-item`](/documentation/po-accordion-item),
 * como no exemplo abaixo:
 *
 * ```
 * <po-accordion #accordion [p-show-manager-accordion]="true">
 *   <po-accordion-item p-label="PO Accordion 1">
 *      Accordion 1
 *   </po-accordion-item>
 *
 *   <po-accordion-item p-label="PO Accordion 2">
 *      Accordion 2
 *   </po-accordion-item>
 * </po-accordion>
 * ```
 *
 * e no typescript pode-se utilizar o `@ViewChild`:
 *
 * ```
 *  @ViewChild(PoAccordionComponent, { static: true }) accordion: PoAccordionComponent;
 *
 *  ngAfterContentInit() {
 *    // ou utilizar o método collapseAllItems();
 *    this.accordion.expandAllItems();
 *  }
 * ```
 *
 * O componente já faz o controle de abertura e fechamento dos itens automaticamente.
 *
 * Caso houver a necessidade de abrir algum dos `po-accordion-item` via Typescript
 * acesse a [documentação do PoAccordionItem](/documentation/po-accordion-item).
 */
@Directive()
export class PoAccordionBaseComponent {
  private language: string = poLocaleDefault;
  private _literals;

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as literais usadas no `po-accordion`.
   *
   * Existem duas maneiras de customizar o componente, passando um objeto com todas as literais disponíveis:
   *
   * ```
   *  const customLiterals: PoAccordionLiterals = {
   *    closeAllItems: 'Fechar todos os itens',
   *    expandAllItems: 'Expandir todos os itens'
   *  };
   * ```
   *
   * Ou passando apenas as literais que deseja customizar:
   *
   * ```
   *  const customLiterals: PoAccordionLiterals = {
   *    expandAllItems: 'Expandir todos os itens'
   *  };
   * ```
   *
   * E para carregar as literais customizadas, basta apenas passar o objeto para o componente.
   *
   * ```
   * <po-accordion
   *   [p-literals]="customLiterals">
   * </po-accordion>
   * ```
   *
   * > O objeto padrão de literais será traduzido de acordo com o idioma do
   * [`PoI18nService`](/documentation/po-i18n) ou do browser.
   */
  @Input('p-literals') set literals(value: PoAccordionLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poAccordionLiteralsDefault[poLocaleDefault],
        ...poAccordionLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poAccordionLiteralsDefault[this.language];
    }
  }

  get literals() {
    return this._literals || poAccordionLiteralsDefault[this.language];
  }

  /**
   * @optional
   *
   * @description
   *
   * Exibe o Gerenciador de Accordion.
   *
   * @default `false`
   */
  @Input({ alias: 'p-show-manager-accordion', transform: convertToBoolean }) showManagerAccordion: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Permite expandir mais de um `<po-accordion-item></po-accordion-item>` ao mesmo tempo.
   * Sempre habilitada caso a propriedade `p-show-manager-accordion` esteja como `true`.
   *
   * @default `false`
   */
  @Input({ alias: 'p-allow-expand-all-items', transform: convertToBoolean }) allowExpandItems: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao expandir o gerenciador de accordion, seja manualmente ou programaticamente.
   *
   */
  @Output('p-expand-all') expandAllEvent = new EventEmitter<void>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao retrair o gerenciador de accordion, seja manualmente ou programaticamente.
   *
   */
  @Output('p-collapse-all') collapseAllEvent = new EventEmitter<void>();

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }
}
