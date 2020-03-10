/**
 * @usedBy PoDisclaimerGroupComponent, PoPageListComponent
 *
 * @description
 *
 * Interface que representa o objeto `po-disclaimer`.
 */
export interface PoDisclaimer {
  /** Se verdadeiro, oculta o botão para fechar o *disclaimer*. */
  hideClose?: boolean;

  /** Texto de exibição do objeto. */
  label?: string;

  /** Nome da propriedade vinculada ao objeto *disclaimer*. */
  property?: string;

  /** Valor do objeto. */
  value: any;
}
