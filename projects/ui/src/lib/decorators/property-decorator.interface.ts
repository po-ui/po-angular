/**
 * @description
 *
 * Estrutura dos parâmetros de um decorator de propriedade.
 */
export interface PropertyDecoratorInterface {
  /** Métodos de acesso a propriedade, por exemplo: `get` e `set`. */
  originalDescriptor?: Object;

  /** Nome da propriedade. */
  property?: string;

  /** Instância da classe da propriedade. */
  target?: any;
}
