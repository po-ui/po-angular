import { Directive, EventEmitter, Input, Output } from '@angular/core';

import { convertToBoolean } from '../../../utils/util';

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
 *
 *  Caso utilize componentes de field dentro do page-slide, recomenda-se o uso do [Grid System](https://po-ui.io/guides/grid-system).
 *
 * No rodapé é possível utilizar o componente [`PoPageSlideFooter`](/documentation/po-page-slide-footer) para customização do template.
 *
 *  * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                              | Descrição                                                         | Valor Padrão                                                                  |
 * |------------------------------------------|-------------------------------------------------------------------|-------------------------------------------------------------------------------|
 * | `--font-family`                          | Família tipográfica usada                                         | `var(--font-family-theme)`                                                    |
 * | `--font-weight`                          | Peso da fonte                                                     | `var(--font-weight-bold)`                                                     |
 * | `--padding-header`                       | Espaçamento do header                                             | `var(--spacing-md)`                                                           |
 * | `--padding-body`                         | Espaçamento do conteúdo                                           | `var(--line-height-none)`                                                     |
 * | `--padding-footer`                       | Espaçamento do footer                                             | `var(--spacing-sm) var(--spacing-md) var(--spacing-xl) var(--spacing-md)`     |
 * | **Default Values**                       |                                                                   |                                                                               |
 * | `--color-overlay`                        | Cor do overlay                                                    | `var(--color-neutral-dark-80)`                                                |
 * | `--opacity-overlay`                      | Cor da opacidade do overlay                                       | `0.7`                                                                         |
 * | `--background-color`                     | Cor de background                                                 | `var(--color-neutral-light-00)`                                               |
 * | `--border-color`                         | Cor da borda                                                      | `var(--color-neutral-light-20)`                                               |
 * | `--color-title`                          | Cor do titulo do header                                           | `var(--color-neutral-dark-95)`                                                |
 * | `--border-radius`                        | Radius da borda                                                   | `var(--border-radius-md) 0 0 var(--border-radius-md)`                         |
 * | `--transition-duration`                  | Duração da transição                                              | `var(--duration-extra-fast)`                                                  |
 * | `--transition-timing`                    | Duração da transição com o tipo de transição                      | `var(--duration-extra-slow) var(--timing-standart)`                           |
 * | `--page-slide-width-sm`                  | Tamanho da largura do componente no tamanho `small`               | `40%`                                                                         |
 * | `--page-slide-width-md`                  | Tamanho da largura do componente no tamanho `medium`              | `50%`                                                                         |
 * | `--page-slide-width-lg`                  | Tamanho da largura do componente no tamanho `large`               | `60%`                                                                         |
 * | `--page-slide-width-xl`                  | Tamanho da largura do componente no tamanho `extra large`         | `70%`                                                                         |
 * | `--page-slide-min-width-auto`            | Tamanho da largura mínima do componente no tamanho `auto`         | `40%`                                                                         |
 * | `--page-slide-max-width-auto`            | Tamanho da largura máxima do componente no tamanho `auto`         | `90%`                                                                         |
 *
 */
@Directive()
export class PoPageSlideBaseComponent {
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
   * Oculta o botão de encerramento da página.
   *
   * Esta opção só é possível se a propriedade `p-click-out` estiver habilitada.
   *
   * @default `false`
   */
  @Input({ alias: 'p-hide-close', transform: convertToBoolean }) hideClose: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define se permite o encerramento da página ao clicar fora da mesma.
   *
   * @default `false`
   */
  @Input({ alias: 'p-click-out', transform: convertToBoolean }) clickOut: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Permite a expansão dinâmica da largura do `po-page-slide` quando `p-size` for `auto` (automático).
   * Propriedade necessária para correto funcionamento da `po-table` dentro do `po-page-slide`
   *
   * @default `false`
   */
  @Input({ alias: 'p-flexible-width', transform: convertToBoolean }) flexibleWidth: boolean = false;

  /**
   * @optional
   *
   * @description
   * Evento executado ao fechar o page slide.
   */
  @Output('p-close') closePageSlide: EventEmitter<any> = new EventEmitter<any>();

  // Controla se a página está ou não oculta, por padrão é oculto.
  public hidden = true;

  private _size = 'md';

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
   * > Todas as opções de tamanho, exceto `auto`, possuem uma largura máxima de **768px**.
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
    this.closePageSlide.emit();
  }
}
