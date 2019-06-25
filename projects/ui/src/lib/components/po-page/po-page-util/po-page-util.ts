/**
 * @description Verifica se existe a função dentro do contexto.
 *
 * @param action Nome da função que será verificada a existência no parentContext.
 *
 * @param parentContext Contexto da qual a função será verificada.
 */
export function hasAction(action: string, parentContext: any): boolean {
  return parentContext && parentContext[action];
}

/**
 * @description Executa a função cujo o nome foi passado por parâmetro.
 *
 * @param action Nome da função que será executada no parentContext.
 *
 * @param parentContext Contexto da qual a função será executada.
 */
export function callAction(action: string, parentContext: any): void {
  if (hasAction(action, parentContext)) {
    parentContext[action]();
  }
}
