/**
 * @usedBy PoPageChangePasswordComponent
 *
 * @description
 *
 * Interface com a definição dos objetos aceitos pela propriedade `p-password-requirements`.
 */
export interface PoPageChangePasswordRequirement {
  /** Requisito. */
  requirement: string;

  /**
   * Função que deve retornar um booleano para validar um requisito de senha.
   *
   * Também é possível informar diretamente um valor booleano que representa esta validação.
   */
  status: boolean | Function;
}
