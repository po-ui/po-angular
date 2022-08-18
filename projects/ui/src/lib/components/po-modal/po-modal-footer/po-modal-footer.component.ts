import { Component, Input } from '@angular/core';

/**
 * @description
 *
 * O componente `po-modal-footer` pode ser utilizado para incluir os botões de ações no rodapé da [`PoModal`](/documentation/po-modal), bem como para dar liberdade ao desenvolvedor de incluir outros itens necessários.
 * > Como boa prática, deve-se observar a utilização de apenas um botão primário.
 *
 * ```
 * <po-modal p-title="Title Modal" #modal>
 *  <po-modal-footer>
 *    <po-button p-label="Close" (p-click)="modal.close()"> </po-button>
 *    <po-button p-label="Clean" (p-click)="clean()"> </po-button>
 *    <po-button p-label="Confirm" p-kind="primary" (p-click)="confirm()"> </po-button>
 *  </po-modal-footer>
 * </po-modal>
 * ```
 */
@Component({
  selector: 'po-modal-footer',
  templateUrl: './po-modal-footer.component.html'
})
export class PoModalFooterComponent {
  /**
   * @optional
   *
   * @description
   *
   * Desabilita o alinhamento padrão, à direita, dos botões de ações que ficam no rodapé da [`PoModal`](/documentation/po-modal).
   *
   * > Caso a propriedade esteja habilitada, o alinhamento deverá ser a esquerda e pode ser personalizado.
   *
   * @default false
   */
  @Input('p-disabled-align') disabledAlign?: boolean = false;
}
