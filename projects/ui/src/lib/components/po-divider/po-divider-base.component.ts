import { Input, Directive, OnInit } from '@angular/core';
import { PoDividerSize } from './po-divider-size.enum';

/**
 * @description
 *
 * Este componente apresenta uma linha demarcadora de blocos e pode conter um *label*. Seu uso é indicado para definição
 * e organização de informações em uma tela e sua característica é semelhante à tag `<hr>`.
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
 * | `--color`                              | Cor principla do divider&nbsp;                        | `var(--color-neutral-mid-40)`                   |
 * | `--stroke-linecap`                     | Extremidade da linha&nbsp;                            | `round`                                         |
 *
 */
@Directive()
export class PoDividerBaseComponent implements OnInit {
  coordinateX1: string;
  coordinateX2: string;
  private _borderWidth: string = PoDividerSize.small;

  /** Valor do rótulo a ser exibido. */
  @Input('p-label') label?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define a espessura da linha.
   *
   * Valores válidos:
   * - small
   * - medium
   * - large
   *
   * @default `small`
   */
  @Input('p-border-width') set borderWidth(value: string) {
    this._borderWidth = PoDividerSize[value] ? PoDividerSize[value] : PoDividerSize.small;
    this.getCoordinates();
  }

  get borderWidth() {
    return this._borderWidth;
  }

  ngOnInit(): void {
    this.getCoordinates();
  }

  getCoordinates() {
    if (this.borderWidth === PoDividerSize.small) {
      this.coordinateX1 = '0.1%';
      this.coordinateX2 = '99.9%';
    } else if (this.borderWidth === PoDividerSize.medium) {
      this.coordinateX1 = '0.2%';
      this.coordinateX2 = '99.8%';
    } else {
      this.coordinateX1 = '0.3%';
      this.coordinateX2 = '99.7%';
    }
  }
}
