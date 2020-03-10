/**
 * @description
 * Interface para as ações do componente po-checkbox-group.
 *
 * @usedBy PoCheckboxGroupComponent
 */
export interface PoCheckboxGroupOption {
  /** Texto exibido para o usuário ao lado do checkbox. */
  label: string;

  /**
   * Valor retornado no model.
   *
   * É possível usar os valores ```true``` e ```false```, caso a propriedade ```p-indeterminate``` esteja setada como ```true```
   * passa a aceitar ```null``` também, por padrão esse valor sempre será setado como ```false```.
   */
  value: string;

  /**
   * Desabilita o checkbox, por padrão as opções sempre estarão habilitadas para o usuário.
   *
   * Mesmo desabilitado o desenvolvedor pode alterar o valor do item via código, mas não será permitido ao
   * usuário alterar a condição do checkbox.
   */
  disabled?: boolean;
}
