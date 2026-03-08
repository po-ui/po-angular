import { Component, HostBinding, HostListener, Input, input } from '@angular/core';

import { PoFieldSize } from '../../enums/po-field-size.enum';
import { getDefaultSizeFn, validateSizeFn } from '../../utils/util';
import { PoButtonGroupToggle } from './enums/po-button-group-toggle.enum';
import { PoButtonGroupItem } from './po-button-group-item.interface';

const PO_TOGGLE_TYPE_DEFAULT = 'none';

/**
 * @description
 *
 * O componente `po-button-group` é formado por um conjunto de botões distribuídos horizontalmente.
 * Cada botão do grupo é tratado de forma individual, recebendo assim um rótulo, uma ação bem como se deverá estar habilitado ou não.
 *
 * Este componente além de servir como um agrupador de botões para ação, também permite que sejam utilizados
 * para seleções multiplas e únicas.
 *
 * O grupo de botões deve ser utilizado para organizar as ações de maneira uniforme e transmitir a ideia de que os botões fazem
 * parte de um mesmo contexto.
 *
 * #### Boas práticas
 *
 * - Evite usar o `po-button-group` com apenas 1 ação, para isso utilize o `po-button`.
 * - Procure utilizar no máximo 3 ações para cada `po-button-group`.
 *
 * > As recomendações do `po-button` também valem para o `po-button-group`.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                            | Descrição                                             | Valor Padrão                                    |
 * |----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
 * | **Default Values**                     |                                                       |                                                 |
 * | `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                      |
 * | `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-default)`                      |
 * | `--font-weight`                        | Peso da fonte                                         | `var(--font-weight-bold)`                       |
 * | `--line-height`                        | Tamanho da label                                      | `var(--line-height-none)`                       |
 * | `--border-radius`                      | Contém o valor do raio dos cantos do elemento&nbsp;   | `var(--border-radius-md)`                       |
 * | `--border-width`                       | Contém o valor da largura dos cantos do elemento&nbsp;| `var(--border-width-md)`                        |
 * | `--padding`                            | Preenchimento                                         | `0 1em`                                         |
 * | `--text-color`                         | Cor do texto                                          | `var(--color-neutral-light-00)`                 |
 * | `--color`                              | Cor principal do botão                                | `var(--color-action-default)`                   |
 * | `--background-color`                   | Cor de background                                     | `var(--color-transparent)`                      |
 * | `--shadow`                             | Contém o valor da sombra do elemento                  | `var(--shadow-none)`                            |
 * | **Hover**                              |                                                       |                                                 |
 * | `--color-hover`                        | Cor principal no estado hover                         | `var(--color-action-hover)`                     |
 * | `--background-hover`                   | Cor de background no estado hover                     | `var(--color-brand-01-lighter)`                 |
 * | `--border-color-hover`                 | Cor da borda no estado hover                          | `var(--color-brand-01-darkest)`                 |
 * | **Focused**                            |                                                       |                                                 |
 * | `--outline-color-focused`              | Cor do outline do estado de focus                     | `var(--color-action-focus)`                     |
 * | **Pressed**                            |                                                       |                                                 |
 * | `--color-pressed`                      | Cor principal no estado de pressionado                | `var(--color-action-pressed)`                   |
 * | `--background-pressed`                 | Cor de background no estado de pressionado&nbsp;      | `var(--color-brand-01-light)`                   |
 * | **Disabled**                           |                                                       |                                                 |
 * | `--color-disabled`                     | Cor principal no estado disabled                      | `var(--color-action-disabled)`                  |
 * | `--background-color-disabled` &nbsp;   | Cor de background no estado disabled                  | `var(--color-transparent)`                      |
 *
 */
@Component({
  selector: 'po-button-group-base',
  template: '',
  standalone: false
})
export class PoButtonGroupBaseComponent {
  /**
   * @Input
   *
   * @description
   *
   * Lista de botões.
   */
  readonly buttons = input<Array<PoButtonGroupItem>>([], { alias: 'p-buttons' });

  private _size?: string = undefined;
  private _initialSize?: string = undefined;

  private _toggle?: string = PO_TOGGLE_TYPE_DEFAULT;

  /**
   * @optional
   *
   * @description
   *
   * Define o modo de seleção dos botões no componente conforme valores especificados no enum `PoButtonGroupToggle`:
   *  - `multiple`: permite múltiplas seleções.
   *  - `none`: desativa a funcionalidade de seleção.
   *  - `single`: restringe a seleção a um único botão.
   *
   * @default `none`
   */
  @Input('p-toggle') set toggle(value: string) {
    this._toggle = (<any>Object).values(PoButtonGroupToggle).includes(value) ? value : PO_TOGGLE_TYPE_DEFAULT;

    this.checkSelecteds(this._toggle);
  }

  get toggle(): string {
    return this._toggle;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do componente:
   * - `small`: altura de 32px (disponível apenas para acessibilidade AA).
   * - `medium`: altura de 44px.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  set size(value: string) {
    this._initialSize = value;
    this.applySizeBasedOnA11y();
  }

  @Input('p-size')
  @HostBinding('attr.p-size')
  get size(): string {
    return this._size ?? getDefaultSizeFn(PoFieldSize);
  }

  onButtonClick(buttonClicked: PoButtonGroupItem, buttonIndex: number) {
    if (this.toggle === PoButtonGroupToggle.Single) {
      this.buttons().forEach(
        (button, index) => (button.selected = index === buttonIndex ? !buttonClicked.selected : false)
      );
    } else if (this.toggle === PoButtonGroupToggle.Multiple) {
      buttonClicked.selected = !buttonClicked.selected;
    }
  }

  @HostListener('window:PoUiThemeChange')
  protected onThemeChange(): void {
    this.applySizeBasedOnA11y();
  }

  private applySizeBasedOnA11y(): void {
    const size = validateSizeFn(this._initialSize, PoFieldSize);
    this._size = size;
  }

  private checkSelecteds(toggleMode: string) {
    if (toggleMode === PoButtonGroupToggle.None) {
      this.deselectAllButtons();
    } else if (toggleMode === PoButtonGroupToggle.Single) {
      const hasMoreOneSelected = this.buttons().filter(button => button.selected).length > 1;
      if (hasMoreOneSelected) {
        this.deselectAllButtons();
      }
    }
  }

  private deselectAllButtons() {
    this.buttons().forEach(button => (button.selected = false));
  }
}
