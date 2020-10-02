import { Input, Output, EventEmitter, Directive } from '@angular/core';

import { convertToBoolean, isTypeof } from '../../utils/util';

/**
 *
 * @description
 *
 * O componente `po-widget` é recomendado para exibição de *dashboards*, podendo ser utilizado
 * para incluir vários tipos de conteúdo como: gráficos, tabelas, grids e imagens.
 *
 * Além da exibição de conteúdos, este componente possibilita adicionar ações e um link
 * para ajuda, como também possibilita ser utilizado com ou sem sombra.
 *
 * Para controlar sua largura, é possível utilizar o [Grid System](/guides/grid-system) para um maior
 * controle de seu redimensionamento, assim possibilitando o tratamento para diferentes resoluções.
 */
@Directive()
export abstract class PoWidgetBaseComponent {
  private _background?: string;
  private _disabled?: boolean = false;
  private _height?: number;
  private _help?: string;
  private _noShadow?: boolean = false;
  private _primary?: boolean = false;
  private _primaryLabel?: string;
  private _title?: string;

  containerHeight?: string = 'auto';

  /**
   * @optional
   *
   * @description
   *
   * Aplicação de imagem de fundo.
   * > Se a imagem escolhida intervir na legibilidade do texto contido no `p-widget`,
   * pode-se utilizar a propriedade `p-primary` em conjunto para que os textos fiquem na cor branca.
   *
   */
  @Input('p-background') set background(value: string) {
    this._background = value && typeof value === 'string' ? value : undefined;
  }

  get background() {
    return this._background;
  }

  /**
   * @optional
   *
   * @description
   *
   * Desabilita todas as ações do componente.
   *
   * @default `false`
   */
  @Input('p-disabled') set disabled(value: boolean) {
    this._disabled = convertToBoolean(value);

    this.onDisabled.emit(this.disabled);
  }

  get disabled() {
    return this._disabled;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a altura do `po-widget`.
   * A altura mínima para o `po-widget` depende do que será exibido através das propriedades `p-primary-label`,
   * `p-setting`, `p-help` e `p-title`.
   * > Caso não seja informado valor, a propriedade irá assumir o tamanho do conteúdo.
   */
  @Input('p-height') set height(value: number) {
    this._height = parseInt(<any>value, 10);
    this.setHeight(this.height);
  }

  get height(): number {
    return this._height;
  }

  /**
   * @optional
   *
   * @description
   *
   * Link de ajuda
   */
  @Input('p-help') set help(value: string) {
    this._help = isTypeof(value, 'string') ? value : '';
    this.setHeight(this.height);
  }

  get help(): string {
    return this._help;
  }

  /**
   * @optional
   *
   * @description
   *
   * Desabilita a sombra do `po-widget`.
   *
   * @default `true`
   */
  @Input('p-no-shadow') set noShadow(value: boolean) {
    this._noShadow = <any>value === '' ? true : convertToBoolean(value);
    this.setHeight(this.height);
  }

  get noShadow(): boolean {
    return this._noShadow;
  }

  /**
   * @optional
   *
   * @description
   *
   * Opção para que o `po-widget` fique em destaque.
   *
   * @default `false`
   */
  @Input('p-primary') set primary(value: boolean) {
    this._primary = <any>value === '' ? true : convertToBoolean(value);
  }

  get primary(): boolean {
    return this._primary;
  }

  /**
   * @optional
   *
   * @description
   *
   * Descrição da primeira ação.
   *
   * @default `false`
   */
  @Input('p-primary-label') set primaryLabel(value: string) {
    this._primaryLabel = isTypeof(value, 'string') ? value : '';
    this.setHeight(this.height);
  }

  get primaryLabel(): string {
    return this._primaryLabel;
  }

  /** Descrição da segunda ação. */
  @Input('p-secondary-label') secondaryLabel?: string;

  /**
   * @optional
   *
   * @description
   *
   * Título do `po-widget`.
   *
   * @default `false`
   */
  @Input('p-title') set title(value: string) {
    this._title = isTypeof(value, 'string') ? value : '';
    this.setHeight(this.height);
  }

  get title(): string {
    return this._title;
  }

  /**
   * @optional
   *
   * @description
   *
   * Ação que será executada quando o usuário clicar sobre a área total do `po-widget`.
   */
  @Output('p-click') click: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * @optional
   *
   * @description
   *
   * Função que será disparada com o valor do `p-disabled` quando esta propriedade for alterada.
   */
  @Output('p-on-disabled') onDisabled: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Função que será chamada na primeira ação.
   */
  @Output('p-primary-action') primaryAction: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Função que será chamada na segunda ação.
   */
  @Output('p-secondary-action') secondaryAction: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   * Função chamada ao clicar no ícone de configuração
   */
  @Output('p-setting') setting: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   * Função que será chamada ao clicar no título.
   */
  @Output('p-title-action') titleAction: EventEmitter<any> = new EventEmitter<any>();

  abstract setHeight(height: number);
}
