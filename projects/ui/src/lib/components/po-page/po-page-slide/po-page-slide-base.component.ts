import { Directive, Input } from '@angular/core';

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
 * > Para o correto funcionamento do componente `po-page-slide`, deve ser
 * > importado o módulo `BrowserAnimationsModule` no módulo principal da sua
 * > aplicação.
 */
@Directive()
export class PoPageSlideBaseComponent {
  private _size = 'md';

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
   * Esta opção só é possível se a propriedade `p-click-out` estiver habilitada.
   *
   * @default `false`
   */
  @Input('p-hide-close') @InputBoolean() hideClose?: boolean = false;

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
   * Ativa a visualização da página.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo
   * ser utilizado o `ViewChild` da seguinte forma:
   *
   * ```typescript
   * import { PoPageSlideComponent } from '@po/ng-components';
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
    // Evita com que a página seja aberta sem que seja possível fechá-la.
    if (this.hideClose && !this.clickOut) {
      this.hideClose = false;
    }

    this.hidden = false;
  }

  /**
   * Encerra a visualização da página.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo
   * ser utilizado o `ViewChild` da seguinte forma:
   *
   * ```typescript
   * import { PoPageSlideComponent } from '@po-ui/ng-components';
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
