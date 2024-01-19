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
 *
 * #### Propriedades customizáveis
 *
 * | Propriedade                            | Descrição                                             | Valor Padrão                                    |
 * |----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
 * | **Default Values**                     |                                                       |                                                 |
 * | --font-family                          | Família tipográfica usada                             | var(--font-family-theme)                        |
 * | --font-size                            | Tamanho da fonte                                      | var(--font-size-default)                        |
 * | --color                                | Cor do accordion                                      | var(--color-action-default)                     |
 * | --background-color                     | Cor de background                                     | var(--color-neutral-light-00)                   |
 * | --font-weight                          | Peso da fonte                                         | var(--font-weight-bold)                         |
 * | ---                                    | ---                                                   | ---                                             |
 * | **Hover**                              |                                                       |                                                 |
 * | --color-hover                          | Cor de hover                                          | var(--color-action-hover)                       |
 * | --background-hover                     | Cor de background de hover                            | var(--color-brand-01-lightest)                  |
 * | ---                                    | ---                                                   | ---                                             |
 * | **Focused**                            |                                                       |                                                 |
 * | --color-focused                        | Cor no estado de focus                                | var(--color-action-focus)                       |
 * | --outline-color-focused &nbsp;         | Cor do outline do focus                               | var(--color-action-focus)                       |
 * | ---                                    | ---                                                   | ---                                             |
 * | **Disabled**                           |                                                       |                                                 |
 * | --color-disabled                       | Cor no estado disabled                                | var(--color-neutral-mid-60)                     |
 * | --background-disabled &nbsp;           | Cor de background no estado disabled                  | var(--color-neutral-light-10)                   |
 * | ---                                    | ---                                                   | ---                                             |
 * | **po-accordion-manager**               |                                                       |                                                 |
 * | --background-color                     | Cor do background                                     | var(--color-neutral-mid-60)                     |
 * | --color                                | Cor de background no estado disabled                  | var(--color-neutral-light-10)                   |
 * | --font-family                          | Família tipográfica usada                             | var(--color-neutral-light-10)                   |
 * | --font-size                            | Tamanho da fonte                                      | var(--color-neutral-light-10)                   |
 * | --font-weight                          | Peso da fonte                                         | var(--color-neutral-light-10)                   |
 * | ---                                    | ---                                                   | ---                                             |
 * | **Pressed**                            |                                                       |                                                 |
 * | --background-pressed &nbsp;            | Cor de background quando pressionado &nbsp;           | var(--color-brand-01-lighter)                   |
 * | --color-pressed                        | Cor quando pressionado                                | var(--color-action-pressed)                     |
 * | ---                                    | ---                                                   | ---                                             |
 * | **Focused**                            |                                                       |                                                 |
 * | --color-focus                          | Cor no estado de focus                                | var(--color-action-default)                     |
 * | --outline-color-focused &nbsp;         | Cor do outline do focus                               | var(--color-action-focus)                       |
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
