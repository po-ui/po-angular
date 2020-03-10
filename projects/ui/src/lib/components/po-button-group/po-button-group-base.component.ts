import { Input, Directive } from '@angular/core';

import { convertToBoolean } from '../../utils/util';
import { PoButtonGroupItem } from './po-button-group-item.interface';
import { PoButtonGroupToggle } from './po-button-group-toggle.enum';

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
 */
@Directive()
export class PoButtonGroupBaseComponent {
  private _small?: boolean = false;
  private _toggle?: string = PO_TOGGLE_TYPE_DEFAULT;

  /** Lista de botões. */
  @Input('p-buttons') buttons: Array<PoButtonGroupItem> = [];

  /**
   * @optional
   *
   * @description
   *
   * Torna o grupo de botões com tamanho minificado.
   *
   * @default `false`
   */
  @Input('p-small') set small(value: boolean) {
    this._small = <any>value === '' ? true : convertToBoolean(value);
  }

  get small(): boolean {
    return this._small;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o modo de seleção de botões.
   *
   * > Veja os valores válidos no *enum* `PoMultiselectFilterMode`.
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

  onButtonClick(buttonClicked: PoButtonGroupItem, buttonIndex: number) {
    if (this.toggle === PoButtonGroupToggle.Single) {
      this.buttons.forEach(
        (button, index) => (button.selected = index === buttonIndex ? !buttonClicked.selected : false)
      );
    } else if (this.toggle === PoButtonGroupToggle.Multiple) {
      buttonClicked.selected = !buttonClicked.selected;
    }
  }

  private checkSelecteds(toggleMode: string) {
    if (toggleMode === PoButtonGroupToggle.None) {
      this.deselectAllButtons();
    } else if (toggleMode === PoButtonGroupToggle.Single) {
      const hasMoreOneSelected = this.buttons.filter(button => button.selected).length > 1;
      if (hasMoreOneSelected) {
        this.deselectAllButtons();
      }
    }
  }

  private deselectAllButtons() {
    this.buttons.forEach(button => (button.selected = false));
  }
}
