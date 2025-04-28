import { Component, Input } from '@angular/core';

/**
 * @description
 *
 * O componente `po-page-slide-footer` pode ser utilizado para incluir os botões de ações no rodapé da [`PoPageSlide`](/documentation/po-page-slide), bem como para dar liberdade ao desenvolvedor de incluir outros itens necessários.
 * > Como boa prática, deve-se observar a utilização de apenas um botão primário.
 *
 * ```
 * <po-page-slide p-title="Title page-slide" #pageSlide>
 *  <po-page-slide-footer>
 *    <po-button p-label="Close" (p-click)="pageSlide.close()"> </po-button>
 *    <po-button p-label="Clean" (p-click)="clean()"> </po-button>
 *    <po-button p-label="Confirm" p-kind="primary" (p-click)="confirm()"> </po-button>
 *  </po-page-slide-footer>
 * </po-page-slide>
 * ```
 */
@Component({
  selector: 'po-page-slide-footer',
  templateUrl: './po-page-slide-footer.component.html',
  standalone: false
})
export class PoPageSlideFooterComponent {
  /**
   * @optional
   *
   * @description
   *
   * Desabilita o alinhamento padrão, à direita, dos botões de ações que ficam no rodapé da [`PoPageSlide`](/documentation/po-page-slide).
   *
   * > Caso a propriedade esteja habilitada, o alinhamento deverá ser a esquerda e pode ser personalizado.
   *
   * @default false
   */
  @Input('p-disabled-align') disabledAlign?: boolean = false;
}
