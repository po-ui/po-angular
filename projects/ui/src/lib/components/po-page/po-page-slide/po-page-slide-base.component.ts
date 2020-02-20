import { Input } from '@angular/core';

import { InputBoolean } from '../../../decorators';

/**
 * @description
 *
 * O componente `po-page-slide` é utilizado para incluir conteúdos secundários
 * adicionando controles e navegações adicionais, mas mantendo o usuário na
 * página principal.
 *
 * Este componente é ativado a partir do método `#open()` e pode ser  encerrado
 * através do botão que encontra-se no cabeçalho do mesmo ou através do método
 * `#close()`.
 *
 * É possível definir o alinhamento do componente na página principal à
 * esquerda ou à direita.
 *
 * > Não é permitido ativar dois ou mais `po-page-slide` simultâneamente.
 */
export class PoPageSlideBaseComponent {
  private _size = 'md';
  private _align = 'right';

  /**
   * @description
   *
   * Título da página.
   */
  @Input('p-title') title: string;

  /**
   * @description
   *
   * Subtítulo da página.
   */
  @Input('p-subtitle') subtitle?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho da página.
   *
   * Valores válidos:
   *  - `sm` (pequeno)
   *  - `md` (médio)
   *  - `lg` (grande)
   *  - `xl` (extra-grande)
   *  - `auto` (automático)
   *
   * > Todas as opções de tamanho possuem uma largura máxima de **768px**.
   *
   * @default `md`
   */
  @Input('p-size') set size(value: string) {
    const sizes = ['sm', 'md', 'lg', 'xl', 'auto'];
    this._size = sizes.indexOf(value) > -1 ? value : 'md';
  }

  get size() {
    return this._size;
  }

  /**
   * @optional
   *
   * @description
   *
   * Oculta o botão de encerramento da página.
   *
   * @default `false`
   */
  @Input('p-hide-close') @InputBoolean() hideClose?: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define o alinhamento horizontal da página.
   *
   * Valores válidos:
   *  - `left` (esquerda)
   *  - `right` (direita)
   *
   * @default `right`
   */
  @Input('p-align') set align(value: string) {
    const aligns = ['left', 'right'];
    this._align = aligns.indexOf(value) > -1 ? value : 'right';
  }

  get align(): string {
    return this._align;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define se permite o encerramento da página ao clicar fora da mesma.
   *
   * @default `false`
   */
  @Input('p-click-out') @InputBoolean() clickOut?: boolean = false;

  // Controla se a página está ou não oculta, por padrão é oculto.
  public hidden = true;

  /**
   * @description
   *
   * Ativa a visualização da página.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo
   * ser utilizado o `ViewChild` da seguinte forma:
   *
   * ```typescript
   * import { PoPageSlideComponent } from '@portinari/portinari-ui';
   *
   * ...
   *
   * @ViewChild(PoPageSlideComponent, { static: true }) pageSlide: PoPageSlideComponent;
   *
   * public openPage() {
   *   this.pageSlide.open();
   * }
   * ```
   */
  public open() {
    this.hidden = false;
  }

  /**
   * @description
   *
   * Encerra a visualização da página.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo
   * ser utilizado o `ViewChild` da seguinte forma:
   *
   * ```typescript
   * import { PoPageSlideComponent } from '@portinari/portinari-ui';
   *
   * ...
   *
   * @ViewChild(PoPageSlideComponent, { static: true }) pageSlide: PoPageSlideComponent;
   *
   * public closePage() {
   *   this.pageSlide.close();
   * }
   * ```
   */
  public close(): void {
    this.hidden = true;
  }
}
