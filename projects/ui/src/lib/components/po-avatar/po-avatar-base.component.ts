import { Directive, EventEmitter, Input, Output } from '@angular/core';

const PO_AVATAR_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const PO_AVATAR_SIZE_DEFAULT = 'md';

/**
 * @description
 *
 * O componente `po-avatar` é um container para imagens em miniatura, possui um formato redondo e cinco opções de
 * tamanho, pode ser utilizado para mostrar a foto do perfil de um usuário, entre outras possibilidades.
 *
 * Além de poder ser utilizado separadamente, é possível usar o `po-avatar` juntamente com outros componentes e criar
 * layouts ricos e bem interessantes para os usuários, como por exemplo, uma lista de itens ou produtos.
 */
@Directive()
export class PoAvatarBaseComponent {
  private _size: string = 'md';

  /**
   * Fonte da imagem que pode ser um caminho local (`./assets/images/logo-black-small.png`)
   * ou um servidor externo (`https://po-ui.io/assets/images/logo-black-small.png`).
   */
  @Input('p-src') src: string;

  /**
   * @optional
   *
   * @description
   *
   * Tamanho de exibição do componente.
   *
   * Valores válidos:
   *  - `xs` (24x24)
   *  - `sm` (32x32)
   *  - `md` (64x64)
   *  - `lg` (96x96)
   *  - `xl` (144x144)
   *
   * @default `md`
   */
  @Input('p-size') set size(value: string) {
    this._size = PO_AVATAR_SIZES.includes(value) ? value : PO_AVATAR_SIZE_DEFAULT;
  }
  get size(): string {
    return this._size;
  }

  /** Evento disparado ao clicar na imagem do *avatar*. */
  @Output('p-click') click = new EventEmitter<any>();

  get hasClickEvent() {
    return !!this.click.observers.length;
  }
}
